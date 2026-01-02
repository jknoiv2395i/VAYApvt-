"""
Agriculture & EUDR Commodities HS Codes - Phase 4.4

Critical for EU Deforestation Regulation (EUDR) compliance.
Covers: Coffee, Rubber, Wood, Cocoa, Soy, Palm Oil, Cattle, and general agri-exports.
"""

# ============================================================================
# COFFEE (Chapter 09)
# ============================================================================

COFFEE_CODES = {
    # Raw coffee
    "09011100": {"cn": "09011100", "desc": "Coffee, not roasted, not decaffeinated", "eudr": True},
    "09011200": {"cn": "09011200", "desc": "Coffee, not roasted, decaffeinated", "eudr": True},
    "09012100": {"cn": "09012100", "desc": "Coffee, roasted, not decaffeinated", "eudr": True},
    "09012200": {"cn": "09012200", "desc": "Coffee, roasted, decaffeinated", "eudr": True},
    "09019010": {"cn": "09019010", "desc": "Coffee husks and skins", "eudr": True},
    "09019020": {"cn": "09019020", "desc": "Coffee substitutes containing coffee", "eudr": True},
    
    # Processed coffee
    "21011100": {"cn": "21011100", "desc": "Extracts/essences/concentrates of coffee", "eudr": True},
    "21011200": {"cn": "21011200", "desc": "Preparations based on coffee extracts", "eudr": True},
}

# ============================================================================
# COCOA (Chapter 18)
# ============================================================================

COCOA_CODES = {
    "18010000": {"cn": "18010000", "desc": "Cocoa beans, whole/broken, raw/roasted", "eudr": True},
    "18020000": {"cn": "18020000", "desc": "Cocoa shells, husks, skins, waste", "eudr": True},
    "18031000": {"cn": "18031000", "desc": "Cocoa paste, not defatted", "eudr": True},
    "18032000": {"cn": "18032000", "desc": "Cocoa paste, wholly/partly defatted", "eudr": True},
    "18040000": {"cn": "18040000", "desc": "Cocoa butter, fat and oil", "eudr": True},
    "18050000": {"cn": "18050000", "desc": "Cocoa powder, unsweetened", "eudr": True},
    "18061000": {"cn": "18061000", "desc": "Cocoa powder, sweetened", "eudr": True},
    "18062000": {"cn": "18062000", "desc": "Chocolate preparations >2kg", "eudr": True},
    "18063100": {"cn": "18063100", "desc": "Chocolate, filled, blocks/bars", "eudr": True},
    "18063200": {"cn": "18063200", "desc": "Chocolate, not filled, blocks/bars", "eudr": True},
    "18069000": {"cn": "18069000", "desc": "Other chocolate preparations", "eudr": True},
}

# ============================================================================
# RUBBER (Chapter 40)
# ============================================================================

RUBBER_CODES = {
    "40011000": {"cn": "40011000", "desc": "Natural rubber latex", "eudr": True},
    "40012100": {"cn": "40012100", "desc": "Natural rubber, smoked sheets", "eudr": True},
    "40012200": {"cn": "40012200", "desc": "Natural rubber, TSNR", "eudr": True},
    "40012900": {"cn": "40012900", "desc": "Natural rubber, other forms", "eudr": True},
    "40013000": {"cn": "40013000", "desc": "Balata, gutta-percha, similar gums", "eudr": True},
    "40021100": {"cn": "40021100", "desc": "Styrene-butadiene rubber (SBR) latex", "eudr": False},
    "40021900": {"cn": "40021900", "desc": "Styrene-butadiene rubber (SBR) other", "eudr": False},
    "40022000": {"cn": "40022000", "desc": "Butadiene rubber (BR)", "eudr": False},
    "40023100": {"cn": "40023100", "desc": "Isobutene-isoprene rubber (IIR) latex", "eudr": False},
    "40024100": {"cn": "40024100", "desc": "Chloroprene rubber (CR) latex", "eudr": False},
    "40025100": {"cn": "40025100", "desc": "Acrylonitrile-butadiene rubber (NBR)", "eudr": False},
    "40026000": {"cn": "40026000", "desc": "Isoprene rubber (IR)", "eudr": False},
    "40027000": {"cn": "40027000", "desc": "EPDM rubber", "eudr": False},
    "40029100": {"cn": "40029100", "desc": "Rubber latex, other", "eudr": False},
    "40029900": {"cn": "40029900", "desc": "Synthetic rubber, other", "eudr": False},
    
    # Rubber products
    "40111000": {"cn": "40111000", "desc": "Pneumatic tyres, motor cars", "eudr": True},
    "40112000": {"cn": "40112000", "desc": "Pneumatic tyres, buses/trucks", "eudr": True},
    "40113000": {"cn": "40113000", "desc": "Pneumatic tyres, aircraft", "eudr": True},
    "40114000": {"cn": "40114000", "desc": "Pneumatic tyres, motorcycles", "eudr": True},
    "40115000": {"cn": "40115000", "desc": "Pneumatic tyres, bicycles", "eudr": True},
    "40116000": {"cn": "40116000", "desc": "Pneumatic tyres, agricultural", "eudr": True},
    "40117000": {"cn": "40117000", "desc": "Pneumatic tyres, construction", "eudr": True},
    "40119000": {"cn": "40119000", "desc": "Pneumatic tyres, other", "eudr": True},
}

