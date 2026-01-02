"""
Downstream Manufacturing HS Codes - Phase 4.3 Expansion

HS codes for manufactured goods containing steel/aluminium precursors.
Important for Scope 3 emissions and complex goods declaration.

Chapters covered: 73, 82, 84, 85, 87
"""

# ============================================================================
# ARTICLES OF IRON/STEEL - DOWNSTREAM (Chapter 73)
# ============================================================================

STEEL_ARTICLES = {
    # Containers and storage
    "73101000": {"cn": "73101000", "desc": "Steel tanks/cisterns, 50-300 liters", "factor": 2.3},
    "73102100": {"cn": "73102100", "desc": "Steel cans, <50 liters, for food/beverage", "factor": 2.4},
    "73102900": {"cn": "73102900", "desc": "Steel cans, <50 liters, other", "factor": 2.3},
    "73110010": {"cn": "73110010", "desc": "LPG cylinders, iron/steel", "factor": 2.5},
    "73110020": {"cn": "73110020", "desc": "Compressed gas cylinders, medical", "factor": 2.6},
    "73110090": {"cn": "73110090", "desc": "Other containers for compressed gas", "factor": 2.5},
    
    # Wire products
    "73121010": {"cn": "73121010", "desc": "Stranded wire, iron/steel, non-insulated", "factor": 2.2},
    "73121020": {"cn": "73121020", "desc": "Steel cables, 6-strand", "factor": 2.3},
    "73121030": {"cn": "73121030", "desc": "Steel cables, 19-strand (elevator)", "factor": 2.4},
    "73121090": {"cn": "73121090", "desc": "Other stranded wire/cables", "factor": 2.2},
    "73129000": {"cn": "73129000", "desc": "Plaited bands, slings, iron/steel", "factor": 2.2},
    
    # Barbed wire and fencing
    "73130010": {"cn": "73130010", "desc": "Barbed wire, iron/steel", "factor": 2.1},
    "73130020": {"cn": "73130020", "desc": "Razor wire (security fencing)", "factor": 2.3},
    "73141200": {"cn": "73141200", "desc": "Woven cloth, stainless steel", "factor": 2.8},
    "73141400": {"cn": "73141400", "desc": "Woven cloth, iron/steel, other", "factor": 2.2},
    "73142000": {"cn": "73142000", "desc": "Grill, netting, expanded metal", "factor": 2.1},
    "73143100": {"cn": "73143100", "desc": "Wire mesh, zinc-coated", "factor": 2.2},
    "73143900": {"cn": "73143900", "desc": "Wire mesh, other coating", "factor": 2.2},
    
    # Nails, tacks, staples
    "73170010": {"cn": "73170010", "desc": "Iron/steel nails", "factor": 2.1},
    "73170020": {"cn": "73170020", "desc": "Iron/steel tacks", "factor": 2.1},
    "73170030": {"cn": "73170030", "desc": "Corrugated nails", "factor": 2.1},
    "73170040": {"cn": "73170040", "desc": "Staples (except office)", "factor": 2.1},
    "73170090": {"cn": "73170090", "desc": "Other nails/tacks/staples", "factor": 2.1},
    
    # Springs
    "73201010": {"cn": "73201010", "desc": "Leaf springs, iron/steel", "factor": 2.3},
    "73201020": {"cn": "73201020", "desc": "Spiral springs, suspension", "factor": 2.3},
    "73202010": {"cn": "73202010", "desc": "Helical springs, iron/steel", "factor": 2.2},
    "73202020": {"cn": "73202020", "desc": "Disc springs", "factor": 2.2},
    "73209000": {"cn": "73209000", "desc": "Other springs, iron/steel", "factor": 2.2},
    
    # Stoves and heaters
    "73211100": {"cn": "73211100", "desc": "Cooking appliances, gas, iron/steel", "factor": 2.4},
    "73211200": {"cn": "73211200", "desc": "Cooking appliances, liquid fuel", "factor": 2.4},
    "73211900": {"cn": "73211900", "desc": "Cooking appliances, other fuel", "factor": 2.4},
    "73218100": {"cn": "73218100", "desc": "Space heaters, gas, iron/steel", "factor": 2.5},
    "73218200": {"cn": "73218200", "desc": "Space heaters, liquid fuel", "factor": 2.5},
    "73218900": {"cn": "73218900", "desc": "Space heaters, other fuel", "factor": 2.5},
    
    # Kitchen and tableware
    "73231000": {"cn": "73231000", "desc": "Iron/steel wool, pot scourers", "factor": 2.0},
    "73239100": {"cn": "73239100", "desc": "Cast iron table/kitchenware, enameled", "factor": 2.3},
    "73239200": {"cn": "73239200", "desc": "Cast iron table/kitchenware, other", "factor": 2.2},
    "73239310": {"cn": "73239310", "desc": "Stainless steel cookware", "factor": 2.8},
    "73239390": {"cn": "73239390", "desc": "Stainless steel tableware", "factor": 2.8},
    "73239900": {"cn": "73239900", "desc": "Other iron/steel tableware", "factor": 2.3},
    
    # Sanitary ware
    "73241000": {"cn": "73241000", "desc": "Cast iron sinks and wash basins", "factor": 2.2},
    "73242100": {"cn": "73242100", "desc": "Cast iron bathtubs", "factor": 2.3},
    "73242900": {"cn": "73242900", "desc": "Other cast iron sanitary ware", "factor": 2.2},
    "73249000": {"cn": "73249000", "desc": "Other iron/steel sanitary ware", "factor": 2.3},
}


