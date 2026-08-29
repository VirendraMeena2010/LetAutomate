import uuid
from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey, func
from sqlalchemy.types import Uuid
from sqlalchemy.orm import relationship

from app.core.database import Base

class EmailVersion(Base):
    __tablename__ = "email_versions"

    version_id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email_id = Column(Uuid(as_uuid=True), ForeignKey("generated_emails.email_id", ondelete="CASCADE"), nullable=False)
    
    version_number = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)
    edited_by = Column(Uuid(as_uuid=True), ForeignKey("users.user_id", ondelete="SET NULL"), nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    email = relationship("GeneratedEmail", backref="versions")
    editor = relationship("User")
