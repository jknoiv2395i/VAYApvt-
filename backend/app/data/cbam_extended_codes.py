"""
CBAM Extended HS Codes - Phase 4.2 Expansion

Additional HS codes for comprehensive CBAM coverage.
Includes: Cement, Electricity, Hydrogen, Fertilisers (expanded), Iron/Steel (expanded), Aluminium (expanded)
"""

# ============================================================================
# CEMENT EXTENDED (Chapter 25)
# ============================================================================

CEMENT_EXTENDED = {
    # Limestone raw materials
    "25210000": {"cn": "25210000", "desc": "Limestone flux; limestone for manufacture of lime/cement", "factor": 0.1},
    "25221000": {"cn": "25221000", "desc": "Quicklime", "factor": 0.95},
    "25222000": {"cn": "25222000", "desc": "Slaked lime", "factor": 0.85},
    "25223000": {"cn": "25223000", "desc": "Hydraulic lime", "factor": 0.75},
    "25231010": {"cn": "25231010", "desc": "Cement clinkers, grey", "factor": 0.85},
    "25231020": {"cn": "25231020", "desc": "Cement clinkers, white", "factor": 0.90},
    "25232110": {"cn": "25232110", "desc": "White Portland cement, ordinary", "factor": 0.79},
    "25232120": {"cn": "25232120", "desc": "White Portland cement, rapid hardening", "factor": 0.82},
    "25232910": {"cn": "25232910", "desc": "Portland cement, ordinary (OPC 43)", "factor": 0.79},
    "25232920": {"cn": "25232920", "desc": "Portland cement, ordinary (OPC 53)", "factor": 0.81},
    "25232930": {"cn": "25232930", "desc": "Portland pozzolana cement (PPC)", "factor": 0.65},
    "25232940": {"cn": "25232940", "desc": "Portland slag cement (PSC)", "factor": 0.60},
    "25232950": {"cn": "25232950", "desc": "Sulphate resistant Portland cement", "factor": 0.80},
    "25232960": {"cn": "25232960", "desc": "Low heat Portland cement", "factor": 0.78},
    "25232970": {"cn": "25232970", "desc": "Rapid hardening Portland cement", "factor": 0.82},
    "25233010": {"cn": "25233010", "desc": "Aluminous cement, high alumina", "factor": 0.75},
    "25233020": {"cn": "25233020", "desc": "Aluminous cement, calcium aluminate", "factor": 0.72},
    "25239010": {"cn": "25239010", "desc": "Masonry cement", "factor": 0.70},
    "25239020": {"cn": "25239020", "desc": "Oil well cement", "factor": 0.85},
    "25239030": {"cn": "25239030", "desc": "Expansive cement", "factor": 0.78},
    "25239090": {"cn": "25239090", "desc": "Other hydraulic cements, nes", "factor": 0.75},
}


# ============================================================================
# HYDROGEN & INDUSTRIAL GASES (Chapter 28)
# ============================================================================

HYDROGEN_EXTENDED = {
    # Pure hydrogen
    "28041010": {"cn": "28041010", "desc": "Hydrogen, compressed", "factor": 9.0},
    "28041020": {"cn": "28041020", "desc": "Hydrogen, liquefied", "factor": 10.5},
    "28041030": {"cn": "28041030", "desc": "Hydrogen, green (electrolysis)", "factor": 0.5},
    "28041040": {"cn": "28041040", "desc": "Hydrogen, blue (SMR with CCS)", "factor": 2.5},
    "28041090": {"cn": "28041090", "desc": "Hydrogen, other forms", "factor": 9.0},
    
    # Rare gases
    "28042110": {"cn": "28042110", "desc": "Argon, liquid", "factor": 1.2},
    "28042190": {"cn": "28042190", "desc": "Argon, other", "factor": 1.2},
    "28042910": {"cn": "28042910", "desc": "Helium, liquid", "factor": 2.0},
    "28042920": {"cn": "28042920", "desc": "Neon", "factor": 3.5},
    "28042930": {"cn": "28042930", "desc": "Krypton", "factor": 4.0},
    "28042940": {"cn": "28042940", "desc": "Xenon", "factor": 5.0},
    
    # Industrial gases
    "28043010": {"cn": "28043010", "desc": "Nitrogen, liquid", "factor": 0.8},
    "28043020": {"cn": "28043020", "desc": "Nitrogen, compressed", "factor": 0.6},
    "28044010": {"cn": "28044010", "desc": "Oxygen, liquid (medical grade)", "factor": 0.7},
    "28044020": {"cn": "28044020", "desc": "Oxygen, liquid (industrial)", "factor": 0.6},
    "28044030": {"cn": "28044030", "desc": "Oxygen, compressed", "factor": 0.5},
    
    # Silicon (important for solar)
    "28046110": {"cn": "28046110", "desc": "Silicon, polycrystalline, solar grade", "factor": 15.0},
    "28046120": {"cn": "28046120", "desc": "Silicon, monocrystalline, electronic grade", "factor": 18.0},
    "28046190": {"cn": "28046190", "desc": "Silicon, other high purity", "factor": 12.0},
    "28046910": {"cn": "28046910", "desc": "Silicon, metallurgical grade", "factor": 8.0},
    "28046990": {"cn": "28046990", "desc": "Silicon, other", "factor": 10.0},
}


