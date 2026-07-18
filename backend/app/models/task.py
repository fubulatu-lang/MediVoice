from sqlalchemy import Column, String, DateTime, func, JSON, Text, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from ..core.database import Base

class TranscriptionTask(Base):
    __tablename__ = "transcription_tasks"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(20), default="pending", nullable=False)  # pending, completed, failed
    audio_duration = Column(Integer, nullable=True)  # seconds
    transcript = Column(Text, nullable=True)
    soap_note = Column(JSON, nullable=True)  # { subjective, objective, assessment, plan }
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)  # soft delete
    
    user = relationship("User", back_populates="tasks")
