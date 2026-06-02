// data.js — mock product catalog for Brand Health Checker
export const products = {
  '009800895007': {
    gtin: '009800895007', brand: 'Nutella', name: 'Hazelnut Cocoa Spread',
    size: '350 g jar', category: 'Sweet spreads', emoji: '🍫',
    variants: {
      US: {
        region: 'US', score: 38, novaGroup: 4, confidence: 'High',
        components: { nutrition: 30, additives: 58, processing: 20 },
        reasons: [
          { type: 'neg', find: 'Very high in sugar', ev: '56.3 g / 100g', tag: 'sugar' },
          { type: 'neg', find: 'Contains palm oil', ev: 'refined oil', tag: 'palm oil' },
          { type: 'neg', find: 'Ultra-processed (NOVA 4)', ev: '8 ingredients', tag: 'processing' },
          { type: 'pos', find: 'No artificial colors', ev: 'verified', tag: 'colors' },
        ],
        nutrition: { sugar: 56.3, addedSugar: 56.3, sat: 10.6, sodium: 36, fiber: 3.6, protein: 6.3, kcal: 539 },
        additives: [
          { code: 'E322', name: 'Lecithins', note: 'Emulsifier', flag: 'Both' },
          { code: '—', name: 'Vanillin', note: 'Artificial flavor', flag: 'Both' },
        ],
        ingredients: 'Sugar, palm oil, hazelnuts, cocoa, skim milk, whey, lecithin (soy), vanillin.',
      },
      EU: {
        region: 'EU', score: 44, novaGroup: 4, confidence: 'High',
        components: { nutrition: 36, additives: 62, processing: 24 },
        reasons: [
          { type: 'neg', find: 'High in sugar', ev: '53.5 g / 100g', tag: 'sugar' },
          { type: 'neg', find: 'Contains palm oil', ev: 'refined oil', tag: 'palm oil' },
          { type: 'neg', find: 'Ultra-processed (NOVA 4)', ev: '7 ingredients', tag: 'processing' },
          { type: 'pos', find: 'Higher hazelnut content', ev: '13% vs 9%', tag: 'nuts' },
        ],
        nutrition: { sugar: 53.5, addedSugar: 53.5, sat: 10.6, sodium: 41, fiber: 3.4, protein: 6.3, kcal: 539 },
        additives: [{ code: 'E322', name: 'Lecithins', note: 'Emulsifier', flag: 'Both' }],
        ingredients: 'Sugar, palm oil, hazelnuts (13%), skim milk, cocoa, lecithin, vanillin.',
      },
    },
    alternatives: ['onceagain', 'nocciolata'],
  },

  '049000028904': {
    gtin: '049000028904', brand: 'Coca-Cola', name: 'Classic Cola',
    size: '500 ml bottle', category: 'Soft drinks', emoji: '🥤',
    variants: {
      US: {
        region: 'US', score: 21, novaGroup: 4, confidence: 'High',
        components: { nutrition: 14, additives: 55, processing: 10 },
        reasons: [
          { type: 'neg', find: 'Sweetened with HFCS', ev: 'high-fructose corn syrup', tag: 'hfcs' },
          { type: 'neg', find: 'High added sugar', ev: '10.6 g / 100ml', tag: 'sugar' },
          { type: 'neg', find: 'No nutritional value', ev: '0 g fiber · 0 g protein', tag: 'empty' },
          { type: 'neg', find: 'Caramel color (E150d)', ev: 'contains 4-MEI', tag: 'caramel' },
        ],
        nutrition: { sugar: 10.6, addedSugar: 10.6, sat: 0, sodium: 4, fiber: 0, protein: 0, kcal: 42 },
        additives: [
          { code: 'E150d', name: 'Caramel color IV', note: 'Color · may contain 4-MEI', flag: 'Both' },
          { code: 'E338', name: 'Phosphoric acid', note: 'Acidity regulator', flag: 'Both' },
        ],
        ingredients: 'Carbonated water, high-fructose corn syrup, caramel color, phosphoric acid, natural flavors, caffeine.',
      },
      EU: {
        region: 'EU', score: 28, novaGroup: 4, confidence: 'High',
        components: { nutrition: 20, additives: 58, processing: 12 },
        reasons: [
          { type: 'neg', find: 'High added sugar', ev: '10.6 g / 100ml', tag: 'sugar' },
          { type: 'pos', find: 'Cane/beet sugar (no HFCS)', ev: 'sucrose', tag: 'sugar-type' },
          { type: 'neg', find: 'No nutritional value', ev: '0 g fiber · 0 g protein', tag: 'empty' },
          { type: 'neg', find: 'Caramel color (E150d)', ev: 'contains 4-MEI', tag: 'caramel' },
        ],
        nutrition: { sugar: 10.6, addedSugar: 10.6, sat: 0, sodium: 4, fiber: 0, protein: 0, kcal: 42 },
        additives: [
          { code: 'E150d', name: 'Caramel color IV', note: 'Color · may contain 4-MEI', flag: 'Both' },
          { code: 'E338', name: 'Phosphoric acid', note: 'Acidity regulator', flag: 'Both' },
        ],
        ingredients: 'Carbonated water, sugar, caramel color, phosphoric acid, natural flavours, caffeine.',
      },
    },
    alternatives: ['spindrift', 'olipop'],
  },

  '028400090858': {
    gtin: '028400090858', brand: 'Doritos', name: 'Nacho Cheese Tortilla Chips',
    size: '155 g bag', category: 'Salty snacks', emoji: '🔺',
    variants: {
      US: {
        region: 'US', score: 31, novaGroup: 4, confidence: 'Medium',
        components: { nutrition: 26, additives: 40, processing: 14 },
        reasons: [
          { type: 'neg', find: 'Artificial colors: Yellow 5, Yellow 6, Red 40', ev: '3 synthetic dyes', tag: 'dyes' },
          { type: 'neg', find: 'High in sodium', ev: '690 mg / 100g', tag: 'sodium' },
          { type: 'neg', find: 'Ultra-processed (NOVA 4)', ev: '20+ ingredients', tag: 'processing' },
          { type: 'neg', find: 'Contains MSG', ev: 'flavor enhancer', tag: 'msg' },
        ],
        nutrition: { sugar: 1.4, addedSugar: 0, sat: 7.1, sodium: 690, fiber: 3.6, protein: 7.1, kcal: 498 },
        additives: [
          { code: 'Yellow 5', name: 'Tartrazine (E102)', note: 'Synthetic dye', flag: 'US' },
          { code: 'Yellow 6', name: 'Sunset Yellow (E110)', note: 'Synthetic dye', flag: 'US' },
          { code: 'Red 40', name: 'Allura Red (E129)', note: 'Synthetic dye', flag: 'US' },
          { code: 'E621', name: 'MSG', note: 'Flavor enhancer', flag: 'Both' },
        ],
        ingredients: 'Corn, vegetable oil, maltodextrin, salt, cheddar cheese, MSG, Yellow 5, Yellow 6, Red 40, …',
      },
      EU: {
        region: 'EU', score: 36, novaGroup: 4, confidence: 'Medium',
        components: { nutrition: 28, additives: 52, processing: 16 },
        reasons: [
          { type: 'pos', find: 'No synthetic dyes', ev: 'paprika & annatto instead', tag: 'dyes' },
          { type: 'neg', find: 'High in sodium', ev: '640 mg / 100g', tag: 'sodium' },
          { type: 'neg', find: 'Ultra-processed (NOVA 4)', ev: '18 ingredients', tag: 'processing' },
          { type: 'neg', find: 'Contains MSG', ev: 'flavor enhancer', tag: 'msg' },
        ],
        nutrition: { sugar: 2.1, addedSugar: 0, sat: 6.8, sodium: 640, fiber: 3.8, protein: 6.9, kcal: 490 },
        additives: [
          { code: 'E160c', name: 'Paprika extract', note: 'Natural color', flag: 'EU' },
          { code: 'E160b', name: 'Annatto', note: 'Natural color', flag: 'EU' },
          { code: 'E621', name: 'MSG', note: 'Flavor enhancer', flag: 'Both' },
        ],
        ingredients: 'Corn, sunflower oil, cheese powder, salt, paprika extract, annatto, flavour enhancer (E621), …',
      },
    },
    alternatives: ['siete', 'ladonna'],
  },

  '036632008015': {
    gtin: '036632008015', brand: 'Activia', name: 'Strawberry Lowfat Yogurt',
    size: '113 g cup', category: 'Yogurt', emoji: '🍓',
    variants: {
      US: {
        region: 'US', score: 58, novaGroup: 3, confidence: 'High',
        components: { nutrition: 44, additives: 70, processing: 50 },
        reasons: [
          { type: 'pos', find: 'Good source of protein', ev: '5 g / serving', tag: 'protein' },
          { type: 'pos', find: 'Contains live cultures', ev: 'probiotic', tag: 'probiotic' },
          { type: 'neg', find: 'Added sugar', ev: '11 g / serving', tag: 'sugar' },
          { type: 'neg', find: 'Added thickeners', ev: 'modified starch', tag: 'thickener' },
        ],
        nutrition: { sugar: 13.3, addedSugar: 9.7, sat: 0.9, sodium: 53, fiber: 0, protein: 4.4, kcal: 80 },
        additives: [{ code: 'E1442', name: 'Modified starch', note: 'Thickener', flag: 'Both' }],
        ingredients: 'Cultured lowfat milk, strawberries, sugar, modified corn starch, fruit pectin, natural flavor.',
      },
      EU: {
        region: 'EU', score: 63, novaGroup: 3, confidence: 'High',
        components: { nutrition: 52, additives: 74, processing: 56 },
        reasons: [
          { type: 'pos', find: 'Good source of protein', ev: '4.7 g / 100g', tag: 'protein' },
          { type: 'pos', find: 'Contains live cultures', ev: 'probiotic', tag: 'probiotic' },
          { type: 'neg', find: 'Added sugar', ev: '8.5 g / 100g', tag: 'sugar' },
          { type: 'pos', find: 'No added thickeners', ev: 'cleaner recipe', tag: 'thickener' },
        ],
        nutrition: { sugar: 11.8, addedSugar: 7.2, sat: 1.0, sodium: 50, fiber: 0, protein: 4.7, kcal: 83 },
        additives: [],
        ingredients: 'Yogurt (milk), strawberries (9%), sugar, fruit pectin, natural flavouring.',
      },
    },
    alternatives: ['siggis', 'fage'],
  },
}

