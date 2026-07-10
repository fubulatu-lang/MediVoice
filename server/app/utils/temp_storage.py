"""
Temporary In-Memory Storage
For zero-retention audio/text processing
"""
from collections import OrderedDict
from datetime import datetime, timedelta
from threading import Lock
from typing import Optional
import structlog

logger = structlog.get_logger()


class TempStorage:
    """
    Volatile in-memory storage with automatic expiration
    Implements zero-persistence policy
    """
    
    def __init__(self, max_items: int = 100, ttl_minutes: int = 10):
        self._storage = OrderedDict()
        self._lock = Lock()
        self._max_items = max_items
        self._ttl = timedelta(minutes=ttl_minutes)
    
    def set(self, key: str, value: any) -> None:
        """Store value with automatic expiration"""
        with self._lock:
            # Clean expired items
            self._cleanup_expired()
            
            # Remove oldest if at capacity
            if len(self._storage) >= self._max_items:
                self._storage.popitem(last=False)
            
            self._storage[key] = {
                "value": value,
                "expires_at": datetime.utcnow() + self._ttl,
            }
    
    def get(self, key: str) -> Optional[any]:
        """Get value if not expired"""
        with self._lock:
            item = self._storage.get(key)
            
            if not item:
                return None
            
            # Check expiration
            if datetime.utcnow() > item["expires_at"]:
                del self._storage[key]
                return None
            
            return item["value"]
    
    def delete(self, key: str) -> None:
        """Explicitly delete item"""
        with self._lock:
            self._storage.pop(key, None)
    
    def _cleanup_expired(self) -> None:
        """Remove all expired items"""
        now = datetime.utcnow()
        expired_keys = [
            k for k, v in self._storage.items()
            if now > v["expires_at"]
        ]
        
        for key in expired_keys:
            del self._storage[key]
        
        if expired_keys:
            logger.info("Cleaned expired temp items", count=len(expired_keys))
    
    def clear_all(self) -> None:
        """Clear all storage (for session end)"""
        with self._lock:
            self._storage.clear()
            logger.info("Cleared all temporary storage")


# Global instance for session-scoped temporary storage
session_storage = TempStorage()