# ============================================================================
# TOOLS OF BASE METAL (Chapter 82)
# ============================================================================

TOOLS_BASE_METAL = {
    # Hand tools
    "82011000": {"cn": "82011000", "desc": "Spades and shovels", "factor": 2.4},
    "82012000": {"cn": "82012000", "desc": "Forks (hand tools)", "factor": 2.4},
    "82013000": {"cn": "82013000", "desc": "Mattocks, picks, hoes, rakes", "factor": 2.4},
    "82014000": {"cn": "82014000", "desc": "Axes, bill hooks, similar tools", "factor": 2.5},
    "82015000": {"cn": "82015000", "desc": "Secateurs, pruning shears", "factor": 2.5},
    "82016000": {"cn": "82016000", "desc": "Hedge shears, two-handed", "factor": 2.5},
    "82019000": {"cn": "82019000", "desc": "Other hand tools for agriculture", "factor": 2.4},
    
    # Saws
    "82021000": {"cn": "82021000", "desc": "Hand saws", "factor": 2.5},
    "82022000": {"cn": "82022000", "desc": "Band saw blades", "factor": 3.0},
    "82023100": {"cn": "82023100", "desc": "Circular saw blades, steel", "factor": 3.2},
    "82023900": {"cn": "82023900", "desc": "Circular saw blades, other", "factor": 3.0},
    "82024000": {"cn": "82024000", "desc": "Chain saw chains", "factor": 3.0},
    "82029100": {"cn": "82029100", "desc": "Straight saw blades, for metal", "factor": 3.0},
    "82029900": {"cn": "82029900", "desc": "Other saw blades", "factor": 2.8},
    
    # Files and related
    "82031000": {"cn": "82031000", "desc": "Files, rasps, and similar tools", "factor": 2.6},
    "82032000": {"cn": "82032000", "desc": "Pliers, pincers, tweezers", "factor": 2.8},
    "82033000": {"cn": "82033000", "desc": "Metal cutting shears, similar", "factor": 2.8},
    "82034000": {"cn": "82034000", "desc": "Pipe cutters, bolt cutters", "factor": 2.8},
    
    # Spanners and wrenches
    "82041100": {"cn": "82041100", "desc": "Hand-operated spanners, non-adjustable", "factor": 2.6},
    "82041200": {"cn": "82041200", "desc": "Hand-operated spanners, adjustable", "factor": 2.7},
    "82042000": {"cn": "82042000", "desc": "Socket wrenches, interchangeable", "factor": 2.8},
    
    # Drilling and tapping tools
    "82051000": {"cn": "82051000", "desc": "Drilling/threading tools", "factor": 3.5},
    "82052000": {"cn": "82052000", "desc": "Hammers and sledge hammers", "factor": 2.5},
    "82053000": {"cn": "82053000", "desc": "Planes, chisels, gouges", "factor": 2.6},
    "82054000": {"cn": "82054000", "desc": "Screwdrivers", "factor": 2.5},
    "82055100": {"cn": "82055100", "desc": "Other hand tools, household", "factor": 2.4},
    "82055900": {"cn": "82055900", "desc": "Other hand tools, non-household", "factor": 2.5},
    "82056000": {"cn": "82056000", "desc": "Blow lamps", "factor": 2.6},
    "82057000": {"cn": "82057000", "desc": "Vices, clamps, and similar", "factor": 2.6},
    "82059000": {"cn": "82059000", "desc": "Sets of hand tools", "factor": 2.6},
    
    # Knives and blades
    "82111000": {"cn": "82111000", "desc": "Knives with cutting blades, sets", "factor": 2.8},
    "82119100": {"cn": "82119100", "desc": "Table knives, fixed blade", "factor": 2.7},
    "82119200": {"cn": "82119200", "desc": "Other knives, fixed blade", "factor": 2.7},
    "82119300": {"cn": "82119300", "desc": "Knives, replaceable blade", "factor": 2.8},
    "82119400": {"cn": "82119400", "desc": "Knife blades", "factor": 3.0},
    "82119500": {"cn": "82119500", "desc": "Handles of base metal", "factor": 2.5},
    
    # Cutlery
    "82151000": {"cn": "82151000", "desc": "Cutlery sets plated with precious metal", "factor": 3.5},
    "82152000": {"cn": "82152000", "desc": "Other cutlery plated with precious metal", "factor": 3.5},
    "82159100": {"cn": "82159100", "desc": "Stainless steel cutlery sets", "factor": 2.8},
    "82159900": {"cn": "82159900", "desc": "Other cutlery, base metal", "factor": 2.6},
}


