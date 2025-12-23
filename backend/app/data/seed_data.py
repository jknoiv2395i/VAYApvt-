"""
HS Code and CN Code Seed Data

Sample data for Phase 1 - includes CBAM-relevant steel/aluminum codes
"""

# Sample Indian HS Codes (ITC-HS)
HS_CODES = [
    # Chapter 72 - Iron and Steel
    {"hs_code": "72061000", "description": "Iron and non-alloy steel ingots", "chapter": "72", "basic_duty_rate": 0, "igst_rate": 18, "is_restricted": False, "synonyms": ["iron ingot", "steel ingot", "pig iron"]},
    {"hs_code": "72071100", "description": "Semi-finished products of iron or non-alloy steel containing by weight less than 0.25% of carbon - Of rectangular cross-section", "chapter": "72", "basic_duty_rate": 0, "igst_rate": 18, "is_restricted": False, "synonyms": ["billet", "slab", "bloom"]},
    {"hs_code": "72083900", "description": "Flat-rolled products of iron or non-alloy steel, of a width of 600mm or more, hot-rolled", "chapter": "72", "basic_duty_rate": 10, "igst_rate": 18, "is_restricted": False, "synonyms": ["hot rolled coil", "HR coil", "steel sheet"]},
    {"hs_code": "72104900", "description": "Flat-rolled products of iron or non-alloy steel, plated or coated with zinc", "chapter": "72", "basic_duty_rate": 12.5, "igst_rate": 18, "is_restricted": False, "synonyms": ["galvanized steel", "GI sheet", "zinc coated"]},
    {"hs_code": "72139110", "description": "Hot-rolled bars and rods of iron or non-alloy steel, of circular cross-section", "chapter": "72", "basic_duty_rate": 0, "igst_rate": 18, "is_restricted": False, "synonyms": ["TMT bar", "rebar", "steel bar", "construction steel"]},
    {"hs_code": "72142000", "description": "Other bars and rods of iron or non-alloy steel, not further worked than forged", "chapter": "72", "basic_duty_rate": 0, "igst_rate": 18, "is_restricted": False, "synonyms": ["forged bar", "forged rod"]},
    
    # Chapter 73 - Articles of Iron or Steel
    {"hs_code": "73011000", "description": "Sheet piling of iron or steel", "chapter": "73", "basic_duty_rate": 10, "igst_rate": 18, "is_restricted": False, "synonyms": ["sheet pile", "steel piling"]},
    {"hs_code": "73021000", "description": "Rails of iron or steel", "chapter": "73", "basic_duty_rate": 10, "igst_rate": 18, "is_restricted": False, "synonyms": ["railway rail", "train track"]},
    {"hs_code": "73063000", "description": "Tubes, pipes and hollow profiles, of iron or steel, welded", "chapter": "73", "basic_duty_rate": 10, "igst_rate": 18, "is_restricted": False, "synonyms": ["steel pipe", "welded tube", "ERW pipe"]},
    {"hs_code": "73181500", "description": "Screws and bolts of iron or steel, whether or not with their nuts or washers", "chapter": "73", "basic_duty_rate": 10, "igst_rate": 18, "is_restricted": False, "synonyms": ["steel screw", "bolt", "fastener", "nut bolt"]},
    {"hs_code": "73182100", "description": "Spring washers and other lock washers of iron or steel", "chapter": "73", "basic_duty_rate": 10, "igst_rate": 18, "is_restricted": False, "synonyms": ["washer", "spring washer", "lock washer"]},
    
    # Chapter 76 - Aluminum and articles thereof
    {"hs_code": "76011000", "description": "Unwrought aluminium, not alloyed", "chapter": "76", "basic_duty_rate": 5, "igst_rate": 18, "is_restricted": False, "synonyms": ["aluminum ingot", "aluminium primary"]},
    {"hs_code": "76012000", "description": "Unwrought aluminium, alloyed", "chapter": "76", "basic_duty_rate": 5, "igst_rate": 18, "is_restricted": False, "synonyms": ["aluminum alloy", "aluminium alloy ingot"]},
    {"hs_code": "76061100", "description": "Aluminium plates, sheets and strip, of a thickness exceeding 0.2mm, not alloyed", "chapter": "76", "basic_duty_rate": 7.5, "igst_rate": 18, "is_restricted": False, "synonyms": ["aluminum sheet", "aluminum plate"]},
    {"hs_code": "76061200", "description": "Aluminium plates, sheets and strip, of a thickness exceeding 0.2mm, alloyed", "chapter": "76", "basic_duty_rate": 7.5, "igst_rate": 18, "is_restricted": False, "synonyms": ["aluminum alloy sheet", "aluminum alloy plate"]},
    {"hs_code": "76071100", "description": "Aluminium foil, not backed, rolled but not further worked, of a thickness not exceeding 0.2mm", "chapter": "76", "basic_duty_rate": 10, "igst_rate": 18, "is_restricted": False, "synonyms": ["aluminum foil", "aluminium foil"]},
    {"hs_code": "76169990", "description": "Other articles of aluminium", "chapter": "76", "basic_duty_rate": 10, "igst_rate": 18, "is_restricted": False, "synonyms": ["aluminum product", "aluminium article"]},
    
    # Chapter 31 - Fertilizers (CBAM covered)
    {"hs_code": "31021000", "description": "Urea, whether or not in aqueous solution", "chapter": "31", "basic_duty_rate": 5, "igst_rate": 5, "is_restricted": False, "synonyms": ["urea fertilizer", "nitrogen fertilizer"]},
    {"hs_code": "31023000", "description": "Ammonium nitrate, whether or not in aqueous solution", "chapter": "31", "basic_duty_rate": 7.5, "igst_rate": 5, "is_restricted": True, "synonyms": ["ammonium nitrate", "AN fertilizer"]},
    {"hs_code": "31052000", "description": "Mineral or chemical fertilisers containing nitrogen, phosphorus and potassium", "chapter": "31", "basic_duty_rate": 5, "igst_rate": 5, "is_restricted": False, "synonyms": ["NPK fertilizer", "complex fertilizer"]},
    
    # Chapter 25 - Cement (CBAM covered)
    {"hs_code": "25232100", "description": "Portland cement: White cement, whether or not artificially coloured", "chapter": "25", "basic_duty_rate": 10, "igst_rate": 28, "is_restricted": False, "synonyms": ["white cement", "portland cement"]},
    {"hs_code": "25232900", "description": "Portland cement: Other", "chapter": "25", "basic_duty_rate": 10, "igst_rate": 28, "is_restricted": False, "synonyms": ["cement", "OPC", "ordinary portland cement"]},
    {"hs_code": "25239000", "description": "Other hydraulic cements", "chapter": "25", "basic_duty_rate": 10, "igst_rate": 28, "is_restricted": False, "synonyms": ["hydraulic cement", "slag cement"]},
]