export const alternatives = {
  onceagain: { brand: 'Once Again', name: 'Hazelnut Butter, Unsweetened', score: 74, note: 'No added sugar · 2 ingredients', emoji: '🌰' },
  nocciolata: { brand: 'Rigoni', name: 'Nocciolata Organic Spread', score: 66, note: 'Organic · no palm oil', emoji: '🍫' },
  spindrift: { brand: 'Spindrift', name: 'Sparkling Water, Raspberry Lime', score: 88, note: 'Real fruit · 2 g sugar', emoji: '💧' },
  olipop: { brand: 'OLIPOP', name: 'Vintage Cola Prebiotic Soda', score: 71, note: '5 g sugar · added fiber', emoji: '🥤' },
  siete: { brand: 'Siete', name: 'Nacho Grain-Free Chips', score: 64, note: 'No synthetic dyes · avocado oil', emoji: '🔺' },
  ladonna: { brand: 'La Donna', name: 'Lightly Salted Tortilla Chips', score: 69, note: '3 ingredients · low sodium', emoji: '🌽' },
  siggis: { brand: "Siggi's", name: 'Strawberry Skyr', score: 79, note: '12 g protein · less sugar', emoji: '🍓' },
  fage: { brand: 'FAGE', name: 'Total 2% with Strawberry', score: 76, note: 'High protein · live cultures', emoji: '🥛' },
}

export const defaultHistory = ['009800895007', '049000028904', '036632008015']
export const unknownBarcode = '040000004271'

export const DATA = { products, alternatives, history: defaultHistory, unknownBarcode }
