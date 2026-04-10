from enum import Enum
from typing import Any, Dict, Optional

from pydantic import BaseModel, Field


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
