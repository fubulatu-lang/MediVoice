import asyncio
import base64
import io
from typing import Tuple, Dict, Any
from groq import AsyncGroq
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
from ..core.config import settings
from ..core.exceptions import GroqAPIError

class GroqService:
    def __init__(self):
        self.client = AsyncGroq(api_key=settings.GROQ_API_KEY)
        self.soap_prompt = """You are a medical scribe. Convert the following doctor-patient conversation or dictation into a structured SOAP note.
        Return a strict JSON object with keys: subjective, objective, assessment, plan.
        If information is missing, leave the value as an empty string.
        Dictation: """
    
    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        retry=retry_if_exception_type((Exception,)),  # Catch all for MVP; refine later
    )
    async def transcribe_audio(self, file_bytes: bytes, filename: str) -> str:
        try:
            # Groq Whisper expects a file-like object
            file_obj = io.BytesIO(file_bytes)
            file_obj.name = filename  # required for mime type detection
            
            transcription = await self.client.audio.transcriptions.create(
                file=file_obj,
                model="whisper-large-v3-turbo",
                response_format="text",
                language="en",
            )
            return transcription
        except Exception as e:
            raise GroqAPIError(f"STT failed: {str(e)}") from e
    
    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        retry=retry_if_exception_type((Exception,)),
    )
    async def generate_soap(self, transcript: str) -> Dict[str, str]:
        try:
            response = await self.client.chat.completions.create(
                model="mixtral-8x7b-32768",
                messages=[
                    {"role": "system", "content": self.soap_prompt},
                    {"role": "user", "content": transcript}
                ],
                temperature=0.2,
                response_format={"type": "json_object"},
            )
            import json
            content = response.choices[0].message.content
            # Ensure it's valid JSON, fallback to empty fields if parsing fails
            try:
                return json.loads(content)
            except json.JSONDecodeError:
                # Hard fallback for MVP
                return {"subjective": "", "objective": "", "assessment": "", "plan": content}
        except Exception as e:
            raise GroqAPIError(f"LLM failed: {str(e)}") from e

    async def process_audio(self, file_bytes: bytes, filename: str) -> Tuple[str, Dict[str, str]]:
        transcript = await self.transcribe_audio(file_bytes, filename)
        soap = await self.generate_soap(transcript)
        return transcript, soap
