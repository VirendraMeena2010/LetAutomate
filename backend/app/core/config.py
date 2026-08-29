from functools import lru_cache
from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict


# Load variables from .env into the environment
load_dotenv()


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # ============================================================
    # App
    # ============================================================

    APP_NAME: str = "Let Automate"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # ============================================================
    # Database
    # ============================================================

    DATABASE_URL: str

    # ============================================================
    # LangSmith
    # ============================================================

    LANGSMITH_TRACING: bool = False
    LANGSMITH_API_KEY: str | None = None
    LANGSMITH_PROJECT: str = "let-automate"

    # ============================================================
    # Langfuse
    # ============================================================

    LANGFUSE_SECRET_KEY: str = ""
    LANGFUSE_PUBLIC_KEY: str = ""
    LANGFUSE_BASE_URL: str = "https://cloud.langfuse.com"
    LANGFUSE_TRACING_ENVIRONMENT: str = "development"

    # ============================================================
    # Logfire
    # ============================================================

    LOGFIRE_TOKEN: str | None = None
    LOGFIRE_SERVICE_NAME: str = "let-automate"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()