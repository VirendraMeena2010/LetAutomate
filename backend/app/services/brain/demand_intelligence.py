from typing import List, Literal
from pydantic import BaseModel, Field
from langchain.agents import create_agent
from app.services.brain.llm import primary_llm, fallback_llm

# ============================================================
# Output Schemas
# ============================================================
class BusinessDemand(BaseModel):
    demand: str = Field(description="Specific business demand identified from evidence.")
    category: Literal[
        "sales", "marketing", "customer_support", "operations", "technology",
        "data", "ai_automation", "product", "hiring", "finance", "other",
    ] = Field(description="Category of the business demand.")
    urgency: Literal["high", "medium", "low"] = Field(description="Estimated urgency based on available evidence.")
    confidence: Literal["high", "medium", "low"] = Field(description="Confidence that the demand is genuinely supported.")
    evidence: List[str] = Field(default_factory=list, description="Specific evidence or facts from upstream intelligence supporting this demand.")
    reasoning: str = Field(description="Reasoning connecting the evidence to the identified business demand.")

class DemandSignal(BaseModel):
    signal: str = Field(description="Specific signal indicating potential business demand.")
    source: Literal["website", "technology", "news", "hiring"] = Field(description="Upstream intelligence source of the signal.")
    strength: Literal["strong", "moderate", "weak"] = Field(description="Strength of the signal.")
    explanation: str = Field(description="Explanation of why the signal matters.")

class ServiceOpportunity(BaseModel):
    opportunity: str = Field(description="Potential service or solution opportunity connected to an identified business demand.")
    related_demand: str = Field(description="Business demand that creates this opportunity.")
    why_it_matters: str = Field(description="Why the opportunity could address the demand.")
    confidence: Literal["high", "medium", "low"] = Field(description="Confidence in the opportunity.")

class DemandIntelligenceOutput(BaseModel):
    company_name: str = Field(description="Target company name.")
    primary_demands: List[BusinessDemand] = Field(default_factory=list, description="Most meaningful evidence-supported business demands.")
    demand_signals: List[DemandSignal] = Field(default_factory=list, description="Signals supporting the identified demands.")
    service_opportunities: List[ServiceOpportunity] = Field(default_factory=list, description="Potential solution opportunities connected to demands.")
    demand_summary: str = Field(description="Concise summary of the company's strongest business demands.")

# ============================================================
# System Prompt
# ============================================================
SYSTEM_PROMPT = """
You are Agent 6 — Demand Intelligence Agent for AgentReach.

Your responsibility is to analyze all available company intelligence and determine what the target company is likely to need.
You do NOT perform new web research. Reason only over intelligence already collected by upstream agents.

============================================================
OBJECTIVE & EVIDENCE CHAIN
============================================================
Determine the company's most meaningful business demands.
Identify only demands supported by evidence. Use this reasoning chain:
Evidence -> Business Signal -> Potential Business Pressure -> Likely Demand -> Potential Service Opportunity

============================================================
DO NOT OVER-INFER
============================================================
Hiring activity does not automatically prove a business problem.
Technology adoption does not automatically prove a technology gap.
Clearly distinguish FACT from SIGNAL from INFERENCE.

============================================================
OUTPUT FORMAT (CRITICAL)
============================================================
YOU MUST CALL THE PROVIDED STRUCTURED OUTPUT TOOL WITH YOUR FINAL ANSWER.
DO NOT return plain conversational text or markdown blocks. 
You must ONLY output the strictly formatted JSON defined by the DemandIntelligenceOutput schema.
"""

# ============================================================
# Agents
# ============================================================
_primary_agent = create_agent(
    model=primary_llm,
    tools=[],
    system_prompt=SYSTEM_PROMPT,
    response_format=DemandIntelligenceOutput,
)

_fallback_agent = create_agent(
    model=fallback_llm,
    tools=[],
    system_prompt=SYSTEM_PROMPT,
    response_format=DemandIntelligenceOutput,
)

demand_intelligence_agent = _primary_agent.with_fallbacks([_fallback_agent])

# ============================================================
# Public Function
# ============================================================
async def analyze_demand(upstream_intelligence: str) -> DemandIntelligenceOutput:
    """
    Analyze upstream company intelligence and return structured demand intelligence.
    """
    result = await demand_intelligence_agent.ainvoke(
        {
            "messages": [
                {
                    "role": "user",
                    "content": upstream_intelligence,
                }
            ]
        }
    )
    
    # Safe Fallback to prevent Graph Crash
    structured_data = result.get("structured_response")
    if structured_data is None:
        print("Demand intelligence agent failed to return structure. Injecting safe default.")
        return DemandIntelligenceOutput(
            company_name="Unknown",
            primary_demands=[],
            demand_signals=[],
            service_opportunities=[],
            demand_summary="Insufficient structured data generated by AI."
        )
        
    return structured_data