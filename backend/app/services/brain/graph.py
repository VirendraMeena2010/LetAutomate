from typing import Any, Dict
from langchain_core.runnables import RunnableConfig
from langgraph.graph import StateGraph, START, END
from app.services.brain.state import ResearchState

from app.services.brain.research_agent import (
    research_agent
)
from app.services.brain.website_analyzer_agent import (
    website_analyzer_agent, 
    website_fallback_agent, 
    WebsiteAnalysis
)
from app.services.brain.news_collector_agent import (
    news_intelligence_agent,
    fallback_agent as news_fallback_agent,
    NewsIntelligenceOutput
)
from app.services.brain.hiring_intelligence import (
    hiring_intelligence_agent, 
    fallback_agent as hiring_fallback_agent, 
    HiringIntelligenceOutput
)
from app.services.brain.demand_intelligence import (
    analyze_demand,
    DemandIntelligenceOutput
)
from app.services.brain.icp_matcher_agent import (
    match_icp,
    ICPMatchOutput
)
from app.services.brain.company_intelligence import get_company_intelligence

# ============================================================
# Agent 1 — Research Agent (Sequential - Can update tracking keys)
# ============================================================
async def run_research_agent(state: ResearchState, config: RunnableConfig) -> Dict[str, Any]:
    result = await research_agent.ainvoke(
        {
            "messages": [
                {
                    "role": "user",
                    "content": (
                        "Research this company.\n\n"
                        f"Company name: {state.get('company_name', 'Unknown')}\n"
                        f"Website: {state.get('website', 'Unknown')}\n"
                        f"Industry: {state.get('industry', 'Unknown')}"
                    ),
                }
            ]
        },
        config=config,
    )
    structured_response = result.get("structured_response")
    
    if structured_response is None:
        print("Research agent failed to return structured response. Proceeding with limited data.")
        return {
            "company_research": {"error": "Failed to parse structured research data."},
            "current_agent": "research_agent",
            "current_step": "research_completed",
            "progress": 20,
        }
        
    return {
        "company_research": structured_response.model_dump(),
        "current_agent": "research_agent",
        "current_step": "research_completed",
        "progress": 20,
    }

# ============================================================
# Agent 2 — Website Analyzer (PARALLEL - Return ONLY data)
# ============================================================
async def run_website_analyzer(state: ResearchState, config: RunnableConfig) -> Dict[str, Any]:
    messages = [
        {
            "role": "user",
            "content": f"Analyze the target company's website using this research.\n\n{state.get('company_research', '')}",
        }
    ]
    
    result = await website_analyzer_agent.ainvoke({"messages": messages}, config=config)
    structured_response = result.get("structured_response")
    
    if structured_response is None:
        print("Primary website analyzer failed to return structure. Trying fallback_agent...")
        try:
            fallback_result = await website_fallback_agent.ainvoke({"messages": messages}, config=config)
            structured_response = fallback_result.get("structured_response")
        except Exception as e:
            print(f"Fallback website analyzer also failed: {e}")

    if structured_response is None:
        print("Both website analyzers failed to return structure. Injecting default safe object.")
        salvaged_summary = "Unstructured data received."
        if result.get("messages") and hasattr(result["messages"][-1], "content"):
            salvaged_summary = result["messages"][-1].content[:500] + "..."
            
        structured_response = WebsiteAnalysis(
            business_model_summary=f"Data formatting failed. Raw preview: {salvaged_summary}",
            business_model_evidence=[],
            primary_products=[],
            target_customer_messaging=[],
            pricing_tiers=[],
            growth_indicators=[],
            customer_testimonials=[],
            partners=[],
            key_messaging=[],
            market_positioning=None
        )

    return {
        "website_analysis": structured_response.model_dump(),
        # Removed current_agent, current_step, and progress to prevent concurrent crash
    }

