import os
from typing import Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    CORS_ORIGINS: Optional[str] = os.getenv("CORS_ORIGINS", "")
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
