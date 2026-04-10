from src.company_enrichment.schemas import CompanyEnrichmentRequest
from src.company_enrichment.documents import create_document_objects

from src.logger import logger
from src.news.service import NewsService


news_service = NewsService()


def enrich_company(payload: CompanyEnrichmentRequest):
    logger.info("GOT INTO SERVICE.py")
    ticker = payload.ticker if payload.public_or_private == "public" else None
    article_resp = news_service.fetch_recent_articles(
        company_name=payload.name,
        ticker=ticker,
    )

    recent_articles = [article.dict() for article in article_resp]

    docling_docs = create_document_objects(recent_articles)

    print("DOCLING DOCS -------------------------------------------------------")

    print(docling_docs)

    return {
        "name": payload.name,
        "public_or_private": payload.public_or_private,
        "ticker": payload.ticker,
        "recent_articles": [article.dict() for article in recent_articles],
    }