# ============================================================================
# MACHINERY (Chapter 84 - Selected)
# ============================================================================

MACHINERY_CODES = {
    # Boilers
    "84011000": {"cn": "84011000", "desc": "Nuclear reactors", "factor": 5.0},
    "84012000": {"cn": "84012000", "desc": "Machinery for isotope separation", "factor": 4.5},
    "84013000": {"cn": "84013000", "desc": "Fuel elements (cartridges), non-irradiated", "factor": 4.0},
    "84014000": {"cn": "84014000", "desc": "Parts of nuclear reactors", "factor": 4.5},
    "84021100": {"cn": "84021100", "desc": "Watertube boilers, >45 t/h steam", "factor": 2.8},
    "84021200": {"cn": "84021200", "desc": "Watertube boilers, ≤45 t/h steam", "factor": 2.7},
    "84021900": {"cn": "84021900", "desc": "Other vapour generating boilers", "factor": 2.7},
    "84022000": {"cn": "84022000", "desc": "Super-heated water boilers", "factor": 2.6},
    
    # Internal combustion engines
    "84071000": {"cn": "84071000", "desc": "Aircraft spark-ignition engines", "factor": 4.0},
    "84072100": {"cn": "84072100", "desc": "Marine propulsion engines, outboard", "factor": 3.5},
    "84072900": {"cn": "84072900", "desc": "Marine propulsion engines, other", "factor": 3.5},
    "84073100": {"cn": "84073100", "desc": "Spark-ignition engines, ≤50cc", "factor": 3.0},
    "84073200": {"cn": "84073200", "desc": "Spark-ignition engines, 50-250cc", "factor": 3.0},
    "84073300": {"cn": "84073300", "desc": "Spark-ignition engines, 250-1000cc", "factor": 3.2},
    "84073400": {"cn": "84073400", "desc": "Spark-ignition engines, >1000cc", "factor": 3.5},
    "84079000": {"cn": "84079000", "desc": "Other spark-ignition engines", "factor": 3.2},
    
    # Diesel engines
    "84081000": {"cn": "84081000", "desc": "Marine propulsion compression-ignition engines", "factor": 3.5},
    "84082010": {"cn": "84082010", "desc": "Diesel engines for vehicles, ≤500kW", "factor": 3.3},
    "84082020": {"cn": "84082020", "desc": "Diesel engines for vehicles, >500kW", "factor": 3.5},
    "84089010": {"cn": "84089010", "desc": "Other diesel engines, ≤18.65kW", "factor": 3.0},
    "84089020": {"cn": "84089020", "desc": "Other diesel engines, 18.65-37.3kW", "factor": 3.1},
    "84089090": {"cn": "84089090", "desc": "Other diesel engines, >37.3kW", "factor": 3.3},
    
    # Pumps
    "84131100": {"cn": "84131100", "desc": "Fuel dispensing pumps", "factor": 2.8},
    "84131900": {"cn": "84131900", "desc": "Other pumps with measuring devices", "factor": 2.7},
    "84132000": {"cn": "84132000", "desc": "Hand pumps (non-frame mounted)", "factor": 2.4},
    "84133000": {"cn": "84133000", "desc": "Fuel/lubricating pumps for engines", "factor": 3.0},
    "84134000": {"cn": "84134000", "desc": "Concrete pumps", "factor": 3.2},
    "84135010": {"cn": "84135010", "desc": "Reciprocating positive displacement pumps", "factor": 2.8},
    "84135020": {"cn": "84135020", "desc": "Rotary positive displacement pumps", "factor": 2.8},
    "84136000": {"cn": "84136000", "desc": "Other rotary positive displacement pumps", "factor": 2.7},
    "84137020": {"cn": "84137020", "desc": "Submersible pumps", "factor": 2.9},
    "84137090": {"cn": "84137090", "desc": "Other centrifugal pumps", "factor": 2.8},
    
    # Lifting machinery
    "84251100": {"cn": "84251100", "desc": "Pulley tackle, electric", "factor": 3.0},
    "84251900": {"cn": "84251900", "desc": "Pulley tackle, non-electric", "factor": 2.8},
    "84253100": {"cn": "84253100", "desc": "Winches, electric", "factor": 3.2},
    "84253900": {"cn": "84253900", "desc": "Winches, non-electric", "factor": 2.9},
    "84254100": {"cn": "84254100", "desc": "Built-in jacking systems (garage type)", "factor": 3.0},
    "84254200": {"cn": "84254200", "desc": "Other jacks, hydraulic", "factor": 2.8},
    "84254900": {"cn": "84254900", "desc": "Other jacks", "factor": 2.7},
}


