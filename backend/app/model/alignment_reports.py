import uuid
from sqlalchemy import Column, Text, Float, ForeignKey
from sqlalchemy.types import Uuid
from sqlalchemy.orm import relationship

from app.core.database import Base

class AlignmentReport(Base):
    __tablename__ = "alignment_reports"

    alignment_id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(Uuid(as_uuid=True), ForeignKey("research_sessions.session_id", ondelete="CASCADE"), nullable=False, unique=True)
    
    overall_score = Column(Float, nullable=True)
    industry_match = Column(Float, nullable=True)
    technology_match = Column(Float, nullable=True)
    hiring_match = Column(Float, nullable=True)
    pain_point_match = Column(Float, nullable=True)
    budget_probability = Column(Float, nullable=True)
    ai_adoption_score = Column(Float, nullable=True)
    urgency_score = Column(Float, nullable=True)
    
    final_recommendation = Column(Text, nullable=True)
    reasoning = Column(Text, nullable=True)

    session = relationship("ResearchSession")
