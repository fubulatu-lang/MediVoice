"""
Note Formatting Endpoints
"""
import time
from fastapi import APIRouter, Depends, HTTPException
from app.api.deps import get_required_user
from app.models.database.user_table import User
from app.models.domain.transcription import FormattingRequest, FormattedNote
from app.services.llm.engine import llm_engine
import structlog

logger = structlog.get_logger()
router = APIRouter()


@router.post("/note", response_model=FormattedNote)
async def format_clinical_note(
    request: FormattingRequest,
    current_user: User = Depends(get_required_user),
):
    """
    Format raw transcription into structured clinical note
    """
    
    # Validate transcript
    if not request.transcript or len(request.transcript.strip()) < 10:
        raise HTTPException(
            status_code=400,
            detail="Transcript is too short for formatting"
        )
    
    # Validate template type
    valid_templates = ["soap", "consultation", "discharge", "procedure"]
    if request.template_type not in valid_templates:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid template. Choose from: {', '.join(valid_templates)}"
        )
    
    logger.info(
        "Formatting clinical note",
        user_id=current_user.id,
        template=request.template_type,
        transcript_length=len(request.transcript),
    )
    
    try:
        # Format note using LLM
        result = await llm_engine.format_note(
            transcript=request.transcript,
            template_type=request.template_type,
        )
        
        return FormattedNote(
            original_transcript=request.transcript,
            formatted_note=result["formatted_note"],
            template_used=result["template_used"],
            confidence=0.9,  # Placeholder
            processing_time=result["processing_time"],
        )
        
    except Exception as e:
        logger.error("Formatting failed", error=str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Note formatting failed: {str(e)}"
        )


@router.get("/templates")
async def list_templates(
    current_user: User = Depends(get_required_user),
):
    """List available note templates"""
    return {
        "templates": [
            {
                "id": "soap",
                "name": "SOAP Note",
                "description": "Subjective, Objective, Assessment, Plan",
                "sections": ["Subjective", "Objective", "Assessment", "Plan"],
            },
            {
                "id": "consultation",
                "name": "Consultation Note",
                "description": "Specialist consultation documentation",
                "sections": ["Reason", "History", "Examination", "Assessment", "Recommendations"],
            },
            {
                "id": "discharge",
                "name": "Discharge Summary",
                "description": "Hospital discharge documentation",
                "sections": ["Admission", "Course", "Discharge", "Medications", "Follow-up"],
            },
        ]
    }
