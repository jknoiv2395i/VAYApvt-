"""
HS Code to EU CN Code Mapping Database.

Comprehensive mapping for CBAM-relevant product categories.
"""

from typing import Optional, Dict, List
from pydantic import BaseModel


class HSCodeMapping(BaseModel):
    """HS Code mapping entry."""
    hs_code: str
    cn_code: str
    description: str
    cbam_category: str
    emission_factor: float  # Default kg CO2e per kg


# ============================================================================
# IRON & STEEL (HS Chapter 72-73)
# ============================================================================

IRON_STEEL_MAPPINGS = {
    # Flat-rolled products (not clad, plated or coated)
    "72081000": {"cn": "72081000", "desc": "Flat-rolled iron/steel, width ≥600mm, hot-rolled, patterns", "factor": 1.85},
    "72082500": {"cn": "72082500", "desc": "Flat-rolled iron/steel, width ≥600mm, hot-rolled, pickled", "factor": 1.85},
    "72082600": {"cn": "72082600", "desc": "Flat-rolled iron/steel, width ≥600mm, hot-rolled, 3-4.75mm", "factor": 1.85},
    "72082700": {"cn": "72082700", "desc": "Flat-rolled iron/steel, width ≥600mm, hot-rolled, <3mm", "factor": 1.85},
    "72083600": {"cn": "72083600", "desc": "Flat-rolled iron/steel, width ≥600mm, hot-rolled, >10mm", "factor": 1.85},
    "72083700": {"cn": "72083700", "desc": "Flat-rolled iron/steel, width ≥600mm, hot-rolled, 4.75-10mm", "factor": 1.85},
    "72083800": {"cn": "72083800", "desc": "Flat-rolled iron/steel, width ≥600mm, hot-rolled, 3-4.75mm", "factor": 1.85},
    "72083900": {"cn": "72083900", "desc": "Flat-rolled iron/steel, width ≥600mm, hot-rolled, <3mm", "factor": 1.85},
    "72084000": {"cn": "72084000", "desc": "Flat-rolled iron/steel, width ≥600mm, hot-rolled, patterns", "factor": 1.85},
    "72085100": {"cn": "72085100", "desc": "Flat-rolled iron/steel, width ≥600mm, not rolled, >10mm", "factor": 1.85},
    "72085200": {"cn": "72085200", "desc": "Flat-rolled iron/steel, width ≥600mm, not rolled, 4.75-10mm", "factor": 1.85},
    "72085300": {"cn": "72085300", "desc": "Flat-rolled iron/steel, width ≥600mm, not rolled, 3-4.75mm", "factor": 1.85},
    "72085400": {"cn": "72085400", "desc": "Flat-rolled iron/steel, width ≥600mm, not rolled, <3mm", "factor": 1.85},
    
    # Cold-rolled products
    "72091500": {"cn": "72091500", "desc": "Flat-rolled iron/steel, width ≥600mm, cold-rolled, ≥3mm", "factor": 1.95},
    "72091600": {"cn": "72091600", "desc": "Flat-rolled iron/steel, width ≥600mm, cold-rolled, 1-3mm", "factor": 1.95},
    "72091700": {"cn": "72091700", "desc": "Flat-rolled iron/steel, width ≥600mm, cold-rolled, 0.5-1mm", "factor": 1.95},
    "72091800": {"cn": "72091800", "desc": "Flat-rolled iron/steel, width ≥600mm, cold-rolled, <0.5mm", "factor": 1.95},
    
    # Stainless steel flat products
    "72191100": {"cn": "72191100", "desc": "Stainless steel flat, width ≥600mm, hot-rolled, >10mm", "factor": 2.1},
    "72191200": {"cn": "72191200", "desc": "Stainless steel flat, width ≥600mm, hot-rolled, 4.75-10mm", "factor": 2.1},
    "72191300": {"cn": "72191300", "desc": "Stainless steel flat, width ≥600mm, hot-rolled, 3-4.75mm", "factor": 2.1},
    "72191400": {"cn": "72191400", "desc": "Stainless steel flat, width ≥600mm, hot-rolled, <3mm", "factor": 2.1},
    "72192100": {"cn": "72192100", "desc": "Stainless steel flat, width ≥600mm, not rolled, >10mm", "factor": 2.1},
    "72192200": {"cn": "72192200", "desc": "Stainless steel flat, width ≥600mm, not rolled, 4.75-10mm", "factor": 2.1},
    "72192300": {"cn": "72192300", "desc": "Stainless steel flat, width ≥600mm, not rolled, 3-4.75mm", "factor": 2.1},
    "72192400": {"cn": "72192400", "desc": "Stainless steel flat, width ≥600mm, not rolled, <3mm", "factor": 2.1},
    "72193100": {"cn": "72193100", "desc": "Stainless steel flat, width ≥600mm, cold-rolled, ≥4.75mm", "factor": 2.2},
    "72193200": {"cn": "72193200", "desc": "Stainless steel flat, width ≥600mm, cold-rolled, 3-4.75mm", "factor": 2.2},
    "72193300": {"cn": "72193300", "desc": "Stainless steel flat, width ≥600mm, cold-rolled, 1-3mm", "factor": 2.2},
    "72193400": {"cn": "72193400", "desc": "Stainless steel flat, width ≥600mm, cold-rolled, 0.5-1mm", "factor": 2.2},
    "72193500": {"cn": "72193500", "desc": "Stainless steel flat, width ≥600mm, cold-rolled, <0.5mm", "factor": 2.2},
    
    # Wire rod
    "72131000": {"cn": "72131000", "desc": "Wire rod, iron/steel, with indentations", "factor": 1.75},
    "72132000": {"cn": "72132000", "desc": "Wire rod, free-cutting steel", "factor": 1.75},
    "72139100": {"cn": "72139100", "desc": "Wire rod, iron/steel, <14mm diameter", "factor": 1.75},
    "72139900": {"cn": "72139900", "desc": "Wire rod, iron/steel, other", "factor": 1.75},
    
    # Bars and rods
    "72141000": {"cn": "72141000", "desc": "Bars/rods iron/steel, forged", "factor": 1.80},
    "72142000": {"cn": "72142000", "desc": "Bars/rods iron/steel, with indentations", "factor": 1.80},
    "72143000": {"cn": "72143000", "desc": "Bars/rods, free-cutting steel", "factor": 1.80},
    "72149100": {"cn": "72149100", "desc": "Bars/rods iron/steel, rectangular cross-section", "factor": 1.80},
    "72149900": {"cn": "72149900", "desc": "Bars/rods iron/steel, other", "factor": 1.80},
    
    # Articles of iron/steel (Chapter 73)
    "73041100": {"cn": "73041100", "desc": "Steel line pipe, seamless, for oil/gas", "factor": 2.0},
    "73041900": {"cn": "73041900", "desc": "Steel line pipe, seamless, other", "factor": 2.0},
    "73042200": {"cn": "73042200", "desc": "Steel casing pipe, seamless", "factor": 2.0},
    "73042300": {"cn": "73042300", "desc": "Steel drill pipe, seamless", "factor": 2.0},
    "73042400": {"cn": "73042400", "desc": "Steel tubing, seamless, other", "factor": 2.0},
    
    # Bolts and screws
    "73181100": {"cn": "73181100", "desc": "Coach screws of iron/steel", "factor": 2.1},
    "73181200": {"cn": "73181200", "desc": "Wood screws of iron/steel", "factor": 2.1},
    "73181300": {"cn": "73181300", "desc": "Screw hooks and screw rings", "factor": 2.1},
    "73181400": {"cn": "73181400", "desc": "Self-tapping screws", "factor": 2.1},
    "73181500": {"cn": "73181500", "desc": "Screws and bolts, with nuts/washers", "factor": 2.1},
    "73181600": {"cn": "73181600", "desc": "Nuts of iron/steel", "factor": 2.1},
    "73182100": {"cn": "73182100", "desc": "Spring washers", "factor": 2.1},
    "73182200": {"cn": "73182200", "desc": "Other washers", "factor": 2.1},
    "73182300": {"cn": "73182300", "desc": "Rivets", "factor": 2.1},
    "73182400": {"cn": "73182400", "desc": "Cotters and cotter pins", "factor": 2.1},
    "73182900": {"cn": "73182900", "desc": "Other threaded articles", "factor": 2.1},
}


