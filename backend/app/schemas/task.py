from pydantic import BaseModel
from uuid import UUID
from typing import Optional, Dict, Any
from datetime import datetime

class TaskCreateResponse(BaseModel):
    task_id: UUID
    status: str

class TaskStatusResponse(BaseModel):
    id: UUID
    status: str
    error_message: Optional[str] = None

class TaskDetailResponse(BaseModel):
    id: UUID
    status: str
    transcript: Optional[str] = None
    soap_note: Optional[Dict[str, Any]] = None
    audio_duration: Optional[int] = None
    created_at: datetime
    updated_at: datetime

class TaskListResponse(BaseModel):
    tasks: list[TaskDetailResponse]
    total: int
    page: int
    limit: int
