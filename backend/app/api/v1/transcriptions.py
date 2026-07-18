from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from uuid import UUID
import uuid
import io

from ...core.database import get_db
from ...core.security import decode_token
from ...core.exceptions import UnauthorizedError, GroqAPIError
from ...models.user import User
from ...models.task import TranscriptionTask
from ...schemas.task import (
    TaskCreateResponse, TaskStatusResponse, TaskDetailResponse, TaskListResponse
)
from ...services.groq_service import GroqService

router = APIRouter(prefix="/transcriptions", tags=["Transcriptions"])

async def get_current_user_from_cookie(request: Request, db: AsyncSession):
    token = request.cookies.get("access_token")
    if not token:
        raise UnauthorizedError()
    try:
        payload = decode_token(token)
        user_id = payload.get("sub")
        if not user_id:
            raise UnauthorizedError()
        result = await db.execute(select(User).where(User.id == uuid.UUID(user_id)))
        user = result.scalar_one_or_none()
        if not user:
            raise UnauthorizedError()
        return user
    except Exception:
        raise UnauthorizedError()

@router.post("/", response_model=TaskCreateResponse, status_code=status.HTTP_202_ACCEPTED)
async def create_transcription(
    request: Request,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
):
    # 1. Validate file (max 25MB, webm/mp4)
    if file.size > 25 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File too large (max 25MB)")
    if file.content_type not in ["audio/webm", "audio/mp4", "audio/webm;codecs=opus"]:
        raise HTTPException(status_code=415, detail="Only WebM/MP4 audio supported")
    
    # 2. Auth
    user = await get_current_user_from_cookie(request, db)
    
    # 3. Create pending task
    task = TranscriptionTask(
        user_id=user.id,
        status="pending",
        audio_duration=0,  # placeholder
    )
    db.add(task)
    await db.commit()
    await db.refresh(task)
    
    # 4. Process audio in background (simulated async inside request - okay for MVP)
    # To avoid blocking, we use asyncio.create_task but we need the response fast.
    # However, Vercel allows 60s, and Groq takes ~8s. We process synchronously but return 202.
    # Actually, for true async processing, we would use a queue. For MVP, we process here.
    # BUT we must respond quickly. Let's run the heavy lifting in the background
    # and update the task later. We'll create a background task.
    import asyncio
    asyncio.create_task(process_task_background(task.id, file, db))
    
    return TaskCreateResponse(task_id=task.id, status="pending")

async def process_task_background(task_id: UUID, file: UploadFile, db: AsyncSession):
    # This runs in the background. We need a new DB session.
    from ...core.database import AsyncSessionLocal
    from ...services.groq_service import GroqService
    
    async with AsyncSessionLocal() as session:
        try:
            # Read file
            content = await file.read()
            
            # Update status
            result = await session.execute(select(TranscriptionTask).where(TranscriptionTask.id == task_id))
            task = result.scalar_one()
            task.status = "processing"
            await session.commit()
            
            # Call Groq
            groq = GroqService()
            transcript, soap = await groq.process_audio(content, file.filename)
            
            # Update task
            task.status = "completed"
            task.transcript = transcript
            task.soap_note = soap
            # Approx duration from file size? Just placeholder.
            await session.commit()
        except Exception as e:
            # Log error
            result = await session.execute(select(TranscriptionTask).where(TranscriptionTask.id == task_id))
            task = result.scalar_one()
            task.status = "failed"
            task.error_message = str(e)
            await session.commit()

@router.get("/", response_model=TaskListResponse)
async def list_transcriptions(
    request: Request,
    page: int = 1,
    limit: int = 10,
    db: AsyncSession = Depends(get_db),
):
    user = await get_current_user_from_cookie(request, db)
    offset = (page - 1) * limit
    
    # Query
    stmt = select(TranscriptionTask).where(
        and_(
            TranscriptionTask.user_id == user.id,
            TranscriptionTask.deleted_at.is_(None)
        )
    ).order_by(TranscriptionTask.created_at.desc()).offset(offset).limit(limit)
    
    result = await db.execute(stmt)
    tasks = result.scalars().all()
    
    total_stmt = select(func.count()).select_from(TranscriptionTask).where(
        and_(
            TranscriptionTask.user_id == user.id,
            TranscriptionTask.deleted_at.is_(None)
        )
    )
    total = await db.scalar(total_stmt)
    
    return TaskListResponse(
        tasks=[TaskDetailResponse(
            id=t.id,
            status=t.status,
            transcript=t.transcript,
            soap_note=t.soap_note,
            audio_duration=t.audio_duration,
            created_at=t.created_at,
            updated_at=t.updated_at
        ) for t in tasks],
        total=total,
        page=page,
        limit=limit
    )

@router.get("/{task_id}", response_model=TaskDetailResponse)
async def get_transcription(
    task_id: UUID,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    user = await get_current_user_from_cookie(request, db)
    result = await db.execute(
        select(TranscriptionTask).where(
            TranscriptionTask.id == task_id,
            TranscriptionTask.user_id == user.id,
            TranscriptionTask.deleted_at.is_(None)
        )
    )
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Note not found")
    return TaskDetailResponse(
        id=task.id,
        status=task.status,
        transcript=task.transcript,
        soap_note=task.soap_note,
        audio_duration=task.audio_duration,
        created_at=task.created_at,
        updated_at=task.updated_at
    )

@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_transcription(
    task_id: UUID,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    user = await get_current_user_from_cookie(request, db)
    result = await db.execute(
        select(TranscriptionTask).where(
            TranscriptionTask.id == task_id,
            TranscriptionTask.user_id == user.id
        )
    )
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Note not found")
    from datetime import datetime, timezone
    task.deleted_at = datetime.now(timezone.utc)
    await db.commit()
    return None
