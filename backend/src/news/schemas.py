from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class ArticleCandidate(BaseModel):
    provider: str
    title: str
    url: str
    snippet: Optional[str] = None
    publisher: Optional[str] = None
    published_at: datetime
    source_domain: Optional[str] = None


class NewsSearchParams(BaseModel):
    company_name: str
    ticker: Optional[str] = None
    since_days: int = 14
    limit: int = 20
