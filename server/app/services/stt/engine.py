"""
STT Engine - Abstraction layer for speech-to-text services
"""
from typing import Optional
import structlog
from app.core.config import settings

logger = structlog.get_logger()


class STTEngine:
    """Base STT Engine class"""
    
    def __init__(self):
        self.provider = settings.AI_PROVIDER
    
    async def transcribe(self, audio_data: bytes, language: str = "en") -> dict:
        """
        Transcribe audio to text
        
        Args:
            audio_data: Raw audio bytes
            language: Language code
            
        Returns:
            dict with text, confidence, segments
        """
        logger.info("Transcribing audio", provider=self.provider)
        
        if self.provider == "groq":
            return await self._transcribe_groq(audio_data, language)
        elif self.provider == "ollama":
            return await self._transcribe_ollama(audio_data, language)
        elif self.provider == "openai":
            return await self._transcribe_openai(audio_data, language)
        else:
            raise ValueError(f"Unknown STT provider: {self.provider}")
    
    async def _transcribe_groq(self, audio_data: bytes, language: str) -> dict:
        """Transcribe using Groq API (FREE TIER)"""
        try:
            from groq import Groq
            
            client = Groq(api_key=settings.GROQ_API_KEY)
            
            # Groq uses Whisper model
            response = client.audio.transcriptions.create(
                model=settings.GROQ_MODEL,
                file=("recording.wav", audio_data),
                language=language,
                response_format="verbose_json",
            )
            
            return {
                "text": response.text,
                "confidence": getattr(response, 'confidence', 0.9),
                "segments": getattr(response, 'segments', []),
                "duration": getattr(response, 'duration', 0.0),
                "provider": "groq"
            }
            
        except Exception as e:
            logger.error("Groq transcription failed", error=str(e))
            raise
    
    async def _transcribe_ollama(self, audio_data: bytes, language: str) -> dict:
        """Transcribe using local Ollama (FREE)"""
        try:
            import httpx
            
            async with httpx.AsyncClient() as client:
                # Save audio temporarily
                import tempfile
                import os
                
                with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as tmp:
                    tmp.write(audio_data)
                    tmp_path = tmp.name
                
                # Use Ollama API
                response = await client.post(
                    f"{settings.OLLAMA_BASE_URL}/api/transcribe",
                    json={
                        "model": settings.OLLAMA_STT_MODEL,
                        "file": tmp_path,
                    }
                )
                
                # Cleanup
                os.unlink(tmp_path)
                
                if response.status_code == 200:
                    data = response.json()
                    return {
                        "text": data.get("text", ""),
                        "confidence": 0.8,
                        "provider": "ollama"
                    }
                else:
                    raise Exception(f"Ollama error: {response.text}")
                    
        except Exception as e:
            logger.error("Ollama transcription failed", error=str(e))
            raise
    
    async def _transcribe_openai(self, audio_data: bytes, language: str) -> dict:
        """Transcribe using OpenAI Whisper (PAID)"""
        try:
            from openai import AsyncOpenAI
            
            client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
            
            response = await client.audio.transcriptions.create(
                model=settings.OPENAI_WHISPER_MODEL,
                file=("recording.wav", audio_data),
                language=language,
                response_format="verbose_json",
            )
            
            return {
                "text": response.text,
                "confidence": getattr(response, 'confidence', 0.9),
                "segments": getattr(response, 'segments', []),
                "duration": getattr(response, 'duration', 0.0),
                "provider": "openai"
            }
            
        except Exception as e:
            logger.error("OpenAI transcription failed", error=str(e))
            raise


# Singleton instance
stt_engine = STTEngine()
