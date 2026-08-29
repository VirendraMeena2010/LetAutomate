from typing import List, Literal
from pydantic import BaseModel, Field
from langchain.agents import create_agent
from langchain.agents.structured_output import ToolStrategy
from app.services.brain.llm import primary_llm, fallback_llm
from app.services.tools import website_scraping, web_search

# ============================================================
# Output Schemas
# ============================================================
class OpenRole(BaseModel):
    title: str = Field(description="Current job title.")
    department: str = Field(description="Department responsible for the role.")
    seniority: str = Field(description="Seniority level of the role.")
    location: str = Field(description="Job location or remote status.")
    source_url: str = Field(description="URL of the job posting.")
    confidence: Literal["high", "medium", "low"] = Field(
        description="Confidence that the role is genuine and currently open."
    )

class DepartmentBreakdown(BaseModel):
    department: str = Field(description="Department name.")
    open_roles_count: int = Field(description="Number of observed current openings in this department.")
    explanation: str = Field(description="Explanation of the department hiring activity.")

class SeniorityBreakdown(BaseModel):
    seniority: str = Field(description="Seniority category.")
    open_roles_count: int = Field(description="Number of observed current openings at this seniority.")
    explanation: str = Field(description="Explanation of the seniority distribution.")

class GrowthDepartmentIndicator(BaseModel):
    department: str = Field(description="Department showing a potential growth signal.")
    signal: str = Field(description="Specific hiring signal.")
    explanation: str = Field(description="Why the hiring activity may indicate growth.")
    confidence: Literal["high", "medium", "low"] = Field(description="Confidence in the growth interpretation.")
    source_url: str = Field(description="Source URL supporting the hiring signal.")

class HiringTrend(BaseModel):
    trend: str = Field(description="Observed hiring trend.")
    explanation: str = Field(description="Evidence-based explanation of the trend.")
    confidence: Literal["high", "medium", "low"] = Field(description="Confidence in the identified trend.")
    evidence_url: str = Field(description="Source URL supporting the trend.")

class HiringIntelligenceOutput(BaseModel):
    company_name: str = Field(description="Verified target company name.")
    hiring_activity_summary: str = Field(description="Concise summary of the company's current hiring activity.")
    key_open_roles: List[OpenRole] = Field(default_factory=list, description="Meaningful current job openings.")
    department_breakdown: List[DepartmentBreakdown] = Field(default_factory=list, description="Breakdown of observed openings by department.")
    seniority_breakdown: List[SeniorityBreakdown] = Field(default_factory=list, description="Breakdown of observed openings by seniority.")
    growth_department_indicators: List[GrowthDepartmentIndicator] = Field(default_factory=list, description="Departments showing potential growth indicators.")
    hiring_trends: List[HiringTrend] = Field(default_factory=list, description="Evidence-based hiring trends.")

# ============================================================
# System Prompt
# ============================================================
SYSTEM_PROMPT = """
You are Agent 5 — Hiring Intelligence Agent for AgentReach.
Your responsibility is to analyze a company's hiring activity and
identify hiring patterns that may indicate business growth,
investment, operational needs, or potential business demand.
You run after Agent 1 — Company Research.

============================================================
INPUT & TOOLS
============================================================
Use website_scraping and web_search to find active company job postings.
Prefer official company sources (careers pages) whenever possible.

============================================================
DATA EXTRACTION RULES
============================================================
- Do not invent job positions, numbers, departments, or source URLs.
- Categorize departments into: Engineering, Sales, Marketing, Customer Support, Operations, Finance, HR, Product, Data, Security, Executive, Other.
- Categorize seniority into: Intern, Entry-level, Mid-level, Senior, Lead, Manager, Director, VP, Executive, Other.
- If evidence is insufficient, return fewer findings rather than speculative ones.

============================================================
OUTPUT FORMAT (CRITICAL)
============================================================
YOU MUST CALL THE PROVIDED STRUCTURED OUTPUT TOOL WITH YOUR FINAL ANSWER.
DO NOT return plain conversational text or markdown blocks. 
You must ONLY output the strictly formatted JSON defined by the HiringIntelligenceOutput schema.
"""

# ============================================================
# Primary Agent
# ============================================================
primary_agent = create_agent(
    model=primary_llm,
    tools=[website_scraping, web_search],
    system_prompt=SYSTEM_PROMPT,
    response_format=ToolStrategy(HiringIntelligenceOutput),
)

# ============================================================
# Fallback Agent
# ============================================================
fallback_agent = create_agent(
    model=fallback_llm,
    tools=[website_scraping, web_search],
    system_prompt=SYSTEM_PROMPT,
    response_format=ToolStrategy(HiringIntelligenceOutput),
)
hiring_intelligence_agent = primary_agent