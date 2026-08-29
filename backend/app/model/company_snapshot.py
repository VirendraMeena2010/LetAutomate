import uuid
from sqlalchemy import Column, Text, DateTime, ForeignKey, func
from sqlalchemy.types import Uuid
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

from app.core.database import Base

class CompanySnapshot(Base):
    __tablename__ = "company_snapshots"

    # Primary and Foreign Keys
    snapshot_id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    company_id = Column(
        Uuid(as_uuid=True), 
        ForeignKey("companies.company_id", ondelete="CASCADE"), 
        nullable=False,
        index=True
    )
    
    session_id = Column(
        Uuid(as_uuid=True), 
        ForeignKey("research_sessions.session_id", ondelete="SET NULL"), 
        nullable=True
    )

    # Snapshot Metadata
    snapshot_date = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    # Processed Summaries
    company_summary = Column(Text, nullable=True)
    ai_summary = Column(Text, nullable=True)
    
    # Raw Data Storage
    raw_research_data = Column(JSONB, nullable=True, default={})

    # Relationships
    company = relationship("Company", backref="snapshots")
    session = relationship("ResearchSession", backref="snapshots")

    def __repr__(self):
        return f"<CompanySnapshot(company_id='{self.company_id}', date='{self.snapshot_date}')>"