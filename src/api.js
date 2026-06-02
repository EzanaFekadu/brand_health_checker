// api.js — Open Food Facts integration

const SESSION_CACHE = {}

// Score a product using the same formula as scoreFromOcr
function computeScore(nutrition, additives, ingredients) {
  const n = nutrition
  let nut = 45
  nut -= Math.min(26, Math.max(0, (n.addedSugar ?? n.sugar ?? 0) - 3) * 2.0)
  nut -= Math.min(12, Math.max(0, (n.sodium ?? 0) - 120) / 35)
  nut -= Math.min(10, Math.max(0, (n.sat ?? 0) - 3) * 2.2)
  nut += Math.min(11, (n.fiber ?? 0) * 1.4) + Math.min(8, (n.protein ?? 0) * 0.6)
  nut = Math.max(0, Math.min(60, nut))

  const addCount = additives.length
  const ingCount = typeof ingredients === 'string'
    ? ingredients.split(',').length
    : ingredients.length

  const additivesScore = Math.max(0, 25 - addCount * 6)
  const processingScore = Math.max(0, 15 - Math.max(0, ingCount - 5) * 1.6)
  const overall = Math.max(0, Math.min(100, Math.round(nut + additivesScore + processingScore)))

  const reasons = []
  if ((n.fiber ?? 0) >= 5) reasons.push({ type: 'pos', find: 'Good source of fiber', ev: (n.fiber) + ' g / 100g', tag: 'fiber' })
  if ((n.protein ?? 0) >= 8) reasons.push({ type: 'pos', find: 'Decent protein', ev: (n.protein) + ' g / 100g', tag: 'protein' })
  if (addCount === 0) reasons.push({ type: 'pos', find: 'No additives detected', ev: 'clean label', tag: 'additives' })
  const addedSugar = n.addedSugar ?? n.sugar ?? 0
  if (addedSugar > 10) reasons.push({ type: 'neg', find: 'High added sugar', ev: addedSugar + ' g / 100g', tag: 'sugar' })
  else if (addedSugar > 5) reasons.push({ type: 'neg', find: 'Some added sugar', ev: addedSugar + ' g / 100g', tag: 'sugar' })
  if ((n.sodium ?? 0) > 400) reasons.push({ type: 'neg', find: 'High in sodium', ev: n.sodium + ' mg / 100g', tag: 'sodium' })
  if ((n.sat ?? 0) > 5) reasons.push({ type: 'neg', find: 'High in saturated fat', ev: n.sat + ' g / 100g', tag: 'sat-fat' })
  if (addCount > 2) reasons.push({ type: 'neg', find: 'Multiple additives detected', ev: addCount + ' flagged', tag: 'additives' })

  return {
    score: overall,
    components: {
      nutrition: Math.round(nut / 60 * 100),
      additives: Math.round(additivesScore / 25 * 100),
      processing: Math.round(processingScore / 15 * 100),
    },
    reasons: reasons.slice(0, 4),
  }
}

function mapOffProduct(barcode, p) {
  const nutriments = p.nutriments || {}

  const nutrition = {
    sugar: nutriments['sugars_100g'] ?? nutriments['sugars'] ?? 0,
    addedSugar: nutriments['added-sugars_100g'] ?? nutriments['sugars_100g'] ?? 0,
    sat: nutriments['saturated-fat_100g'] ?? nutriments['saturated-fat'] ?? 0,
    sodium: Math.round((nutriments['sodium_100g'] ?? nutriments['sodium'] ?? 0) * 1000), // convert g → mg
    fiber: nutriments['fiber_100g'] ?? nutriments['fiber'] ?? 0,
    protein: nutriments['proteins_100g'] ?? nutriments['proteins'] ?? 0,
    kcal: Math.round(nutriments['energy-kcal_100g'] ?? (nutriments['energy_100g'] ?? 0) / 4.184),
  }

  // Clean E-number codes from additives_tags like "en:e322i" → "E322i"
  const additives = (p.additives_tags || []).map((tag) => {
    const code = tag.replace(/^[a-z]{2}:/, '').replace(/^e/, 'E').toUpperCase()
    return { code, name: code, note: 'Additive', flag: 'Both' }
  })

  const ingredients = p.ingredients_text || ''
  const { score, components, reasons } = computeScore(nutrition, additives, ingredients)

  // Detect region from countries_tags
  const countries = (p.countries_tags || []).join(',').toLowerCase()
  const region = countries.includes('united-states') || countries.includes('en:us') ? 'US' : 'EU'

  const variant = {
    region,
    score,
    novaGroup: p.nova_group ?? 3,
    confidence: p.completeness > 0.7 ? 'Medium' : 'Low',
    components,
    reasons,
    nutrition,
    additives,
    ingredients,
  }

  // Get category
  const categoryTags = p.categories_tags || []
  const category = categoryTags.length > 0
    ? categoryTags[categoryTags.length - 1].replace(/^[a-z]{2}:/, '').replace(/-/g, ' ')
    : 'Food'

  return {
    gtin: barcode,
    brand: p.brands || 'Unknown brand',
    name: p.product_name || p.product_name_en || 'Unknown product',
    size: p.quantity || '',
    category,
    emoji: '🏷️',
    fromApi: true,
    variants: { [region]: variant },
    alternatives: [],
  }
}

export async function fetchProduct(barcode) {
  // Check session cache first
  if (SESSION_CACHE[barcode]) return SESSION_CACHE[barcode]

  try {
    const url = `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) return null

    const json = await res.json()
    if (json.status !== 1 || !json.product) return null

    const mapped = mapOffProduct(barcode, json.product)
    SESSION_CACHE[barcode] = mapped
    return mapped
  } catch (e) {
    console.warn('OFF fetch failed:', e)
    return null
  }
}
