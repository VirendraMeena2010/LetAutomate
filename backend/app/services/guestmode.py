from typing import TypedDict,Optional,Literal
from langgraph.graph import StateGraph,START,END
from pydantic import BaseModel,Field
from dotenv import load_dotenv
import os
from app.services.brain.llm import llm
from langchain_community.document_loaders import WebBaseLoader
from langchain_tavily import TavilySearch
load_dotenv()
tavily_api_key=os.getenv("TAVILY_API_KEY")
tavily_search = TavilySearch(
    tavily_api_key=tavily_api_key,
    max_results=5,
    topic="general",
)
DB_URL = os.getenv("DATABASE_URL")

if not DB_URL:
    raise RuntimeError(
        "DATABASE_URL environment variable is not set. "
        "Please add DATABASE_URL to your .env file or deployment environment."
    )


class GuestModeInput(BaseModel):
    target_company_name:str=Field(description="Name of the company you want to target")
    target_company_industry:str=Field(description="Industry of the company you want to target")
    target_company_website:str=Field(description="Website of the company you want to target")
    your_services:str=Field(description="Your services")







class GuestModeState(TypedDict):
    target_company_name:str
    target_company_industry:str
    target_company_website:str
    output_research_agent:str
    your_services:str
    news_articles:str
    output:str
    busniess_signal:str
    icp_matcher_output:str
    output_website_analyst:str
    your_descrition:Optional[str]


class research_agent_result(BaseModel):
    company_name:str
    company_industry:str
    company_info:str
    class Config:
        model_config = {"extra": "forbid"}

research_agent_model = llm.with_structured_output(research_agent_result)


def research_agent(state:GuestModeState):
    company_name=state["target_company_name"]
    compamy_industry=state["target_company_industry"]
    prompt=f"""
you are reasearch agent you have to search about company:{company_name} which is belogs to industry:{compamy_industry}
    """
    
    result=research_agent_model.invoke(prompt)
    return {
        "output_research_agent":result
    }

class website_analyst_result(BaseModel):
    website_summary:str
    class Config:
        model_config = {"extra": "forbid"}
website_analyst_model=llm.with_structured_output(website_analyst_result)


def website_analyst_agent(state:GuestModeState):
    website=state["target_company_website"]
    loader = WebBaseLoader(website)
    doc = loader.load()
    prompt=f"""
    you are website analyst you have to analyze the website:{website} and provide the summary of the website,here is content of it :{doc}
    """
    result=website_analyst_model.invoke(prompt)
    return {
        "output_website_analyst":result
    }





"""def tech_stack_dectector_agent(state:GuestModeState):
    pass
"""




def news_collector_agent(state:GuestModeState):
    """
    Search the web for the latest information about a company.

    This node is responsible only for retrieving information.
    It does NOT summarize or analyze the results.
    """

    company_name = state["target_company_name"]
    company_industry=state["target_company_industry"]

    query = f"""
    {company_name}
    {company_industry} latest news
    important announcements
    funding
    product launches
    partnerships
    acquisitions
    significant business events
    """

    search_results = tavily_search.invoke(
        {
            "query": query,
            "search_depth": "advanced",
        }
    )

    return {
        "news_articles": search_results,
    }



class ICP_matcher_result(BaseModel):
    icp_match_score:int
    icp_match_level:Literal["low","meadium","high"]
    reason_for_match:str
    class Config:
        model_config = {"extra": "forbid"}

icp_matcher_model=llm.with_structured_output(ICP_matcher_result)


def icp_matcher_agent(state:GuestModeState):
    prompt=f"""
you are a very intelligent ICP matcher you have to match the ICP for the company:{state["target_company_name"]} and industry:{state['target_company_industry']} with the services you are providing:{state["your_services"]}
    provide the detailed analysis of the match and why it is a good match or not,
     also consider the news articles:{state["news_articles"]} and website analysis:{state["output_website_analyst"]} and research:{state["output_research_agent"]} 
important ICP matcher score should be between 1 to 100     
    """
    result=icp_matcher_model.invoke(prompt)
    return {
        "icp_matcher_output":result
    }

def busniess_signal_analyst(state:GuestModeState):
    prompt=f"""
you are a  senior busniess singal analyst and these and give 
the business signals for the company:{state["target_company_name"]} and industry:{state["target_company_industry"]}
    also consider the news articles:{state["news_articles"]} and website analysis:{state["output_website_analyst"]} and research:{state["output_research_agent"]}           
    """
    result=llm.invoke(prompt)
    return {
        "busniess_signal":result.content
    }


class concluder_agent_result(BaseModel):
    company_name:str
    company_industry:str
    company_icp_match_score:int
    company_business_signals:str
    final_conclusion:str
    icp_match_level:Literal["low","meadium","high"]

    class Config:
        model_config = {"extra": "forbid"}
concluder_agent_model=llm.with_structured_output(concluder_agent_result)
def concluder_agent(state:GuestModeState):
    prompt=f"""
you are the OG intelligent concluder agent you have to provide the final conclusion based on all the analysis done by other agents
    here is the research:{state["output_research_agent"]},website analysis:{state["output_website_analyst"]},news articles:{state["news_articles"]},ICP matcher output:{state["icp_matcher_output"]},business signals:{state["busniess_signal"]}        
    """
    result=concluder_agent_model.invoke(prompt)
    return {
        "output":result
    }
from langgraph.checkpoint.postgres import PostgresSaver

checkpointer_context = PostgresSaver.from_conn_string(DB_URL)
checkpointer = checkpointer_context.__enter__()

checkpointer.setup()

builder = StateGraph(GuestModeState)

builder.add_node("research_agent", research_agent)
builder.add_node("website_analyst_agent", website_analyst_agent)
builder.add_node("news_collector_agent", news_collector_agent)
builder.add_node("icp_matcher_agent", icp_matcher_agent)
builder.add_node("busniess_signal_analyst", busniess_signal_analyst)
builder.add_node("concluder_agent", concluder_agent)

builder.add_edge(START, "research_agent")
builder.add_edge(START, "website_analyst_agent")
builder.add_edge(START, "news_collector_agent")

builder.add_edge("research_agent", "busniess_signal_analyst")
builder.add_edge("website_analyst_agent", "busniess_signal_analyst")
builder.add_edge("news_collector_agent", "busniess_signal_analyst")

builder.add_edge("research_agent", "icp_matcher_agent")
builder.add_edge("website_analyst_agent", "icp_matcher_agent")
builder.add_edge("news_collector_agent", "icp_matcher_agent")

builder.add_edge("busniess_signal_analyst", "concluder_agent")
builder.add_edge("icp_matcher_agent", "concluder_agent")

agent = builder.compile(
    checkpointer=checkpointer
)