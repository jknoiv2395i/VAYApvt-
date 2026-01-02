"""
HS Codes for Construction Materials, Wood, Paper, Stone, Glass, Ceramics.
"""

CONSTRUCTION_CODES = {
    # =========================================================================
    # CHAPTER 25: SALT; SULPHUR; EARTHS AND STONE
    # =========================================================================
    "250100": {"desc": "Salt (including table salt and denatured salt)", "cn": "2501 00 10", "category": "construction"},
    "251710": {"desc": "Pebbles, gravel, broken or crushed stone, for concrete aggregates", "cn": "2517 10 10", "category": "construction"},
    "252010": {"desc": "Gypsum; anhydrite", "cn": "2520 10 00", "category": "construction"},
    "252100": {"desc": "Limestone flux; limestone and other calcareous stone, for lime/cement", "cn": "2521 00 00", "category": "construction"},
    "252310": {"desc": "Cement clinkers (CBAM covered)", "cn": "2523 10 00", "category": "construction"},
    "252321": {"desc": "White portland cement, whether or not artificially coloured", "cn": "2523 21 00", "category": "construction"},
    "252329": {"desc": "Other portland cement (CBAM covered)", "cn": "2523 29 00", "category": "construction"},

    # =========================================================================
    # CHAPTER 26: ORES, SLAG AND ASH
    # =========================================================================
    "260111": {"desc": "Iron ores and concentrates, non-agglomerated", "cn": "2601 11 00", "category": "construction"},
    "260300": {"desc": "Copper ores and concentrates", "cn": "2603 00 00", "category": "construction"},

    # =========================================================================
    # CHAPTER 27: MINERAL FUELS, MINERAL OILS
    # =========================================================================
    "270111": {"desc": "Anthracite", "cn": "2701 11 00", "category": "energy"},
    "270112": {"desc": "Bituminous coal", "cn": "2701 12 10", "category": "energy"},
    "270900": {"desc": "Petroleum oils and oils obtained from bituminous minerals, crude", "cn": "2709 00 10", "category": "energy"},
    "271012": {"desc": "Light oils and preparations (Motor spirit/Gasoline)", "cn": "2710 12 11", "category": "energy"},
    "271019": {"desc": "Other oils (Medium/Heavy oils, Diesel, Fuel oils)", "cn": "2710 19 11", "category": "energy"},
    "271111": {"desc": "Natural gas, liquefied", "cn": "2711 11 00", "category": "energy"},
    "271121": {"desc": "Natural gas, in gaseous state", "cn": "2711 21 00", "category": "energy"},

    # =========================================================================
    # CHAPTER 44: WOOD AND ARTICLES OF WOOD
    # =========================================================================
    "440111": {"desc": "Fuel wood, in logs, in billets, in twigs, in faggots, coniferous", "cn": "4401 11 00", "category": "construction"},
    "440311": {"desc": "Wood in the rough, treated with paint, stains, creosote, coniferous", "cn": "4403 11 00", "category": "construction"},
    "440320": {"desc": "Wood in the rough, coniferous, other (Pine, Fir, Spruce)", "cn": "4403 20 11", "category": "construction"},
    "440391": {"desc": "Wood in the rough, Oak (Quercus spp.)", "cn": "4403 91 10", "category": "construction"},
    "440710": {"desc": "Wood sawn or chipped lengthwise, sliced or peeled, thickness > 6 mm, coniferous", "cn": "4407 10 31", "category": "construction"},
    "440711": {"desc": "Wood sawn or chipped lengthwise, Pine (Pinus spp.)", "cn": "4407 11 10", "category": "construction"},
    "440712": {"desc": "Wood sawn or chipped lengthwise, Fir (Abies spp.) and Spruce (Picea spp.)", "cn": "4407 12 10", "category": "construction"},
    "440791": {"desc": "Wood sawn or chipped lengthwise, Oak (Quercus spp.)", "cn": "4407 91 15", "category": "construction"},
    "441210": {"desc": "Plywood, veneered panels and similar laminated wood, of bamboo", "cn": "4412 10 00", "category": "construction"},
    "441231": {"desc": "Plywood consisting solely of sheets of wood <= 6 mm, with outer ply of tropical wood", "cn": "4412 31 10", "category": "construction"},
    "441510": {"desc": "Cases, boxes, crates, drums and similar packings; cable-drums", "cn": "4415 10 10", "category": "construction"},
    "441520": {"desc": "Pallets, box pallets and other load boards", "cn": "4415 20 20", "category": "construction"},
    "441810": {"desc": "Windows, French-windows and their frames, of wood", "cn": "4418 10 10", "category": "construction"},
    "441820": {"desc": "Doors and their frames and thresholds, of wood", "cn": "4418 20 10", "category": "construction"},

    # =========================================================================
    # CHAPTER 48: PAPER AND PAPERBOARD
    # =========================================================================
    "480100": {"desc": "Newsprint, in rolls or sheets", "cn": "4801 00 00", "category": "construction"},
    "480210": {"desc": "Hand-made paper and paperboard", "cn": "4802 10 00", "category": "construction"},
    "480255": {"desc": "Uncoated paper and paperboard, for writing/printing (copy paper)", "cn": "4802 55 15", "category": "construction"},
    "480411": {"desc": "Kraftliner, unbleached", "cn": "4804 11 11", "category": "construction"},
    "480511": {"desc": "Semi-chemical fluting paper", "cn": "4805 11 00", "category": "construction"},
    "481013": {"desc": "Paper and paperboard, coated with kaolin (china clay), in rolls", "cn": "4810 13 00", "category": "construction"},
    "481710": {"desc": "Envelopes", "cn": "4817 10 00", "category": "construction"},
    "481810": {"desc": "Toilet paper", "cn": "4818 10 10", "category": "construction"},
    "481820": {"desc": "Handkerchiefs, cleansing or facial tissues and towels", "cn": "4818 20 10", "category": "construction"},
    "481910": {"desc": "Cartons, boxes and cases, of corrugated paper or paperboard", "cn": "4819 10 00", "category": "construction"},
    "482010": {"desc": "Registers, account books, note books, order books, receipt books", "cn": "4820 10 10", "category": "construction"},
    "482110": {"desc": "Paper or paperboard labels, printed", "cn": "4821 10 10", "category": "construction"},

    # =========================================================================
    # CHAPTER 68: ARTICLES OF STONE, PLASTER, CEMENT
    # =========================================================================
    "680221": {"desc": "Marble, travertine and alabaster, cut or sawn", "cn": "6802 21 00", "category": "construction"},
    "680223": {"desc": "Granite, cut or sawn", "cn": "6802 23 00", "category": "construction"},
    "680520": {"desc": "Natural or artificial abrasive powder or grain, on a base of paper or paperboard (sandpaper)", "cn": "6805 20 00", "category": "construction"},
    "680710": {"desc": "Articles of asphalt or of similar material, in rolls", "cn": "6807 10 00", "category": "construction"},
    "680911": {"desc": "Boards, sheets, panels, tiles and similar articles, not ornamented, of plaster", "cn": "6809 11 00", "category": "construction"},
    "681011": {"desc": "Building blocks and bricks, of cement, of concrete or of artificial stone", "cn": "6810 11 90", "category": "construction"},

    # =========================================================================
    # CHAPTER 69: CERAMIC PRODUCTS
    # =========================================================================
    "690410": {"desc": "Ceramic building bricks", "cn": "6904 10 00", "category": "construction"},
    "690721": {"desc": "Ceramic flags and paving, hearth or wall tiles, water absorption <= 0.5%", "cn": "6907 21 00", "category": "construction"},
    "690723": {"desc": "Ceramic flags and paving, hearth or wall tiles, water absorption > 10%", "cn": "6907 23 00", "category": "construction"},
    "691010": {"desc": "Ceramic sinks, wash basins, wash basin pedestals, baths, bidets, water closet pans, of porcelain", "cn": "6910 10 00", "category": "construction"},
    "691110": {"desc": "Tableware and kitchenware, of porcelain or china", "cn": "6911 10 00", "category": "construction"},
    "691200": {"desc": "Ceramic tableware, kitchenware, other household articles, other than of porcelain", "cn": "6912 00 23", "category": "construction"},

    # =========================================================================
    # CHAPTER 70: GLASS AND GLASSWARE
    # =========================================================================
    "700521": {"desc": "Float glass and surface ground or polished glass, non-wired, coloured throughout the mass", "cn": "7005 21 25", "category": "construction"},
    "700529": {"desc": "Float glass and surface ground or polished glass, other", "cn": "7005 29 25", "category": "construction"},
    "700711": {"desc": "Toughened (tempered) safety glass, for vehicles, aircraft, spacecraft or vessels", "cn": "7007 11 10", "category": "construction"},
    "700721": {"desc": "Laminated safety glass, for vehicles, aircraft, spacecraft or vessels", "cn": "7007 21 20", "category": "construction"},
    "700910": {"desc": "Rear-view mirrors for vehicles", "cn": "7009 10 00", "category": "construction"},
    "701090": {"desc": "Carboys, bottles, flasks, jars, pots, phials for conveyance or packing", "cn": "7010 90 21", "category": "construction"},
    "701349": {"desc": "Glassware of a kind used for table (other than drinking glasses) or kitchen purposes", "cn": "7013 49 10", "category": "construction"},
}
