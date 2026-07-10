"""
Text Sanitizer Utility
Cleans and validates clinical text output
"""
import re
from typing import List


def sanitize_clinical_text(text: str) -> str:
    """
    Sanitize clinical note text
    
    - Removes excessive whitespace
    - Normalizes line endings
    - Removes control characters
    - Ensures proper section spacing