# ============================================================================
# ALUMINIUM (HS Chapter 76)
# ============================================================================

ALUMINIUM_MAPPINGS = {
    # Unwrought aluminium
    "76011000": {"cn": "76011000", "desc": "Unwrought aluminium, not alloyed", "factor": 8.7},
    "76012000": {"cn": "76012000", "desc": "Unwrought aluminium alloys", "factor": 8.7},
    
    # Waste and scrap
    "76020010": {"cn": "76020010", "desc": "Aluminium waste and scrap", "factor": 0.5},
    
    # Bars, rods, profiles
    "76041000": {"cn": "76041000", "desc": "Aluminium bars/rods, not alloyed", "factor": 9.0},
    "76042100": {"cn": "76042100", "desc": "Aluminium hollow profiles, alloyed", "factor": 9.2},
    "76042900": {"cn": "76042900", "desc": "Aluminium other profiles, alloyed", "factor": 9.2},
    
    # Wire
    "76051100": {"cn": "76051100", "desc": "Aluminium wire, not alloyed, >7mm", "factor": 9.0},
    "76051900": {"cn": "76051900", "desc": "Aluminium wire, not alloyed, other", "factor": 9.0},
    "76052100": {"cn": "76052100", "desc": "Aluminium wire, alloyed, >7mm", "factor": 9.2},
    "76052900": {"cn": "76052900", "desc": "Aluminium wire, alloyed, other", "factor": 9.2},
    
    # Plates, sheets, strips
    "76061100": {"cn": "76061100", "desc": "Aluminium plates/sheets, not alloyed, rectangular", "factor": 9.0},
    "76061200": {"cn": "76061200", "desc": "Aluminium plates/sheets, alloyed, rectangular", "factor": 9.2},
    "76069100": {"cn": "76069100", "desc": "Aluminium plates/sheets, not alloyed, other", "factor": 9.0},
    "76069200": {"cn": "76069200", "desc": "Aluminium plates/sheets, alloyed, other", "factor": 9.2},
    
    # Foil
    "76071110": {"cn": "76071110", "desc": "Aluminium foil, rolled, <0.021mm, not backed", "factor": 9.5},
    "76071190": {"cn": "76071190", "desc": "Aluminium foil, rolled, other, not backed", "factor": 9.5},
    "76072010": {"cn": "76072010", "desc": "Aluminium foil, backed with paper", "factor": 9.5},
    "76072090": {"cn": "76072090", "desc": "Aluminium foil, backed, other", "factor": 9.5},
    
    # Tubes 
    "76081000": {"cn": "76081000", "desc": "Aluminium tubes, not alloyed", "factor": 9.2},
    "76082000": {"cn": "76082000", "desc": "Aluminium tubes, alloyed", "factor": 9.4},
    
    # Structures
    "76109000": {"cn": "76109000", "desc": "Aluminium structures and parts", "factor": 9.5},
}