# ============================================================
# Agent 3 — News Intelligence (PARALLEL - Return ONLY data)
# ============================================================
async def run_news_intelligence(state: ResearchState, config: RunnableConfig) -> Dict[str, Any]:
    messages = [
        {
            "role": "user",
            "content": f"Research recent business signals for this target company.\n\n{state.get('company_research', '')}",
        }
    ]
    
    result = await news_intelligence_agent.ainvoke({"messages": messages}, config=config)
    structured_response = result.get("structured_response")
    
    if structured_response is None:
        print("Primary news agent failed to return structure. Trying fallback_agent...")
        try:
            fallback_result = await news_fallback_agent.ainvoke({"messages": messages}, config=config)
            structured_response = fallback_result.get("structured_response")
        except Exception as e:
            print(f"Fallback news agent also failed: {e}")

    if structured_response is None:
        print("Both news agents failed to return structure. Injecting default safe object.")
        structured_response = NewsIntelligenceOutput(signals=[])

    return {
        "news_intelligence": structured_response.model_dump(),
        # Removed current_agent, current_step, and progress to prevent concurrent crash
    }

# ============================================================
# Agent 4 — Hiring Intelligence (PARALLEL - Return ONLY data)
# ============================================================
async def run_hiring_intelligence(state: ResearchState, config: RunnableConfig) -> Dict[str, Any]:
    messages = [
        {
            "role": "user",
            "content": f"Analyze the hiring activity of this target company.\n\n{state.get('company_research', '')}"
        }
    ]
    
    result = await hiring_intelligence_agent.ainvoke({"messages": messages}, config=config)
    structured_response = result.get("structured_response")
    
    if structured_response is None:
        print("Primary hiring agent failed to return structure. Trying fallback_agent...")
        try:
            fallback_result = await hiring_fallback_agent.ainvoke({"messages": messages}, config=config)
            structured_response = fallback_result.get("structured_response")
        except Exception as e:
            print(f"Fallback hiring agent also failed: {e}")

    if structured_response is None:
        print("Both hiring agents failed to return structure. Injecting default safe object.")
        salvaged_summary = "Unstructured data received."
        if result.get("messages") and hasattr(result["messages"][-1], "content"):
            salvaged_summary = result["messages"][-1].content[:500] + "..."
            
        structured_response = HiringIntelligenceOutput(
            company_name=state.get("company_name", "Unknown"),
            hiring_activity_summary=f"Data formatting failed. Raw preview: {salvaged_summary}",
            key_open_roles=[],
            department_breakdown=[],
            seniority_breakdown=[],
            growth_department_indicators=[],
            hiring_trends=[]
        )

    return {
        "hiring_intelligence": structured_response.model_dump(),
        # Removed current_agent, current_step, and progress to prevent concurrent crash
    }

# ============================================================
# Company Intelligence (Sequential - Can update tracking keys)
# ============================================================
def run_company_intelligence(state: ResearchState, config: RunnableConfig) -> Dict[str, Any]:
    company_id = state.get("company_id")
    if not company_id:
        raise ValueError("company_id is required for company intelligence.")
    
    company_profile = get_company_intelligence(company_id=company_id)
    if not company_profile.get("success"):
        return {
            "company_intelligence": None,
            "current_agent": "company_intelligence",
            "current_step": "company_intelligence_failed",
            "error": company_profile.get("error"),
        }
    return {
        "company_intelligence": company_profile["company"],
        "current_agent": "company_intelligence",
        "current_step": "company_intelligence_completed",
        "progress": 65,
    }

