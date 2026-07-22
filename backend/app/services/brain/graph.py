from langgraph.graph import StateGraph, START, END
from dotenv import load_dotenv

load_dotenv()
# Import agent nodes
#from app.services.brain.companyresearchagent import company_research_agent
from app.services.brain.newsresearcher import news_research
from app.services.brain.painpointanalyzer import Business_Opportunity_Analyze

# Shared state for all agents
from app.services.brain.state import AgentState


# Create a LangGraph workflow
workflow = StateGraph(AgentState)


# ------------------------------------------------------------------
# Register Nodes
# ------------------------------------------------------------------

"""workflow.add_node(
    "company_research",
    company_research_agent
)"""

workflow.add_node(
    "news_research",
    news_research
)

workflow.add_node(
    "Business_Opportunity_Analyze",
    Business_Opportunity_Analyze
)


# ------------------------------------------------------------------
# Define Workflow
# ------------------------------------------------------------------

# Start two independent research agents
#workflow.add_edge(START, "company_research")
workflow.add_edge(START, "news_research")

# Wait for both research agents to finish
#workflow.add_edge("company_research", "pain_point_analyzer")
workflow.add_edge("news_research", "Business_Opportunity_Analyze")

# Finish workflow
workflow.add_edge("Business_Opportunity_Analyze", END)


# ------------------------------------------------------------------
# Compile Graph
# ------------------------------------------------------------------

agent = workflow.compile()