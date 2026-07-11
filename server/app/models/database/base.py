"""
Database Base Configuration
Uses PostgreSQL on Neon.tech for production, SQLite for local dev
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from app.core.config import settings

# Get database URL from settings
DATABASE_URL = settings.DATABASE_URL

if "postgresql" in DATABASE_URL or "neon" in DATABASE_URL:
    # PostgreSQL (Neon.tech)
    sync_engine = create_engine(
        DATABASE_URL.replace("+asyncpg", "").replace("postgresql+asyncpg://", "postgresql://"),
        echo=False,
    )
    async_engine = create_async_engine(
        DATABASE_URL,
        echo=False,
        pool_size=5,
        max_overflow=10,
    )
else:
    # SQLite fallback
    DB_PATH = '/tmp/medivoice.db'
    sync_engine = create_engine(
        f"sqlite:///{DB_PATH}",
        echo=False,
        connect_args={"check_same_thread": False}
    )
    async_engine = create_async_engine(
        f"sqlite+aiosqlite:///{DB_PATH}",
        echo=False,
        connect_args={"check_same_thread": False}
    )

# Session makers
SyncSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=sync_engine)
AsyncSessionLocal = async_sessionmaker(async_engine, class_=AsyncSession, expire_on_commit=False)


class Base(DeclarativeBase):
    """Base class for all database models"""
    pass


def init_db_sync():
    """Initialize database tables"""
    Base.metadata.create_all(bind=sync_engine)


async def init_db():
    """Initialize database tables"""
    init_db_sync()


async def get_db() -> AsyncSession:
    """Dependency to get database session"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
