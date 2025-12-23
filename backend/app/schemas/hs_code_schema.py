from typing import Optional, List
from pydantic import BaseModel, Field
from app.models.hs_code import CBAMCategory


class HSCodeBase(BaseModel):
    """Base HS Code schema."""
    hs_code: str
    description: str
    unit_of_measurement: Optional[str] = None
    basic_duty_rate: Optional[float] = None
    igst_rate: Optional[float] = None
    is_restricted: bool = False
    chapter: str

    class Config:
        from_attributes = True


class HSCodeSearchResult(HSCodeBase):
    """HS Code search result with relevance score."""
    relevance_score: float = 0.0
    is_cbam_relevant: bool = False


class HSCodeSearchResponse(BaseModel):
    """Response for HS code search."""
    results: List[HSCodeSearchResult]
    total: int
    query: str


class CNCodeBase(BaseModel):
    """Base CN Code schema."""
    cn_code: str
    description: str
    is_cbam_covered: bool
    cbam_category: Optional[CBAMCategory] = None
    default_direct_emission: Optional[float] = None
    default_indirect_emission: Optional[float] = None

    class Config:
        from_attributes = True


class HSCNMappingResult(BaseModel):
    """Result of HS to CN code mapping."""
    cn_code: str
    description: str
    confidence: str  # exact, probable, ambiguous
    is_cbam_covered: bool
    cbam_category: Optional[CBAMCategory] = None
    disambiguation_questions: Optional[List[str]] = None


class HSCNMappingResponse(BaseModel):
    """Response for HS to CN mapping."""
    hs_code: str
    cn_codes: List[HSCNMappingResult]