# EU Combined Nomenclature Codes (CBAM relevant)
CN_CODES = [
    # Iron and Steel (CBAM Category)
    {"cn_code": "72061000", "description": "Iron and non-alloy steel ingots", "is_cbam_covered": True, "cbam_category": "iron_steel", "default_direct_emission": 1.85, "default_indirect_emission": 0.42},
    {"cn_code": "72071190", "description": "Semi-finished products of iron - billets", "is_cbam_covered": True, "cbam_category": "iron_steel", "default_direct_emission": 1.52, "default_indirect_emission": 0.38},
    {"cn_code": "72083900", "description": "Flat-rolled products, hot-rolled", "is_cbam_covered": True, "cbam_category": "iron_steel", "default_direct_emission": 1.95, "default_indirect_emission": 0.45},
    {"cn_code": "72104900", "description": "Flat-rolled products, zinc coated", "is_cbam_covered": True, "cbam_category": "iron_steel", "default_direct_emission": 2.10, "default_indirect_emission": 0.52},
    {"cn_code": "72139110", "description": "Hot-rolled bars, circular cross-section", "is_cbam_covered": True, "cbam_category": "iron_steel", "default_direct_emission": 1.70, "default_indirect_emission": 0.40},
    {"cn_code": "73181500", "description": "Screws and bolts of iron or steel", "is_cbam_covered": True, "cbam_category": "iron_steel", "default_direct_emission": 2.20, "default_indirect_emission": 0.55},
    
    # Aluminum (CBAM Category)
    {"cn_code": "76011000", "description": "Unwrought aluminium, not alloyed", "is_cbam_covered": True, "cbam_category": "aluminium", "default_direct_emission": 1.60, "default_indirect_emission": 6.80},
    {"cn_code": "76012000", "description": "Unwrought aluminium, alloyed", "is_cbam_covered": True, "cbam_category": "aluminium", "default_direct_emission": 1.75, "default_indirect_emission": 7.20},
    {"cn_code": "76061100", "description": "Aluminium plates, not alloyed", "is_cbam_covered": True, "cbam_category": "aluminium", "default_direct_emission": 2.00, "default_indirect_emission": 7.50},
    {"cn_code": "76061200", "description": "Aluminium plates, alloyed", "is_cbam_covered": True, "cbam_category": "aluminium", "default_direct_emission": 2.15, "default_indirect_emission": 7.80},
    
    # Fertilizers (CBAM Category)
    {"cn_code": "31021000", "description": "Urea", "is_cbam_covered": True, "cbam_category": "fertilisers", "default_direct_emission": 2.30, "default_indirect_emission": 0.15},
    {"cn_code": "31023000", "description": "Ammonium nitrate", "is_cbam_covered": True, "cbam_category": "fertilisers", "default_direct_emission": 3.50, "default_indirect_emission": 0.20},
    {"cn_code": "31052000", "description": "NPK fertilizers", "is_cbam_covered": True, "cbam_category": "fertilisers", "default_direct_emission": 1.80, "default_indirect_emission": 0.25},
    
    # Cement (CBAM Category)
    {"cn_code": "25232100", "description": "White portland cement", "is_cbam_covered": True, "cbam_category": "cement", "default_direct_emission": 0.85, "default_indirect_emission": 0.05},
    {"cn_code": "25232900", "description": "Other portland cement", "is_cbam_covered": True, "cbam_category": "cement", "default_direct_emission": 0.75, "default_indirect_emission": 0.04},
    {"cn_code": "25239000", "description": "Other hydraulic cements", "is_cbam_covered": True, "cbam_category": "cement", "default_direct_emission": 0.65, "default_indirect_emission": 0.03},
]