# ============================================================================
# FERTILISERS EXTENDED (Chapter 31)
# ============================================================================

FERTILISER_EXTENDED = {
    # Urea variants
    "31021010": {"cn": "31021010", "desc": "Urea, prilled", "factor": 2.5},
    "31021020": {"cn": "31021020", "desc": "Urea, granular", "factor": 2.5},
    "31021030": {"cn": "31021030", "desc": "Urea, technical grade", "factor": 2.6},
    "31021040": {"cn": "31021040", "desc": "Urea, coated/slow release", "factor": 2.8},
    
    # Ammonium compounds
    "31022110": {"cn": "31022110", "desc": "Ammonium sulphate, crystalline", "factor": 2.2},
    "31022120": {"cn": "31022120", "desc": "Ammonium sulphate, granular", "factor": 2.2},
    "31022910": {"cn": "31022910", "desc": "Ammonium chloride", "factor": 2.0},
    "31022920": {"cn": "31022920", "desc": "Ammonium sulphate nitrate (ASN)", "factor": 2.4},
    
    # Ammonium nitrate variants
    "31023010": {"cn": "31023010", "desc": "Ammonium nitrate, prilled (fertilizer grade)", "factor": 2.8},
    "31023020": {"cn": "31023020", "desc": "Ammonium nitrate, granular", "factor": 2.8},
    "31023030": {"cn": "31023030", "desc": "Calcium ammonium nitrate (CAN)", "factor": 2.4},
    "31023040": {"cn": "31023040", "desc": "Ammonium nitrate solution (UAN)", "factor": 2.6},
    
    # Nitrates
    "31025010": {"cn": "31025010", "desc": "Sodium nitrate, natural (Chile saltpetre)", "factor": 1.8},
    "31025020": {"cn": "31025020", "desc": "Sodium nitrate, synthetic", "factor": 2.0},
    "31026010": {"cn": "31026010", "desc": "Calcium nitrate", "factor": 1.9},
    "31026020": {"cn": "31026020", "desc": "Potassium nitrate", "factor": 2.1},
    
    # NPK and complex fertilizers
    "31052010": {"cn": "31052010", "desc": "NPK 10-26-26", "factor": 2.0},
    "31052020": {"cn": "31052020", "desc": "NPK 12-32-16", "factor": 2.0},
    "31052030": {"cn": "31052030", "desc": "NPK 14-35-14", "factor": 2.0},
    "31052040": {"cn": "31052040", "desc": "NPK 17-17-17", "factor": 2.0},
    "31052050": {"cn": "31052050", "desc": "NPK 20-20-0", "factor": 2.0},
    "31052090": {"cn": "31052090", "desc": "Other NPK fertilizers", "factor": 2.0},
    
    # DAP and MAP
    "31053010": {"cn": "31053010", "desc": "Diammonium phosphate (DAP), granular", "factor": 2.1},
    "31053020": {"cn": "31053020", "desc": "Diammonium phosphate (DAP), powder", "factor": 2.1},
    "31054010": {"cn": "31054010", "desc": "Monoammonium phosphate (MAP), granular", "factor": 2.1},
    "31054020": {"cn": "31054020", "desc": "Monoammonium phosphate (MAP), powder", "factor": 2.1},
}


# ============================================================================
# ELECTRICITY (Chapter 27)
# ============================================================================

ELECTRICITY_EXTENDED = {
    "27160010": {"cn": "27160010", "desc": "Electrical energy, renewable sources", "factor": 0.05},
    "27160020": {"cn": "27160020", "desc": "Electrical energy, grid average", "factor": 0.4},
    "27160030": {"cn": "27160030", "desc": "Electrical energy, coal-based", "factor": 0.9},
    "27160040": {"cn": "27160040", "desc": "Electrical energy, gas-based", "factor": 0.45},
    "27160050": {"cn": "27160050", "desc": "Electrical energy, nuclear", "factor": 0.02},
    "27160090": {"cn": "27160090", "desc": "Electrical energy, other sources", "factor": 0.4},
}


# ============================================================================
# IRON & STEEL ADDITIONAL (Focus on finished products)
# ============================================================================

