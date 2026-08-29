import uuid
import enum
from sqlalchemy import Column, Text, Integer, DateTime, Enum, ForeignKey, func
from sqlalchemy.types import Uuid
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

from app.core.database import Base

class MessageSender(str, enum.Enum):
    user = "user"
    ai = "ai"

class Message(Base):
    __tablename__ = "messages"

    message_id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    chat_session_id = Column(Uuid(as_uuid=True), ForeignKey("chat_sessions.chat_session_id", ondelete="CASCADE"), nullable=False)
    
    sender = Column(Enum(MessageSender), nullable=False)
    message_content = Column(Text, nullable=False)
    
    # Store retrieved context dynamically
    retrieved_context = Column(JSONB, nullable=True)
    
    token_usage = Column(Integer, default=0, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    chat_session = relationship("ChatSession", backref="messages")
