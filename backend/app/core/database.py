from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

from app.core.config import settings


# ============================================================
# DATABASE CONFIGURATION
# ============================================================

SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL


# ============================================================
# DATABASE ENGINE
# ============================================================

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    echo=False,
    pool_pre_ping=True,
    pool_recycle=1800,
)


# ============================================================
# DATABASE SESSION
# ============================================================

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
)


# ============================================================
# BASE MODEL
# ============================================================

class Base(DeclarativeBase):
    """
    Abstract base class for all SQLAlchemy models.
    Your models (User, Company, etc.) should inherit from this.
    """
    pass


# ============================================================
# INITIALIZE DATABASE
# ============================================================

def init_db():
    """
    Creates all tables defined by classes inheriting from Base.

    This should be called when the application starts.
    """
    print("Initializing database tables...")

    Base.metadata.create_all(bind=engine)

    print("Database tables initialized successfully.")


# ============================================================
# DATABASE DEPENDENCY
# ============================================================

def get_db():
    """
    Provides a database session to FastAPI endpoints.
    The session is automatically closed after the request finishes.
    """
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()