IRON_STEEL_FINISHED = {
    # Wire and wire products
    "72171000": {"cn": "72171000", "desc": "Iron/steel wire, not plated/coated", "factor": 2.0},
    "72172000": {"cn": "72172000", "desc": "Iron/steel wire, zinc-plated/coated", "factor": 2.1},
    "72173000": {"cn": "72173000", "desc": "Iron/steel wire, copper-plated/coated", "factor": 2.2},
    "72179000": {"cn": "72179000", "desc": "Iron/steel wire, other plating", "factor": 2.1},
    
    # Stainless steel bars
    "72221100": {"cn": "72221100", "desc": "Stainless steel bars, circular, hot-rolled", "factor": 2.3},
    "72221900": {"cn": "72221900", "desc": "Stainless steel bars, other, hot-rolled", "factor": 2.3},
    "72222000": {"cn": "72222000", "desc": "Stainless steel bars, cold-formed", "factor": 2.4},
    "72223000": {"cn": "72223000", "desc": "Stainless steel bars, other forms", "factor": 2.3},
    "72224000": {"cn": "72224000", "desc": "Stainless steel angles/shapes", "factor": 2.4},
    
    # Other alloy steel bars
    "72271000": {"cn": "72271000", "desc": "Alloy steel wire rod, high-speed steel", "factor": 3.0},
    "72272000": {"cn": "72272000", "desc": "Alloy steel wire rod, silico-manganese", "factor": 2.5},
    "72279000": {"cn": "72279000", "desc": "Other alloy steel wire rod", "factor": 2.5},
    "72281000": {"cn": "72281000", "desc": "Other alloy steel bars, high-speed", "factor": 3.2},
    "72282000": {"cn": "72282000", "desc": "Other alloy steel bars, silico-manganese", "factor": 2.6},
    "72283000": {"cn": "72283000", "desc": "Other alloy steel bars, bearing steel", "factor": 2.8},
    "72284000": {"cn": "72284000", "desc": "Other alloy steel bars, tool steel", "factor": 3.0},
    "72285000": {"cn": "72285000", "desc": "Other alloy steel bars, cold-formed", "factor": 2.7},
    "72286000": {"cn": "72286000", "desc": "Other alloy steel bars, other forms", "factor": 2.5},
    
    # Welded pipes and tubes
    "73052000": {"cn": "73052000", "desc": "Steel casing, welded, for oil/gas", "factor": 2.2},
    "73053100": {"cn": "73053100", "desc": "Steel tubes, welded, longitudinal", "factor": 2.0},
    "73053900": {"cn": "73053900", "desc": "Steel tubes, welded, other", "factor": 2.0},
    "73059000": {"cn": "73059000", "desc": "Steel tubes, riveted/clinched", "factor": 2.1},
    "73061100": {"cn": "73061100", "desc": "Welded line pipe, stainless steel", "factor": 2.5},
    "73061900": {"cn": "73061900", "desc": "Welded line pipe, other", "factor": 2.0},
    "73062100": {"cn": "73062100", "desc": "Welded casing/tubing, stainless", "factor": 2.6},
    "73062900": {"cn": "73062900", "desc": "Welded casing/tubing, other", "factor": 2.1},
    "73063000": {"cn": "73063000", "desc": "Welded tubes, circular, iron/steel", "factor": 2.0},
    "73064000": {"cn": "73064000", "desc": "Welded tubes, circular, stainless", "factor": 2.5},
    "73065000": {"cn": "73065000", "desc": "Welded tubes, circular, alloy steel", "factor": 2.3},
    "73066100": {"cn": "73066100", "desc": "Welded tubes, square/rectangular", "factor": 2.1},
    "73066900": {"cn": "73066900", "desc": "Welded tubes, other cross-section", "factor": 2.1},
    
    # Tube fittings
    "73071100": {"cn": "73071100", "desc": "Cast iron tube fittings, non-malleable", "factor": 1.8},
    "73071900": {"cn": "73071900", "desc": "Cast iron tube fittings, other", "factor": 1.8},
    "73072100": {"cn": "73072100", "desc": "Stainless steel flanges", "factor": 2.6},
    "73072200": {"cn": "73072200", "desc": "Stainless steel threaded elbows/bends", "factor": 2.6},
    "73072300": {"cn": "73072300", "desc": "Stainless steel butt welding fittings", "factor": 2.6},
    "73072900": {"cn": "73072900", "desc": "Stainless steel tube fittings, other", "factor": 2.6},
    "73079100": {"cn": "73079100", "desc": "Iron/steel flanges", "factor": 2.2},
    "73079200": {"cn": "73079200", "desc": "Iron/steel threaded elbows/bends", "factor": 2.2},
    "73079300": {"cn": "73079300", "desc": "Iron/steel butt welding fittings", "factor": 2.2},
    "73079900": {"cn": "73079900", "desc": "Iron/steel tube fittings, other", "factor": 2.2},
}


