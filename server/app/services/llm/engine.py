"""
LLM Engine - Abstraction layer for LLM formatting services
"""
from typing import Optional
import time
import structlog
from app.core.config import settings

logger = structlog.get_logger()


class LLMEngine:
    """Base LLM Engine class for clinical note formatting"""
    
    def __init__(self):
        self.provider = settings.AI_PROVIDER
    
    async def format_note(self, transcript: str, template_type: str = "soap") -> dict:
        """
        Format transcript into clinical note
        
        Args:
            transcript: Raw transcription text
            template_type: Note template (soap, consultation, discharge)
            
        Returns:
            dict with formatted note and metadata
        """
        start_time = time.time()
        
        logger.info("Formatting clinical note", template=template_type)
        
        # Get appropriate prompt
        prompt = self._get_prompt(transcript, template_type)
        
        # Get completion from LLM
        formatted_text = await self._get_completion(prompt)
        
        processing_time = time.time() - start_time
        
        return {
            "formatted_note": formatted_text,
            "template_used": template_type,
            "processing_time": processing_time,
            "provider": self.provider
        }
    
    def _get_prompt(self, transcript: str, template_type: str) -> str:
        """Generate clinical formatting prompt"""
        
        if template_type == "soap":
            return f"""You are a medical documentation expert. Convert the following clinical dictation into a professionally formatted SOAP note.

## Guidelines:
- **S (Subjective)**: Patient's reported symptoms, history, complaints
- **O (Objective)**: Vital signs, physical exam findings, lab results
- **A (Assessment)**: Diagnosis, differential diagnoses, clinical impression  
- **P (Plan)**: Treatment plan, medications, follow-up instructions

- Use proper medical terminology
- Maintain a professional, concise tone
- Include all clinically relevant information
- Format with clear section headers
- Note any missing information with [Not specified]

## Clinical Dictation:
{transcript}

## Formatted SOAP Note:
"""
        
        elif template_type == "consultation":
            return f"""Convert this clinical consultation dictation into a formatted consultation note.

Include:
- Reason for Consultation
- History of Present Illness
- Review of Systems
- Physical Examination
- Assessment and Recommendations

## Dictation:
{transcript}

## Consultation Note:
"""
        
        else:
            return f"""Format this clinical dictation into a structured medical note.

## Dictation:
{transcript}

## Structured Note:
"""
    
    async def _get_completion(self, prompt: str) -> str:
        """Get completion from configured LLM provider"""
        
        if self.provider == "groq":
            return await self._complete_groq(prompt)
        elif self.provider == "ollama":
            return await self._complete_ollama(prompt)
        elif self.provider == "openai":
            return await self._complete_openai(prompt)
        else:
            raise ValueError(f"Unknown LLM provider: {self.provider}")
    
    async def _complete_groq(self, prompt: str) -> str:
        """Complete using Groq API (FREE TIER - Llama 3.1)"""
        try:
            from groq import Groq
            
            client = Groq(api_key=settings.GROQ_API_KEY)
            
            response = client.chat.completions.create(
                model=settings.GROQ_LLM_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert medical documentation assistant. Format clinical notes professionally and accurately."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.3,
                max_tokens=2000,
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            logger.error("Groq completion failed", error=str(e))
            raise
    
    async def _complete_ollama(self, prompt: str) -> str:
        """Complete using local Ollama (FREE)"""
        try:
            import httpx
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{settings.OLLAMA_BASE_URL}/api/generate",
                    json={
                        "model": settings.OLLAMA_LLM_MODEL,
                        "prompt": prompt,
                        "stream": False,
                        "options": {
                            "temperature": 0.3,
                            "max_tokens": 2000,
                        }
                    },
                    timeout=60.0
                )
                
                if response.status_code == 200:
                    return response.json().get("response", "")
                else:
                    raise Exception(f"Ollama error: {response.text}")
                    
        except Exception as e:
            logger.error("Ollama completion failed", error=str(e))
            raise
    
    async def _complete_openai(self, prompt: str) -> str:
        """Complete using OpenAI (PAID)"""
        try:
            from openai import AsyncOpenAI
            
            client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
            
            response = await client.chat.completions.create(
                model=settings.OPENAI_LLM_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert medical documentation assistant."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.3,
                max_tokens=2000,
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            logger.error("OpenAI completion failed", error=str(e))
            raise


# Singleton instance
llm_engine = LLMEngine()
