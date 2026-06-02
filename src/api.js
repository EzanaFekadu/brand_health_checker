// api.js — multi-source product lookup with Supabase cache
// Lookup chain: Supabase cache → Open Food Facts → USDA → Nutritionix
import { createClient } from '@supabase/supabase-js'

const SESSION_CACHE = {}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

const NX_APP_ID = import.meta.env.VITE_NUTRITIONIX_APP_ID
const NX_APP_KEY = import.meta.env.VITE_NUTRITIONIX_APP_KEY
const USDA_KEY = import.meta.env.VITE_USDA_API_KEY || 'DEMO_KEY'

// ---- Scoring (shared across all sources) ----
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
  if ((n.fiber ?? 0) >= 5) reasons.push({ type: 'pos', find: 'Good source of fiber', ev: n.fiber + ' g / 100g', tag: 'fiber' })
  if ((n.protein ?? 0) >= 8) reasons.push({ type: 'pos', find: 'Decent protein', ev: n.protein + ' g / 100g', tag: 'protein' })
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

// ---- Supabase persistent cache ----
async function cacheGet(barcode) {
  if (!supabase) return null
  try {
    const { data } = await supabase
      .from('product_cache')
      .select('data')
      .eq('gtin', barcode)
      .single()
    return data?.data ?? null
  } catch { return null }
}

function cacheSet(barcode, product, source) {
  if (!supabase) return
  supabase.from('product_cache').upsert(
    { gtin: barcode, data: product, source, updated_at: new Date().toISOString() },
    { onConflict: 'gtin' }
  ).catch(() => {})
}

function logScan(gtin, found, source) {
  if (!supabase) return
  supabase.from('scan_events').insert({ gtin, found, source }).catch(() => {})
}

// ---- Open Food Facts ----
function mapOffProduct(barcode, p) {
  const nutriments = p.nutriments || {}
  const nutrition = {
    sugar: nutriments['sugars_100g'] ?? nutriments['sugars'] ?? 0,
    addedSugar: nutriments['added-sugars_100g'] ?? nutriments['sugars_100g'] ?? 0,
    sat: nutriments['saturated-fat_100g'] ?? nutriments['saturated-fat'] ?? 0,
    sodium: Math.round((nutriments['sodium_100g'] ?? nutriments['sodium'] ?? 0) * 1000),
    fiber: nutriments['fiber_100g'] ?? nutriments['fiber'] ?? 0,
    protein: nutriments['proteins_100g'] ?? nutriments['proteins'] ?? 0,
    kcal: Math.round(nutriments['energy-kcal_100g'] ?? (nutriments['energy_100g'] ?? 0) / 4.184),
  }
  const additives = (p.additives_tags || []).map((tag) => {
    const code = tag.replace(/^[a-z]{2}:/, '').replace(/^e/, 'E').toUpperCase()
    return { code, name: code, note: 'Additive', flag: 'Both' }
  })
  const ingredients = p.ingredients_text || ''
  const { score, components, reasons } = computeScore(nutrition, additives, ingredients)
  const countries = (p.countries_tags || []).join(',').toLowerCase()
  const region = countries.includes('united-states') || countries.includes('en:us') ? 'US' : 'EU'
  const categoryTags = p.categories_tags || []
  const categoryTag = categoryTags.length > 0 ? categoryTags[categoryTags.length - 1] : null
  const category = categoryTag ? categoryTag.replace(/^[a-z]{2}:/, '').replace(/-/g, ' ') : 'Food'
  const image = p.image_front_thumb_url || p.image_front_url || null

  return {
    gtin: barcode, source: 'off',
    brand: p.brands || 'Unknown brand',
    name: p.product_name || p.product_name_en || 'Unknown product',
    size: p.quantity || '', category, categoryTag, image, emoji: '🏷️', fromApi: true,
    variants: {
      [region]: { region, score, novaGroup: p.nova_group ?? 3, confidence: p.completeness > 0.7 ? 'Medium' : 'Low', components, reasons, nutrition, additives, ingredients }
    },
    alternatives: [],
  }
}

async function fetchFromOff(barcode) {
  try {
    const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) return null
    const json = await res.json()
    if (json.status !== 1 || !json.product) return null
    return mapOffProduct(barcode, json.product)
  } catch (e) {
    console.warn('OFF fetch failed:', e)
    return null
  }
}

// ---- USDA FoodData Central ----
function mapUsdaProduct(barcode, item) {
  const servingG = (item.servingSize && item.servingSizeUnit === 'g') ? item.servingSize : 100
  const scale = 100 / servingG

  const byName = {}
  for (const n of (item.foodNutrients || [])) byName[n.nutrientName] = n.value ?? 0

  const get = (...names) => {
    for (const name of names) if (byName[name] != null) return Math.round(byName[name] * scale * 10) / 10
    return 0
  }

  const energyKcal = byName['Energy'] ?? byName['Energy (Atwater General Factors)'] ?? 0
  const energyKj = byName['Energy (Atwater Specific Factors)'] ?? 0

  const nutrition = {
    sugar: get('Sugars, total including NLEA', 'Total Sugars'),
    addedSugar: get('Sugars, added', 'Sugars, total including NLEA'),
    sat: get('Fatty acids, total saturated'),
    sodium: Math.round((byName['Sodium, Na'] ?? 0) * scale),
    fiber: get('Fiber, total dietary'),
    protein: get('Protein'),
    kcal: Math.round(energyKcal > 0 ? energyKcal * scale : energyKj * scale / 4.184),
  }

  const { score, components, reasons } = computeScore(nutrition, [], item.ingredients || '')

  return {
    gtin: barcode, source: 'usda',
    brand: item.brandOwner || item.brandName || 'Unknown brand',
    name: item.description || 'Unknown product',
    size: '', category: item.foodCategory || 'Food', categoryTag: null,
    image: null, emoji: '🏷️', fromApi: true,
    variants: {
      US: { region: 'US', score, novaGroup: 3, confidence: 'Medium', components, reasons, nutrition, additives: [], ingredients: item.ingredients || '' }
    },
    alternatives: [],
  }
}

