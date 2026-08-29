import uuid
import enum
from sqlalchemy import Column, String, Text, Float, Enum, ForeignKey
from sqlalchemy.types import Uuid
from sqlalchemy.orm import relationship

from app.core.database import Base

class EmailStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"
    edited = "edited"

class GeneratedEmail(Base):
    __tablename__ = "generated_emails"

    email_id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(Uuid(as_uuid=True), ForeignKey("research_sessions.session_id", ondelete="CASCADE"), nullable=False)
    decision_maker_id = Column(Uuid(as_uuid=True), ForeignKey("decision_makers.decision_maker_id", ondelete="SET NULL"), nullable=True)
    
    subject = Column(String(255), nullable=True)
    email_body = Column(Text, nullable=False)
    tone = Column(String(100), nullable=True)
    status = Column(Enum(EmailStatus), default=EmailStatus.pending, nullable=False)
    
    spam_score = Column(Float, nullable=True)
    ai_score = Column(Float, nullable=True)
    grammar_score = Column(Float, nullable=True)
    personalization_score = Column(Float, nullable=True)

    session = relationship("ResearchSession")
    decision_maker = relationship("DecisionMaker")
