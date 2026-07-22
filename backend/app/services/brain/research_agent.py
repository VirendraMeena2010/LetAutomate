from app.services.brain.state import AgentState
from app.services.brain.llm import llm

def company_research_agent(state: AgentState):
    prompt = f"Research and summarize the company {state['company_name']}."
    response = llm.invoke(prompt)
    state["research_summary"] = response.content    
    return state
