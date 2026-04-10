from fastapi import APIRouter

from src.company_enrichment.schemas import CompanyEnrichmentRequest
from src.company_enrichment.service import enrich_company

company_enrichment_router = APIRouter()


@company_enrichment_router.post("/company")
async def create_company_enrichment(payload: CompanyEnrichmentRequest):
    return enrich_company(payload)
