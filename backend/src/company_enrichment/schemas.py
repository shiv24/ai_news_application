from enum import Enum
from typing import Any, Dict, Optional, List

from pydantic import BaseModel, ConfigDict, Field


class CompanyType(str, Enum):
    PUBLIC = "public"
    PRIVATE = "private"


class CompanyEnrichmentRequest(BaseModel):
    name: str = Field(..., min_length=1)
    public_or_private: CompanyType
    ticker: Optional[str] = None


class PreparedDocument(BaseModel):
    article_id: str
    docling_document: Any
    metadata: Dict[str, Any]


class InsightTheme(BaseModel):
    model_config = ConfigDict(extra="forbid")

    theme: str
    why_it_matters: str
    source_ids: List[str]


class InsightRisk(BaseModel):
    model_config = ConfigDict(extra="forbid")

    risk: str
    source_ids: List[str]


class InsightOpportunity(BaseModel):
    model_config = ConfigDict(extra="forbid")

    opportunity: str
    source_ids: List[str]


class InsightRecommendation(BaseModel):
    model_config = ConfigDict(extra="forbid")

    recommendation: str
    reasoning: str
    source_ids: List[str]


class CompanyInsights(BaseModel):
    model_config = ConfigDict(extra="forbid")

    executive_summary: str
    key_themes: List[InsightTheme]
    risks: List[InsightRisk]
    opportunities: List[InsightOpportunity]
    recommendations_for_partner: List[InsightRecommendation]
    partner_talking_points: List[str]
    confidence_gaps: List[str]


class FinancialSnapshot(BaseModel):
    model_config = ConfigDict(extra="forbid")

    price: str
    market_cap: str
    pe: str
    revenue_or_eps: str
    analyst_sentiment: str


class CompanyFinancialInsights(BaseModel):
    model_config = ConfigDict(extra="forbid")

    company_name: str
    ticker: str
    snapshot: FinancialSnapshot
    financial_health: str
    valuation: str
    performance_trends: str
    investors_should_watch: List[str]


class BackupSearchTheme(BaseModel):
    model_config = ConfigDict(extra="forbid")

    theme: str
    why_it_matters: str


class BackupSearchSource(BaseModel):
    model_config = ConfigDict(extra="forbid")

    title: str
    url: str


class BackupSearchAnalysis(BaseModel):
    model_config = ConfigDict(extra="forbid")

    executive_summary: str
    key_themes: List[BackupSearchTheme]
    partner_talking_points: List[str]
    sources_used: List[BackupSearchSource]


class CompanySearchRequest(BaseModel):
    name: str = Field(..., min_length=1)
    page: int = Field(default=1, ge=1)
    per_page: int = Field(default=10, ge=1, le=25)


class CompanySearchItem(BaseModel):
    name: str
    domain: str
    logo: Optional[str] = None


class CompanySearchPagination(BaseModel):
    current_page: int
    last_page: int
    per_page: int
    total: int


class CompanySearchResponse(BaseModel):
    companies: List[CompanySearchItem]
    pagination: CompanySearchPagination


class CompanyDomainEnrichmentRequest(BaseModel):
    domain: str = Field(..., min_length=1)


class CompanyDomainEnrichmentResponse(BaseModel):
    name: str
    public_or_private: str
    ticker: Optional[str] = None
