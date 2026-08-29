import enum
import uuid

from sqlalchemy import (
    Column,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Integer,
    JSON,
    Numeric,
    String,
    Text,
    func,
)
from sqlalchemy.orm import relationship
from sqlalchemy.types import Uuid

from app.core.database import Base


# ============================================================
# Research Status
# ============================================================

class ResearchStatus(str, enum.Enum):
    pending = "pending"
    processing = "processing"
    completed = "completed"
    failed = "failed"


# ============================================================
# Research Session Model
# ============================================================

class ResearchSession(Base):
    __tablename__ = "research_sessions"

    # Primary Key
    session_id = Column(
        Uuid(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    # Ownership & Foreign Keys
    user_id = Column(
        Uuid(as_uuid=True),
        ForeignKey("users.user_id", ondelete="CASCADE"),
        nullable=False,
    )
    company_id = Column(
        Uuid(as_uuid=True),
        ForeignKey("service_provider_companies.company_id", ondelete="CASCADE"),
        nullable=False,
    )

    # Target Company Details
    target_company_name = Column(String(255), nullable=False)
    target_company_website = Column(Text, nullable=True)
    target_company_industry = Column(String(255), nullable=True)

    # Status & Progress
    research_status = Column(
        Enum(ResearchStatus),
        default=ResearchStatus.pending,
        nullable=False,
    )
    progress = Column(Integer, default=0, nullable=False)

    # Research Outputs (Structured Data)
    company_research = Column(JSON, nullable=True)
    website_analysis = Column(JSON, nullable=True)
    news_intelligence = Column(JSON, nullable=True)
    hiring_intelligence = Column(JSON, nullable=True)
    demand_intelligence = Column(JSON, nullable=True)
    company_intelligence = Column(JSON, nullable=True)
    final_report = Column(JSON, nullable=True)

    # Timings
    start_time = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    completion_time = Column(DateTime(timezone=True), nullable=True)
    processing_duration = Column(Float, nullable=True)

    # Resource & Cost Tracking
    total_tokens_used = Column(Integer, default=0, nullable=False)
    estimated_cost = Column(Numeric(10, 6), default=0.0, nullable=False)

    # Error Tracking
    error_message = Column(Text, nullable=True)

    # Relationships
    user = relationship("User", backref="research_sessions")
    service_provider_company = relationship(
        "ServiceProviderCompany",
        backref="research_sessions",
    )

    def __repr__(self) -> str:
        return (
            f"<ResearchSession("
            f"session_id='{self.session_id}', "
            f"target='{self.target_company_name}', "
            f"status='{self.research_status}', "
            f"progress={self.progress}%"
            f")>"
        )