"""
Application Configuration - CLOUD ONLY VERSION
Uses Pydantic Settings for environment variable management
No local AI - all processing via cloud APIs
"""
from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import validator


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Application
    APP_NAME: str = "MediVoice"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "development"
    API_PREFIX: str = "/api/v1"
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    WORKERS: int = 1
    RELOAD: bool = False
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000", "https://medivoice.vercel.app"]
    
    @validator("CORS_ORIGINS", pre=True)
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            import json
            return json.loads(v)
        return v
    
    # Database - Neon.tech (Cloud PostgreSQL)
    DATABASE_URL: str = "postgresql://neondb_owner:npg_5ubdxUCYz6PE@ep-winter-art-atv1ymgx-pooler.c-9.us-east-1.aws.neon.tech/medivoice_db?sslmode=require&channel_binding=require"  # Default SQLite for dev
    
    # Redis - Upstash (Cloud Redis) - Optional for MVP
    REDIS_URL: Optional[str] = None
    
    # JWT Authentication
    JWT_SECRET_KEY: str = "change-this-in-production-use-a-long-random-string"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Session
    SESSION_TIMEOUT_MINUTES: int = 10
    MAX_NOTES_PER_SESSION: int = 5
    
    # ============================================
    # AI/ML Configuration - CLOUD ONLY
    # ============================================
    
    # Primary: Groq Cloud (FREE TIER - Recommended)
    # Sign up at https://console.groq.com for free API key
    GROQ_API_KEY: Optional[str] = None
    GROQ_STT_MODEL: str = "whisper-large-v3"  # Speech-to-Text
    GROQ_LLM_MODEL: str = "llama-3.1-70b-versatile"  # Note Formatting
    
    # Secondary: OpenAI (PAID - Optional fallback)
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_STT_MODEL: str = "whisper-1"
    OPENAI_LLM_MODEL: str = "gpt-3.5-turbo"
    
    # Active AI Provider: "groq" or "openai"
    AI_PROVIDER: str = "groq"
    
    # Feature Flags
    ENABLE_MULTI_TEMPLATE: bool = False
    ENABLE_OFFLINE_MODE: bool = False
    ENABLE_BACKGROUND_RECORDING: bool = False
    ENABLE_AUDIT_LOGGING: bool = False
    
    # Security
    ENCRYPTION_ENABLED: bool = False
    RATE_LIMIT_ENABLED: bool = False
    RATE_LIMIT_PER_MINUTE: int = 30
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "json"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()
