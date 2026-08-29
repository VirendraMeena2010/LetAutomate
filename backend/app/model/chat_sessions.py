import uuid
import enum
from sqlalchemy import Column, String, Enum, DateTime, ForeignKey, func
from sqlalchemy.types import Uuid
from sqlalchemy.orm import relationship

from app.core.database import Base

class ChatStatus(str, enum.Enum):
    active = "active"
    archived = "archived"
    closed = "closed"

class ChatSession(Base):
    __tablename__ = "chat_sessions"
    chat_session_id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    company_id = Column(Uuid(as_uuid=True), ForeignKey("companies.company_id", ondelete="CASCADE"), nullable=False)
    started_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    last_activity = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now(), nullable=False)
    status = Column(Enum(ChatStatus), default=ChatStatus.active, nullable=False)
    user = relationship("User")
    company = relationship("Company")
