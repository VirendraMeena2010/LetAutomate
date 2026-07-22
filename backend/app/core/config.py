from functools import lru_cache

from dotenv import load_dotenv
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

load_dotenv()


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # App
    APP_NAME: str = "Let Automate"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True


    LANGSMITH_TRACING:bool=True
    LANGSMITH_ENDPOINT:str="https://eu.api.smith.langchain.com"
    LANGSMITH_API_KEY:str="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"
    LANGSMITH_PROJECT:str="let-automate"



    # Logfire
    LOGFIRE_TOKEN: str | None = None
    LOGFIRE_SERVICE_NAME: str = "let-automate"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()