# ============================================================================
# CEMENT (HS Chapter 25)
# ============================================================================

CEMENT_MAPPINGS = {
    "25231000": {"cn": "25231000", "desc": "Cement clinkers", "factor": 0.85},
    "25232100": {"cn": "25232100", "desc": "White Portland cement", "factor": 0.79},
    "25232900": {"cn": "25232900", "desc": "Other Portland cement", "factor": 0.79},
    "25233000": {"cn": "25233000", "desc": "Aluminous cement", "factor": 0.75},
    "25239000": {"cn": "25239000", "desc": "Other hydraulic cements", "factor": 0.75},
}


# ============================================================================
# FERTILISERS (HS Chapters 28, 31)
# ============================================================================

FERTILISER_MAPPINGS = {
    # Ammonia
    "28141000": {"cn": "28141000", "desc": "Anhydrous ammonia", "factor": 2.7},
    "28142000": {"cn": "28142000", "desc": "Ammonia in aqueous solution", "factor": 2.5},
    
    # Nitric acid
    "28080010": {"cn": "28080010", "desc": "Nitric acid", "factor": 2.3},
    
    # Nitrogen fertilizers
    "31021000": {"cn": "31021000", "desc": "Urea", "factor": 2.5},
    "31022100": {"cn": "31022100", "desc": "Ammonium sulphate", "factor": 2.2},
    "31022900": {"cn": "31022900", "desc": "Double salts of ammonium", "factor": 2.2},
    "31023000": {"cn": "31023000", "desc": "Ammonium nitrate", "factor": 2.8},
    "31024000": {"cn": "31024000", "desc": "Mixtures of ammonium nitrate", "factor": 2.6},
    "31025000": {"cn": "31025000", "desc": "Sodium nitrate", "factor": 2.0},
    "31026000": {"cn": "31026000", "desc": "Double salts of calcium nitrate", "factor": 2.0},
    "31029000": {"cn": "31029000", "desc": "Other nitrogen fertilizers", "factor": 2.3},
    
    # Mixed fertilizers
    "31051000": {"cn": "31051000", "desc": "Fertilizers in tablets or forms", "factor": 2.0},
    "31052000": {"cn": "31052000", "desc": "Mineral/chemical fertilizers with N,P,K", "factor": 2.0},
    "31053000": {"cn": "31053000", "desc": "Diammonium hydrogenorthophosphate", "factor": 2.1},
    "31054000": {"cn": "31054000", "desc": "Ammonium dihydrogenorthophosphate", "factor": 2.1},
    "31055100": {"cn": "31055100", "desc": "Fertilizers with nitrates and phosphates", "factor": 2.2},
    "31055900": {"cn": "31055900", "desc": "Other mineral/chemical fertilizers with N,P", "factor": 2.0},
    "31056000": {"cn": "31056000", "desc": "Fertilizers with phosphorus and potassium", "factor": 1.8},
    "31059000": {"cn": "31059000", "desc": "Other fertilizers", "factor": 1.8},
}


