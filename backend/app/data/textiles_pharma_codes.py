"""
Textiles, Leather & Pharma HS Codes - Phase 4.4

Major Indian export sectors for comprehensive trade compliance.
"""

# ============================================================================
# COTTON & TEXTILES (Chapters 52, 61, 62)
# ============================================================================

COTTON_CODES = {
    # Raw cotton
    "52010010": {"cn": "52010010", "desc": "Cotton, not carded/combed, Indian"},
    "52010020": {"cn": "52010020", "desc": "Cotton, not carded/combed, extra-long staple"},
    "52010090": {"cn": "52010090", "desc": "Cotton, not carded/combed, other"},
    "52021000": {"cn": "52021000", "desc": "Cotton yarn waste"},
    "52022000": {"cn": "52022000", "desc": "Cotton garnetted stock"},
    "52030000": {"cn": "52030000", "desc": "Cotton, carded or combed"},
    
    # Cotton yarn
    "52041100": {"cn": "52041100", "desc": "Cotton sewing thread, ≥85%"},
    "52041900": {"cn": "52041900", "desc": "Cotton sewing thread, <85%"},
    "52051100": {"cn": "52051100", "desc": "Cotton yarn, single, ≥714.29dtex"},
    "52051200": {"cn": "52051200", "desc": "Cotton yarn, single, 714-232dtex"},
    "52051300": {"cn": "52051300", "desc": "Cotton yarn, single, 232-192dtex"},
    "52051400": {"cn": "52051400", "desc": "Cotton yarn, single, 192-125dtex"},
    "52051500": {"cn": "52051500", "desc": "Cotton yarn, single, <125dtex"},
    
    # Cotton fabrics
    "52081100": {"cn": "52081100", "desc": "Plain weave cotton, ≤100g/m²"},
    "52081200": {"cn": "52081200", "desc": "Plain weave cotton, 100-200g/m²"},
    "52081300": {"cn": "52081300", "desc": "Plain weave cotton, >200g/m²"},
    "52082100": {"cn": "52082100", "desc": "Plain weave cotton, bleached, ≤100g/m²"},
    "52082200": {"cn": "52082200", "desc": "Plain weave cotton, bleached, 100-200g/m²"},
    "52082300": {"cn": "52082300", "desc": "Plain weave cotton, bleached, >200g/m²"},
    "52083100": {"cn": "52083100", "desc": "Plain weave cotton, dyed, ≤100g/m²"},
    "52083200": {"cn": "52083200", "desc": "Plain weave cotton, dyed, 100-200g/m²"},
    "52083300": {"cn": "52083300", "desc": "Plain weave cotton, dyed, >200g/m²"},
    "52094100": {"cn": "52094100", "desc": "Denim, ≥85% cotton, >200g/m²"},
    "52094200": {"cn": "52094200", "desc": "Denim fabrics, other"},
}

