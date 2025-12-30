"""
AI-powered endpoints for VAYA

Provides:
- Natural language HS code search
- Trade compliance Q&A
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List

# Use OpenRouter for AI (free tier)
from app.services.openrouter_service import get_openrouter_service

# Import local HS code database for fallback
from app.data.hs_cn_mapping import search_hs_codes, get_cbam_category

router = APIRouter()


class HSCodeQuery(BaseModel):
    """Request for AI-powered HS code lookup."""
    product_description: str


class HSCodeSuggestion(BaseModel):
    """AI-suggested HS code."""
    hs_code: str
    description: str
    confidence: str
    cbam_category: Optional[str] = None
    reasoning: str


class HSCodeSuggestionsResponse(BaseModel):
    """Response with HS code suggestions."""
    query: str
    suggestions: List[HSCodeSuggestion]


class TradeQueryRequest(BaseModel):
    """Request for trade compliance questions."""
    question: str


class TradeQueryResponse(BaseModel):
    """Response to trade compliance question."""
    question: str
    answer: str


@router.post("/match-hs-code", response_model=HSCodeSuggestionsResponse)
async def ai_match_hs_code(request: HSCodeQuery):
    """
    Use AI to find the best matching HS code for a product description.
    
    First searches the local CBAM database, then optionally enhances
    with AI classification if OpenRouter is available.
    """
    query = request.product_description.strip()
    suggestions = []
    
    # Step 1: Always search local database first (guaranteed results)
    local_results = search_hs_codes(query, limit=5)
    
    for r in local_results:
        suggestions.append(HSCodeSuggestion(
            hs_code=r["hs_code"],
            description=r["description"],
            confidence="high" if query.lower() in r["description"].lower() else "medium",
            cbam_category=r.get("cbam_category"),
            reasoning=f"Matched from CBAM database. Emission factor: {r.get('emission_factor', 1.85)} kg CO2e/kg"
        ))
    
    # Step 2: Try to enhance with OpenRouter AI (optional)
    try:
        service = get_openrouter_service()
        result = await service.match_hs_code(query)
        
        ai_suggestions = result.get("suggestions", [])
        for s in ai_suggestions:
            hs_code = s.get("hs_code", "")
            # Check if this HS code is already in our suggestions
            existing_codes = [sug.hs_code for sug in suggestions]
            if hs_code and hs_code not in existing_codes:
                suggestions.append(HSCodeSuggestion(
                    hs_code=hs_code,
                    description=s.get("description", "AI suggested classification"),
                    confidence=s.get("confidence", "low"),
                    cbam_category=s.get("cbam_category") or get_cbam_category(hs_code),
                    reasoning=s.get("reasoning", "AI classification")
                ))
    except Exception as e:
        # AI enhancement failed, but we still have local results
        print(f"OpenRouter AI enhancement failed: {e}")
    
    # Step 3: If still no results, provide category-based suggestions
    if not suggestions:
        # Detect likely category from keywords
        query_lower = query.lower()
        if any(kw in query_lower for kw in ["steel", "iron", "metal", "rod", "bar", "wire", "pipe", "bolt", "screw"]):
            suggestions.append(HSCodeSuggestion(
                hs_code="72193400",
                description="Stainless steel flat, width ≥600mm, cold-rolled, 0.5-1mm",
                confidence="medium",
                cbam_category="iron_steel",
                reasoning="Steel/iron product detected. Common HS code for stainless steel products."
            ))
        elif any(kw in query_lower for kw in ["aluminium", "aluminum", "foil"]):
            suggestions.append(HSCodeSuggestion(
                hs_code="76061200",
                description="Aluminium plates/sheets, alloyed, rectangular",
                confidence="medium",
                cbam_category="aluminium",
                reasoning="Aluminium product detected. Common HS code for aluminium products."
            ))
        elif any(kw in query_lower for kw in ["cement", "concrete", "clinker"]):
            suggestions.append(HSCodeSuggestion(
                hs_code="25232900",
                description="Other Portland cement",
                confidence="medium",
                cbam_category="cement",
                reasoning="Cement product detected. Common HS code for cement products."
            ))
        elif any(kw in query_lower for kw in ["fertilizer", "urea", "ammonia", "nitrate"]):
            suggestions.append(HSCodeSuggestion(
                hs_code="31021000",
                description="Urea",
                confidence="medium",
                cbam_category="fertilisers",
                reasoning="Fertilizer product detected. Common HS code for fertilizers."
            ))
    
    return HSCodeSuggestionsResponse(
        query=query,
        suggestions=suggestions[:10]  # Limit to 10 results
    )


@router.post("/ask", response_model=TradeQueryResponse)
async def ask_trade_question(request: TradeQueryRequest):
    """
    Ask questions about trade compliance (CBAM, EUDR, HS codes, etc.)
    
    The AI assistant can help with:
    - HS code classification guidance
    - CBAM applicability and requirements
    - EUDR compliance questions
    - Indian customs procedures
    """
    try:
        service = get_openrouter_service()
        answer = await service.answer_trade_query(request.question)
        
        return TradeQueryResponse(
            question=request.question,
            answer=answer
        )
    except ValueError as e:
        raise HTTPException(status_code=503, detail=f"AI service not configured: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")