# ============================================================================
# ALUMINIUM ADDITIONAL
# ============================================================================

ALUMINIUM_ADDITIONAL = {
    # Aluminium bars profiles (expanded)
    "76041010": {"cn": "76041010", "desc": "Aluminium bars, not alloyed, circular", "factor": 9.0},
    "76041020": {"cn": "76041020", "desc": "Aluminium bars, not alloyed, rectangular", "factor": 9.0},
    "76041090": {"cn": "76041090", "desc": "Aluminium bars, not alloyed, other", "factor": 9.0},
    "76042110": {"cn": "76042110", "desc": "Aluminium hollow profiles, 6000 series", "factor": 9.2},
    "76042120": {"cn": "76042120", "desc": "Aluminium hollow profiles, 7000 series", "factor": 9.4},
    "76042190": {"cn": "76042190", "desc": "Aluminium hollow profiles, other alloys", "factor": 9.2},
    "76042910": {"cn": "76042910", "desc": "Aluminium solid profiles, 6000 series", "factor": 9.2},
    "76042920": {"cn": "76042920", "desc": "Aluminium solid profiles, 7000 series", "factor": 9.4},
    "76042990": {"cn": "76042990", "desc": "Aluminium solid profiles, other", "factor": 9.2},
    
    # Aluminium plates/sheets (expanded)
    "76061110": {"cn": "76061110", "desc": "Aluminium plates, not alloyed, >6mm", "factor": 9.0},
    "76061120": {"cn": "76061120", "desc": "Aluminium sheets, not alloyed, 2-6mm", "factor": 9.0},
    "76061130": {"cn": "76061130", "desc": "Aluminium sheets, not alloyed, <2mm", "factor": 9.0},
    "76061210": {"cn": "76061210", "desc": "Aluminium plates, alloyed, >6mm", "factor": 9.2},
    "76061220": {"cn": "76061220", "desc": "Aluminium sheets, alloyed, 2-6mm (5000 series)", "factor": 9.2},
    "76061230": {"cn": "76061230", "desc": "Aluminium sheets, alloyed, <2mm (3000 series)", "factor": 9.2},
    "76061240": {"cn": "76061240", "desc": "Aluminium sheets, alloyed, roofing", "factor": 9.3},
    
    # Aluminium cans and packaging
    "76129010": {"cn": "76129010", "desc": "Aluminium beverage cans", "factor": 9.8},
    "76129020": {"cn": "76129020", "desc": "Aluminium aerosol cans", "factor": 9.8},
    "76129030": {"cn": "76129030", "desc": "Aluminium food containers", "factor": 9.5},
    "76129040": {"cn": "76129040", "desc": "Aluminium collapsible tubes (pharma)", "factor": 9.8},
    
    # Aluminium building products
    "76109010": {"cn": "76109010", "desc": "Aluminium doors and windows", "factor": 9.6},
    "76109020": {"cn": "76109020", "desc": "Aluminium curtain walls", "factor": 9.5},
    "76109030": {"cn": "76109030", "desc": "Aluminium ladders", "factor": 9.5},
    "76109040": {"cn": "76109040", "desc": "Aluminium scaffolding", "factor": 9.4},
    "76109090": {"cn": "76109090", "desc": "Aluminium structures, other", "factor": 9.5},
}


# ============================================================================
# AGGREGATE ALL EXTENDED MAPPINGS
# ============================================================================

def get_all_extended_mappings():
    """Get all extended CBAM mappings as a single dictionary."""
    all_ext = {}
    
    # Add categories
    for code, data in CEMENT_EXTENDED.items():
        all_ext[code] = {**data, "category": "cement"}
    
    for code, data in HYDROGEN_EXTENDED.items():
        all_ext[code] = {**data, "category": "hydrogen"}
    
    for code, data in FERTILISER_EXTENDED.items():
        all_ext[code] = {**data, "category": "fertilisers"}
    
    for code, data in ELECTRICITY_EXTENDED.items():
        all_ext[code] = {**data, "category": "electricity"}
    
    for code, data in IRON_STEEL_FINISHED.items():
        all_ext[code] = {**data, "category": "iron_steel"}
    
    for code, data in ALUMINIUM_ADDITIONAL.items():
        all_ext[code] = {**data, "category": "aluminium"}
    
    return all_ext


# Export count for verification
EXTENDED_CODE_COUNT = (
    len(CEMENT_EXTENDED) +
    len(HYDROGEN_EXTENDED) +
    len(FERTILISER_EXTENDED) +
    len(ELECTRICITY_EXTENDED) +
    len(IRON_STEEL_FINISHED) +
    len(ALUMINIUM_ADDITIONAL)
)
