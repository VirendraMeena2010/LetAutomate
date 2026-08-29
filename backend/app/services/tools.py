from langchain_core.tools import tool
import os
from dotenv import load_dotenv
from app.services.scraper.scraper_service import ScraperService


@tool
async def website_scraping(url: str) -> dict:
    """
    Scrape a website and return its metadata, text, and discovered pages.
    """
    scraper = ScraperService()

    result = await scraper.scrape(url)

    return result




"""from typing import Any

from langchain_core.tools import tool
from dotenv import load_dotenv
from langchain_tavily import TavilySearch



load_dotenv()


)"""


from dotenv import load_dotenv
from langchain_core.tools import tool
from langchain_tavily import TavilySearch


load_dotenv()

tavily_api_key=os.getenv("TAVILY_API_KEY")
# ============================================================
# Tavily Search
# ============================================================

tavily_search = TavilySearch(
    max_results=5,
    topic="general",
    tavily_api_key=tavily_api_key,
)


# ============================================================
# Web Search Tool
# ============================================================

@tool
async def web_search(query: str) -> str:
    """
    Search the web for factual information about a company.

    Args:
        query: Search query.

    Returns:
        Clean, formatted search results for the research agent.
    """

    try:
        response = await tavily_search.ainvoke(
            {
                "query": query,
            }
        )

        if not response:
            return "No search results found."

        if isinstance(response, dict):
            results = response.get("results", [])

        elif isinstance(response, list):
            results = response

        else:
            return str(response)

        if not results:
            return "No search results found."

        formatted_results = []

        for index, result in enumerate(results, start=1):

            if not isinstance(result, dict):
                formatted_results.append(
                    f"Result {index}\n\n{str(result)}"
                )
                continue

            title = result.get("title") or "Untitled"
            url = result.get("url") or "URL not available"
            content = result.get("content") or "No content available"

            published_date = (
                result.get("published_date")
                or result.get("publishedDate")
                or "Not available"
            )

            formatted_results.append(
                f"""
Result {index}

Title:
{title}

URL:
{url}

Published Date:
{published_date}

Content:
{content}
""".strip()
            )

        return "\n\n---\n\n".join(formatted_results)

    except Exception as exc:
        raise RuntimeError(
            f"Tavily web search failed: {exc}"
        ) from exc

from typing import List, Literal

from pydantic import BaseModel, Field
from langchain_core.tools import tool


class TechnologyDetection(BaseModel):
    name: str
    category: Literal[
        "frontend",
        "backend",
        "cloud",
        "crm",
        "analytics",
        "payments",
        "support",
        "marketing",
        "ai_tools",
        "other",
    ]
    confidence: float = Field(ge=0.0, le=1.0)
    evidence: List[str]


TECHNOLOGY_SIGNATURES = {
    "React": {
        "category": "frontend",
        "patterns": [
            "react",
            "__react",
            "react-dom",
        ],
    },
    "Next.js": {
        "category": "frontend",
        "patterns": [
            "_next/static",
            "__next",
        ],
    },
    "Vue": {
        "category": "frontend",
        "patterns": [
            "vue.js",
            "vue.min.js",
            "__vue__",
        ],
    },
    "Angular": {
        "category": "frontend",
        "patterns": [
            "ng-version",
            "angular.js",
            "angular.min.js",
        ],
    },
    "Node.js": {
        "category": "backend",
        "patterns": [
            "node.js",
            "nodejs",
        ],
    },
    "Django": {
        "category": "backend",
        "patterns": [
            "csrfmiddlewaretoken",
            "django",
        ],
    },
    "FastAPI": {
        "category": "backend",
        "patterns": [
            "fastapi",
        ],
    },
    "AWS": {
        "category": "cloud",
        "patterns": [
            "amazonaws.com",
            "aws.amazon.com",
        ],
    },
    "Salesforce": {
        "category": "crm",
        "patterns": [
            "salesforce",
            "force.com",
        ],
    },
    "HubSpot": {
        "category": "crm",
        "patterns": [
            "hubspot",
            "hs-scripts.com",
        ],
    },
    "Google Analytics": {
        "category": "analytics",
        "patterns": [
            "google-analytics.com",
            "googletagmanager.com",
            "gtag(",
        ],
    },
    "Mixpanel": {
        "category": "analytics",
        "patterns": [
            "mixpanel",
        ],
    },
    "Stripe": {
        "category": "payments",
        "patterns": [
            "stripe.com",
            "js.stripe.com",
            "stripe.js",
        ],
    },
    "Razorpay": {
        "category": "payments",
        "patterns": [
            "razorpay",
        ],
    },
    "Zendesk": {
        "category": "support",
        "patterns": [
            "zendesk",
            "zdassets.com",
        ],
    },
    "Intercom": {
        "category": "support",
        "patterns": [
            "intercom",
            "widget.intercom.io",
        ],
    },
    "Mailchimp": {
        "category": "marketing",
        "patterns": [
            "mailchimp",
        ],
    },
    "OpenAI": {
        "category": "ai_tools",
        "patterns": [
            "openai",
            "api.openai.com",
        ],
    },
}


def _calculate_confidence(
    matched_patterns: List[str],
    total_patterns: int,
) -> float:

    match_ratio = len(matched_patterns) / total_patterns

    if match_ratio >= 0.75:
        return 0.90

    if match_ratio >= 0.50:
        return 0.75

    return 0.60


@tool
def technology_detection(html: str) -> List[dict]:
    
    """Detect technologies used by a company from raw website HTML.

    Input:
        html: Raw HTML content of the company's website.

    Returns:
        A list of detected technologies containing:
        - technology name
        - category
        - confidence score
        - detection evidence

    Use this tool when you need to identify the company's
    frontend, backend, cloud, CRM, analytics, payment,
    support, marketing, or AI technologies."""

    if not html:
        return []

    html_lower = html.lower()

    detections = []

    for technology, signature in TECHNOLOGY_SIGNATURES.items():

        matched_patterns = []

        for pattern in signature["patterns"]:

            if pattern.lower() in html_lower:
                matched_patterns.append(pattern)

        if not matched_patterns:
            continue

        confidence = _calculate_confidence(
            matched_patterns,
            len(signature["patterns"]),
        )

        detection = TechnologyDetection(
            name=technology,
            category=signature["category"],
            confidence=confidence,
            evidence=[
                f"Matched signature: {pattern}"
                for pattern in matched_patterns
            ],
        )

        detections.append(
            detection.model_dump()
        )

    return detections

