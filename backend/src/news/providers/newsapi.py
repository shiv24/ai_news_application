import os
from datetime import datetime, timedelta, timezone
from typing import List
from urllib.parse import urlparse

import httpx
from dotenv import load_dotenv


from src.news.schemas import ArticleCandidate, NewsSearchParams

load_dotenv()


class NewsAPIProvider:
    BASE_URL = "https://newsapi.org/v2/everything"

    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv("NEWS_API_KEY")

    async def fetch_recent_articles(
        self, search_params: NewsSearchParams
    ) -> List[ArticleCandidate]:
        if not self.api_key:
            raise ValueError("NEWS_API_KEY is not set")

        from_date = (
            datetime.now(timezone.utc) - timedelta(days=search_params.since_days)
        ).isoformat()

        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.get(
                self.BASE_URL,
                params={
                    "q": self._build_query(search_params),
                    "from": from_date,
                    "sortBy": "publishedAt",
                    "language": "en",
                    "pageSize": search_params.limit,
                    "apiKey": self.api_key,
                },
            )
        response.raise_for_status()

        payload = response.json()
        if payload.get("status") != "ok":
            raise ValueError(payload.get("message", "NewsAPI request failed"))

        articles = []
        for article in payload.get("articles", []):
            url = article.get("url")
            title = article.get("title")
            published_at = article.get("publishedAt")

            if not url or not title or not published_at:
                continue

            articles.append(
                ArticleCandidate(
                    provider="newsapi",
                    title=title,
                    url=url,
                    snippet=article.get("description"),
                    publisher=(article.get("source") or {}).get("name"),
                    published_at=published_at,
                    source_domain=urlparse(url).netloc or None,
                )
            )

        return articles

    def _build_query(self, search_params: NewsSearchParams) -> str:
        if search_params.ticker:
            return '"{company_name}" AND "{ticker}"'.format(
                company_name=search_params.company_name,
                ticker=search_params.ticker,
            )

        return '"{company_name}"'.format(company_name=search_params.company_name)
