"""
API v1 Router - Aggregates all endpoint routers
"""
from fastapi import APIRouter

api_router = APIRouter()

# Import and include endpoint routers
from app.api.v1.endpoints import health, auth, transcription, formatting

api_router.include_router(health.router, tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(transcription.router, prefix="/transcribe", tags=["transcription"])
api_router.include_router(formatting.router, prefix="/format", tags=["formatting"])
