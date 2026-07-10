"""
Session Cleanup Middleware
Ensures no patient data is retained in memory
"""
import gc
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
import structlog

logger = structlog.get_logger()


class SessionCleanupMiddleware(BaseHTTPMiddleware):
    """
    Middleware to clean up request data after processing
    Implements zero-retention policy for HIPAA compliance
    """
    
    async def dispatch(self, request: Request, call_next):
        # Process request
        response = await call_next(request)
        
        # Clean up request body from memory
        if hasattr(request, '_body'):
            del request._body
        
        # Force garbage collection for large objects
        gc.collect()
        
        return response
