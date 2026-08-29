from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.model.service_provider_company import ServiceProviderCompany


# ============================================================
# Response Schema
# ============================================================

class CompanyResponse(BaseModel):
    company_id: UUID
    company_name: str
    industry: Optional[str] = None
    services_description: Optional[str] = None
    target_industries: Optional[List[str]] = None
    preferred_company_size: Optional[str] = None
    country: Optional[str] = None
    company_website: Optional[str] = None
    linkedin_company_page: Optional[str] = None

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# Company Intelligence
# ============================================================

def get_company_intelligence(
    company_id: UUID,
) -> dict:
    """
    Fetch the service-provider company's information
    required for service-demand matching.
    """

    db: Session = SessionLocal()

    try:
        company = db.execute(
            select(ServiceProviderCompany).where(
                ServiceProviderCompany.company_id == company_id
            )
        ).scalar_one_or_none()

        if company is None:
            return {
                "success": False,
                "error": "Company not found",
            }

        company_data = CompanyResponse.model_validate(company)

        return {
            "success": True,
            "company": company_data.model_dump(mode="json"),
        }

    finally:
        db.close()