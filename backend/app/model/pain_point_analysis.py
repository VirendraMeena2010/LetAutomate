import uuid
from sqlalchemy import Column, Text, Float, ForeignKey
from sqlalchemy.types import Uuid
from sqlalchemy.orm import relationship

from app.core.database import Base

class PainPointAnalysis(Base):
    __tablename__ = "pain_point_analysis"

    analysis_id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id = Column(Uuid(as_uuid=True), ForeignKey("companies.company_id", ondelete="CASCADE"), nullable=False)
    session_id = Column(Uuid(as_uuid=True), ForeignKey("research_sessions.session_id", ondelete="CASCADE"), nullable=False)
    
    pain_point = Column(Text, nullable=False)
    opportunity = Column(Text, nullable=True)
    estimated_impact = Column(Text, nullable=True)
    confidence_score = Column(Float, nullable=True)
    ai_reasoning = Column(Text, nullable=True)

    company = relationship("Company")
    session = relationship("ResearchSession")