async function fetchFromUsda(barcode) {
  try {
    const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(barcode)}&dataType=Branded&pageSize=10&api_key=${USDA_KEY}`
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) return null
    const json = await res.json()
    const foods = json.foods || []
    const norm = (s) => String(s ?? '').replace(/^0+/, '')
    const match = foods.find((f) => norm(f.gtinUpc) === norm(barcode)) || null
    if (!match) return null
    return mapUsdaProduct(barcode, match)
  } catch (e) {
    console.warn('USDA fetch failed:', e)
    return null
  }
}

// ---- Nutritionix ----
function mapNutritionixProduct(barcode, item) {
  const servingG = item.serving_weight_grams || 100
  const scale = 100 / servingG
  const r1 = (v) => Math.round((v || 0) * scale * 10) / 10

  const nutrition = {
    sugar: r1(item.nf_sugars),
    addedSugar: r1(item.nf_added_sugars || item.nf_sugars),
    sat: r1(item.nf_saturated_fat),
    sodium: Math.round((item.nf_sodium || 0) * scale),
    fiber: r1(item.nf_dietary_fiber),
    protein: r1(item.nf_protein),
    kcal: Math.round((item.nf_calories || 0) * scale),
  }

  const { score, components, reasons } = computeScore(nutrition, [], item.nf_ingredient_statement || '')

  return {
    gtin: barcode, source: 'nutritionix',
    brand: item.brand_name || item.nix_brand_name || 'Unknown brand',
    name: item.food_name || item.nix_item_name || 'Unknown product',
    size: '', category: 'Food', categoryTag: null,
    image: item.photo?.thumb || null, emoji: '🏷️', fromApi: true,
    variants: {
      US: { region: 'US', score, novaGroup: 3, confidence: 'Medium', components, reasons, nutrition, additives: [], ingredients: item.nf_ingredient_statement || '' }
    },
    alternatives: [],
  }
}

async function fetchFromNutritionix(barcode) {
  if (!NX_APP_ID || !NX_APP_KEY) return null
  try {
    const res = await fetch(`https://trackapi.nutritionix.com/v2/search/item?upc=${barcode}`, {
      headers: { 'x-app-id': NX_APP_ID, 'x-app-key': NX_APP_KEY },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return null
    const json = await res.json()
    const item = json.foods?.[0]
    if (!item) return null
    return mapNutritionixProduct(barcode, item)
  } catch (e) {
    console.warn('Nutritionix fetch failed:', e)
    return null
  }
}

const OFF_SEARCH_FIELDS = 'code,product_name,brands,nutriments,additives_tags,ingredients_text,image_front_thumb_url,countries_tags,nova_group,completeness,categories_tags'

// ---- Search by product name ----
export async function searchProducts(query) {
  if (!query.trim()) return []
  try {
    const url = `https://world.openfoodfacts.org/api/v2/search?search_terms=${encodeURIComponent(query)}&fields=${OFF_SEARCH_FIELDS}&page_size=15&sort_by=unique_scans_n`
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
    if (!res.ok) return []
    const json = await res.json()
    return (json.products || [])
      .filter((p) => p.code && p.product_name)
      .map((p) => {
        const mapped = mapOffProduct(p.code, p)
        SESSION_CACHE[p.code] = mapped
        return mapped
      })
  } catch (e) {
    console.warn('searchProducts failed:', e)
    return []
  }
}

// ---- Alternatives by category ----
export async function fetchAlternatives(category, categoryTag, excludeGtin) {
  try {
    const filter = categoryTag
      ? `categories_tags=${encodeURIComponent(categoryTag)}`
      : `search_terms=${encodeURIComponent(category)}`
    const url = `https://world.openfoodfacts.org/api/v2/search?${filter}&fields=${OFF_SEARCH_FIELDS}&page_size=20&sort_by=unique_scans_n`
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
    if (!res.ok) return []
    const json = await res.json()
    return (json.products || [])
      .filter((p) => p.code && p.product_name && p.code !== excludeGtin)
      .map((p) => {
        const mapped = mapOffProduct(p.code, p)
        SESSION_CACHE[p.code] = mapped
        return mapped
      })
      .sort((a, b) => {
        const sa = Object.values(a.variants)[0]?.score ?? 0
        const sb = Object.values(b.variants)[0]?.score ?? 0
        return sb - sa
      })
      .slice(0, 6)
  } catch (e) {
    console.warn('fetchAlternatives failed:', e)
    return []
  }
}

// ---- Main entry point ----
export async function fetchProduct(barcode) {
  if (SESSION_CACHE[barcode]) return SESSION_CACHE[barcode]

  // 1. Supabase persistent cache
  const cached = await cacheGet(barcode)
  if (cached) {
    SESSION_CACHE[barcode] = cached
    return cached
  }

  // 2–4. Live sources in priority order
  const product =
    await fetchFromOff(barcode) ||
    await fetchFromUsda(barcode) ||
    await fetchFromNutritionix(barcode)

  if (product) {
    SESSION_CACHE[barcode] = product
    cacheSet(barcode, product, product.source)
    logScan(barcode, true, product.source)
  } else {
    logScan(barcode, false, null)
  }

  return product ?? null
}
