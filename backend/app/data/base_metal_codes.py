"""
HS Codes for Base Metals and Articles Thereof (Chapters 74-83).
Excludes Iron/Steel (72, 73) and Aluminium (76) which are covered elsewhere.
Includes Copper, Nickel, Lead, Zinc, Tin, and Tools (82).
"""

BASE_METAL_CODES = {
    # =========================================================================
    # CHAPTER 74: COPPER AND ARTICLES THEREOF
    # =========================================================================

    "740100": {"desc": "Copper mattes; cement copper (precipitated copper)", "cn": "7401 00 00", "category": "base_metals"},
    "740200": {"desc": "Unrefined copper; copper anodes for electrolytic refining", "cn": "7402 00 00", "category": "base_metals"},
    "740311": {"desc": "Refined copper, cathodes and sections of cathodes", "cn": "7403 11 00", "category": "base_metals"},
    "740312": {"desc": "Refined copper, wire-bars", "cn": "7403 12 00", "category": "base_metals"},
    "740313": {"desc": "Refined copper, billets", "cn": "7403 13 00", "category": "base_metals"},
    "740319": {"desc": "Other refined copper", "cn": "7403 19 00", "category": "base_metals"},
    "740321": {"desc": "Copper-zinc base alloys (brass)", "cn": "7403 21 00", "category": "base_metals"},
    "740322": {"desc": "Copper-tin base alloys (bronze)", "cn": "7403 22 00", "category": "base_metals"},
    "740400": {"desc": "Copper waste and scrap", "cn": "7404 00 10", "category": "base_metals"},
    "740500": {"desc": "Master alloys of copper", "cn": "7405 00 00", "category": "base_metals"},
    "740610": {"desc": "Copper powders of non-lamellar structure", "cn": "7406 10 00", "category": "base_metals"},
    "740710": {"desc": "Copper bars, rods and profiles, of refined copper", "cn": "7407 10 00", "category": "base_metals"},
    "740721": {"desc": "Copper bars, rods and profiles, of copper-zinc base alloys (brass)", "cn": "7407 21 10", "category": "base_metals"},
    "740811": {"desc": "Copper wire, of refined copper, max dimension > 6 mm", "cn": "7408 11 00", "category": "base_metals"},
    "740819": {"desc": "Other copper wire, of refined copper", "cn": "7408 19 10", "category": "base_metals"},
    "740911": {"desc": "Copper plates, sheets and strip, of refined copper, in coils, thickness > 0.15 mm", "cn": "7409 11 00", "category": "base_metals"},
    "741011": {"desc": "Copper foil, of refined copper, not backed", "cn": "7410 11 00", "category": "base_metals"},
    "741110": {"desc": "Copper tubes and pipes, of refined copper", "cn": "7411 10 10", "category": "base_metals"},
    "741121": {"desc": "Copper tubes and pipes, of copper-zinc base alloys (brass)", "cn": "7411 21 10", "category": "base_metals"},
    "741210": {"desc": "Copper tube or pipe fittings, of refined copper", "cn": "7412 10 00", "category": "base_metals"},
    "741300": {"desc": "Stranded wire, cables, plaited bands and the like, of copper, not electrically insulated", "cn": "7413 00 00", "category": "base_metals"},
    "741510": {"desc": "Nails and tacks, drawing pins, staples and similar articles, of copper", "cn": "7415 10 00", "category": "base_metals"},
    "741810": {"desc": "Table, kitchen or other household articles and parts thereof, of copper", "cn": "7418 10 90", "category": "base_metals"},
    "741920": {"desc": "Other articles of copper, cast, moulded, stamped or forged", "cn": "7419 20 00", "category": "base_metals"},

    # =========================================================================
    # CHAPTER 75: NICKEL AND ARTICLES THEREOF
    # =========================================================================

    "750110": {"desc": "Nickel mattes", "cn": "7501 10 00", "category": "base_metals"},
    "750210": {"desc": "Unwrought nickel, nickel, not alloyed", "cn": "7502 10 00", "category": "base_metals"},
    "750220": {"desc": "Unwrought nickel, nickel alloys", "cn": "7502 20 00", "category": "base_metals"},
    "750400": {"desc": "Nickel powders and flakes", "cn": "7504 00 00", "category": "base_metals"},
    "750511": {"desc": "Nickel bars, rods and profiles, of nickel, not alloyed", "cn": "7505 11 00", "category": "base_metals"},
    "750610": {"desc": "Nickel plates, sheets, strip and foil, of nickel, not alloyed", "cn": "7506 10 00", "category": "base_metals"},
    "750890": {"desc": "Other articles of nickel", "cn": "7508 90 00", "category": "base_metals"},

    # =========================================================================
    # CHAPTER 78: LEAD AND ARTICLES THEREOF
    # =========================================================================

    "780110": {"desc": "Unwrought lead, refined", "cn": "7801 10 00", "category": "base_metals"},
    "780191": {"desc": "Other unwrought lead, containing by weight antimony as the principal other element", "cn": "7801 91 00", "category": "base_metals"},
    "780411": {"desc": "Lead sheets, strip and foil, sheets, strip and foil of a thickness (excluding any backing) not exceeding 0.2 mm", "cn": "7804 11 00", "category": "base_metals"},
    "780600": {"desc": "Other articles of lead", "cn": "7806 00 10", "category": "base_metals"},

    # =========================================================================
    # CHAPTER 79: ZINC AND ARTICLES THEREOF
    # =========================================================================

    "790111": {"desc": "Unwrought zinc, containing by weight 99.99% or more of zinc", "cn": "7901 11 00", "category": "base_metals"},
    "790112": {"desc": "Unwrought zinc, containing by weight less than 99.99% of zinc", "cn": "7901 12 10", "category": "base_metals"},
    "790120": {"desc": "Unwrought zinc, zinc alloys", "cn": "7901 20 00", "category": "base_metals"},
    "790310": {"desc": "Zinc dust", "cn": "7903 10 00", "category": "base_metals"},
    "790400": {"desc": "Zinc bars, rods, profiles and wire", "cn": "7904 00 00", "category": "base_metals"},
    "790500": {"desc": "Zinc plates, sheets, strip and foil", "cn": "7905 00 00", "category": "base_metals"},
    "790700": {"desc": "Other articles of zinc", "cn": "7907 00 00", "category": "base_metals"},

    # =========================================================================
    # CHAPTER 80: TIN AND ARTICLES THEREOF
    # =========================================================================

    "800110": {"desc": "Unwrought tin, tin, not alloyed", "cn": "8001 10 00", "category": "base_metals"},
    "800120": {"desc": "Unwrought tin, tin alloys", "cn": "8001 20 00", "category": "base_metals"},
    "800300": {"desc": "Tin bars, rods, profiles and wire", "cn": "8003 00 00", "category": "base_metals"},
    "800700": {"desc": "Other articles of tin", "cn": "8007 00 80", "category": "base_metals"},

    # =========================================================================
    # CHAPTER 82: TOOLS, IMPLEMENTS, CUTLERY, SPOONS AND FORKS
    # =========================================================================

    "820110": {"desc": "Spades and shovels", "cn": "8201 10 00", "category": "metal_tools"},
    "820130": {"desc": "Mattocks, picks, hoes and rakes", "cn": "8201 30 00", "category": "metal_tools"},
    "820140": {"desc": "Axes, bill hooks and similar hewing tools", "cn": "8201 40 00", "category": "metal_tools"},
    "820150": {"desc": "Secateurs and similar one-handed pruners and shears", "cn": "8201 50 00", "category": "metal_tools"},
    "820210": {"desc": "Hand saws", "cn": "8202 10 00", "category": "metal_tools"},
    "820220": {"desc": "Band saw blades", "cn": "8202 20 00", "category": "metal_tools"},
    "820231": {"desc": "Circular saw blades, with working part of steel", "cn": "8202 31 00", "category": "metal_tools"},
    "820310": {"desc": "Files, rasps and similar tools", "cn": "8203 10 00", "category": "metal_tools"},
    "820320": {"desc": "Pliers (including cutting pliers), pincers and similar tools", "cn": "8203 20 00", "category": "metal_tools"},
    "820340": {"desc": "Pipe-cutters, bolt croppers, perforating punches and similar tools", "cn": "8203 40 00", "category": "metal_tools"},
    "820411": {"desc": "Hand-operated spanners and wrenches, non-adjustable", "cn": "8204 11 00", "category": "metal_tools"},
    "820412": {"desc": "Hand-operated spanners and wrenches, adjustable", "cn": "8204 12 00", "category": "metal_tools"},
    "820420": {"desc": "Interchangeable spanner sockets, with or without handles", "cn": "8204 20 00", "category": "metal_tools"},
    "820510": {"desc": "Drilling, threading or tapping tools", "cn": "8205 10 00", "category": "metal_tools"},
    "820520": {"desc": "Hammers and sledge hammers", "cn": "8205 20 00", "category": "metal_tools"},
    "820540": {"desc": "Screwdrivers", "cn": "8205 40 00", "category": "metal_tools"},
    "820551": {"desc": "Other household tools", "cn": "8205 51 00", "category": "metal_tools"},
    "820713": {"desc": "Rock drilling or earth boring tools, with working part of cermets", "cn": "8207 13 00", "category": "metal_tools"},
    "820750": {"desc": "Tools for drilling, other than for rock drilling", "cn": "8207 50 10", "category": "metal_tools"},
    "821110": {"desc": "Sets of assorted knives", "cn": "8211 10 00", "category": "metal_tools"},
    "821191": {"desc": "Table knives having fixed blades", "cn": "8211 91 00", "category": "metal_tools"},
    "821192": {"desc": "Other knives having fixed blades", "cn": "8211 92 00", "category": "metal_tools"},
    "821210": {"desc": "Razors", "cn": "8212 10 10", "category": "metal_tools"},
    "821410": {"desc": "Paper knives, letter openers, erasing knives, pencil sharpeners and blades therefor", "cn": "8214 10 00", "category": "metal_tools"},
    "821510": {"desc": "Sets of assorted spoons, forks, ladles, etc., containing at least one article plated with precious metal", "cn": "8215 10 20", "category": "metal_tools"},
    "821520": {"desc": "Other sets of assorted spoons, forks, ladles, etc.", "cn": "8215 20 10", "category": "metal_tools"},
    "821591": {"desc": "Spoons, forks, etc., plated with precious metal", "cn": "8215 91 00", "category": "metal_tools"},
    "821599": {"desc": "Other spoons, forks, etc.", "cn": "8215 99 10", "category": "metal_tools"},

    # =========================================================================
    # CHAPTER 83: MISCELLANEOUS ARTICLES OF BASE METAL
    # =========================================================================

    "830110": {"desc": "Padlocks", "cn": "8301 10 00", "category": "base_metals"},
    "830130": {"desc": "Locks of a kind used for furniture", "cn": "8301 30 00", "category": "base_metals"},
    "830140": {"desc": "Other locks", "cn": "8301 40 11", "category": "base_metals"},
    "830210": {"desc": "Hinges", "cn": "8302 10 00", "category": "base_metals"},
    "830241": {"desc": "Other mountings, fittings and similar articles suitable for buildings", "cn": "8302 41 10", "category": "base_metals"},
    "830242": {"desc": "Other mountings, fittings and similar articles suitable for furniture", "cn": "8302 42 00", "category": "base_metals"},
    "831110": {"desc": "Coated electrodes of base metal, for electric arc-welding", "cn": "8311 10 00", "category": "base_metals"},
}
