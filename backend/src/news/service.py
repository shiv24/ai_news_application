from typing import List, Optional

from src.news.providers.newsapi import NewsAPIProvider
from src.news.schemas import ArticleCandidate, NewsSearchParams


class NewsService:
    def __init__(self, provider: Optional[NewsAPIProvider] = None):
        self.provider = provider or NewsAPIProvider()

    async def fetch_recent_articles(
        self,
        company_name: str,
        ticker: Optional[str],
        since_days: int = 14,
        limit: int = 5,
    ) -> List[ArticleCandidate]:
        search_params = NewsSearchParams(
            company_name=company_name,
            ticker=ticker,
            since_days=since_days,
            limit=limit,
        )
        return await self.provider.fetch_recent_articles(search_params)
