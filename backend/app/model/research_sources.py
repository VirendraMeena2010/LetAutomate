import uuid
from sqlalchemy import Column, String, Text, Float, DateTime, ForeignKey, func
from sqlalchemy.types import Uuid
from sqlalchemy.orm import relationship

from app.core.database import Base

class ResearchSource(Base):
    __tablename__ = "research_sources"

    source_id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(Uuid(as_uuid=True), ForeignKey("research_sessions.session_id", ondelete="CASCADE"), nullable=False)
    
    source_type = Column(String(100), nullable=False)
    url = Column(Text, nullable=True)
    title = Column(String(255), nullable=True)
    
    retrieved_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    reliability_score = Column(Float, nullable=True)

    session = relationship("ResearchSession", backref="sources")
