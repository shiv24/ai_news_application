from datetime import datetime, timezone
import re
from typing import List, Optional
from urllib.parse import urlparse

from src.news.schemas import ArticleCandidate

BLOCKED_DOMAINS = {"consent.yahoo.com"}

HIGH_QUALITY_DOMAINS = {
    "reuters.com",
    "bloomberg.com",
    "wsj.com",
    "ft.com",
    "cnbc.com",
    "apnews.com",
}

IMPORTANT_EVENT_KEYWORDS = {
    "earnings",
    "guidance",
    "acquisition",
    "acquire",
    "merger",
    "investigation",
    "lawsuit",
    "settlement",
    "ipo",
    "funding",
    "bankruptcy",
    "layoff",
    "layoffs",
    "recall",
    "partnership",
    "contract",
    "ceo",
    "cfo",
    "revenue",
    "profit",
    "forecast",
    "results",
}

NAME_STOPWORDS = {
    "inc",
    "incorporated",
    "corp",
    "corporation",
    "co",
    "company",
    "limited",
    "ltd",
    "plc",
    "group",
    "holdings",
}


def rank_news_articles(
    articles: List[ArticleCandidate],
    company_name: str,
    ticker: Optional[str] = None,
    limit: Optional[int] = None,
) -> List[ArticleCandidate]:
    now_utc = datetime.now(timezone.utc)
    company_name_lower = company_name.strip().lower()
    ticker_lower = ticker.lower() if ticker else None

    scored_articles = []
    for article in articles:
        # Basic required fields and URL sanity.
        if not article.url or not article.title or not article.published_at:
            continue

        parsed = urlparse(article.url)
        if parsed.scheme not in {"http", "https"} or not parsed.netloc:
            continue

        domain = (article.source_domain or parsed.netloc or "").lower()
        domain = domain.split(":")[0].strip(".")
        if not domain:
            continue

        # Block obviously bad domains.
        is_blocked = any(
            domain == blocked or domain.endswith(f".{blocked}")
            for blocked in BLOCKED_DOMAINS
        )
        if is_blocked:
            continue

        text = f"{article.title} {article.snippet or ''}".lower()
        score = 0.0

        # Company relevance.
        if company_name_lower and company_name_lower in text:
            score += 4.0

        name_tokens = [
            token
            for token in re.findall(r"[a-z0-9]+", company_name_lower)
            if token and token not in NAME_STOPWORDS
        ]
        token_hits = sum(1 for token in name_tokens if token in text)
        score += min(token_hits, 3) * 1.0

        if ticker_lower and re.search(rf"\b{re.escape(ticker_lower)}\b", text):
            score += 2.0

        # Recency.
        published_at_utc = _as_utc(article.published_at)
        age_days = (now_utc - published_at_utc).total_seconds() / 86400
        if age_days <= 1:
            score += 3.0
        elif age_days <= 3:
            score += 2.0
        elif age_days <= 7:
            score += 1.0
        elif age_days <= 14:
            score += 0.5

        # Source quality.
        is_high_quality = any(
            domain == high_quality or domain.endswith(f".{high_quality}")
            for high_quality in HIGH_QUALITY_DOMAINS
        )
        if is_high_quality:
            score += 2.0
        elif article.publisher:
            score += 0.5

        # Important company event signal.
        event_hits = sum(1 for keyword in IMPORTANT_EVENT_KEYWORDS if keyword in text)
        score += min(event_hits, 4) * 0.75

        scored_articles.append((score, article))

    # Deterministic ordering:
    # 1) higher score, 2) newer article, 3) title alphabetical.
    scored_articles.sort(
        key=lambda item: (
            -item[0],
            -_as_utc(item[1].published_at).timestamp(),
            item[1].title.lower(),
        )
    )

    ranked = [article for _, article in scored_articles]
    return ranked[:limit] if limit is not None else ranked


def _as_utc(value: datetime) -> datetime:
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value.astimezone(timezone.utc)
