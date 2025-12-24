"""
HS Code lookup and mapping API endpoints.

Provides search and classification for Indian HS codes to EU CN codes.
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, List

# Import the mapping database
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from app.data.hs_cn_mapping import (
    get_cn_code,
    get_cbam_category,
    get_emission_factor,
    get_description,
    search_hs_codes,
    get_all_hs_codes,
    ALL_MAPPINGS
)

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


class HSCodeSearchResult(BaseModel):
    """HS code search result."""
    hs_code: str
    cn_code: str
    description: str
    cbam_category: str
    emission_factor: float


class HSCodeSearchResponse(BaseModel):
    """Search response."""
    results: List[HSCodeSearchResult]
    total: int
    query: str


class CBAMCategoryStats(BaseModel):
    """Stats for a CBAM category."""
    category: str
    display_name: str
    hs_code_count: int
    emission_factor_range: str


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
    
    cn_code = get_cn_code(hs_code)
    category = get_cbam_category(hs_code)
    factor = get_emission_factor(hs_code)
    description = get_description(hs_code)
    
    return HSCodeInfo(
        hs_code=hs_code,
        cn_code=cn_code,
        description=description,
        cbam_category=category,
        emission_factor=factor,
        is_cbam_covered=category is not None
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
    """
    results = search_hs_codes(q, limit)
    
    return HSCodeSearchResponse(
        results=[HSCodeSearchResult(**r) for r in results],
        total=len(results),
        query=q
    )


@router.get("/categories")
async def get_cbam_categories():
    """
    Get all CBAM categories with statistics.
    """
    categories = {
        "iron_steel": {"name": "Iron & Steel", "hs_prefix": ["72", "73"]},
        "aluminium": {"name": "Aluminium", "hs_prefix": ["76"]},
        "cement": {"name": "Cement", "hs_prefix": ["25"]},
        "fertilisers": {"name": "Fertilizers", "hs_prefix": ["28", "31"]},
        "hydrogen": {"name": "Hydrogen", "hs_prefix": ["28"]},
        "electricity": {"name": "Electricity", "hs_prefix": ["27"]},
    }
    
    # Count codes per category
    stats = []
    for cat_key, cat_info in categories.items():
        count = sum(1 for code, data in ALL_MAPPINGS.items() if data.get("category") == cat_key)
        factors = [data["factor"] for code, data in ALL_MAPPINGS.items() if data.get("category") == cat_key]
        
        if factors:
            factor_range = f"{min(factors):.1f} - {max(factors):.1f}"
        else:
            factor_range = "N/A"
        
        stats.append({
            "category": cat_key,
            "display_name": cat_info["name"],
            "hs_prefix": cat_info["hs_prefix"],
            "hs_code_count": count,
            "emission_factor_range": factor_range
        })
    
    return {
        "categories": stats,
        "total_hs_codes": len(ALL_MAPPINGS)
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
    all_codes = get_all_hs_codes()
    
    if category:
        all_codes = [c for c in all_codes if c["cbam_category"] == category]
    
    return {
        "codes": all_codes[skip:skip+limit],
        "total": len(all_codes),
        "category_filter": category
    }


@router.get("/validate/{hs_code}")
async def validate_hs_code(hs_code: str):
    """
    Validate an HS code for CBAM compliance.
    
    Returns validation status and recommendations.
    """
    hs_code = hs_code.replace(" ", "").replace(".", "")[:8]
    
    validation = {
        "hs_code": hs_code,
        "valid_format": len(hs_code) >= 6,
        "is_cbam_covered": False,
        "cbam_category": None,
        "cn_code": None,
        "warnings": [],
        "recommendations": []
    }
    
    if len(hs_code) < 6:
        validation["warnings"].append("HS code should be at least 6 digits")
        return validation
    
    cn_code = get_cn_code(hs_code)
    category = get_cbam_category(hs_code)
    
    if cn_code:
        validation["is_cbam_covered"] = True
        validation["cbam_category"] = category
        validation["cn_code"] = cn_code
    else:
        # Check if prefix suggests CBAM coverage
        prefix = hs_code[:2]
        if prefix in ["72", "73"]:
            validation["warnings"].append("Iron/steel product may be CBAM-covered. Verify specific CN code.")
            validation["recommendations"].append("Check EU CBAM goods list for exact classification")
        elif prefix == "76":
            validation["warnings"].append("Aluminium product may be CBAM-covered. Verify specific CN code.")
        elif prefix == "25":
            validation["warnings"].append("Cement product may be CBAM-covered. Verify specific CN code.")
        elif prefix in ["28", "31"]:
            validation["warnings"].append("Fertilizer product may be CBAM-covered. Verify specific CN code.")
        else:
            validation["recommendations"].append("This product does not appear to be CBAM-covered")
    
    return validation


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
            }
        },
        "eu_carbon_price_eur": 80.0,
        "carbon_price_note": "Current EU ETS price per tonne CO2"
    }