# ============================================================================
# WOOD (Chapter 44)
# ============================================================================

WOOD_CODES = {
    # Fuel wood
    "44011100": {"cn": "44011100", "desc": "Fuel wood, coniferous", "eudr": True},
    "44011200": {"cn": "44011200", "desc": "Fuel wood, non-coniferous", "eudr": True},
    "44012100": {"cn": "44012100", "desc": "Wood chips, coniferous", "eudr": True},
    "44012200": {"cn": "44012200", "desc": "Wood chips, non-coniferous", "eudr": True},
    "44013100": {"cn": "44013100", "desc": "Wood pellets", "eudr": True},
    "44013900": {"cn": "44013900", "desc": "Wood waste (sawdust)", "eudr": True},
    "44014100": {"cn": "44014100", "desc": "Sawdust, not agglomerated", "eudr": True},
    "44014900": {"cn": "44014900", "desc": "Wood waste, other", "eudr": True},
    
    # Rough wood
    "44031100": {"cn": "44031100", "desc": "Logs, coniferous, treated", "eudr": True},
    "44031200": {"cn": "44031200", "desc": "Logs, coniferous, untreated", "eudr": True},
    "44032100": {"cn": "44032100", "desc": "Logs, tropical, Meranti", "eudr": True},
    "44032200": {"cn": "44032200", "desc": "Logs, tropical, Teak", "eudr": True},
    "44032300": {"cn": "44032300", "desc": "Logs, tropical, Mahogany", "eudr": True},
    "44032400": {"cn": "44032400", "desc": "Logs, tropical, Virola/Balsa", "eudr": True},
    "44032500": {"cn": "44032500", "desc": "Logs, tropical, Dark Red Meranti", "eudr": True},
    "44032600": {"cn": "44032600", "desc": "Logs, tropical, White Lauan", "eudr": True},
    "44034100": {"cn": "44034100", "desc": "Logs, tropical, other", "eudr": True},
    "44034900": {"cn": "44034900", "desc": "Logs, non-coniferous, other", "eudr": True},
    
    # Sawn wood
    "44071100": {"cn": "44071100", "desc": "Sawn wood, coniferous, >6mm", "eudr": True},
    "44071200": {"cn": "44071200", "desc": "Sawn wood, coniferous, finger-jointed", "eudr": True},
    "44071900": {"cn": "44071900", "desc": "Sawn wood, coniferous, other", "eudr": True},
    "44072100": {"cn": "44072100", "desc": "Sawn wood, Mahogany", "eudr": True},
    "44072200": {"cn": "44072200", "desc": "Sawn wood, Virola", "eudr": True},
    "44072500": {"cn": "44072500", "desc": "Sawn wood, Dark Red Meranti", "eudr": True},
    "44072600": {"cn": "44072600", "desc": "Sawn wood, White Lauan", "eudr": True},
    "44072700": {"cn": "44072700", "desc": "Sawn wood, Sapelli", "eudr": True},
    "44072800": {"cn": "44072800", "desc": "Sawn wood, Iroko", "eudr": True},
    "44072900": {"cn": "44072900", "desc": "Sawn wood, tropical, other", "eudr": True},
    "44079100": {"cn": "44079100", "desc": "Sawn wood, Oak", "eudr": True},
    "44079200": {"cn": "44079200", "desc": "Sawn wood, Beech", "eudr": True},
    "44079300": {"cn": "44079300", "desc": "Sawn wood, Maple", "eudr": True},
    "44079400": {"cn": "44079400", "desc": "Sawn wood, Cherry", "eudr": True},
    "44079500": {"cn": "44079500", "desc": "Sawn wood, Ash", "eudr": True},
    "44079900": {"cn": "44079900", "desc": "Sawn wood, other", "eudr": True},
    
    # Plywood and panels
    "44121000": {"cn": "44121000", "desc": "Plywood, bamboo", "eudr": True},
    "44123100": {"cn": "44123100", "desc": "Plywood, tropical, 1 outer ply", "eudr": True},
    "44123300": {"cn": "44123300", "desc": "Plywood, tropical, both outer plies", "eudr": True},
    "44123400": {"cn": "44123400", "desc": "Plywood, other, 1 outer ply tropical", "eudr": True},
    "44123900": {"cn": "44123900", "desc": "Plywood, other", "eudr": True},
    "44129400": {"cn": "44129400", "desc": "Blockboard, laminboard", "eudr": True},
    "44129900": {"cn": "44129900", "desc": "Other layered wood", "eudr": True},
    
    # Furniture
    "94016100": {"cn": "94016100", "desc": "Wooden seats, upholstered", "eudr": True},
    "94016900": {"cn": "94016900", "desc": "Wooden seats, other", "eudr": True},
    "94033000": {"cn": "94033000", "desc": "Wooden office furniture", "eudr": True},
    "94034000": {"cn": "94034000", "desc": "Wooden kitchen furniture", "eudr": True},
    "94035000": {"cn": "94035000", "desc": "Wooden bedroom furniture", "eudr": True},
    "94036000": {"cn": "94036000", "desc": "Other wooden furniture", "eudr": True},
}