# ============================================================================
# COMBINED MAPPING
# ============================================================================

ALL_MAPPINGS: Dict[str, Dict] = {}
ALL_MAPPINGS.update({k: {**v, "category": "iron_steel"} for k, v in IRON_STEEL_MAPPINGS.items()})
ALL_MAPPINGS.update({k: {**v, "category": "aluminium"} for k, v in ALUMINIUM_MAPPINGS.items()})
ALL_MAPPINGS.update({k: {**v, "category": "cement"} for k, v in CEMENT_MAPPINGS.items()})
ALL_MAPPINGS.update({k: {**v, "category": "fertilisers"} for k, v in FERTILISER_MAPPINGS.items()})


# ============================================================================
# FUNCTIONS
# ============================================================================

def get_cn_code(hs_code: str) -> Optional[str]:
    """Get EU CN code from Indian HS code."""
    mapping = ALL_MAPPINGS.get(hs_code)
    return mapping["cn"] if mapping else None


def get_cbam_category(hs_code: str) -> Optional[str]:
    """Get CBAM category from HS code."""
    mapping = ALL_MAPPINGS.get(hs_code)
    if mapping:
        return mapping["category"]
    
    # Fallback: detect from HS prefix
    prefix = hs_code[:2] if hs_code else ""
    if prefix in ["72", "73"]:
        return "iron_steel"
    elif prefix == "76":
        return "aluminium"
    elif prefix == "25":
        return "cement"
    elif prefix in ["28", "31"]:
        return "fertilisers"
    return None


def get_emission_factor(hs_code: str) -> float:
    """Get default emission factor for HS code (kg CO2e per kg)."""
    mapping = ALL_MAPPINGS.get(hs_code)
    return mapping["factor"] if mapping else 1.85  # Default iron/steel


def get_description(hs_code: str) -> Optional[str]:
    """Get product description from HS code."""
    mapping = ALL_MAPPINGS.get(hs_code)
    return mapping["desc"] if mapping else None


def search_hs_codes(query: str, limit: int = 10) -> List[Dict]:
    """Search HS codes by description or code prefix."""
    query_lower = query.lower()
    results = []
    
    for code, data in ALL_MAPPINGS.items():
        if query in code or query_lower in data["desc"].lower():
            results.append({
                "hs_code": code,
                "cn_code": data["cn"],
                "description": data["desc"],
                "cbam_category": data["category"],
                "emission_factor": data["factor"]
            })
        
        if len(results) >= limit:
            break
    
    return results


def get_all_hs_codes() -> List[Dict]:
    """Get all HS codes in the database."""
    return [
        {
            "hs_code": code,
            "cn_code": data["cn"],
            "description": data["desc"],
            "cbam_category": data["category"],
            "emission_factor": data["factor"]
        }
        for code, data in ALL_MAPPINGS.items()
    ]
