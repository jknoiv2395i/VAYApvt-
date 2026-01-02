"""
HS Codes for Vehicles and Parts (Chapter 87).
Includes parts and accessories for motor vehicles, tractors, and bicycles.
"""

VEHICLE_CODES = {
    # --- 8701: Tractors ---
    "870120": {"desc": "Road tractors for semi-trailers", "cn": "8701 20 10", "category": "vehicles"},
    "870191": {"desc": "Agricultural tractors, engine power <= 18 kW", "cn": "8701 91 10", "category": "vehicles"},
    "870192": {"desc": "Agricultural tractors, engine power > 18 kW but <= 37 kW", "cn": "8701 92 10", "category": "vehicles"},

    # --- 8703: Motor cars ---
    "870321": {"desc": "Vehicles with spark-ignition engine, cylinder capacity <= 1000 cc", "cn": "8703 21 10", "category": "vehicles"},
    "870322": {"desc": "Vehicles with spark-ignition engine, cylinder capacity > 1000 cc but <= 1500 cc", "cn": "8703 22 10", "category": "vehicles"},
    "870323": {"desc": "Vehicles with spark-ignition engine, cylinder capacity > 1500 cc but <= 3000 cc", "cn": "8703 23 19", "category": "vehicles"},
    "870340": {"desc": "Hybrid electric vehicles (HEV), spark-ignition", "cn": "8703 40 10", "category": "vehicles"},
    "870380": {"desc": "Electric vehicles (EV)", "cn": "8703 80 10", "category": "vehicles"},

    # --- 8704: Motor vehicles for transport of goods ---
    "870421": {"desc": "Goods vehicles with compression-ignition engine, g.v.w. <= 5 tonnes", "cn": "8704 21 31", "category": "vehicles"},
    "870422": {"desc": "Goods vehicles with compression-ignition engine, g.v.w. > 5 tonnes but <= 20 tonnes", "cn": "8704 22 91", "category": "vehicles"},

    # --- 8708: Parts and accessories of motor vehicles ---
    "870810": {"desc": "Bumpers and parts thereof", "cn": "8708 10 90", "category": "vehicles_parts"},
    "870821": {"desc": "Safety seat belts", "cn": "8708 21 10", "category": "vehicles_parts"},
    "870829": {"desc": "Other parts and accessories of bodies (including cabs)", "cn": "8708 29 90", "category": "vehicles_parts"},
    "870830": {"desc": "Brakes and servo-brakes; parts thereof", "cn": "8708 30 91", "category": "vehicles_parts"},
    "870840": {"desc": "Gear boxes and parts thereof", "cn": "8708 40 50", "category": "vehicles_parts"},
    "870850": {"desc": "Drive-axles with differential, whether or not provided with other transmission components", "cn": "8708 50 20", "category": "vehicles_parts"},
    "870870": {"desc": "Road wheels and parts and accessories thereof", "cn": "8708 70 50", "category": "vehicles_parts"},
    "870880": {"desc": "Suspension systems and parts thereof (including shock-absorbers)", "cn": "8708 80 35", "category": "vehicles_parts"},
    "870891": {"desc": "Radiators and parts thereof", "cn": "8708 91 35", "category": "vehicles_parts"},
    "870892": {"desc": "Silencers (mufflers) and exhaust pipes; parts thereof", "cn": "8708 92 35", "category": "vehicles_parts"},
    "870893": {"desc": "Clutches and parts thereof", "cn": "8708 93 90", "category": "vehicles_parts"},
    "870894": {"desc": "Steering wheels, steering columns and steering boxes; parts thereof", "cn": "8708 94 35", "category": "vehicles_parts"},
    "870895": {"desc": "Safety airbags with inflater system; parts thereof", "cn": "8708 95 10", "category": "vehicles_parts"},
    "870899": {"desc": "Other parts and accessories", "cn": "8708 99 97", "category": "vehicles_parts"},

    # --- 8711: Motorcycles ---
    "871120": {"desc": "Motorcycles, cylinder capacity > 50 cc but <= 250 cc", "cn": "8711 20 10", "category": "vehicles"},
    "871130": {"desc": "Motorcycles, cylinder capacity > 250 cc but <= 500 cc", "cn": "8711 30 10", "category": "vehicles"},
    "871160": {"desc": "Electric motorcycles", "cn": "8711 60 10", "category": "vehicles"},

    # --- 8712: Bicycles ---
    "871200": {"desc": "Bicycles and other cycles (including delivery tricycles), not motorised", "cn": "8712 00 30", "category": "vehicles"},

    # --- 8714: Parts and accessories of vehicles of headings 8711 to 8713 ---
    "871410": {"desc": "Of motorcycles (including mopeds)", "cn": "8714 10 10", "category": "vehicles_parts"},
    "871491": {"desc": "Frames and forks, and parts thereof", "cn": "8714 91 10", "category": "vehicles_parts"},
    "871493": {"desc": "Hubs, other than coaster braking hubs and hub brakes, and free-wheel sprocket-wheels", "cn": "8714 93 00", "category": "vehicles_parts"},
    "871494": {"desc": "Brakes, including coaster braking hubs and hub brakes, and parts thereof", "cn": "8714 94 20", "category": "vehicles_parts"},
    "871496": {"desc": "Pedals and crank-gear, and parts thereof", "cn": "8714 96 30", "category": "vehicles_parts"},
}