# ============================================================================
# PALM OIL (Chapter 15)
# ============================================================================

PALM_OIL_CODES = {
    "15111000": {"cn": "15111000", "desc": "Palm oil, crude", "eudr": True},
    "15119010": {"cn": "15119010", "desc": "Palm oil, refined, solid", "eudr": True},
    "15119020": {"cn": "15119020", "desc": "Palm oil, refined, liquid", "eudr": True},
    "15119090": {"cn": "15119090", "desc": "Palm oil, other", "eudr": True},
    "15132100": {"cn": "15132100", "desc": "Palm kernel oil, crude", "eudr": True},
    "15132900": {"cn": "15132900", "desc": "Palm kernel oil, refined", "eudr": True},
}

# ============================================================================
# SOY (Chapter 12 & 23)
# ============================================================================

SOY_CODES = {
    "12010010": {"cn": "12010010", "desc": "Soya beans, for sowing", "eudr": True},
    "12010090": {"cn": "12010090", "desc": "Soya beans, other", "eudr": True},
    "12081000": {"cn": "12081000", "desc": "Soya bean flour and meal", "eudr": True},
    "15071000": {"cn": "15071000", "desc": "Soya bean oil, crude", "eudr": True},
    "15079010": {"cn": "15079010", "desc": "Soya bean oil, refined", "eudr": True},
    "15079090": {"cn": "15079090", "desc": "Soya bean oil, other", "eudr": True},
    "23040000": {"cn": "23040000", "desc": "Soya bean oilcake", "eudr": True},
}

# ============================================================================
# CATTLE (Chapter 01 & 02)
# ============================================================================