APPAREL_CODES = {
    # Knitted garments (Chapter 61)
    "61011000": {"cn": "61011000", "desc": "Men's overcoats, knitted"},
    "61012000": {"cn": "61012000", "desc": "Men's anoraks, knitted"},
    "61013000": {"cn": "61013000", "desc": "Women's overcoats, knitted"},
    "61019000": {"cn": "61019000", "desc": "Other overcoats, knitted"},
    "61021000": {"cn": "61021000", "desc": "Women's overcoats, wool, knitted"},
    "61022000": {"cn": "61022000", "desc": "Women's overcoats, cotton, knitted"},
    "61023000": {"cn": "61023000", "desc": "Women's overcoats, man-made fibre, knitted"},
    "61029000": {"cn": "61029000", "desc": "Women's overcoats, other, knitted"},
    "61031000": {"cn": "61031000", "desc": "Men's suits, knitted"},
    "61032200": {"cn": "61032200", "desc": "Men's ensembles, cotton, knitted"},
    "61032300": {"cn": "61032300", "desc": "Men's ensembles, synthetic, knitted"},
    "61033100": {"cn": "61033100", "desc": "Men's jackets, wool, knitted"},
    "61033200": {"cn": "61033200", "desc": "Men's jackets, cotton, knitted"},
    "61033300": {"cn": "61033300", "desc": "Men's jackets, synthetic, knitted"},
    "61034100": {"cn": "61034100", "desc": "Men's trousers, wool, knitted"},
    "61034200": {"cn": "61034200", "desc": "Men's trousers, cotton, knitted"},
    "61034300": {"cn": "61034300", "desc": "Men's trousers, synthetic, knitted"},
    
    # T-shirts
    "61091000": {"cn": "61091000", "desc": "T-shirts, cotton, knitted"},
    "61099010": {"cn": "61099010", "desc": "T-shirts, synthetic, knitted"},
    "61099020": {"cn": "61099020", "desc": "T-shirts, wool, knitted"},
    "61099090": {"cn": "61099090", "desc": "T-shirts, other fibres, knitted"},
    
    # Woven garments (Chapter 62)
    "62011100": {"cn": "62011100", "desc": "Men's overcoats, wool, woven"},
    "62011200": {"cn": "62011200", "desc": "Men's overcoats, cotton, woven"},
    "62011300": {"cn": "62011300", "desc": "Men's overcoats, synthetic, woven"},
    "62021100": {"cn": "62021100", "desc": "Women's overcoats, wool, woven"},
    "62021200": {"cn": "62021200", "desc": "Women's overcoats, cotton, woven"},
    "62021300": {"cn": "62021300", "desc": "Women's overcoats, synthetic, woven"},
    "62031100": {"cn": "62031100", "desc": "Men's suits, wool, woven"},
    "62031200": {"cn": "62031200", "desc": "Men's suits, synthetic, woven"},
    "62031900": {"cn": "62031900", "desc": "Men's suits, other, woven"},
    "62032200": {"cn": "62032200", "desc": "Men's ensembles, cotton, woven"},
    "62032300": {"cn": "62032300", "desc": "Men's ensembles, synthetic, woven"},
    "62033100": {"cn": "62033100", "desc": "Men's jackets, wool, woven"},
    "62033200": {"cn": "62033200", "desc": "Men's jackets, cotton, woven"},
    "62033300": {"cn": "62033300", "desc": "Men's jackets, synthetic, woven"},
    "62034100": {"cn": "62034100", "desc": "Men's trousers, wool, woven"},
    "62034200": {"cn": "62034200", "desc": "Men's trousers, cotton, woven"},
    "62034300": {"cn": "62034300", "desc": "Men's trousers, synthetic, woven"},
    "62034900": {"cn": "62034900", "desc": "Men's trousers, other, woven"},
    
    # Shirts
    "62051000": {"cn": "62051000", "desc": "Men's shirts, wool, woven"},
    "62052000": {"cn": "62052000", "desc": "Men's shirts, cotton, woven"},
    "62053000": {"cn": "62053000", "desc": "Men's shirts, synthetic, woven"},
    "62059000": {"cn": "62059000", "desc": "Men's shirts, other, woven"},
    "62061000": {"cn": "62061000", "desc": "Women's blouses, silk, woven"},
    "62062000": {"cn": "62062000", "desc": "Women's blouses, wool, woven"},
    "62063000": {"cn": "62063000", "desc": "Women's blouses, cotton, woven"},
    "62064000": {"cn": "62064000", "desc": "Women's blouses, synthetic, woven"},
    "62069000": {"cn": "62069000", "desc": "Women's blouses, other, woven"},
}

# ============================================================================
# LEATHER (Chapter 41-42)
# ============================================================================

