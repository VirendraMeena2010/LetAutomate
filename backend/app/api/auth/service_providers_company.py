from fastapi import APIRouter, status, HTTPException, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import (
    create_access_token,
    get_current_company,
    get_current_user,
    hash_password,
    verify_password,
)
from app.model.service_provider_company import ServiceProviderCompany
from app.schemas.service_provider_company import (
    CompanyCreate,
    CompanyListItem,
    CompanyLogin,
    CompanyMeResponse,
    CompanyResponse,
    CompanyTokenResponse,
)

serviceprovidercompany_router = APIRouter(tags=["Service Provider Company"])


# ============================================================
# REGISTER COMPANY
# ============================================================
@serviceprovidercompany_router.post(
    "/register",
    response_model=CompanyResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_company(
    company: CompanyCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Register a new service provider company under the authenticated owner."""
    # Ensure owner exists
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Owner authentication required",
        )

    # Check if company email already exists
    existing_company = (
        db.query(ServiceProviderCompany)
        .filter(ServiceProviderCompany.company_email == company.company_email)
        .first()
    )
    if existing_company:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Company with this email already exists",
        )

    # Create company instance
    hashed_password = hash_password(company.company_password)
    new_company = ServiceProviderCompany(
        owner_id=current_user,  # Fixed: Accessing the ID attribute from the user object
        company_email=company.company_email,
        company_password_hash=hashed_password,
        company_name=company.company_name,
        industry=company.industry,
        company_website=company.company_website,
        country=company.country,
        linkedin_company_page=company.linkedin_company_page,
        services_description=company.services_description,
        target_industries=company.target_industries,
        preferred_company_size=company.preferred_company_size,
        brand_voice=company.brand_voice,
        default_cta=company.default_cta,
        email_signature=company.email_signature,
        preferred_tone=company.preferred_tone,
    )

    db.add(new_company)
    db.commit()
    db.refresh(new_company)
    return new_company


# ============================================================
# COMPANY LOGIN
# ============================================================
@serviceprovidercompany_router.post(
    "/login",
    response_model=CompanyTokenResponse,
)
async def login_company(
    company_login: CompanyLogin,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Authenticate a company account belonging to the logged-in owner."""
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Owner authentication required",
        )

    # Find company belonging to this owner
    db_company = (
        db.query(ServiceProviderCompany)
        .filter(
            ServiceProviderCompany.company_email == company_login.company_email,
            ServiceProviderCompany.owner_id == current_user,  # Fixed: Accessing user_id attribute
        )
        .first()
    )

    # Validate credentials
    if not db_company or not verify_password(
        company_login.company_password,
        db_company.company_password_hash,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid company email or password",
        )

    # Create COMPANY JWT
    access_token = create_access_token(
        data={
            "sub": str(db_company.company_id),
            "type": "company",
        }
    )

    return CompanyTokenResponse(
        access_token=access_token,
        token_type="bearer",
        company=db_company,
    )


# ============================================================
# GET OWNER'S COMPANIES
# ============================================================
@serviceprovidercompany_router.get(
    "/companies",
    response_model=list[CompanyListItem],
)
def get_owner_companies(
    current_owner=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return all service-provider companies owned by the authenticated owner."""
    if current_owner is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Owner authentication required",
        )

    companies = (
        db.query(ServiceProviderCompany)
        .filter(ServiceProviderCompany.owner_id == current_owner)
        .order_by(ServiceProviderCompany.created_at.desc())
        .all()
    )
    return companies


# ============================================================
# GET CURRENT COMPANY PROFILE
# ============================================================
@serviceprovidercompany_router.get(
    "/me",
    response_model=CompanyMeResponse,
)
def get_current_company_profile(
    current_company=Depends(get_current_company),
):
    """Return the profile of the currently authenticated company via company JWT."""
    if current_company is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Company authentication required",
        )
    return current_company
