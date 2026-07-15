from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.endpoints import formatting, health

app = FastAPI(
    title="NotaMed API v1.0.0",
    description="Voice-to-Text Medical Note Generator",
    version="1.0.0"
)

# CORS Configuration
origins = [
    "https://notamed.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
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

# Include routers (no authentication)
app.include_router(formatting.router, prefix="/api/v1/formatting", tags=["formatting"])
app.include_router(health.router, prefix="/api/v1/health", tags=["health"])

@app.get("/")
async def root():
    return {"message": "NotaMed API is running"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)