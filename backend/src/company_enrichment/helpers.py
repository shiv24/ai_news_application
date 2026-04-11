import os

import httpx

from src.company_enrichment.schemas import CompanyDomainEnrichmentResponse


COMPANY_DOMAIN_ENRICH_URL = "https://api.thecompaniesapi.com/v2/companies/{domain}"


async def fetch_company_by_domain(domain: str) -> dict:
    api_key = os.getenv("COMPANY_SEARCH_API_KEY")
    if not api_key:
        raise ValueError("COMPANY_SEARCH_API_KEY is not set")

    async with httpx.AsyncClient(timeout=20.0) as client:
        response = await client.get(
            COMPANY_DOMAIN_ENRICH_URL.format(domain=domain),
            headers={"Authorization": f"Basic {api_key}"},
        )
    response.raise_for_status()

    payload = response.json()
    return payload.get("data", payload)


def parse_company_domain_enrichment(payload: dict) -> CompanyDomainEnrichmentResponse:
    about = payload.get("about") or {}
    finances = payload.get("finances") or {}

    is_public = about.get("businessType") == "public-company"
    ticker = finances.get("stockSymbol") if is_public else None

    return CompanyDomainEnrichmentResponse(
        name=about.get("name") or "",
        public_or_private="public" if is_public else "private",
        ticker=ticker,
    )
