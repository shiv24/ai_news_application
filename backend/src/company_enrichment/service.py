import asyncio
import os

import httpx

from src.company_enrichment.schemas import CompanyEnrichmentRequest
from src.company_enrichment.documents import (
    create_document_objects,
    chunk_prepared_documents,
    format_retrieved_context,
)

from src.company_enrichment.constants import COMPANY_SEARCH_URL

from src.company_enrichment.prompts import GENERAL_QUERY_PROMPT
from src.company_enrichment.analysis import (
    generate_backup_search_analysis,
    generate_company_insights,
    generate_company_financial_insights,
)
from src.company_enrichment.schemas import (
    CompanyDomainEnrichmentRequest,
    CompanySearchItem,
    CompanySearchPagination,
    CompanySearchRequest,
    CompanySearchResponse,
)
from src.company_enrichment.helpers import (
    fetch_company_by_domain,
    parse_company_domain_enrichment,
)

from src.logger import logger
from src.news.service import NewsService
from src.vector_store.chroma_store import ChromaVectorStore


news_service = NewsService()
vector_store = ChromaVectorStore()


async def enrich_company(
    payload: CompanyEnrichmentRequest,
    domain: str | None = None,
):
    ticker = payload.ticker if payload.public_or_private == "public" else None
    financial_insights_task = (
        asyncio.create_task(generate_company_financial_insights(ticker))
        if payload.public_or_private == "public" and ticker
        else None
    )
    article_resp = await news_service.fetch_recent_articles(
        company_name=payload.name,
        ticker=ticker,
    )

    recent_articles = [article.dict() for article in article_resp]
    logger.info("Fetched recent and relevant articles")
    docling_docs = await asyncio.to_thread(create_document_objects, recent_articles)
    logger.info("Created docling docs from articles")
    chunked_documents = await asyncio.to_thread(chunk_prepared_documents, docling_docs)
    logger.info("Chunked articles")

    stored_count = await asyncio.to_thread(
        vector_store.store_chunks, payload.name, chunked_documents
    )
    query_text = (
        GENERAL_QUERY_PROMPT.format(company_name=payload.name).strip().strip('"')
    )
    retrieved_chunks = await asyncio.to_thread(
        vector_store.query_chunks,
        payload.name,
        query_text,
    )
    retrieved_context = format_retrieved_context(retrieved_chunks)
    insufficient_information = len(retrieved_chunks) == 0
    insights = await generate_company_insights(
        company_name=payload.name,
        public_or_private=payload.public_or_private.value,
        retrieved_chunks=retrieved_context,
    )
    insights_payload = _normalize_insight_source_ids(insights.model_dump())
    backup_search_analysis = (
        await generate_backup_search_analysis(
            company_name=payload.name,
            ticker=ticker,
            domain=domain,
        )
        if insufficient_information
        else None
    )
    financial_insights = (
        await financial_insights_task if financial_insights_task else None
    )

    return {
        "name": payload.name,
        "public_or_private": payload.public_or_private,
        "ticker": payload.ticker,
        "insufficient_information": insufficient_information,
        "insights": insights_payload,
        "backup_search_analysis": (
            backup_search_analysis.model_dump() if backup_search_analysis else None
        ),
        "financial_insights": (
            financial_insights.model_dump() if financial_insights else None
        ),
    }


async def enrich_company_from_domain(
    payload: CompanyDomainEnrichmentRequest,
) -> dict:
    company_payload = await fetch_company_by_domain(payload.domain)
    parsed_company = parse_company_domain_enrichment(company_payload)
    enrichment_payload = CompanyEnrichmentRequest(
        name=parsed_company.name,
        public_or_private=parsed_company.public_or_private,
        ticker=parsed_company.ticker,
    )
    return await enrich_company(enrichment_payload, domain=payload.domain)


async def search_companies_by_name(
    params: CompanySearchRequest,
) -> CompanySearchResponse:
    api_key = os.getenv("COMPANY_SEARCH_API_KEY")
    if not api_key:
        raise ValueError("COMPANY_SEARCH_API_KEY is not set")

    async with httpx.AsyncClient(timeout=20.0) as client:
        response = await client.get(
            COMPANY_SEARCH_URL,
            params={
                "name": params.name,
                "page": params.page,
                "size": params.per_page,
                "sortKey": "meta.score",
                "sortOrder": "desc",
                "simplified": "true",
            },
            headers={"Authorization": f"Basic {api_key}"},
        )
    response.raise_for_status()

    payload = response.json()
    data = payload.get("data", payload)

    raw_companies = data.get("companies", [])
    companies = [
        CompanySearchItem(
            name=_extract_name(company),
            domain=_extract_domain(company),
            logo=_extract_logo(company),
        )
        for company in raw_companies
    ]

    meta = data.get("meta", {})
    pagination = CompanySearchPagination(
        current_page=_as_int(
            meta.get("currentPage", meta.get("current_page", meta.get("page"))),
            fallback=params.page,
        ),
        last_page=_as_int(
            meta.get(
                "lastPage",
                meta.get("last_page", meta.get("pageCount", meta.get("totalPages"))),
            ),
            fallback=params.page,
        ),
        per_page=_as_int(
            meta.get("perPage", meta.get("per_page", meta.get("size"))),
            fallback=params.per_page,
        ),
        total=_as_int(
            meta.get("total", meta.get("totalCount", meta.get("count"))),
            fallback=len(companies),
        ),
    )

    return CompanySearchResponse(companies=companies, pagination=pagination)


def _as_int(value, fallback: int) -> int:
    try:
        return int(value)
    except (TypeError, ValueError):
        return fallback


def _extract_name(company: dict) -> str:
    return company.get("name") or company.get("about", {}).get("name") or ""


def _extract_domain(company: dict) -> str:
    domain = company.get("domain")
    if isinstance(domain, str):
        return domain
    if isinstance(domain, dict):
        return domain.get("domain") or ""
    return ""


def _extract_logo(company: dict):
    logo_candidates = [
        company.get("logo"),
        company.get("brand", {}).get("logo"),
        company.get("images", {}).get("logo"),
        company.get("assets", {}).get("logo"),
        company.get("assets", {}).get("logoSquare"),
    ]

    for candidate in logo_candidates:
        if isinstance(candidate, str) and candidate:
            return candidate
        if isinstance(candidate, dict):
            for key in ("url", "src", "source", "href"):
                value = candidate.get(key)
                if isinstance(value, str) and value:
                    return value

    return None


def _normalize_insight_source_ids(insights: dict) -> dict:
    source_id_sections = [
        "key_themes",
        "risks",
        "opportunities",
        "recommendations_for_partner",
    ]

    for section in source_id_sections:
        for item in insights.get(section, []):
            raw_ids = item.get("source_ids", [])
            article_ids = [_to_article_source_id(source_id) for source_id in raw_ids]
            item["source_ids"] = list(dict.fromkeys(article_ids))

    return insights


def _to_article_source_id(source_id: str) -> str:
    marker = "::chunk-"
    if marker in source_id:
        return source_id.split(marker, 1)[0]
    return source_id
