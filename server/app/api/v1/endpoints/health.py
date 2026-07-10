"""
Health Check Endpoints
"""
from fastapi import APIRouter
from app.core.config import settings

router = APIRouter()


@router.get("/health")
async def health_check():
    """Basic health check"""
    return {
        "status": "healthy",
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
    }


@router.get("/health/ready")
async def readiness_check():
    """Readiness check for deployment"""
    # Add checks for database, Redis, AI services here later
    checks = {
        "database": "ok",  # Will check actual DB connection
        "ai_service": "ok",  # Will check AI provider
    }
    
    all_healthy = all(v == "ok" for v in checks.values())
    
    return {
        "status": "ready" if all_healthy else "not_ready",
        "checks": checks,
    }
