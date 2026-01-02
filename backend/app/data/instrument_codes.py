"""
HS Codes for Optical, Photographic, Cinematographic, Measuring, 
Checking, Precision, Medical or Surgical Instruments and Apparatus (Chapter 90).
"""

INSTRUMENT_CODES = {
    # --- 9001-9004: Optical Fibres, Lenses, Spectacles ---
    "900110": {"desc": "Optical fibres, optical fibre bundles and cables", "cn": "9001 10 90", "category": "instruments"},
    "900120": {"desc": "Sheets and plates of polarising material", "cn": "9001 20 00", "category": "instruments"},
    "900130": {"desc": "Contact lenses", "cn": "9001 30 00", "category": "instruments"},
    "900140": {"desc": "Spectacle lenses of glass", "cn": "9001 40 20", "category": "instruments"},
    "900150": {"desc": "Spectacle lenses of other materials", "cn": "9001 50 20", "category": "instruments"},
    "900211": {"desc": "Objective lenses for cameras, projectors or photographic enlargers or reducers", "cn": "9002 11 00", "category": "instruments"},
    "900311": {"desc": "Frames and mountings for spectacles, goggles or the like, of plastics", "cn": "9003 11 00", "category": "instruments"},
    "900319": {"desc": "Frames and mountings for spectacles, goggles or the like, of other materials", "cn": "9003 19 00", "category": "instruments"},
    "900410": {"desc": "Sunglasses", "cn": "9004 10 10", "category": "instruments"},
    "900490": {"desc": "Other spectacles, goggles and the like (e.g. corrective, protective)", "cn": "9004 90 10", "category": "instruments"},

    # --- 9005-9008: Binoculars, Cameras ---
    "900510": {"desc": "Binoculars", "cn": "9005 10 00", "category": "instruments"},
    "900580": {"desc": "Other monoculars, telescopes, astronomical instruments", "cn": "9005 80 00", "category": "instruments"},
    "900653": {"desc": "Other cameras for roll film of a width of 35 mm", "cn": "9006 53 10", "category": "instruments"},
    "900659": {"desc": "Other cameras", "cn": "9006 59 00", "category": "instruments"},

    # --- 9011-9013: Microscopes, Lasers ---
    "901110": {"desc": "Stereoscopic microscopes", "cn": "9011 10 90", "category": "instruments"},
    "901120": {"desc": "Other microscopes, for photomicrography, cinephotomicrography or microprojection", "cn": "9011 20 90", "category": "instruments"},
    "901180": {"desc": "Other microscopes", "cn": "9011 80 00", "category": "instruments"},
    "901210": {"desc": "Microscopes other than optical microscopes; diffraction apparatus", "cn": "9012 10 90", "category": "instruments"},
    "901310": {"desc": "Telescopic sights for fitting to arms; periscopes", "cn": "9013 10 00", "category": "instruments"},
    "901320": {"desc": "Lasers, other than laser diodes", "cn": "9013 20 00", "category": "instruments"},

    # --- 9015: Surveying Instruments ---
    "901510": {"desc": "Rangefinders", "cn": "9015 10 10", "category": "instruments"},
    "901520": {"desc": "Theodolites and tachymeters (tachometers)", "cn": "9015 20 10", "category": "instruments"},
    "901530": {"desc": "Levels", "cn": "9015 30 10", "category": "instruments"},
    "901580": {"desc": "Other surveying, hydrographic, oceanographic instruments", "cn": "9015 80 11", "category": "instruments"},

    # --- 9018: Medical, Surgical, Dental Instruments ---
    "901811": {"desc": "Electro-cardiographs", "cn": "9018 11 00", "category": "instruments"},
    "901812": {"desc": "Ultrasonic scanning apparatus", "cn": "9018 12 00", "category": "instruments"},
    "901813": {"desc": "Magnetic resonance imaging apparatus (MRI)", "cn": "9018 13 00", "category": "instruments"},
    "901814": {"desc": "Scintigraphic apparatus", "cn": "9018 14 00", "category": "instruments"},
    "901819": {"desc": "Other electro-diagnostic apparatus", "cn": "9018 19 10", "category": "instruments"},
    "901820": {"desc": "Ultraviolet or infrared ray apparatus", "cn": "9018 20 00", "category": "instruments"},
    "901831": {"desc": "Syringes, with or without needles", "cn": "9018 31 10", "category": "instruments"},
    "901832": {"desc": "Tubular metal needles and needles for sutures", "cn": "9018 32 10", "category": "instruments"},
    "901839": {"desc": "Other needles, catheters, cannulae and the like", "cn": "9018 39 00", "category": "instruments"},
    "901841": {"desc": "Dental drill engines", "cn": "9018 41 00", "category": "instruments"},
    "901849": {"desc": "Other instruments and appliances, used in dental sciences", "cn": "9018 49 10", "category": "instruments"},
    "901850": {"desc": "Other ophthalmic instruments and appliances", "cn": "9018 50 10", "category": "instruments"},
    "901890": {"desc": "Other instruments and appliances used in medical, surgical sciences", "cn": "9018 90 20", "category": "instruments"},

    # --- 9019-9022: Therapy and X-Ray Apparatus ---
    "901910": {"desc": "Mechano-therapy appliances; massage apparatus", "cn": "9019 10 90", "category": "instruments"},
    "901920": {"desc": "Ozone therapy, oxygen therapy, aerosol therapy, artificial respiration apparatus", "cn": "9019 20 00", "category": "instruments"},
    "902000": {"desc": "Other breathing appliances and gas masks", "cn": "9020 00 00", "category": "instruments"},
    "902110": {"desc": "Orthopaedic or fracture appliances", "cn": "9021 10 10", "category": "instruments"},
    "902121": {"desc": "Artificial teeth", "cn": "9021 21 10", "category": "instruments"},
    "902131": {"desc": "Artificial joints", "cn": "9021 31 00", "category": "instruments"},
    "902140": {"desc": "Hearing aids, excluding parts and accessories", "cn": "9021 40 00", "category": "instruments"},
    "902150": {"desc": "Pacemakers for stimulating heart muscles", "cn": "9021 50 00", "category": "instruments"},
    "902212": {"desc": "Computed tomography apparatus (CT scan)", "cn": "9022 12 00", "category": "instruments"},
    "902213": {"desc": "Other X-ray apparatus, for dental uses", "cn": "9022 13 00", "category": "instruments"},
    "902214": {"desc": "Other X-ray apparatus, for medical, surgical or veterinary uses", "cn": "9022 14 00", "category": "instruments"},

    # --- 9024-9027: Measuring and Checking Instruments ---
    "902410": {"desc": "Machines and appliances for testing metals", "cn": "9024 10 11", "category": "instruments"},
    "902511": {"desc": "Thermometers and pyrometers, liquid-filled, for direct reading", "cn": "9025 11 80", "category": "instruments"},
    "902519": {"desc": "Other thermometers and pyrometers", "cn": "9025 19 20", "category": "instruments"},
    "902580": {"desc": "Other hydrometers, barometers, hygrometers", "cn": "9025 80 40", "category": "instruments"},
    "902610": {"desc": "Instruments for measuring or checking the flow or level of liquids", "cn": "9026 10 21", "category": "instruments"},
    "902620": {"desc": "Instruments for measuring or checking pressure (manometers)", "cn": "9026 20 20", "category": "instruments"},
    "902710": {"desc": "Gas or smoke analysis apparatus", "cn": "9027 10 10", "category": "instruments"},
    "902720": {"desc": "Chromatographs and electrophoresis instruments", "cn": "9027 20 10", "category": "instruments"},
    "902730": {"desc": "Spectrometers, spectrophotometers", "cn": "9027 30 00", "category": "instruments"},
    "902750": {"desc": "Other instruments using optical radiations (UV, visible, IR)", "cn": "9027 50 00", "category": "instruments"},
    "902780": {"desc": "Other instruments for physical or chemical analysis", "cn": "9027 80 17", "category": "instruments"},

    # --- 9028-9032: Regulating and Control Instruments ---
    "902810": {"desc": "Gas supply or production meters", "cn": "9028 10 00", "category": "instruments"},
    "902820": {"desc": "Liquid supply or production meters", "cn": "9028 20 00", "category": "instruments"},
    "902830": {"desc": "Electricity supply or production meters", "cn": "9028 30 11", "category": "instruments"},
    "903010": {"desc": "Instruments for measuring or detecting ionising radiations", "cn": "9030 10 00", "category": "instruments"},
    "903031": {"desc": "Multimeters without a recording device", "cn": "9030 31 00", "category": "instruments"},
    "903180": {"desc": "Other measuring or checking instruments, appliances and machines", "cn": "9031 80 34", "category": "instruments"},
    "903210": {"desc": "Thermostats", "cn": "9032 10 20", "category": "instruments"},
    "903289": {"desc": "Other automatic regulating or controlling instruments and apparatus", "cn": "9032 89 00", "category": "instruments"},
}
