"""
Transcription domain models
"""
from typing import Optional, List
from pydantic import BaseModel


class TranscriptionRequest(BaseModel):
    """Request schema for transcription"""
    audio_file: bytes
    language: Optional[str] = "en-US"
    medical_context: Optional[bool] = True


class TranscriptionResponse(BaseModel):
    """Response schema for transcription"""
    text: str
    confidence: float
    duration_seconds: float
    segments: Optional[List[dict]] = None
    medical_terms_detected: Optional[List[str]] = None


class FormattingRequest(BaseModel):
    """Request schema for note formatting"""
    transcript: str
    template_type: str = "soap"  # soap, consultation, discharge
    specialty: Optional[str] = "general"
    context: Optional[str] = None


class FormattedNote(BaseModel):
    """Response schema for formatted note"""
    original_transcript: str
    formatted_note: str
    template_used: str
    sections: Optional[dict] = None
    confidence: float
    processing_time: float
