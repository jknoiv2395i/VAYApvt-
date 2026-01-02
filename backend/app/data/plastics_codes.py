"""
HS Codes for Plastics and Articles Thereof (Chapter 39).
Includes primary forms (polymers) and finished articles.
"""

PLASTICS_CODES = {
    # --- 3901: Polymers of ethylene, in primary forms ---
    "390110": {"desc": "Polyethylene having a specific gravity of less than 0.94", "cn": "3901 10 10", "category": "plastics_primary"},
    "390120": {"desc": "Polyethylene having a specific gravity of 0.94 or more", "cn": "3901 20 10", "category": "plastics_primary"},
    "390130": {"desc": "Ethylene-vinyl acetate copolymers", "cn": "3901 30 00", "category": "plastics_primary"},
    "390140": {"desc": "Ethylene-alpha-olefin copolymers, having a specific gravity of less than 0.94", "cn": "3901 40 00", "category": "plastics_primary"},
    "390190": {"desc": "Other polymers of ethylene", "cn": "3901 90 90", "category": "plastics_primary"},

    # --- 3902: Polymers of propylene or of other olefins ---
    "390210": {"desc": "Polypropylene", "cn": "3902 10 00", "category": "plastics_primary"},
    "390220": {"desc": "Polyisobutylene", "cn": "3902 20 00", "category": "plastics_primary"},
    "390230": {"desc": "Propylene copolymers", "cn": "3902 30 00", "category": "plastics_primary"},

    # --- 3903: Polymers of styrene ---
    "390311": {"desc": "Polystyrene, expansible", "cn": "3903 11 00", "category": "plastics_primary"},
    "390319": {"desc": "Polystyrene, other", "cn": "3903 19 00", "category": "plastics_primary"},
    "390320": {"desc": "Styrene-acrylonitrile (SAN) copolymers", "cn": "3903 20 00", "category": "plastics_primary"},
    "390330": {"desc": "Acrylonitrile-butadiene-styrene (ABS) copolymers", "cn": "3903 30 00", "category": "plastics_primary"},

    # --- 3904: Polymers of vinyl chloride (PVC) ---
    "390410": {"desc": "Poly(vinyl chloride), not mixed with other substances", "cn": "3904 10 00", "category": "plastics_primary"},
    "390421": {"desc": "Other poly(vinyl chloride), non-plasticised", "cn": "3904 21 00", "category": "plastics_primary"},
    "390422": {"desc": "Other poly(vinyl chloride), plasticised", "cn": "3904 22 00", "category": "plastics_primary"},
    "390430": {"desc": "Vinyl chloride-vinyl acetate copolymers", "cn": "3904 30 00", "category": "plastics_primary"},

    # --- 3907: Polyacetals, other polyethers and epoxide resins ---
    "390720": {"desc": "Other polyethers", "cn": "3907 20 11", "category": "plastics_primary"},
    "390730": {"desc": "Epoxide resins", "cn": "3907 30 00", "category": "plastics_primary"},
    "390740": {"desc": "Polycarbonates", "cn": "3907 40 00", "category": "plastics_primary"},
    "390750": {"desc": "Alkyd resins", "cn": "3907 50 00", "category": "plastics_primary"},
    "390761": {"desc": "Poly(ethylene terephthalate) having a viscosity number of 78 ml/g or higher", "cn": "3907 61 00", "category": "plastics_primary"},
    "390791": {"desc": "Unsaturated polyallyl esters", "cn": "3907 91 10", "category": "plastics_primary"},

    # --- 3917: Tubes, pipes and hoses ---
    "391710": {"desc": "Artificial guts (sausage casings) of hardened protein or of cellulosic materials", "cn": "3917 10 10", "category": "plastics_articles"},
    "391721": {"desc": "Tubes, pipes and hoses, rigid, of polymers of ethylene", "cn": "3917 21 10", "category": "plastics_articles"},
    "391722": {"desc": "Tubes, pipes and hoses, rigid, of polymers of propylene", "cn": "3917 22 10", "category": "plastics_articles"},
    "391723": {"desc": "Tubes, pipes and hoses, rigid, of polymers of vinyl chloride", "cn": "3917 23 10", "category": "plastics_articles"},
    "391731": {"desc": "Flexible tubes, pipes and hoses, having a minimum burst pressure of 27.6 MPa", "cn": "3917 31 00", "category": "plastics_articles"},
    "391732": {"desc": "Other tubes, pipes and hoses, not reinforced or otherwise combined with other materials, without fittings", "cn": "3917 32 00", "category": "plastics_articles"},
    "391740": {"desc": "Fittings (for example, joints, elbows, flanges)", "cn": "3917 40 00", "category": "plastics_articles"},

    # --- 3918: Floor coverings ---
    "391810": {"desc": "Floor coverings of polymers of vinyl chloride", "cn": "3918 10 10", "category": "plastics_articles"},
    "391890": {"desc": "Floor coverings of other plastics", "cn": "3918 90 00", "category": "plastics_articles"},

    # --- 3919: Self-adhesive plates, sheets, film, foil, tape ---
    "391910": {"desc": "In rolls of a width not exceeding 20 cm", "cn": "3919 10 12", "category": "plastics_articles"},
    "391990": {"desc": "Other self-adhesive plates, sheets, film", "cn": "3919 90 00", "category": "plastics_articles"},

    # --- 3920: Other plates, sheets, film, foil (non-cellular) ---
    "392010": {"desc": "Of polymers of ethylene", "cn": "3920 10 23", "category": "plastics_articles"},
    "392020": {"desc": "Of polymers of propylene", "cn": "3920 20 21", "category": "plastics_articles"},
    "392030": {"desc": "Of polymers of styrene", "cn": "3920 30 00", "category": "plastics_articles"},
    "392043": {"desc": "Of polymers of vinyl chloride, containing by weight not less than 6% of plasticisers", "cn": "3920 43 10", "category": "plastics_articles"},
    "392062": {"desc": "Of poly(ethylene terephthalate)", "cn": "3920 62 11", "category": "plastics_articles"},

    # --- 3923: Articles for conveyance or packing ---
    "392310": {"desc": "Boxes, cases, crates and similar articles", "cn": "3923 10 10", "category": "plastics_articles"},
    "392321": {"desc": "Sacks and bags, of polymers of ethylene", "cn": "3923 21 00", "category": "plastics_articles"},
    "392329": {"desc": "Sacks and bags, of other plastics", "cn": "3923 29 10", "category": "plastics_articles"},
    "392330": {"desc": "Carboys, bottles, flasks and similar articles", "cn": "3923 30 10", "category": "plastics_articles"},
    "392350": {"desc": "Stoppers, lids, caps and other closures", "cn": "3923 50 10", "category": "plastics_articles"},

    # --- 3924: Tableware, kitchenware, other household articles ---
    "392410": {"desc": "Tableware and kitchenware", "cn": "3924 10 00", "category": "plastics_articles"},
    "392490": {"desc": "Other household articles and toilet articles", "cn": "3924 90 00", "category": "plastics_articles"},

    # --- 3925: Builders' ware of plastics ---
    "392510": {"desc": "Reservoirs, tanks, vats and similar containers, capacity > 300 l", "cn": "3925 10 00", "category": "plastics_articles"},
    "392520": {"desc": "Doors, windows and their frames and thresholds for doors", "cn": "3925 20 00", "category": "plastics_articles"},
    "392530": {"desc": "Shutters, blinds (including Venetian blinds) and similar articles", "cn": "3925 30 00", "category": "plastics_articles"},
    "392590": {"desc": "Other builders' ware", "cn": "3925 90 10", "category": "plastics_articles"},

    # --- 3926: Other articles of plastics ---
    "392610": {"desc": "Office or school supplies", "cn": "3926 10 00", "category": "plastics_articles"},
    "392620": {"desc": "Articles of apparel and clothing accessories", "cn": "3926 20 00", "category": "plastics_articles"},
    "392630": {"desc": "Fittings for furniture, coachwork or the like", "cn": "3926 30 00", "category": "plastics_articles"},
    "392640": {"desc": "Statuettes and other ornamental articles", "cn": "3926 40 00", "category": "plastics_articles"},
    "392690": {"desc": "Other articles of plastics", "cn": "3926 90 97", "category": "plastics_articles"},
}
