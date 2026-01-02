"""
HS Codes for Textile Materials and Articles (Chapters 50-60).
Includes Silk, Wool, Cotton, Man-made fibers, Carpets, Special woven fabrics.
Excludes Apparel (Chapters 61-62).
"""

TEXTILE_MATERIALS = {
    # =========================================================================
    # CHAPTER 50: SILK
    # =========================================================================
    "500100": {"desc": "Silkworm cocoons suitable for reeling", "cn": "5001 00 00", "category": "textiles_materials"},
    "500200": {"desc": "Raw silk (not thrown)", "cn": "5002 00 00", "category": "textiles_materials"},
    "500720": {"desc": "Woven fabrics of silk or of silk waste, other than noil silk", "cn": "5007 20 11", "category": "textiles_materials"},

    # =========================================================================
    # CHAPTER 51: WOOL, FINE OR COARSE ANIMAL HAIR
    # =========================================================================
    "510111": {"desc": "Greasy wool, including fleece-washed, shorn", "cn": "5101 11 00", "category": "textiles_materials"},
    "510121": {"desc": "Degreased wool, not carbonised, shorn", "cn": "5101 21 00", "category": "textiles_materials"},
    "510610": {"desc": "Yarn of carded wool, containing >= 85% by weight of wool", "cn": "5106 10 10", "category": "textiles_materials"},
    "510710": {"desc": "Yarn of combed wool, containing >= 85% by weight of wool", "cn": "5107 10 10", "category": "textiles_materials"},
    "511111": {"desc": "Woven fabrics of carded wool or fine animal hair, weight <= 300 g/m²", "cn": "5111 11 00", "category": "textiles_materials"},

    # =========================================================================
    # CHAPTER 52: COTTON
    # =========================================================================
    "520100": {"desc": "Cotton, not carded or combed", "cn": "5201 00 90", "category": "textiles_materials"},
    "520300": {"desc": "Cotton, carded or combed", "cn": "5203 00 00", "category": "textiles_materials"},
    "520512": {"desc": "Cotton yarn (other than sewing thread), single, uncombed, > 232.56 decitex but <= 714.29 decitex", "cn": "5205 12 00", "category": "textiles_materials"},
    "520812": {"desc": "Woven fabrics of cotton, unbleached, plain weave, weighing > 100 g/m² but <= 200 g/m²", "cn": "5208 12 16", "category": "textiles_materials"},
    "520832": {"desc": "Woven fabrics of cotton, dyed, plain weave, weighing > 100 g/m² but <= 200 g/m²", "cn": "5208 32 16", "category": "textiles_materials"},
    "520942": {"desc": "Woven fabrics of cotton, denim", "cn": "5209 42 00", "category": "textiles_materials"},
    "521031": {"desc": "Woven fabrics of cotton mixed with man-made fibres, dyed, plain weave", "cn": "5210 31 00", "category": "textiles_materials"},

    # =========================================================================
    # CHAPTER 54: MAN-MADE FILAMENTS
    # =========================================================================
    "540211": {"desc": "Synthetic filament yarn, high tenacity, of aramids", "cn": "5402 11 00", "category": "textiles_materials"},
    "540233": {"desc": "Synthetic filament yarn, textured, of polyesters", "cn": "5402 33 00", "category": "textiles_materials"},
    "540710": {"desc": "Woven fabrics obtained from high tenacity yarn of nylon or other polyamides or of polyesters", "cn": "5407 10 00", "category": "textiles_materials"},
    "540742": {"desc": "Woven fabrics of nylon/polyamides, dyed", "cn": "5407 42 00", "category": "textiles_materials"},
    "540752": {"desc": "Woven fabrics of textured polyester filaments, dyed", "cn": "5407 52 00", "category": "textiles_materials"},

    # =========================================================================
    # CHAPTER 55: MAN-MADE STAPLE FIBRES
    # =========================================================================
    "550320": {"desc": "Synthetic staple fibres, not carded/combed, of polyesters", "cn": "5503 20 00", "category": "textiles_materials"},
    "550921": {"desc": "Yarn (other than sewing thread) of polyester staple fibres, single", "cn": "5509 21 00", "category": "textiles_materials"},
    "551211": {"desc": "Woven fabrics of synthetic staple fibres (>= 85% polyester), unbleached or bleached", "cn": "5512 11 00", "category": "textiles_materials"},
    "551321": {"desc": "Woven fabrics of synthetic staple fibres (< 85% polyester), mixed with cotton, dyed, plain weave", "cn": "5513 21 00", "category": "textiles_materials"},

    # =========================================================================
    # CHAPTER 57: CARPETS AND OTHER TEXTILE FLOOR COVERINGS
    # =========================================================================
    "570110": {"desc": "Carpets and other textile floor coverings, knotted, of wool or fine animal hair", "cn": "5701 10 10", "category": "textiles_materials"},
    "570232": {"desc": "Carpets and other textile floor coverings, woven, not tufted or flocked, of man-made textile materials, made up", "cn": "5702 32 10", "category": "textiles_materials"},
    "570320": {"desc": "Carpets and other textile floor coverings, tufted, of nylon or other polyamides", "cn": "5703 20 12", "category": "textiles_materials"},
    "570500": {"desc": "Other carpets and other textile floor coverings", "cn": "5705 00 30", "category": "textiles_materials"},

    # =========================================================================
    # CHAPTER 58: SPECIAL WOVEN FABRICS
    # =========================================================================
    "580110": {"desc": "Woven pile fabrics and chenille fabrics, of wool or fine animal hair", "cn": "5801 10 00", "category": "textiles_materials"},
    "580121": {"desc": "Woven pile fabrics and chenille fabrics, of cotton, uncut weft pile fabrics", "cn": "5801 21 00", "category": "textiles_materials"},
    "580211": {"desc": "Terry towelling and similar woven terry fabrics, of cotton, unbleached", "cn": "5802 11 00", "category": "textiles_materials"},
    "580421": {"desc": "Tulles and other net fabrics, mechanically made lace, of man-made fibres", "cn": "5804 21 10", "category": "textiles_materials"},
    "580632": {"desc": "Narrow woven fabrics, of man-made fibres", "cn": "5806 32 10", "category": "textiles_materials"},
    "581092": {"desc": "Embroidery on a ground, of man-made fibres", "cn": "5810 92 10", "category": "textiles_materials"},

    # =========================================================================
    # CHAPTER 59: IMPREGNATED, COATED, COVERED OR LAMINATED TEXTILE FABRICS
    # =========================================================================
    "590310": {"desc": "Textile fabrics impregnated, coated, covered or laminated with poly(vinyl chloride) (PVC)", "cn": "5903 10 10", "category": "textiles_materials"},
    "590320": {"desc": "Textile fabrics impregnated, coated, covered or laminated with polyurethane", "cn": "5903 20 10", "category": "textiles_materials"},
    "591190": {"desc": "Textile products and articles, for technical uses", "cn": "5911 90 10", "category": "textiles_materials"},

    # =========================================================================
    # CHAPTER 60: KNITTED OR CROCHETED FABRICS
    # =========================================================================
    "600110": {"desc": "Pile fabrics, including 'long pile' fabrics and terry fabrics, knitted or crocheted", "cn": "6001 10 00", "category": "textiles_materials"},
    "600410": {"desc": "Knitted or crocheted fabrics containing >= 5% elastomeric yarn", "cn": "6004 10 00", "category": "textiles_materials"},
    "600622": {"desc": "Other knitted or crocheted fabrics, of cotton, dyed", "cn": "6006 22 00", "category": "textiles_materials"},
    "600632": {"desc": "Other knitted or crocheted fabrics, of synthetic fibres, dyed", "cn": "6006 32 10", "category": "textiles_materials"},
}
