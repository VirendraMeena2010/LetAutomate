from typing import Any, Dict, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.langfuse import create_langfuse_handler
from app.core.security import get_current_company
from app.model.service_provider_company import ServiceProviderCompany
from app.model.research_session import ResearchSession, ResearchStatus
from app.services.brain.graph import research_graph

router = APIRouter(
    tags=["Research"],
)


# ============================================================
# Request Schemas
# ============================================================

class TargetCompanyRequest(BaseModel):
    """Payload to trigger research on a target company."""

    target_company_name: str = Field(
        ...,
        description="Name of the target company",
    )
    target_company_website: Optional[str] = Field(
        None,
        description="Website of the target company",
    )
    target_company_industry: Optional[str] = Field(
        None,
        description="Industry of the target company",
    )


# ============================================================
# Endpoints
# ============================================================

@router.post(
    "/run",
    status_code=status.HTTP_200_OK,
)
async def run_company_research(
    request: TargetCompanyRequest,
    current_company: Any = Depends(get_current_company),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Creates a new research session record, invokes the LangGraph pipeline,
    and updates the database with the results upon completion.
    """
    company_id = current_company

    # 1. Fetch ServiceProviderCompany to retrieve owner_id
    service_provider = (
        db.query(ServiceProviderCompany)
        .filter(
            ServiceProviderCompany.company_id == company_id,
        )
        .first()
    )

    if service_provider is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Authenticated company not found",
        )

    owner_id = service_provider.owner_id

    if owner_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Authenticated company has no owner",
        )

    # 2. Initialize research session in database
    research_session = ResearchSession(
        user_id=owner_id,
        company_id=company_id,
        target_company_name=request.target_company_name,
        target_company_website=request.target_company_website,
        target_company_industry=request.target_company_industry,
        research_status=ResearchStatus.processing,
        progress=0,
        company_research=None,
        website_analysis=None,
        news_intelligence=None,
        hiring_intelligence=None,
        demand_intelligence=None,
        company_intelligence=None,
        final_report=None,
        total_tokens_used=0,
        estimated_cost=0.0,
    )

    db.add(research_session)
    db.commit()
    db.refresh(research_session)

    session_id = research_session.session_id

    # 3. Build initial LangGraph execution state
    initial_state = {
        "company_id": company_id,
        "company_name": request.target_company_name,
        "website": request.target_company_website,
        "industry": request.target_company_industry,
        "company_research": None,
        "website_analysis": None,
        "news_intelligence": None,
        "hiring_intelligence": None,
        "demand_intelligence": None,
        "company_intelligence": None,
        "final_report": None,
        "current_agent": None,
        "current_step": "started",
        "status": "running",
        "progress": 0,
        "progress_message": "Research pipeline started.",
        "retry_count": 0,
        "max_retries": 2,
        "errors": [],
        "last_error": None,
        "completed_agents": [],
        "failed_agents": [],
        "processing_times": {},
    }

    # 4. Execute LangGraph pipeline
    try:
        langfuse_handler = create_langfuse_handler()

        result = await research_graph.ainvoke(
            initial_state,
            config={
                "callbacks": [langfuse_handler],
                "run_name": "company-research",
                "metadata": {
                    "session_id": str(session_id),
                    "company_id": str(company_id),
                    "owner_id": str(owner_id),
                    "target_company": request.target_company_name,
                    "industry": request.target_company_industry,
                },
            },
        )

        # 5. Save completed output to database
        research_session.company_research = result.get("company_research")
        research_session.website_analysis = result.get("website_analysis")
        research_session.news_intelligence = result.get("news_intelligence")
        research_session.hiring_intelligence = result.get("hiring_intelligence")
        research_session.demand_intelligence = result.get("demand_intelligence")
        research_session.company_intelligence = result.get("company_intelligence")
        research_session.final_report = result.get("final_report")
        research_session.research_status = ResearchStatus.completed
        research_session.progress = result.get("progress") or 100

        db.commit()
        db.refresh(research_session)

        return {
            "success": True,
            "session_id": str(session_id),
            "status": research_session.research_status.value,
            "current_step": result.get("current_step"),
            "progress": research_session.progress,
            "progress_message": result.get("progress_message"),
            "company_research": result.get("company_research"),
            "website_analysis": result.get("website_analysis"),
            "news_intelligence": result.get("news_intelligence"),
            "hiring_intelligence": result.get("hiring_intelligence"),
            "demand_intelligence": result.get("demand_intelligence"),
            "company_intelligence": result.get("company_intelligence"),
            "final_report": result.get("final_report"),
        }

    except Exception as exc:
        research_session.research_status = ResearchStatus.failed
        research_session.error_message = str(exc)
        research_session.progress = 0

        db.commit()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Research pipeline failed: {str(exc)}",
        )


@router.get(
    "/research/{session_id}",
    status_code=status.HTTP_200_OK,
)
async def get_research(
    session_id: str,
    current_company: Any = Depends(get_current_company),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Fetch the results and execution status of a specific research session
    belonging to the authenticated company.
    """
    research_session = (
        db.query(ResearchSession)
        .filter(
            ResearchSession.session_id == session_id,
            ResearchSession.company_id == current_company,
        )
        .first()
    )

    if research_session is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Research session not found",
        )

    return {
        "success": True,
        "session_id": str(research_session.session_id),
        "company_id": str(research_session.company_id),
        "target_company": {
            "name": research_session.target_company_name,
            "website": research_session.target_company_website,
            "industry": research_session.target_company_industry,
        },
        "status": (
            research_session.research_status.value
            if research_session.research_status
            else None
        ),
        "progress": research_session.progress,
        "start_time": (
            research_session.start_time.isoformat()
            if research_session.start_time
            else None
        ),
        "completion_time": (
            research_session.completion_time.isoformat()
            if research_session.completion_time
            else None
        ),
        "processing_duration": research_session.processing_duration,
        "company_research": research_session.company_research,
        "website_analysis": research_session.website_analysis,
        "news_intelligence": research_session.news_intelligence,
        "hiring_intelligence": research_session.hiring_intelligence,
        "demand_intelligence": research_session.demand_intelligence,
        "company_intelligence": research_session.company_intelligence,
        "final_report": research_session.final_report,
        "total_tokens_used": research_session.total_tokens_used,
        "estimated_cost": (
            float(research_session.estimated_cost)
            if research_session.estimated_cost is not None
            else 0.0
        ),
        "error_message": research_session.error_message,
    }


@router.get(
    "/research",
    status_code=status.HTTP_200_OK,
)
async def get_research_history(
    current_company: Any = Depends(get_current_company),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Return all research sessions belonging to the authenticated company.
    """

    research_sessions = (
        db.query(ResearchSession)
        .filter(
            ResearchSession.company_id == current_company
        )
        .order_by(ResearchSession.start_time.desc())
        .all()
    )

    return {
        "success": True,
        "research": [
            {
                "session_id": str(session.session_id),
                "target_company": {
                    "name": session.target_company_name,
                    "website": session.target_company_website,
                    "industry": session.target_company_industry,
                },
                "status": (
                    session.research_status.value
                    if session.research_status
                    else None
                ),
                "progress": session.progress,
                "start_time": (
                    session.start_time.isoformat()
                    if session.start_time
                    else None
                ),
                "completion_time": (
                    session.completion_time.isoformat()
                    if session.completion_time
                    else None
                ),
            }
            for session in research_sessions
        ],
    }