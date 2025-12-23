from typing import Annotated, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_

from app.core.database import get_db
from app.models.hs_code import HSCode, CNCode, HSCNMapping
from app.schemas.hs_code_schema import (
    HSCodeSearchResult,
    HSCodeSearchResponse,
    HSCNMappingResult,
    HSCNMappingResponse,
)

router = APIRouter(prefix="/hs-codes", tags=["HS Codes"])


@router.get("/search", response_model=HSCodeSearchResponse)
async def search_hs_codes(
    db: Annotated[AsyncSession, Depends(get_db)],
    q: str = Query(..., min_length=2, description="Search query"),
    limit: int = Query(10, ge=1, le=50, description="Number of results"),
):
    """
    Fuzzy search for HS codes.
    
    Searches by:
    - HS code number
    - Description text
    - Synonyms
    """
    search_query = f"%{q.lower()}%"
    
    # Search by code or description
    result = await db.execute(
        select(HSCode)
        .where(
            or_(
                HSCode.hs_code.ilike(search_query),
                HSCode.description.ilike(search_query),
            )
        )
        .limit(limit)
    )
    hs_codes = result.scalars().all()
    
    # Build results with relevance scoring
    results = []
    for hs in hs_codes:
        # Simple relevance scoring
        score = 0.0
        if q.lower() in hs.hs_code.lower():
            score = 1.0  # Exact code match
        elif q.lower() in hs.description.lower():
            score = 0.7  # Description match
        
        # Check if CBAM relevant via mapping
        mapping_result = await db.execute(
            select(HSCNMapping).where(HSCNMapping.hs_code == hs.hs_code).limit(1)
        )
        mapping = mapping_result.scalar_one_or_none()
        
        is_cbam = False
        if mapping:
            cn_result = await db.execute(
                select(CNCode).where(CNCode.cn_code == mapping.cn_code)
            )
            cn_code = cn_result.scalar_one_or_none()
            if cn_code:
                is_cbam = cn_code.is_cbam_covered
        
        results.append(
            HSCodeSearchResult(
                hs_code=hs.hs_code,
                description=hs.description,
                unit_of_measurement=hs.unit_of_measurement,
                basic_duty_rate=float(hs.basic_duty_rate) if hs.basic_duty_rate else None,
                igst_rate=float(hs.igst_rate) if hs.igst_rate else None,
                is_restricted=hs.is_restricted,
                chapter=hs.chapter,
                relevance_score=score,
                is_cbam_relevant=is_cbam,
            )
        )
    
    # Sort by relevance
    results.sort(key=lambda x: x.relevance_score, reverse=True)
    
    return HSCodeSearchResponse(
        results=results,
        total=len(results),
        query=q,
    )


@router.get("/{hs_code}", response_model=HSCodeSearchResult)
async def get_hs_code(
    hs_code: str,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Get details for a specific HS code."""
    result = await db.execute(
        select(HSCode).where(HSCode.hs_code == hs_code)
    )
    hs = result.scalar_one_or_none()
    
    if hs is None:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"HS code {hs_code} not found",
        )
    
    # Check CBAM relevance
    mapping_result = await db.execute(
        select(HSCNMapping).where(HSCNMapping.hs_code == hs.hs_code)
    )
    mapping = mapping_result.scalar_one_or_none()
    
    is_cbam = False
    if mapping:
        cn_result = await db.execute(
            select(CNCode).where(CNCode.cn_code == mapping.cn_code)
        )
        cn_code = cn_result.scalar_one_or_none()
        if cn_code:
            is_cbam = cn_code.is_cbam_covered
    
    return HSCodeSearchResult(
        hs_code=hs.hs_code,
        description=hs.description,
        unit_of_measurement=hs.unit_of_measurement,
        basic_duty_rate=float(hs.basic_duty_rate) if hs.basic_duty_rate else None,
        igst_rate=float(hs.igst_rate) if hs.igst_rate else None,
        is_restricted=hs.is_restricted,
        chapter=hs.chapter,
        relevance_score=1.0,
        is_cbam_relevant=is_cbam,
    )


@router.post("/map-to-cn", response_model=HSCNMappingResponse)
async def map_hs_to_cn(
    hs_code: str,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Map Indian HS code to EU CN code(s)."""
    # Find all mappings for this HS code
    result = await db.execute(
        select(HSCNMapping).where(HSCNMapping.hs_code == hs_code)
    )
    mappings = result.scalars().all()
    
    if not mappings:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No CN code mapping found for HS code {hs_code}",
        )
    
    cn_results = []
    for mapping in mappings:
        cn_result = await db.execute(
            select(CNCode).where(CNCode.cn_code == mapping.cn_code)
        )
        cn = cn_result.scalar_one_or_none()
        
        if cn:
            cn_results.append(
                HSCNMappingResult(
                    cn_code=cn.cn_code,
                    description=cn.description,
                    confidence=mapping.mapping_confidence,
                    is_cbam_covered=cn.is_cbam_covered,
                    cbam_category=cn.cbam_category,
                    disambiguation_questions=None,  # TODO: Add from JSONB
                )
            )
    
    return HSCNMappingResponse(
        hs_code=hs_code,
        cn_codes=cn_results,
    )
