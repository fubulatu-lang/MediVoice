# server/app/models/database/__init__.py

from .base import Base
from .note import Note

# This ensures all models are imported and registered with SQLAlchemy.
# Add other model imports here as they are created.