# ============================================================================
# ELECTRICAL MACHINERY (Chapter 85 - Selected)
# ============================================================================

ELECTRICAL_CODES = {
    # Motors and generators
    "85011010": {"cn": "85011010", "desc": "Electric motors, ≤37.5W, DC", "factor": 3.2},
    "85011090": {"cn": "85011090", "desc": "Electric motors, ≤37.5W, AC", "factor": 3.2},
    "85012000": {"cn": "85012000", "desc": "Universal AC/DC motors, >37.5W", "factor": 3.3},
    "85013100": {"cn": "85013100", "desc": "DC motors, 750W-75kW", "factor": 3.4},
    "85013200": {"cn": "85013200", "desc": "DC motors, 75-375kW", "factor": 3.5},
    "85013300": {"cn": "85013300", "desc": "DC motors, >375kW", "factor": 3.6},
    "85013400": {"cn": "85013400", "desc": "DC generators", "factor": 3.4},
    "85014010": {"cn": "85014010", "desc": "Single-phase AC motors", "factor": 3.3},
    "85014020": {"cn": "85014020", "desc": "Three-phase AC motors, ≤7.5kW", "factor": 3.3},
    "85014090": {"cn": "85014090", "desc": "Other AC motors, single-phase", "factor": 3.2},
    "85015100": {"cn": "85015100", "desc": "AC motors, 3-phase, 750W-75kW", "factor": 3.4},
    "85015200": {"cn": "85015200", "desc": "AC motors, 3-phase, 75-375kW", "factor": 3.5},
    "85015300": {"cn": "85015300", "desc": "AC motors, 3-phase, >375kW", "factor": 3.6},
    
    # Transformers
    "85043100": {"cn": "85043100", "desc": "Transformers, ≤1kVA", "factor": 2.8},
    "85043200": {"cn": "85043200", "desc": "Transformers, 1-16kVA", "factor": 2.9},
    "85043300": {"cn": "85043300", "desc": "Transformers, 16-500kVA", "factor": 3.0},
    "85043400": {"cn": "85043400", "desc": "Transformers, >500kVA", "factor": 3.2},
    
    # Batteries
    "85071000": {"cn": "85071000", "desc": "Lead-acid batteries, for vehicles", "factor": 2.5},
    "85072000": {"cn": "85072000", "desc": "Other lead-acid batteries", "factor": 2.4},
    "85073000": {"cn": "85073000", "desc": "Nickel-cadmium batteries", "factor": 3.5},
    "85074000": {"cn": "85074000", "desc": "Nickel-iron batteries", "factor": 3.0},
    "85075000": {"cn": "85075000", "desc": "Nickel-metal hydride batteries", "factor": 3.5},
    "85076000": {"cn": "85076000", "desc": "Lithium-ion batteries", "factor": 8.0},
    "85078000": {"cn": "85078000", "desc": "Other electric accumulators", "factor": 3.0},
    
    # Wires and cables
    "85441100": {"cn": "85441100", "desc": "Copper winding wire", "factor": 4.0},
    "85441900": {"cn": "85441900", "desc": "Other winding wire", "factor": 3.5},
    "85442000": {"cn": "85442000", "desc": "Coaxial cable", "factor": 3.8},
    "85443000": {"cn": "85443000", "desc": "Ignition wiring sets", "factor": 3.5},
    "85444210": {"cn": "85444210", "desc": "Copper conductor cables, ≤1kV", "factor": 4.0},
    "85444290": {"cn": "85444290", "desc": "Other conductor cables, ≤1kV", "factor": 3.8},
    "85446010": {"cn": "85446010", "desc": "Copper conductor cables, >1kV", "factor": 4.2},
    "85446090": {"cn": "85446090", "desc": "Other conductor cables, >1kV", "factor": 4.0},
}


