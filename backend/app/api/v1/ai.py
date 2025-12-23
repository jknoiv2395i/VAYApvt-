"""
AI-powered endpoints for VAYA

Provides:
- Natural language HS code search
- Trade compliance Q&A
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List

from app.services.gemini_service import get_gemini_service

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
    
    This is useful when users describe products in natural language
    and need to find the correct HS classification.
    """
    try:
        service = get_gemini_service()
        result = await service.match_hs_code(request.product_description)
        
        suggestions = []
        for s in result.get("suggestions", []):
            suggestions.append(HSCodeSuggestion(
                hs_code=s.get("hs_code", ""),
                description=s.get("description", ""),
                confidence=s.get("confidence", "low"),
                cbam_category=s.get("cbam_category"),
                reasoning=s.get("reasoning", "")
            ))
        
        return HSCodeSuggestionsResponse(
            query=request.product_description,
            suggestions=suggestions
        )
    except ValueError as e:
        raise HTTPException(status_code=503, detail=f"AI service not configured: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")


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
        service = get_gemini_service()
        answer = await service.answer_trade_query(request.question)
        
        return TradeQueryResponse(
            question=request.question,
            answer=answer
        )
    except ValueError as e:
        raise HTTPException(status_code=503, detail=f"AI service not configured: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")
