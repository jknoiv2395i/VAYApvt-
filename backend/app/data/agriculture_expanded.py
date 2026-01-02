"""
HS Codes for Agriculture and Food Products (Chapters 01-24).
Includes Live Animals, Meat, Fish, Dairy, Vegetables, Fruits, Grains, Oils, Beverages, Tobacco.
"""

AGRICULTURE_EXPANDED = {
    # =========================================================================
    # CHAPTER 01: LIVE ANIMALS
    # =========================================================================
    "010121": {"desc": "Pure-bred breeding horses", "cn": "0101 21 00", "category": "agriculture"},
    "010221": {"desc": "Pure-bred breeding cattle", "cn": "0102 21 10", "category": "agriculture"},
    "010229": {"desc": "Other cattle", "cn": "0102 29 10", "category": "agriculture"},
    "010310": {"desc": "Pure-bred breeding swine", "cn": "0103 10 00", "category": "agriculture"},
    "010410": {"desc": "Sheep", "cn": "0104 10 10", "category": "agriculture"},
    "010420": {"desc": "Goats", "cn": "0104 20 10", "category": "agriculture"},
    "010511": {"desc": "Fowls of the species Gallus domesticus, weighing <= 185 g", "cn": "0105 11 11", "category": "agriculture"},

    # =========================================================================
    # CHAPTER 02: MEAT AND EDIBLE MEAT OFFAL
    # =========================================================================
    "020110": {"desc": "Carcasses and half-carcasses of bovine animals, fresh or chilled", "cn": "0201 10 00", "category": "agriculture"},
    "020120": {"desc": "Other cuts of bovine animals with bone in, fresh or chilled", "cn": "0201 20 20", "category": "agriculture"},
    "020130": {"desc": "Boneless meat of bovine animals, fresh or chilled", "cn": "0201 30 00", "category": "agriculture"},
    "020210": {"desc": "Carcasses and half-carcasses of bovine animals, frozen", "cn": "0202 10 00", "category": "agriculture"},
    "020220": {"desc": "Other cuts of bovine animals with bone in, frozen", "cn": "0202 20 10", "category": "agriculture"},
    "020230": {"desc": "Boneless meat of bovine animals, frozen", "cn": "0202 30 10", "category": "agriculture"},
    "020311": {"desc": "Carcasses and half-carcasses of swine, fresh or chilled", "cn": "0203 11 10", "category": "agriculture"},
    "020319": {"desc": "Other meat of swine, fresh or chilled", "cn": "0203 19 11", "category": "agriculture"},
    "020410": {"desc": "Carcasses and half-carcasses of lamb, fresh or chilled", "cn": "0204 10 00", "category": "agriculture"},
    "020711": {"desc": "Fowls of the species Gallus domesticus, not cut in pieces, fresh or chilled", "cn": "0207 11 10", "category": "agriculture"},
    "020712": {"desc": "Fowls of the species Gallus domesticus, not cut in pieces, frozen", "cn": "0207 12 10", "category": "agriculture"},
    "020713": {"desc": "Cuts and offal of fowls, fresh or chilled", "cn": "0207 13 10", "category": "agriculture"},
    "020714": {"desc": "Cuts and offal of fowls, frozen", "cn": "0207 14 10", "category": "agriculture"},

    # =========================================================================
    # CHAPTER 03: FISH AND CRUSTACEANS
    # =========================================================================
    "030111": {"desc": "Ornamental freshwater fish", "cn": "0301 11 00", "category": "agriculture"},
    "030211": {"desc": "Trout, fresh or chilled", "cn": "0302 11 10", "category": "agriculture"},
    "030213": {"desc": "Pacific salmon, fresh or chilled", "cn": "0302 13 00", "category": "agriculture"},
    "030214": {"desc": "Atlantic salmon and Danube salmon, fresh or chilled", "cn": "0302 14 00", "category": "agriculture"},
    "030311": {"desc": "Sockeye salmon (red salmon), frozen", "cn": "0303 11 00", "category": "agriculture"},
    "030312": {"desc": "Other Pacific salmon, frozen", "cn": "0303 12 00", "category": "agriculture"},
    "030313": {"desc": "Atlantic salmon and Danube salmon, frozen", "cn": "0303 13 00", "category": "agriculture"},
    "030461": {"desc": "Frozen fillets of tilapia", "cn": "0304 61 00", "category": "agriculture"},
    "030611": {"desc": "Frozen rock lobster and other sea crawfish", "cn": "0306 11 10", "category": "agriculture"},
    "030616": {"desc": "Cold-water shrimps and prawns, frozen", "cn": "0306 16 10", "category": "agriculture"},
    "030617": {"desc": "Other shrimps and prawns, frozen", "cn": "0306 17 11", "category": "agriculture"},

    # =========================================================================
    # CHAPTER 04: DAIRY PRODUCE; BIRDS' EGGS; HONEY
    # =========================================================================
    "040110": {"desc": "Milk and cream, not concentrated, fat content <= 1%", "cn": "0401 10 10", "category": "agriculture"},
    "040120": {"desc": "Milk and cream, not concentrated, fat content > 1% but <= 6%", "cn": "0401 20 11", "category": "agriculture"},
    "040210": {"desc": "Milk and cream, concentrated,, in powder, fat content <= 1.5%", "cn": "0402 10 11", "category": "agriculture"},
    "040221": {"desc": "Milk and cream, concentrated, in powder, fat content > 1.5%, no sugar", "cn": "0402 21 11", "category": "agriculture"},
    "040510": {"desc": "Butter", "cn": "0405 10 11", "category": "agriculture"},
    "040610": {"desc": "Fresh (unripened or uncured) cheese, including whey cheese, and curd", "cn": "0406 10 20", "category": "agriculture"},
    "040630": {"desc": "Processed cheese, not grated or powdered", "cn": "0406 30 10", "category": "agriculture"},
    "040690": {"desc": "Other cheese (Cheddar, Gouda, etc.)", "cn": "0406 90 21", "category": "agriculture"},
    "040711": {"desc": "Fertilised eggs for incubation, of fowls", "cn": "0407 11 00", "category": "agriculture"},
    "040900": {"desc": "Natural honey", "cn": "0409 00 00", "category": "agriculture"},

    # =========================================================================
    # CHAPTER 07: EDIBLE VEGETABLES
    # =========================================================================
    "070110": {"desc": "Seed potatoes", "cn": "0701 10 00", "category": "agriculture"},
    "070190": {"desc": "Other potatoes, fresh or chilled", "cn": "0701 90 10", "category": "agriculture"},
    "070200": {"desc": "Tomatoes, fresh or chilled", "cn": "0702 00 00", "category": "agriculture"},
    "070310": {"desc": "Onions and shallots, fresh or chilled", "cn": "0703 10 10", "category": "agriculture"},
    "070320": {"desc": "Garlic, fresh or chilled", "cn": "0703 20 00", "category": "agriculture"},
    "071310": {"desc": "Peas, dried", "cn": "0713 10 00", "category": "agriculture"},
    "071320": {"desc": "Chickpeas (garbanzos), dried", "cn": "0713 20 00", "category": "agriculture"},
    "071333": {"desc": "Kidney beans, including white pea beans, dried", "cn": "0713 33 10", "category": "agriculture"},
    "071340": {"desc": "Lentils, dried", "cn": "0713 40 00", "category": "agriculture"},

    # =========================================================================
    # CHAPTER 08: EDIBLE FRUIT AND NUTS
    # =========================================================================
    "080111": {"desc": "Desiccated coconut", "cn": "0801 11 00", "category": "agriculture"},
    "080131": {"desc": "Cashew nuts, in shell", "cn": "0801 31 00", "category": "agriculture"},
    "080132": {"desc": "Cashew nuts, shelled", "cn": "0801 32 10", "category": "agriculture"},
    "080211": {"desc": "Almonds, in shell", "cn": "0802 11 10", "category": "agriculture"},
    "080212": {"desc": "Almonds, shelled", "cn": "0802 12 00", "category": "agriculture"},
    "080310": {"desc": "Plantains, fresh or dried", "cn": "0803 10 10", "category": "agriculture"},
    "080390": {"desc": "Bananas, fresh or dried", "cn": "0803 90 10", "category": "agriculture"},
    "080410": {"desc": "Dates, fresh or dried", "cn": "0804 10 10", "category": "agriculture"},
    "080450": {"desc": "Guavas, mangoes and mangosteens, fresh or dried", "cn": "0804 50 10", "category": "agriculture"},
    "080510": {"desc": "Oranges", "cn": "0805 10 10", "category": "agriculture"},
    "080550": {"desc": "Lemons and limes", "cn": "0805 50 10", "category": "agriculture"},
    "080610": {"desc": "Grapes, fresh", "cn": "0806 10 10", "category": "agriculture"},
    "080810": {"desc": "Apples, fresh", "cn": "0808 10 00", "category": "agriculture"},
    "081010": {"desc": "Strawberries, fresh", "cn": "0810 10 00", "category": "agriculture"},

    # =========================================================================
    # CHAPTER 09: COFFEE, TEA, MATÉ AND SPICES
    # =========================================================================
    "090111": {"desc": "Coffee, not roasted, not decaffeinated", "cn": "0901 11 00", "category": "agriculture"},
    "090112": {"desc": "Coffee, not roasted, decaffeinated", "cn": "0901 12 00", "category": "agriculture"},
    "090121": {"desc": "Coffee, roasted, not decaffeinated", "cn": "0901 21 00", "category": "agriculture"},
    "090210": {"desc": "Green tea (not fermented) in immediate packings <= 3 kg", "cn": "0902 10 00", "category": "agriculture"},
    "090220": {"desc": "Other green tea (not fermented)", "cn": "0902 20 00", "category": "agriculture"},
    "090230": {"desc": "Black tea (fermented) and partly fermented tea, in immediate packings <= 3 kg", "cn": "0902 30 10", "category": "agriculture"},
    "090240": {"desc": "Other black tea (fermented)", "cn": "0902 40 10", "category": "agriculture"},
    "090411": {"desc": "Pepper of the genus Piper, neither crushed nor ground", "cn": "0904 11 10", "category": "agriculture"},
    "090421": {"desc": "Fruits of the genus Capsicum or of the genus Pimenta, dried, neither crushed nor ground", "cn": "0904 21 10", "category": "agriculture"},
    "090611": {"desc": "Cinnamon (Cinnamomum zeylanicum Blume), neither crushed nor ground", "cn": "0906 11 10", "category": "agriculture"},
    "090811": {"desc": "Nutmeg, neither crushed nor ground", "cn": "0908 11 10", "category": "agriculture"},
    "090831": {"desc": "Cardamoms, neither crushed nor ground", "cn": "0908 31 10", "category": "agriculture"},
    "090931": {"desc": "Cumin seeds, neither crushed nor ground", "cn": "0909 31 11", "category": "agriculture"},
    "091011": {"desc": "Ginger, neither crushed nor ground", "cn": "0910 11 10", "category": "agriculture"},
    "091030": {"desc": "Turmeric (curcuma)", "cn": "0910 30 10", "category": "agriculture"},

    # =========================================================================
    # CHAPTER 10: CEREALS
    # =========================================================================
    "100111": {"desc": "Durum wheat, seed", "cn": "1001 11 00", "category": "agriculture"},
    "100199": {"desc": "Other wheat and meslin", "cn": "1001 99 00", "category": "agriculture"},
    "100510": {"desc": "Maize (corn) seed", "cn": "1005 10 11", "category": "agriculture"},
    "100590": {"desc": "Other maize (corn)", "cn": "1005 90 00", "category": "agriculture"},
    "100610": {"desc": "Rice in the husk (paddy or rough)", "cn": "1006 10 10", "category": "agriculture"},
    "100620": {"desc": "Husked (brown) rice", "cn": "1006 20 00", "category": "agriculture"},
    "100630": {"desc": "Semi-milled or wholly milled rice, whether or not polished or glazed", "cn": "1006 30 10", "category": "agriculture"},
    "100640": {"desc": "Broken rice", "cn": "1006 40 00", "category": "agriculture"},

    # =========================================================================
    # CHAPTER 15: ANIMAL OR VEGETABLE FATS AND OILS
    # =========================================================================
    "150710": {"desc": "Soya-bean oil, crude, whether or not degummed", "cn": "1507 10 10", "category": "agriculture"},
    "150810": {"desc": "Ground-nut oil, crude", "cn": "1508 10 00", "category": "agriculture"},
    "150910": {"desc": "Olive oil, virgin", "cn": "1509 10 10", "category": "agriculture"},
    "151110": {"desc": "Palm oil, crude", "cn": "1511 10 00", "category": "agriculture"},
    "151190": {"desc": "Palm oil, refined", "cn": "1511 90 10", "category": "agriculture"},
    "151211": {"desc": "Sunflower-seed or safflower oil, crude", "cn": "1512 11 10", "category": "agriculture"},

    # =========================================================================
    # CHAPTER 17: SUGARS AND SUGAR CONFECTIONERY
    # =========================================================================
    "170112": {"desc": "Beet sugar, raw", "cn": "1701 12 10", "category": "agriculture"},
    "170114": {"desc": "Cane sugar, raw", "cn": "1701 14 10", "category": "agriculture"},
    "170199": {"desc": "Other cane or beet sugar, pure sucrose", "cn": "1701 99 10", "category": "agriculture"},

    # =========================================================================
    # CHAPTER 18: COCOA AND COCOA PREPARATIONS
    # =========================================================================
    "180100": {"desc": "Cocoa beans, whole or broken, raw or roasted", "cn": "1801 00 00", "category": "agriculture"},
    "180310": {"desc": "Cocoa paste, not defatted", "cn": "1803 10 00", "category": "agriculture"},
    "180500": {"desc": "Cocoa powder, not containing added sugar or other sweetening matter", "cn": "1805 00 00", "category": "agriculture"},
    "180610": {"desc": "Cocoa powder, containing added sugar or other sweetening matter", "cn": "1806 10 15", "category": "agriculture"},
    "180631": {"desc": "Chocolate and other food preparations containing cocoa, filled blocks/bars", "cn": "1806 31 00", "category": "agriculture"},

    # =========================================================================
    # CHAPTER 22: BEVERAGES, SPIRITS AND VINEGAR
    # =========================================================================
    "220110": {"desc": "Mineral waters and aerated waters, not sweetened/flavoured", "cn": "2201 10 11", "category": "agriculture"},
    "220210": {"desc": "Waters, including mineral/aerated waters, sweetened or flavoured", "cn": "2202 10 00", "category": "agriculture"},
    "220300": {"desc": "Beer made from malt", "cn": "2203 00 01", "category": "agriculture"},
    "220410": {"desc": "Sparkling wine", "cn": "2204 10 11", "category": "agriculture"},
    "220421": {"desc": "Other wine; grape must with fermentation prevented, in containers <= 2 l", "cn": "2204 21 11", "category": "agriculture"},
    "220820": {"desc": "Spirits obtained by distilling grape wine or grape marc (e.g., Brandy)", "cn": "2208 20 12", "category": "agriculture"},
    "220830": {"desc": "Whiskies", "cn": "2208 30 11", "category": "agriculture"},
    "220860": {"desc": "Vodka", "cn": "2208 60 11", "category": "agriculture"},
    "220870": {"desc": "Liqueurs and cordials", "cn": "2208 70 10", "category": "agriculture"},

    # =========================================================================
    # CHAPTER 24: TOBACCO AND MANUFACTURED TOBACCO SUBSTITUTES
    # =========================================================================
    "240110": {"desc": "Tobacco, not stemmed/stripped", "cn": "2401 10 35", "category": "agriculture"},
    "240120": {"desc": "Tobacco, partly or wholly stemmed/stripped", "cn": "2401 20 35", "category": "agriculture"},
    "240220": {"desc": "Cigarettes containing tobacco", "cn": "2402 20 10", "category": "agriculture"},
    "240311": {"desc": "Water pipe tobacco", "cn": "2403 11 00", "category": "agriculture"},
}