LEATHER_CODES = {
    # Raw hides
    "41021000": {"cn": "41021000", "desc": "Sheep/lamb skins, raw, with wool"},
    "41022100": {"cn": "41022100", "desc": "Sheep/lamb skins, pickled, with wool"},
    "41022900": {"cn": "41022900", "desc": "Sheep/lamb skins, other, with wool"},
    "41031000": {"cn": "41031000", "desc": "Goat/kid skins, raw"},
    "41032000": {"cn": "41032000", "desc": "Goat/kid skins, preserved"},
    "41039000": {"cn": "41039000", "desc": "Goat/kid skins, other"},
    
    # Tanned leather
    "41041100": {"cn": "41041100", "desc": "Bovine leather, full grains, unsplit"},
    "41041900": {"cn": "41041900", "desc": "Bovine leather, other"},
    "41044100": {"cn": "41044100", "desc": "Bovine leather, full grains, dry"},
    "41044900": {"cn": "41044900", "desc": "Bovine leather, grain splits"},
    "41051000": {"cn": "41051000", "desc": "Sheep/lamb leather, vegetable tanned"},
    "41053000": {"cn": "41053000", "desc": "Sheep/lamb leather, other"},
    "41062100": {"cn": "41062100", "desc": "Goat/kid leather, vegetable tanned"},
    "41062200": {"cn": "41062200", "desc": "Goat/kid leather, otherwise tanned"},
    
    # Leather products
    "42021100": {"cn": "42021100", "desc": "Trunks, suitcases, leather"},
    "42021200": {"cn": "42021200", "desc": "Trunks, suitcases, plastic"},
    "42021900": {"cn": "42021900", "desc": "Trunks, suitcases, other"},
    "42022100": {"cn": "42022100", "desc": "Handbags, leather"},
    "42022200": {"cn": "42022200", "desc": "Handbags, plastic sheeting"},
    "42022900": {"cn": "42022900", "desc": "Handbags, other"},
    "42023100": {"cn": "42023100", "desc": "Wallets, leather"},
    "42023200": {"cn": "42023200", "desc": "Wallets, plastic"},
    "42023900": {"cn": "42023900", "desc": "Wallets, other"},
    "42029100": {"cn": "42029100", "desc": "Other containers, leather"},
    "42029200": {"cn": "42029200", "desc": "Other containers, plastic"},
    "42029900": {"cn": "42029900", "desc": "Other containers, other"},
    "42031000": {"cn": "42031000", "desc": "Leather clothing"},
    "42032100": {"cn": "42032100", "desc": "Sports gloves, leather"},
    "42032900": {"cn": "42032900", "desc": "Other gloves, leather"},
    "42033000": {"cn": "42033000", "desc": "Belts, leather"},
    "42034000": {"cn": "42034000", "desc": "Other leather accessories"},
    
    # Footwear
    "64031200": {"cn": "64031200", "desc": "Ski boots, leather uppers"},
    "64031900": {"cn": "64031900", "desc": "Sports footwear, leather"},
    "64032000": {"cn": "64032000", "desc": "Footwear with leather straps"},
    "64034000": {"cn": "64034000", "desc": "Footwear with metal toe-cap"},
    "64035100": {"cn": "64035100", "desc": "Footwear covering ankle, leather"},
    "64035900": {"cn": "64035900", "desc": "Other leather footwear"},
    "64039100": {"cn": "64039100", "desc": "Footwear covering ankle, other"},
    "64039900": {"cn": "64039900", "desc": "Other footwear"},
}

# ============================================================================
# PHARMACEUTICALS (Chapter 30)
# ============================================================================

PHARMA_CODES = {
    # Medicaments
    "30021100": {"cn": "30021100", "desc": "Malaria test kits"},
    "30021200": {"cn": "30021200", "desc": "Antisera and other blood fractions"},
    "30021300": {"cn": "30021300", "desc": "Immunological products, unmixed"},
    "30021400": {"cn": "30021400", "desc": "Immunological products, mixed"},
    "30021500": {"cn": "30021500", "desc": "Immunological products, dosage form"},
    "30022000": {"cn": "30022000", "desc": "Vaccines for human medicine"},
    "30023000": {"cn": "30023000", "desc": "Vaccines for veterinary medicine"},
    "30029000": {"cn": "30029000", "desc": "Other blood products"},
    
    # Medicines
    "30031000": {"cn": "30031000", "desc": "Medicaments containing penicillins"},
    "30032000": {"cn": "30032000", "desc": "Medicaments containing antibiotics"},
    "30033100": {"cn": "30033100", "desc": "Medicaments containing insulin"},
    "30033900": {"cn": "30033900", "desc": "Medicaments containing hormones"},
    "30034100": {"cn": "30034100", "desc": "Medicaments containing ephedrine"},
    "30034200": {"cn": "30034200", "desc": "Medicaments containing pseudoephedrine"},
    "30034300": {"cn": "30034300", "desc": "Medicaments containing norephedrine"},
    "30034900": {"cn": "30034900", "desc": "Medicaments containing other alkaloids"},
    "30039000": {"cn": "30039000", "desc": "Other medicaments"},
    
    # Dosage forms
    "30041000": {"cn": "30041000", "desc": "Medicaments with penicillins, dosage"},
    "30042000": {"cn": "30042000", "desc": "Medicaments with antibiotics, dosage"},
    "30043100": {"cn": "30043100", "desc": "Medicaments with insulin, dosage"},
    "30043200": {"cn": "30043200", "desc": "Medicaments with corticosteroids"},
    "30043900": {"cn": "30043900", "desc": "Other hormone medicaments, dosage"},
    "30044100": {"cn": "30044100", "desc": "Medicaments with ephedrine, dosage"},
    "30044200": {"cn": "30044200", "desc": "Medicaments with pseudoephedrine, dosage"},
    "30044300": {"cn": "30044300", "desc": "Medicaments with norephedrine, dosage"},
    "30044900": {"cn": "30044900", "desc": "Medicaments with alkaloids, dosage"},
    "30045000": {"cn": "30045000", "desc": "Medicaments with vitamins, dosage"},
    "30046000": {"cn": "30046000", "desc": "Antimalarial medicaments, dosage"},
    "30049010": {"cn": "30049010", "desc": "Ayurvedic medicaments"},
    "30049020": {"cn": "30049020", "desc": "Homeopathic medicaments"},
    "30049030": {"cn": "30049030", "desc": "Unani medicaments"},
    "30049090": {"cn": "30049090", "desc": "Other medicaments, dosage"},
}