# HS to CN Code Mappings
HS_CN_MAPPINGS = [
    {"hs_code": "72061000", "cn_code": "72061000", "mapping_confidence": "exact", "verified": True},
    {"hs_code": "72071100", "cn_code": "72071190", "mapping_confidence": "probable", "verified": False, "notes": "CN code has more specific breakdown"},
    {"hs_code": "72083900", "cn_code": "72083900", "mapping_confidence": "exact", "verified": True},
    {"hs_code": "72104900", "cn_code": "72104900", "mapping_confidence": "exact", "verified": True},
    {"hs_code": "72139110", "cn_code": "72139110", "mapping_confidence": "exact", "verified": True},
    {"hs_code": "73181500", "cn_code": "73181500", "mapping_confidence": "exact", "verified": True},
    {"hs_code": "76011000", "cn_code": "76011000", "mapping_confidence": "exact", "verified": True},
    {"hs_code": "76012000", "cn_code": "76012000", "mapping_confidence": "exact", "verified": True},
    {"hs_code": "76061100", "cn_code": "76061100", "mapping_confidence": "exact", "verified": True},
    {"hs_code": "76061200", "cn_code": "76061200", "mapping_confidence": "exact", "verified": True},
    {"hs_code": "31021000", "cn_code": "31021000", "mapping_confidence": "exact", "verified": True},
    {"hs_code": "31023000", "cn_code": "31023000", "mapping_confidence": "exact", "verified": True},
    {"hs_code": "31052000", "cn_code": "31052000", "mapping_confidence": "exact", "verified": True},
    {"hs_code": "25232100", "cn_code": "25232100", "mapping_confidence": "exact", "verified": True},
    {"hs_code": "25232900", "cn_code": "25232900", "mapping_confidence": "exact", "verified": True},
    {"hs_code": "25239000", "cn_code": "25239000", "mapping_confidence": "exact", "verified": True},
]
