from typing import Any, Dict, List, Optional, TypedDict
from uuid import UUID


class ResearchState(TypedDict, total=False):

    # =========================================================
    # Input
    # =========================================================

    company_id: UUID
    company_name: str
    website: Optional[str]
    industry: Optional[str]

    # =========================================================
    # Workflow
    # =========================================================

    current_step: str
    current_agent: Optional[str]
    status: str

    retry_count: int
    max_retries: int

    errors: List[str]
    last_error: Optional[str]

    # =========================================================
    # Agent 1 — Company Research
    # =========================================================

    company_research: Optional[Dict[str, Any]]

    # =========================================================
    # Agent 2 — Website Analysis
    # =========================================================

    website_analysis: Optional[Dict[str, Any]]

    # =========================================================
    # Agent 3 — News Intelligence
    # =========================================================

    news_intelligence: Optional[Dict[str, Any]]

    # =========================================================
    # Agent 4 — Hiring Intelligence
    # =========================================================

    hiring_intelligence: Optional[Dict[str, Any]]

    # =========================================================
    # Agent 5 — Demand Intelligence
    # =========================================================

    demand_intelligence: Optional[Dict[str, Any]]

    # =========================================================
    # Our Company Intelligence
    # =========================================================

    company_intelligence: Optional[Dict[str, Any]]

    # =========================================================
    # Final ICP Report
    # =========================================================

    final_report: Optional[Dict[str, Any]]

    # =========================================================
    # Metadata
    # =========================================================

    completed_agents: List[str]
    failed_agents: List[str]
    processing_times: Dict[str, float]

    progress: int
    progress_message: Optional[str]