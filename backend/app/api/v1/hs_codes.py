"""
HS Code lookup and mapping API endpoints.

Provides search and classification for Indian HS codes to EU CN codes.
Uses the HSCodeService for data access.
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, List

from app.services.hs_code_service import get_static_service

router = APIRouter()


# ============================================================================
# SCHEMAS
# ============================================================================

class HSCodeInfo(BaseModel):
    """HS code information."""
    hs_code: str
    cn_code: Optional[str]
    description: Optional[str]
    cbam_category: Optional[str]
    emission_factor: float
    is_cbam_covered: bool
    category: Optional[str] = None


class HSCodeSearchResult(BaseModel):
    """HS code search result."""
    hs_code: str
    cn_code: str
    description: str
    cbam_category: Optional[str]
    emission_factor: float
    category: Optional[str] = None


class HSCodeSearchResponse(BaseModel):
    """Search response."""
    results: List[HSCodeSearchResult]
    total: int
    query: str


class CategoryStats(BaseModel):
    """Stats for a CBAM category."""
    category: str
    display_name: str
    count: int


# ============================================================================
# ENDPOINTS
# ============================================================================

@router.get("/lookup/{hs_code}", response_model=HSCodeInfo)
async def lookup_hs_code(hs_code: str):
    """
    Look up an HS code and get its EU CN mapping and CBAM category.
    
    Returns:
    - CN code mapping
    - Product description
    - CBAM category (if covered)
    - Default emission factor
    """
    # Clean the HS code
    hs_code = hs_code.replace(" ", "").replace(".", "")[:8]
    
    service = get_static_service()
    result = await service.lookup(hs_code)
    
    if not result:
        raise HTTPException(
            status_code=404,
            detail=f"HS code not found: {hs_code}"
        )
    
    return HSCodeInfo(
        hs_code=hs_code,
        cn_code=result.get("cn_code"),
        description=result.get("description"),
        cbam_category=result.get("cbam_category"),
        emission_factor=result.get("emission_factor", 0),
        is_cbam_covered=result.get("cbam_category") is not None,
        category=result.get("category")
    )


@router.get("/search", response_model=HSCodeSearchResponse)
async def search_hs(
    q: str = Query(..., min_length=2, description="Search query (code prefix or description)"),
    limit: int = Query(20, le=100, description="Maximum results")
):
    """
    Search HS codes by code prefix or product description.
    
    Examples:
    - q=7219 → All stainless steel flat products
    - q=steel → All products containing 'steel' in description
    - q=aluminium → All aluminium products
    - q=coffee → All coffee products
    """
    service = get_static_service()
    results = await service.search(q, limit)
    
    search_results = []
    for r in results:
        search_results.append(HSCodeSearchResult(
            hs_code=r.get("hs_code", ""),
            cn_code=r.get("cn_code", ""),
            description=r.get("description", ""),
            cbam_category=r.get("cbam_category"),
            emission_factor=r.get("emission_factor", 0),
            category=r.get("category")
        ))
    
    return HSCodeSearchResponse(
        results=search_results,
        total=len(results),
        query=q
    )


@router.get("/categories")
async def get_cbam_categories():
    """
    Get all categories with statistics.
    """
    service = get_static_service()
    stats = await service.get_category_stats()
    total = await service.get_count()
    
    # Format for response
    category_names = {
        "iron_steel": "Iron & Steel",
        "aluminium": "Aluminium", 
        "cement": "Cement",
        "fertilisers": "Fertilizers",
        "hydrogen": "Hydrogen",
        "electricity": "Electricity",
        "textiles": "Textiles",
        "leather": "Leather",
        "pharmaceuticals": "Pharmaceuticals",
        "gems_jewelry": "Gems & Jewelry",
        "agriculture": "Agriculture",
        "downstream": "Downstream Mfg",
    }
    
    formatted_stats = []
    for cat, count in stats.items():
        formatted_stats.append({
            "category": cat,
            "display_name": category_names.get(cat, cat.replace("_", " ").title()),
            "count": count
        })
    
    # Sort by count descending
    formatted_stats.sort(key=lambda x: x["count"], reverse=True)
    
    return {
        "categories": formatted_stats,
        "total_hs_codes": total
    }


@router.get("/all")
async def get_all_codes(
    category: Optional[str] = None,
    skip: int = 0,
    limit: int = 50
):
    """
    Get all HS codes in the database, optionally filtered by category.
    """
    service = get_static_service()
    all_codes = await service.get_all(category=category, skip=skip, limit=limit)
    total = await service.get_count()
    
    return {
        "codes": all_codes,
        "total": total,
        "skip": skip,
        "limit": limit,
        "category_filter": category
    }


@router.get("/validate/{hs_code}")
async def validate_hs_code(hs_code: str):
    """
    Validate an HS code for CBAM compliance.
    
    Returns validation status and recommendations.
    """
    hs_code = hs_code.replace(" ", "").replace(".", "")[:8]
    
    service = get_static_service()
    result = await service.lookup(hs_code)
    
    validation = {
        "hs_code": hs_code,
        "valid_format": len(hs_code) >= 6,
        "is_cbam_covered": False,
        "cbam_category": None,
        "cn_code": None,
        "category": None,
        "warnings": [],
        "recommendations": []
    }
    
    if len(hs_code) < 6:
        validation["warnings"].append("HS code should be at least 6 digits")
        return validation
    
    if result:
        validation["is_cbam_covered"] = result.get("cbam_category") is not None
        validation["cbam_category"] = result.get("cbam_category")
        validation["cn_code"] = result.get("cn_code")
        validation["category"] = result.get("category")
    else:
        # Check if prefix suggests CBAM coverage
        prefix = hs_code[:2]
        cbam_prefixes = {
            "72": "Iron/Steel",
            "73": "Iron/Steel articles",
            "76": "Aluminium",
            "25": "Cement",
            "28": "Hydrogen/Fertilizers",
            "31": "Fertilizers"
        }
        
        if prefix in cbam_prefixes:
            validation["warnings"].append(
                f"{cbam_prefixes[prefix]} product may be CBAM-covered. Verify specific CN code."
            )
            validation["recommendations"].append("Check EU CBAM goods list for exact classification")
        else:
            validation["recommendations"].append("This product does not appear to be CBAM-covered")
    
    return validation


@router.get("/count")
async def get_code_count():
    """
    Get total count of HS codes in the library.
    """
    service = get_static_service()
    count = await service.get_count()
    
    return {
        "total_hs_codes": count,
        "source": "static_library"
    }


@router.get("/emission-factors")
async def get_default_emission_factors():
    """
    Get default emission factors by category and product type.
    """
    return {
        "by_category": {
            "iron_steel": {
                "average": 1.85,
                "range": "1.75 - 2.20",
                "unit": "kg CO2e per kg product",
                "note": "Higher for stainless steel, lower for basic iron"
            },
            "aluminium": {
                "average": 8.7,
                "range": "0.5 - 9.5",
                "unit": "kg CO2e per kg product",
                "note": "Very high for primary aluminium, low for recycled"
            },
            "cement": {
                "average": 0.79,
                "range": "0.75 - 0.85",
                "unit": "kg CO2e per kg product",
                "note": "Portland cement has higher emissions"
            },
            "fertilisers": {
                "average": 2.3,
                "range": "1.8 - 2.8",
                "unit": "kg CO2e per kg product",
                "note": "Ammonia-based fertilizers have higher emissions"
            },
            "hydrogen": {
                "average": 12.0,
                "range": "0.5 - 15.0",
                "unit": "kg CO2e per kg H2",
                "note": "Green hydrogen has near-zero emissions"
            }
        },
        "eu_carbon_price_eur": 80.0,
        "carbon_price_note": "Current EU ETS price per tonne CO2"
    }
