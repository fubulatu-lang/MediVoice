from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.endpoints import auth, recordings, history, templates, health
from app.db.database import engine, Base

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="NotaMed API",
    description="Voice-to-Text Medical Note Generator",
    version="1.0.0"
)

# CORS Configuration - Allow your frontend
origins = [
    "https://notamed.vercel.app",
    "http://localhost:5173",  # For local development
    "http://localhost:3000",  # Alternative local dev
]

if settings.CORS_ORIGINS:
    origins.extend(settings.CORS_ORIGINS.split(","))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(recordings.router, prefix="/api/v1/recordings", tags=["recordings"])
app.include_router(history.router, prefix="/api/v1/history", tags=["history"])
app.include_router(templates.router, prefix="/api/v1/templates", tags=["templates"])
app.include_router(health.router, prefix="/api/v1/health", tags=["health"])

# Root endpoint
@app.get("/")
async def root():
    return {"message": "NotaMed API is running"}

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