# ============================================================================
# GEMS & JEWELRY (Chapter 71)
# ============================================================================

GEMS_JEWELRY_CODES = {
    # Diamonds
    "71021000": {"cn": "71021000", "desc": "Diamonds, unsorted"},
    "71022100": {"cn": "71022100", "desc": "Diamonds, industrial, unworked"},
    "71022900": {"cn": "71022900", "desc": "Diamonds, industrial, other"},
    "71023100": {"cn": "71023100", "desc": "Diamonds, non-industrial, unworked"},
    "71023900": {"cn": "71023900", "desc": "Diamonds, non-industrial, worked"},
    
    # Precious stones
    "71031000": {"cn": "71031000", "desc": "Precious stones, unworked"},
    "71039100": {"cn": "71039100", "desc": "Rubies, sapphires, emeralds, worked"},
    "71039900": {"cn": "71039900", "desc": "Other precious stones, worked"},
    "71041000": {"cn": "71041000", "desc": "Piezo-electric quartz"},
    "71042000": {"cn": "71042000", "desc": "Synthetic precious stones, unworked"},
    "71049000": {"cn": "71049000", "desc": "Synthetic precious stones, worked"},
    
    # Gold
    "71081100": {"cn": "71081100", "desc": "Gold, powder"},
    "71081200": {"cn": "71081200", "desc": "Gold, other unwrought forms"},
    "71082000": {"cn": "71082000", "desc": "Gold, semi-manufactured"},
    
    # Silver
    "71061000": {"cn": "71061000", "desc": "Silver, powder"},
    "71069100": {"cn": "71069100", "desc": "Silver, unwrought"},
    "71069200": {"cn": "71069200", "desc": "Silver, semi-manufactured"},
    
    # Jewelry
    "71131100": {"cn": "71131100", "desc": "Jewelry, silver"},
    "71131900": {"cn": "71131900", "desc": "Jewelry, other precious metal"},
    "71132000": {"cn": "71132000", "desc": "Jewelry, base metal, precious clad"},
    "71141100": {"cn": "71141100", "desc": "Silversmiths' wares, silver"},
    "71141900": {"cn": "71141900", "desc": "Silversmiths' wares, other"},
    "71142000": {"cn": "71142000", "desc": "Silversmiths' wares, base metal clad"},
    "71151000": {"cn": "71151000", "desc": "Platinum articles"},
    "71159010": {"cn": "71159010", "desc": "Gold articles"},
    "71159020": {"cn": "71159020", "desc": "Silver articles"},
    "71159090": {"cn": "71159090", "desc": "Other precious metal articles"},
    "71161000": {"cn": "71161000", "desc": "Natural pearl articles"},
    "71162000": {"cn": "71162000", "desc": "Precious stone articles"},
    "71171100": {"cn": "71171100", "desc": "Cufflinks, base metal"},
    "71171900": {"cn": "71171900", "desc": "Other imitation jewelry, base metal"},
    "71179000": {"cn": "71179000", "desc": "Other imitation jewelry"},
}


# ============================================================================
# AGGREGATE ALL TEXTILES/PHARMA CODES
# ============================================================================

def get_all_textiles_pharma_mappings():
    """Get all textiles, leather, pharma, and gems mappings."""
    all_codes = {}
    
    for code, data in COTTON_CODES.items():
        all_codes[code] = {"cn": data["cn"], "desc": data["desc"], "factor": 1.5, "category": "textiles"}
    
    for code, data in APPAREL_CODES.items():
        all_codes[code] = {"cn": data["cn"], "desc": data["desc"], "factor": 2.0, "category": "textiles"}
    
    for code, data in LEATHER_CODES.items():
        all_codes[code] = {"cn": data["cn"], "desc": data["desc"], "factor": 5.0, "category": "leather"}
    
    for code, data in PHARMA_CODES.items():
        all_codes[code] = {"cn": data["cn"], "desc": data["desc"], "factor": 0.8, "category": "pharmaceuticals"}
    
    for code, data in GEMS_JEWELRY_CODES.items():
        all_codes[code] = {"cn": data["cn"], "desc": data["desc"], "factor": 0.1, "category": "gems_jewelry"}
    
    return all_codes


TEXTILES_PHARMA_CODE_COUNT = (
    len(COTTON_CODES) +
    len(APPAREL_CODES) +
    len(LEATHER_CODES) +
    len(PHARMA_CODES) +
    len(GEMS_JEWELRY_CODES)
)