CATTLE_CODES = {
    # Live cattle
    "01022110": {"cn": "01022110", "desc": "Live cattle, pure-bred breeding, dairy", "eudr": True},
    "01022190": {"cn": "01022190", "desc": "Live cattle, pure-bred breeding, other", "eudr": True},
    "01022910": {"cn": "01022910", "desc": "Live cattle, other, dairy", "eudr": True},
    "01022990": {"cn": "01022990", "desc": "Live cattle, other", "eudr": True},
    "01023110": {"cn": "01023110", "desc": "Live buffalo, pure-bred", "eudr": True},
    "01023910": {"cn": "01023910", "desc": "Live buffalo, other", "eudr": True},
    
    # Beef
    "02011000": {"cn": "02011000", "desc": "Bovine carcasses, fresh/chilled", "eudr": True},
    "02012000": {"cn": "02012000", "desc": "Bovine cuts, bone-in, fresh", "eudr": True},
    "02013000": {"cn": "02013000", "desc": "Bovine cuts, boneless, fresh", "eudr": True},
    "02021000": {"cn": "02021000", "desc": "Bovine carcasses, frozen", "eudr": True},
    "02022000": {"cn": "02022000", "desc": "Bovine cuts, bone-in, frozen", "eudr": True},
    "02023000": {"cn": "02023000", "desc": "Bovine cuts, boneless, frozen", "eudr": True},
    
    # Leather
    "41011000": {"cn": "41011000", "desc": "Bovine hides, whole, fresh", "eudr": True},
    "41012000": {"cn": "41012000", "desc": "Bovine hides, whole, preserved", "eudr": True},
    "41015000": {"cn": "41015000", "desc": "Bovine hides, whole, dried", "eudr": True},
    "41019000": {"cn": "41019000", "desc": "Bovine hides, other", "eudr": True},
}

# ============================================================================
# TEA & SPICES (Chapters 09)
# ============================================================================

TEA_SPICES_CODES = {
    # Tea
    "09021000": {"cn": "09021000", "desc": "Green tea, ≤3kg packages", "eudr": False},
    "09022000": {"cn": "09022000", "desc": "Green tea, >3kg packages", "eudr": False},
    "09023000": {"cn": "09023000", "desc": "Black tea, ≤3kg packages", "eudr": False},
    "09024000": {"cn": "09024000", "desc": "Black tea, >3kg packages", "eudr": False},
    
    # Spices
    "09041100": {"cn": "09041100", "desc": "Pepper, neither crushed nor ground", "eudr": False},
    "09041200": {"cn": "09041200", "desc": "Pepper, crushed or ground", "eudr": False},
    "09042100": {"cn": "09042100", "desc": "Capsicum dried, whole", "eudr": False},
    "09042200": {"cn": "09042200", "desc": "Capsicum crushed or ground", "eudr": False},
    "09051000": {"cn": "09051000", "desc": "Vanilla, neither crushed nor ground", "eudr": False},
    "09052000": {"cn": "09052000", "desc": "Vanilla, crushed or ground", "eudr": False},
    "09061100": {"cn": "09061100", "desc": "Cinnamon, whole", "eudr": False},
    "09061900": {"cn": "09061900", "desc": "Cinnamon, other", "eudr": False},
    "09062000": {"cn": "09062000", "desc": "Cinnamon, crushed or ground", "eudr": False},
    "09071000": {"cn": "09071000", "desc": "Cloves, whole", "eudr": False},
    "09072000": {"cn": "09072000", "desc": "Cloves, crushed or ground", "eudr": False},
    "09081100": {"cn": "09081100", "desc": "Nutmeg, whole", "eudr": False},
    "09081200": {"cn": "09081200", "desc": "Nutmeg, crushed or ground", "eudr": False},
    "09082100": {"cn": "09082100", "desc": "Mace, whole", "eudr": False},
    "09082200": {"cn": "09082200", "desc": "Mace, crushed or ground", "eudr": False},
    "09083100": {"cn": "09083100", "desc": "Cardamom, whole", "eudr": False},
    "09083200": {"cn": "09083200", "desc": "Cardamom, crushed or ground", "eudr": False},
    "09091000": {"cn": "09091000", "desc": "Anise or badian seeds", "eudr": False},
    "09092100": {"cn": "09092100", "desc": "Coriander seeds, whole", "eudr": False},
    "09092200": {"cn": "09092200", "desc": "Coriander seeds, crushed", "eudr": False},
    "09093100": {"cn": "09093100", "desc": "Cumin seeds, whole", "eudr": False},
    "09093200": {"cn": "09093200", "desc": "Cumin seeds, crushed", "eudr": False},
    "09096100": {"cn": "09096100", "desc": "Ginger, whole", "eudr": False},
    "09096200": {"cn": "09096200", "desc": "Ginger, crushed or ground", "eudr": False},
    "09101100": {"cn": "09101100", "desc": "Ginger, neither crushed nor ground", "eudr": False},
    "09101200": {"cn": "09101200", "desc": "Ginger, crushed or ground", "eudr": False},
    "09102000": {"cn": "09102000", "desc": "Saffron", "eudr": False},
    "09103000": {"cn": "09103000", "desc": "Turmeric (curcuma)", "eudr": False},
}

