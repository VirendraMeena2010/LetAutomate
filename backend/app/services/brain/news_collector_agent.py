
import os
from dotenv import load_dotenv

from langchain_tavily import TavilySearch

from app.services.brain.state import AgentState

load_dotenv()

tavily_search = TavilySearch(
    tavily_api_key="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",
    max_results=5,
    topic="general",
)


def news_research(state: AgentState):
    """
    Search the web for the latest information about a company.

    This node is responsible only for retrieving information.
    It does NOT summarize or analyze the results.
    """

    company = state["company_name"]

    query = f"""
    {company} latest news
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

