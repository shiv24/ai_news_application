from fastapi import APIRouter, Depends

from src.company_enrichment.schemas import (
    CompanyDomainEnrichmentRequest,
    CompanySearchRequest,
    CompanySearchResponse,
)
from src.company_enrichment.service import (
    enrich_company_from_domain,
    search_companies_by_name,
)

company_enrichment_router = APIRouter()


@company_enrichment_router.post("/company")
async def create_company_enrichment(payload: CompanyDomainEnrichmentRequest):
    return await enrich_company_from_domain(payload)


@company_enrichment_router.get(
    "/companies/search",
    response_model=CompanySearchResponse,
)
async def search_companies(payload: CompanySearchRequest = Depends()):
    return await search_companies_by_name(payload)