# ============================================================================
# VEHICLES (Chapter 87 - Selected)
# ============================================================================

VEHICLE_CODES = {
    # Tractors
    "87011000": {"cn": "87011000", "desc": "Pedestrian controlled tractors", "factor": 3.0},
    "87012000": {"cn": "87012000", "desc": "Road tractors for semi-trailers", "factor": 3.5},
    "87013000": {"cn": "87013000", "desc": "Track-laying tractors", "factor": 3.8},
    "87019010": {"cn": "87019010", "desc": "Agricultural tractors, ≤18kW", "factor": 3.2},
    "87019020": {"cn": "87019020", "desc": "Agricultural tractors, 18-37kW", "factor": 3.3},
    "87019030": {"cn": "87019030", "desc": "Agricultural tractors, 37-75kW", "factor": 3.4},
    "87019090": {"cn": "87019090", "desc": "Agricultural tractors, >75kW", "factor": 3.5},
    
    # Motor vehicles for passengers
    "87032100": {"cn": "87032100", "desc": "Passenger vehicles, ≤1000cc", "factor": 3.5},
    "87032210": {"cn": "87032210", "desc": "Passenger vehicles, 1000-1500cc", "factor": 3.6},
    "87032290": {"cn": "87032290", "desc": "Passenger vehicles, 1500-3000cc", "factor": 3.8},
    "87032300": {"cn": "87032300", "desc": "Passenger vehicles, >3000cc", "factor": 4.0},
    "87033100": {"cn": "87033100", "desc": "Diesel vehicles, ≤1500cc", "factor": 3.6},
    "87033210": {"cn": "87033210", "desc": "Diesel vehicles, 1500-2500cc", "factor": 3.8},
    "87033290": {"cn": "87033290", "desc": "Diesel vehicles, >2500cc", "factor": 4.0},
    "87034000": {"cn": "87034000", "desc": "Hybrid electric vehicles", "factor": 4.5},
    "87035000": {"cn": "87035000", "desc": "Plug-in hybrid vehicles", "factor": 5.0},
    "87036000": {"cn": "87036000", "desc": "Pure electric vehicles", "factor": 6.0},
    
    # Commercial vehicles
    "87041010": {"cn": "87041010", "desc": "Dump trucks, off-highway", "factor": 4.0},
    "87042100": {"cn": "87042100", "desc": "Goods vehicles, diesel, ≤5t", "factor": 3.5},
    "87042200": {"cn": "87042200", "desc": "Goods vehicles, diesel, 5-20t", "factor": 3.8},
    "87042300": {"cn": "87042300", "desc": "Goods vehicles, diesel, >20t", "factor": 4.0},
    "87043100": {"cn": "87043100", "desc": "Goods vehicles, petrol, ≤5t", "factor": 3.5},
    "87043200": {"cn": "87043200", "desc": "Goods vehicles, petrol, >5t", "factor": 3.8},
    
    # Vehicle parts
    "87071010": {"cn": "87071010", "desc": "Bodies for passenger vehicles", "factor": 3.0},
    "87071020": {"cn": "87071020", "desc": "Bodies for commercial vehicles", "factor": 3.2},
    "87079010": {"cn": "87079010", "desc": "Bodies for tractors", "factor": 3.0},
    "87081000": {"cn": "87081000", "desc": "Bumpers and parts thereof", "factor": 2.8},
    "87082100": {"cn": "87082100", "desc": "Safety seat belts", "factor": 2.8},
    "87082900": {"cn": "87082900", "desc": "Other body parts", "factor": 2.8},
    "87083010": {"cn": "87083010", "desc": "Brake drums", "factor": 2.6},
    "87083020": {"cn": "87083020", "desc": "Disc brake pads", "factor": 2.7},
    "87083090": {"cn": "87083090", "desc": "Other brake parts", "factor": 2.6},
    "87084000": {"cn": "87084000", "desc": "Gear boxes and parts", "factor": 3.0},
    "87085000": {"cn": "87085000", "desc": "Drive axles with differential", "factor": 3.2},
    "87087000": {"cn": "87087000", "desc": "Road wheels and parts", "factor": 2.8},
    "87088000": {"cn": "87088000", "desc": "Suspension systems and parts", "factor": 2.9},
    "87089100": {"cn": "87089100", "desc": "Radiators and parts", "factor": 2.7},
    "87089200": {"cn": "87089200", "desc": "Silencers (mufflers) and exhaust pipes", "factor": 2.5},
    "87089300": {"cn": "87089300", "desc": "Clutches and parts", "factor": 2.8},
    "87089400": {"cn": "87089400", "desc": "Steering wheels and columns", "factor": 2.8},
    "87089900": {"cn": "87089900", "desc": "Other vehicle parts", "factor": 2.7},
}


# ============================================================================
# AGGREGATE ALL DOWNSTREAM CODES
# ============================================================================

def get_all_downstream_mappings():
    """Get all downstream manufacturing mappings."""
    all_downstream = {}
    
    for code, data in STEEL_ARTICLES.items():
        all_downstream[code] = {**data, "category": "iron_steel"}
    
    for code, data in TOOLS_BASE_METAL.items():
        all_downstream[code] = {**data, "category": "iron_steel"}
    
    for code, data in MACHINERY_CODES.items():
        all_downstream[code] = {**data, "category": "iron_steel"}
    
    for code, data in ELECTRICAL_CODES.items():
        all_downstream[code] = {**data, "category": "iron_steel"}
    
    for code, data in VEHICLE_CODES.items():
        all_downstream[code] = {**data, "category": "iron_steel"}
    
    return all_downstream


DOWNSTREAM_CODE_COUNT = (
    len(STEEL_ARTICLES) +
    len(TOOLS_BASE_METAL) +
    len(MACHINERY_CODES) +
    len(ELECTRICAL_CODES) +
    len(VEHICLE_CODES)
)
