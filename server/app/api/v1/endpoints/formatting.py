# server/app/api/v1/endpoints/formatting.py

import json
import groq
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from app.core.config import settings

router = APIRouter()

class FormatRequest(BaseModel):
    transcript: str
    template: str = "SOAP"

class FormatResponse(BaseModel):
    formatted_note: dict

@router.post("/note", response_model=FormatResponse)
async def format_note(req: FormatRequest):
    # Ensure API key is present
    if not settings.GROQ_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="GROQ API key not configured. Please contact the administrator.",
        )

    try:
        client = groq.Groq(api_key=settings.GROQ_API_KEY)
        prompt = f"""
        You are an AI medical assistant. Convert the following clinical transcript into a SOAP note.
        The SOAP note must have sections: Subjective, Objective, Assessment, Plan.
        Return a valid JSON object with keys: subjective, objective, assessment, plan.
        If any section is not mentioned, provide a placeholder like "Not mentioned" or "No data".

        Transcript:
        {req.transcript}

        JSON output:
        """

        response = client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=1024,
        )

        raw = response.choices[0].message.content.strip()

        # Try to parse JSON; if fail, treat as plain text and wrap it
        try:
            # Some models might include markdown code fences, clean them
            if raw.startswith("```json"):
                raw = raw.split("```json")[1].split("```")[0].strip()
            elif raw.startswith("```"):
                raw = raw.split("```")[1].split("```")[0].strip()
            parsed = json.loads(raw)
            # Ensure all keys exist
            for key in ["subjective", "objective", "assessment", "plan"]:
                if key not in parsed:
                    parsed[key] = "Not provided"
            return FormatResponse(formatted_note=parsed)
        except json.JSONDecodeError:
            # Fallback: put raw text in subjective
            return FormatResponse(
                formatted_note={
                    "subjective": raw,
                    "objective": "Not provided",
                    "assessment": "Not provided",
                    "plan": "Not provided",
                }
            )

    except groq.APIStatusError as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Groq API error: {e.message}",
        )
    except groq.APIConnectionError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Could not connect to Groq API: {str(e)}",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Formatting failed: {str(e)}",
        )