# ============================================================================
# RICE (Chapter 10)
# ============================================================================

RICE_CODES = {
    "10061010": {"cn": "10061010", "desc": "Rice, paddy, basmati", "eudr": False},
    "10061090": {"cn": "10061090", "desc": "Rice, paddy, other", "eudr": False},
    "10062010": {"cn": "10062010", "desc": "Rice, husked, basmati", "eudr": False},
    "10062090": {"cn": "10062090", "desc": "Rice, husked, other", "eudr": False},
    "10063010": {"cn": "10063010", "desc": "Rice, semi/wholly milled, basmati", "eudr": False},
    "10063020": {"cn": "10063020", "desc": "Rice, parboiled, basmati", "eudr": False},
    "10063090": {"cn": "10063090", "desc": "Rice, other", "eudr": False},
    "10064000": {"cn": "10064000", "desc": "Broken rice", "eudr": False},
}


# ============================================================================
# AGGREGATE ALL AGRICULTURE CODES
# ============================================================================

def get_all_agriculture_mappings():
    """Get all agriculture/EUDR mappings."""
    all_agri = {}
    
    for code, data in COFFEE_CODES.items():
        all_agri[code] = {"cn": data["cn"], "desc": data["desc"], "factor": 0.5, "category": "eudr_commodity", "eudr": data.get("eudr", False)}
    
    for code, data in COCOA_CODES.items():
        all_agri[code] = {"cn": data["cn"], "desc": data["desc"], "factor": 0.6, "category": "eudr_commodity", "eudr": data.get("eudr", False)}
    
    for code, data in RUBBER_CODES.items():
        all_agri[code] = {"cn": data["cn"], "desc": data["desc"], "factor": 2.5, "category": "eudr_commodity", "eudr": data.get("eudr", False)}
    
    for code, data in WOOD_CODES.items():
        all_agri[code] = {"cn": data["cn"], "desc": data["desc"], "factor": 0.3, "category": "eudr_commodity", "eudr": data.get("eudr", False)}
    
    for code, data in PALM_OIL_CODES.items():
        all_agri[code] = {"cn": data["cn"], "desc": data["desc"], "factor": 3.5, "category": "eudr_commodity", "eudr": data.get("eudr", False)}
    
    for code, data in SOY_CODES.items():
        all_agri[code] = {"cn": data["cn"], "desc": data["desc"], "factor": 0.8, "category": "eudr_commodity", "eudr": data.get("eudr", False)}
    
    for code, data in CATTLE_CODES.items():
        all_agri[code] = {"cn": data["cn"], "desc": data["desc"], "factor": 15.0, "category": "eudr_commodity", "eudr": data.get("eudr", False)}
    
    for code, data in TEA_SPICES_CODES.items():
        all_agri[code] = {"cn": data["cn"], "desc": data["desc"], "factor": 0.4, "category": "agriculture", "eudr": False}
    
    for code, data in RICE_CODES.items():
        all_agri[code] = {"cn": data["cn"], "desc": data["desc"], "factor": 1.2, "category": "agriculture", "eudr": False}
    
    return all_agri


AGRICULTURE_CODE_COUNT = (
    len(COFFEE_CODES) +
    len(COCOA_CODES) +
    len(RUBBER_CODES) +
    len(WOOD_CODES) +
    len(PALM_OIL_CODES) +
    len(SOY_CODES) +
    len(CATTLE_CODES) +
    len(TEA_SPICES_CODES) +
    len(RICE_CODES)
)
