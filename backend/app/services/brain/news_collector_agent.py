from typing import List, Literal, Optional
from pydantic import BaseModel, Field
from langchain.agents import create_agent
from langchain.agents.structured_output import ToolStrategy
from app.services.brain.llm import primary_llm, fallback_llm
from app.services.tools import web_search

# ============================================================
# Business Signal
# ============================================================
class BusinessSignal(BaseModel):
    signal_type: Literal[
        "funding", "hiring", "acquisition", "partnership",
        "press_release", "product_launch", "geographic_expansion",
    ] = Field(description="Category of the business signal.")
    title: str = Field(description="Title of the news article or business announcement.")
    description: str = Field(description="Concise factual description of the business signal.")
    source_url: str = Field(description="URL of the strongest available source.")
    published_date: Optional[str] = Field(
        default=None,
        description="Publication date in YYYY-MM-DD format when available. Return null if it cannot be reliably determined.",
    )
    confidence: Literal["high", "medium", "low"] = Field(
        description="Confidence in the accuracy and relevance of the signal."
    )

# ============================================================
# Main Output
# ============================================================
class NewsIntelligenceOutput(BaseModel):
    signals: List[BusinessSignal] = Field(
        default_factory=list,
        description="Recent and relevant business signals.",
    )

# ============================================================
# System Prompt
# ============================================================
SYSTEM_PROMPT = """
You are Agent 4 — News Intelligence Agent for AgentReach.

Your responsibility is to identify recent and meaningful business
signals about a target company.

You have access to the web_search tool.

============================================================
INPUT & RESEARCH OBJECTIVE
============================================================
The user will provide company information.
Identify recent business signals related to:
- Funding, Hiring, Acquisitions, Partnerships, Press releases, Product launches, Geographic expansion.

Prioritize results from the last 12 months. Do not include results older than 24 months.
Never invent publication dates. If a reliable publication date cannot be established, return null.

============================================================
COMPANY VERIFICATION & DUPLICATES
============================================================
Before accepting a result, verify that it refers to the target company.
If multiple sources report the same underlying event:
- Treat them as one signal.
- Keep only the strongest source.

============================================================
FACTUAL ACCURACY
============================================================
Never invent facts, URLs, publication dates, funding amounts, acquisitions, hiring numbers, partnerships, or product launches.
Only report information supported by the source. If no relevant signals are discovered, return an empty list.

============================================================
OUTPUT FORMAT (CRITICAL)
============================================================
YOU MUST CALL THE PROVIDED STRUCTURED OUTPUT TOOL WITH YOUR FINAL ANSWER.
DO NOT return plain conversational text or markdown blocks. 
You must ONLY output the strictly formatted JSON defined by the NewsIntelligenceOutput schema.
"""

# ============================================================
# Primary Agent
# ============================================================
primary_agent = create_agent(
    model=primary_llm,
    tools=[web_search],
    system_prompt=SYSTEM_PROMPT,
    response_format=ToolStrategy(NewsIntelligenceOutput),
)

# ============================================================
# Fallback Agent
# ============================================================
fallback_agent = create_agent(
    model=fallback_llm,
    tools=[web_search],
    system_prompt=SYSTEM_PROMPT,
    response_format=ToolStrategy(NewsIntelligenceOutput),
)

news_intelligence_agent = primary_agent