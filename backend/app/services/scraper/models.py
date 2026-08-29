from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class OpenGraphMetadata(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    url: Optional[str] = None
    type: Optional[str] = None


class PageMetadata(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    canonical_url: Optional[str] = None
    open_graph: OpenGraphMetadata = Field(
        default_factory=OpenGraphMetadata
    )


class PageResult(BaseModel):
    url: str
    page_type: str
    status_code: Optional[int] = None
    text: Optional[str] = None
    metadata: PageMetadata = Field(
        default_factory=PageMetadata
    )
    fetch_method: Optional[str] = None
    success: bool = False
    error: Optional[str] = None


class ScrapeResult(BaseModel):
    url: str
    final_url: Optional[str] = None
    status_code: Optional[int] = None
    fetch_method: Optional[str] = None

    metadata: PageMetadata = Field(
        default_factory=PageMetadata
    )

    pages: list[PageResult] = Field(
        default_factory=list
    )

    scraped_at: datetime = Field(
        default_factory=datetime.utcnow
    )

    success: bool = False
    error: Optional[str] = None