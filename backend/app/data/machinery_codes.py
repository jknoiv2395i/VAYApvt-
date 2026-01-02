"""
HS Codes for Machinery and Electrical Equipment (Chapters 84 & 85).
Includes engines, pumps, agricultural machinery, electrical motors, batteries, and electronics.
"""

MACHINERY_CODES = {
    # =========================================================================
    # CHAPTER 84: Nuclear Reactors, Boilers, Machinery and Mechanical Appliances
    # =========================================================================

    # --- 8401-8406: Nuclear reactors, boilers, turbines ---
    "840110": {"desc": "Nuclear reactors", "cn": "8401 10 00", "category": "machinery"},
    "840211": {"desc": "Watertube boilers with a steam production > 45 t per hour", "cn": "8402 11 00", "category": "machinery"},
    "840212": {"desc": "Watertube boilers with a steam production <= 45 t per hour", "cn": "8402 12 00", "category": "machinery"},
    "840310": {"desc": "Central heating boilers", "cn": "8403 10 90", "category": "machinery"},
    "840410": {"desc": "Auxiliary plant for use with boilers of heading 8402 or 8403", "cn": "8404 10 00", "category": "machinery"},
    "840510": {"desc": "Producer gas or water gas generators, with or without their purifiers", "cn": "8405 10 00", "category": "machinery"},
    "840610": {"desc": "Steam turbines for marine propulsion", "cn": "8406 10 00", "category": "machinery"},
    "840681": {"desc": "Other steam turbines, output > 40 MW", "cn": "8406 81 00", "category": "machinery"},

    # --- 8407-8408: Internal combustion engines ---
    "840710": {"desc": "Aircraft engines", "cn": "8407 10 00", "category": "machinery"},
    "840731": {"desc": "Spark-ignition reciprocating piston engines for vehicles, cylinder capacity <= 50 cc", "cn": "8407 31 00", "category": "machinery"},
    "840732": {"desc": "Spark-ignition reciprocating piston engines for vehicles, cylinder capacity > 50 cc but <= 250 cc", "cn": "8407 32 10", "category": "machinery"},
    "840733": {"desc": "Spark-ignition reciprocating piston engines for vehicles, cylinder capacity > 250 cc but <= 1000 cc", "cn": "8407 33 00", "category": "machinery"},
    "840734": {"desc": "Spark-ignition reciprocating piston engines for vehicles, cylinder capacity > 1000 cc", "cn": "8407 34 10", "category": "machinery"},
    "840810": {"desc": "Marine propulsion engines (diesel)", "cn": "8408 10 11", "category": "machinery"},
    "840820": {"desc": "Engines used for the propulsion of vehicles of chapter 87", "cn": "8408 20 10", "category": "machinery"},

    # --- 8413-8414: Pumps ---
    "841311": {"desc": "Pumps for dispensing fuel or lubricants, of the type used in filling-stations", "cn": "8413 11 00", "category": "machinery"},
    "841330": {"desc": "Fuel, lubricating or cooling medium pumps for internal combustion piston engines", "cn": "8413 30 20", "category": "machinery"},
    "841350": {"desc": "Other reciprocating positive displacement pumps", "cn": "8413 50 20", "category": "machinery"},
    "841370": {"desc": "Other centrifugal pumps", "cn": "8413 70 21", "category": "machinery"},
    "841410": {"desc": "Vacuum pumps", "cn": "8414 10 20", "category": "machinery"},
    "841430": {"desc": "Compressors of a kind used in refrigerating equipment", "cn": "8414 30 20", "category": "machinery"},
    "841451": {"desc": "Table, floor, wall, window, ceiling or roof fans, output <= 125 W", "cn": "8414 51 00", "category": "machinery"},
    "841480": {"desc": "Other air or gas pumps, compressors and fans", "cn": "8414 80 11", "category": "machinery"},

    # --- 8415: Air conditioning ---
    "841510": {"desc": "Window or wall types, self-contained or 'split-system'", "cn": "8415 10 10", "category": "machinery"},
    "841520": {"desc": "Of a kind used for persons, in motor vehicles", "cn": "8415 20 00", "category": "machinery"},
    "841581": {"desc": "Other air conditioning machines, incorporating a refrigerating unit and a valve for reversal", "cn": "8415 81 00", "category": "machinery"},

    # --- 8418: Refrigerators, freezers ---
    "841810": {"desc": "Combined refrigerator-freezers, fitted with separate external doors", "cn": "8418 10 20", "category": "machinery"},
    "841821": {"desc": "Refrigerators, household type, compression-type", "cn": "8418 21 10", "category": "machinery"},
    "841830": {"desc": "Freezers of the chest type, capacity <= 800 l", "cn": "8418 30 20", "category": "machinery"},
    "841840": {"desc": "Freezers of the upright type, capacity <= 900 l", "cn": "8418 40 20", "category": "machinery"},

    # --- 8432-8433: Agricultural machinery ---
    "843210": {"desc": "Ploughs", "cn": "8432 10 00", "category": "machinery"},
    "843221": {"desc": "Disc harrows", "cn": "8432 21 00", "category": "machinery"},
    "843231": {"desc": "No-till direct seeders, planters and transplanters", "cn": "8432 31 00", "category": "machinery"},
    "843241": {"desc": "Manure spreaders and fertiliser distributors", "cn": "8432 41 00", "category": "machinery"},
    "843311": {"desc": "Mowers for lawns, parks or sports-grounds, powered, with cutting device rotating in horizontal plane", "cn": "8433 11 10", "category": "machinery"},
    "843351": {"desc": "Combine harvester-threshers", "cn": "8433 51 00", "category": "machinery"},

    # --- 8471: Automatic data processing machines (Computers) ---
    "847130": {"desc": "Portable automatic data processing machines, weighing <= 10 kg (Laptops)", "cn": "8471 30 00", "category": "machinery"},
    "847141": {"desc": "Other automatic data processing machines (Desktops)", "cn": "8471 41 00", "category": "machinery"},
    "847160": {"desc": "Input or output units, whether or not containing storage units in the same housing", "cn": "8471 60 60", "category": "machinery"},
    "847170": {"desc": "Storage units", "cn": "8471 70 50", "category": "machinery"},

    # --- 8481: Taps, cocks, valves ---
    "848110": {"desc": "Pressure-reducing valves", "cn": "8481 10 05", "category": "machinery"},
    "848120": {"desc": "Valves for oleohydraulic or pneumatic transmissions", "cn": "8481 20 10", "category": "machinery"},
    "848140": {"desc": "Safety or relief valves", "cn": "8481 40 10", "category": "machinery"},
    "848180": {"desc": "Other appliances (taps, cocks, etc.)", "cn": "8481 80 11", "category": "machinery"},

    # =========================================================================
    # CHAPTER 85: Electrical Machinery and Equipment
    # =========================================================================

    # --- 8501: Electric motors and generators ---
    "850110": {"desc": "Motors of an output not exceeding 37.5 W", "cn": "8501 10 10", "category": "electrical"},
    "850120": {"desc": "Universal AC/DC motors of an output exceeding 37.5 W", "cn": "8501 20 00", "category": "electrical"},
    "850131": {"desc": "Other DC motors; DC generators, output <= 750 W", "cn": "8501 31 00", "category": "electrical"},
    "850140": {"desc": "Other AC motors, single-phase", "cn": "8501 40 20", "category": "electrical"},
    "850152": {"desc": "Other AC motors, multi-phase, output > 750 W but <= 75 kW", "cn": "8501 52 20", "category": "electrical"},

    # --- 8504: Electrical transformers, static converters ---
    "850410": {"desc": "Ballasts for discharge lamps or tubes", "cn": "8504 10 20", "category": "electrical"},
    "850421": {"desc": "Liquid dielectric transformers, power handling capacity <= 650 kVA", "cn": "8504 21 00", "category": "electrical"},
    "850431": {"desc": "Other transformers, power handling capacity <= 1 kVA", "cn": "8504 31 80", "category": "electrical"},
    "850440": {"desc": "Static converters", "cn": "8504 40 30", "category": "electrical"},

    # --- 8507: Electric accumulators (Batteries) ---
    "850710": {"desc": "Lead-acid, of a kind used for starting piston engines", "cn": "8507 10 20", "category": "electrical"},
    "850720": {"desc": "Other lead-acid accumulators", "cn": "8507 20 20", "category": "electrical"},
    "850760": {"desc": "Lithium-ion accumulators", "cn": "8507 60 00", "category": "electrical"},

    # --- 8517: Telephone sets, smartphones ---
    "851711": {"desc": "Line telephone sets with cordless handsets", "cn": "8517 11 00", "category": "electrical"},
    "851713": {"desc": "Smartphones", "cn": "8517 13 00", "category": "electrical"},
    "851762": {"desc": "Machines for the reception, conversion and transmission or regeneration of voice, images or other data (Routers/Modems)", "cn": "8517 62 00", "category": "electrical"},

    # --- 8528: Monitors and projectors ---
    "852852": {"desc": "Monitors suitable for use with an automatic data processing machine", "cn": "8528 52 10", "category": "electrical"},
    "852872": {"desc": "Reception apparatus for television, colour", "cn": "8528 72 20", "category": "electrical"},

    # --- 8542: Electronic integrated circuits ---
    "854231": {"desc": "Processors and controllers", "cn": "8542 31 10", "category": "electrical"},
    "854232": {"desc": "Memories", "cn": "8542 32 10", "category": "electrical"},
    "854233": {"desc": "Amplifiers", "cn": "8542 33 00", "category": "electrical"},
    "854239": {"desc": "Other electronic integrated circuits", "cn": "8542 39 10", "category": "electrical"},

    # --- 8544: Insulated wire, cable ---
    "854411": {"desc": "Winding wire of copper", "cn": "8544 11 10", "category": "electrical"},
    "854420": {"desc": "Coaxial cable and other coaxial electric conductors", "cn": "8544 20 00", "category": "electrical"},
    "854442": {"desc": "Other electric conductors, fitted with connectors", "cn": "8544 42 10", "category": "electrical"},
    "854470": {"desc": "Optical fibre cables", "cn": "8544 70 00", "category": "electrical"},
}