# ============================================================
# Demand Intelligence (Sequential - Can update tracking keys)
# ============================================================
async def run_demand_intelligence(state: ResearchState, config: RunnableConfig) -> Dict[str, Any]:
    upstream_intelligence = (
        "COMPANY RESEARCH:\n"
        f"{state.get('company_research', 'None')}\n\n"
        "WEBSITE ANALYSIS:\n"
        f"{state.get('website_analysis', 'None')}\n\n"
        "NEWS INTELLIGENCE:\n"
        f"{state.get('news_intelligence', 'None')}\n\n"
        "HIRING INTELLIGENCE:\n"
        f"{state.get('hiring_intelligence', 'None')}"
    )
    
    structured_response = await analyze_demand(upstream_intelligence)
    
    if structured_response is None:
        print("Demand Intelligence returned None. Injecting safe default.")
        structured_response = DemandIntelligenceOutput(
            company_name=state.get("company_name", "Unknown"),
            primary_demands=[],
            demand_signals=[],
            service_opportunities=[],
            demand_summary="Data formatting failed during demand analysis."
        )

    return {
        "demand_intelligence": structured_response.model_dump(),
        "current_agent": "demand_intelligence",
        "current_step": "demand_intelligence_completed",
        "progress": 75,
    }

# ============================================================
# ICP Matcher (Sequential - Can update tracking keys)
# ============================================================
async def run_icp_matcher(state: ResearchState, config: RunnableConfig) -> Dict[str, Any]:
    intelligence = (
        "TARGET COMPANY RESEARCH:\n"
        f"{state.get('company_research', 'None')}\n\n"
        "WEBSITE ANALYSIS:\n"
        f"{state.get('website_analysis', 'None')}\n\n"
        "NEWS INTELLIGENCE:\n"
        f"{state.get('news_intelligence', 'None')}\n\n"
        "HIRING INTELLIGENCE:\n"
        f"{state.get('hiring_intelligence', 'None')}\n\n"
        "DEMAND INTELLIGENCE:\n"
        f"{state.get('demand_intelligence', 'None')}\n\n"
        "OUR COMPANY INTELLIGENCE:\n"
        f"{state.get('company_intelligence', 'None')}"
    )
    
    structured_response = await match_icp(intelligence)
    
    if structured_response is None:
        print("ICP Matcher returned None. Injecting safe default.")
        structured_response = ICPMatchOutput(
            company_name=state.get("company_name", "Unknown"),
            overall_match_score=0,
            fit_level="poor",
            recommendation="do_not_target",
            service_matches=[],
            icp_dimension_scores=[],
            strongest_signals=[],
            major_mismatches=["Agent failed to output structured evaluation."],
            recommended_services=[],
            reasoning_summary="Data formatting failed."
        )

    return {
        "final_report": structured_response.model_dump(),
        "current_agent": "icp_matcher",
        "current_step": "completed",
        "status": "completed",
        "progress": 100,
    }

# ============================================================
# Build Research Graph
# ============================================================
def build_research_graph():
    builder = StateGraph(ResearchState)
    
    # Nodes
    builder.add_node("research_agent", run_research_agent)
    builder.add_node("website_analyzer", run_website_analyzer)
    builder.add_node("news_intelligence", run_news_intelligence)
    builder.add_node("hiring_intelligence", run_hiring_intelligence)
    builder.add_node("demand_intelligence", run_demand_intelligence)
    builder.add_node("company_intelligence", run_company_intelligence)
    builder.add_node("icp_matcher", run_icp_matcher)
    
    # Edges
    builder.add_edge(START, "research_agent")
    
    builder.add_edge("research_agent", "website_analyzer")
    builder.add_edge("research_agent", "news_intelligence")
    builder.add_edge("research_agent", "hiring_intelligence")
    
    builder.add_edge("website_analyzer", "demand_intelligence")
    builder.add_edge("news_intelligence", "demand_intelligence")
    builder.add_edge("hiring_intelligence", "demand_intelligence")
    
    builder.add_edge("demand_intelligence", "company_intelligence")
    builder.add_edge("company_intelligence", "icp_matcher")
    builder.add_edge("icp_matcher", END)
    
    return builder.compile()

# ============================================================
# Compiled Research Graph
# ============================================================
research_graph = build_research_graph()