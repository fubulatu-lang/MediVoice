"""
Main FastAPI Application - Cloud Version
All AI processing via cloud APIs
Phone-friendly CORS configuration
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.logging import setup_logging
from app.api.v1.router import api_router
from app.middleware.session_cleanup import SessionCleanupMiddleware

# Setup structured logging
logger = setup_logging()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager
    Handles startup and shutdown events
    """
    # Startup
    logger.info("🚀 Starting MediVoice API (Cloud Mode)", 
                version=settings.APP_VERSION,
                ai_provider=settings.AI_PROVIDER)
    
    # Validate cloud API keys
    if settings.AI_PROVIDER == "groq" and not settings.GROQ_API_KEY:
        logger.warning("⚠️ GROQ_API_KEY not set! Get free key at https://console.groq.com")
    elif settings.AI_PROVIDER == "openai" and not settings.OPENAI_API_KEY:
        logger.warning("⚠️ OPENAI_API_KEY not set!")
    
    # Initialize database
    from app.models.database.base import init_db
    await init_db()
    logger.info("✅ Database initialized")
    
    yield
    
    # Shutdown
    logger.info("👋 Shutting down MediVoice API")
    # Cleanup temporary files


def create_app() -> FastAPI:
    """Create and configure the FastAPI application"""
    
    app = FastAPI(
        title="MediVoice API - Cloud",
        version=settings.APP_VERSION,
        description="""
        ## Clinical Voice-to-Text Notes API
        
        **Cloud-Only Version** - All AI processing via cloud APIs
        
        ### Features:
        - 🎤 Voice recording from phone
        - ☁️ Cloud-based speech-to-text (Groq/OpenAI)
        - 🤖 Cloud LLM formatting (Llama 3.1/GPT)
        - 📋 SOAP note generation
        - 📱 Phone-optimized PWA
        
        ### Free Tier:
        - Groq API: Free STT + LLM
        - Neon.tech: Free PostgreSQL
        - Vercel: Free hosting
        """,
        docs_url="/docs" if settings.DEBUG else None,
        redoc_url="/redoc" if settings.DEBUG else None,
        openapi_url="/openapi.json" if settings.DEBUG else None,
        lifespan=lifespan,
    )
    
    # CORS Middleware - Allow phone access
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["*"],
        expose_headers=["*"],
    )
    
    # Session cleanup middleware (zero retention)
    app.add_middleware(SessionCleanupMiddleware)
    
    # Include API routes
    app.include_router(api_router, prefix=settings.API_PREFIX)
    
    # Health check endpoint
    @app.get("/health")
    async def health_check():
        return {
            "status": "healthy",
            "version": settings.APP_VERSION,
            "service": "medivoice-api-cloud",
            "ai_provider": settings.AI_PROVIDER,
            "mode": "cloud"
        }
    
    @app.get("/")
    async def root():
        return {
            "message": "MediVoice API - Cloud Version",
            "docs": "/docs",
            "health": "/health",
            "api": settings.API_PREFIX,
            "free_stt": "Groq Whisper" if settings.AI_PROVIDER == "groq" else "OpenAI Whisper",
            "free_llm": "Groq Llama 3.1" if settings.AI_PROVIDER == "groq" else "OpenAI GPT",
        }
    
    return app


app = create_app()
