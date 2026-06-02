import { useState } from 'react'
import { T } from '../../theme.js'
import { Ico } from '../../components/icons.jsx'
import { Screen, TopBar, Chip, SectionLabel, PrimaryButton } from '../../components/primitives.jsx'

const OCR_SAMPLE = {
  brand: 'From label', name: 'Maple Almond Granola', size: '300 g pouch', category: 'Cereal & granola', emoji: '🥣',
  ingredients: ['Rolled oats', 'Almonds', 'Maple syrup', 'Sunflower oil', 'Honey', 'Pumpkin seeds', 'Sea salt', 'Cinnamon'],
  nutrition: { kcal: 442, sugar: 19, addedSugar: 14, sat: 2.4, sodium: 120, fiber: 7.2, protein: 9.8 },
  additives: [],
  region: 'US',
}

function scoreFromOcr(p) {
  const n = p.nutrition
  let nut = 45
  nut -= Math.min(26, Math.max(0, n.addedSugar - 3) * 2.0)
  nut -= Math.min(12, Math.max(0, n.sodium - 120) / 35)
  nut -= Math.min(10, Math.max(0, n.sat - 3) * 2.2)
  nut += Math.min(11, n.fiber * 1.4) + Math.min(8, n.protein * 0.6)
  nut = Math.max(0, Math.min(60, nut))
  const additives = Math.max(0, 25 - p.additives.length * 6)
  const processing = Math.max(0, 15 - Math.max(0, p.ingredients.length - 5) * 1.6)
  const overall = Math.max(0, Math.min(100, Math.round(nut + additives + processing)))
  const reasons = []
  if (n.fiber >= 5) reasons.push({ type: 'pos', find: 'Good source of fiber', ev: n.fiber + ' g / 100g', tag: 'fiber' })
  if (n.protein >= 8) reasons.push({ type: 'pos', find: 'Decent protein', ev: n.protein + ' g / 100g', tag: 'protein' })
  if (p.additives.length === 0) reasons.push({ type: 'pos', find: 'No additives detected', ev: 'clean label', tag: 'additives' })
  if (n.addedSugar > 10) reasons.push({ type: 'neg', find: 'High added sugar', ev: n.addedSugar + ' g / 100g', tag: 'sugar' })
  else if (n.addedSugar > 5) reasons.push({ type: 'neg', find: 'Some added sugar', ev: n.addedSugar + ' g / 100g', tag: 'sugar' })
  if (p.ingredients.length > 10) reasons.push({ type: 'neg', find: 'Many ingredients', ev: p.ingredients.length + ' listed', tag: 'processing' })
  return {
    region: p.region, score: overall, novaGroup: 3, confidence: 'Low',
    components: { nutrition: Math.round(nut / 60 * 100), additives: Math.round(additives / 25 * 100), processing: Math.round(processing / 15 * 100) },
    reasons: reasons.slice(0, 4), nutrition: n, additives: p.additives, ingredients: p.ingredients.join(', ') + '.',
  }
}

export default function LabelReviewScreen({ nav, region, commitOcr, isAvoided, toggleAvoidLabel }) {
  const [ings, setIngs] = useState(OCR_SAMPLE.ingredients)
  const [name, setName] = useState(OCR_SAMPLE.name)
  const removeIng = (i) => setIngs((a) => a.filter((_, idx) => idx !== i))
  const n = OCR_SAMPLE.nutrition

  const commit = () => {
    const product = { ...OCR_SAMPLE, name, ingredients: ings, region }
    const variant = scoreFromOcr({ ...product })
    const built = {
      gtin: 'ocr-' + Date.now(), brand: OCR_SAMPLE.brand, name, size: OCR_SAMPLE.size,
      category: OCR_SAMPLE.category, emoji: OCR_SAMPLE.emoji, fromLabel: true,
      variants: { [region]: variant }, alternatives: [],
    }
    const gtin = commitOcr(built)
    nav.replace('result', { gtin, fresh: true })
  }

  return (
    <Screen pb="calc(env(safe-area-inset-bottom) + 24px)">
      <TopBar onBack={() => nav.pop()} title="REVIEW & CONFIRM" />
      <div style={{ padding: '0 22px' }}>
        <Chip tone="warn">{Ico.info(T.amberDeep, 14)} Read from a photo — please check</Chip>
        <div style={{ fontSize: 25, fontWeight: 800, fontFamily: T.display, letterSpacing: -0.5, lineHeight: 1.05, margin: '14px 0 4px' }}>What we read</div>
        <div style={{ fontSize: 13.5, color: T.muted, marginBottom: 18, lineHeight: 1.4 }}>Fix anything that looks wrong before we score it.</div>

        <div style={{ fontSize: 12, fontWeight: 700, color: T.ink2, marginBottom: 6 }}>Product name</div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: '100%', height: 46, borderRadius: 12, border: '1px solid ' + T.line, background: T.paper, padding: '0 14px', fontSize: 15, fontFamily: T.ui, color: T.ink, outline: 'none', marginBottom: 18, boxSizing: 'border-box' }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <SectionLabel>INGREDIENTS DETECTED ({ings.length})</SectionLabel>
          <span style={{ fontSize: 11.5, color: T.muted }}>tap to avoid · ✕ removes</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {ings.map((ing, i) => {
            const avoided = isAvoided(ing)
            return (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: avoided ? T.clayTint : T.paper, border: '1px solid ' + (avoided ? T.clay : T.line), borderRadius: 10, padding: '7px 9px 7px 12px', fontSize: 13, fontWeight: 600, color: avoided ? T.clayDeep : T.ink, transition: 'background .15s,border-color .15s' }}>
                <button onClick={() => toggleAvoidLabel(ing)} style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer', fontFamily: T.ui, fontSize: 13, fontWeight: 600, color: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  {avoided && <span style={{ flex: 'none', display: 'inline-flex' }}>{Ico.alert(T.clay, 13)}</span>}
                  {ing}
                </button>
                <button onClick={() => removeIng(i)} style={{ border: 'none', background: avoided ? 'rgba(207,83,64,0.14)' : T.cream, borderRadius: 7, width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flex: 'none' }}>
                  {Ico.x(avoided ? T.clay : T.muted, 12)}
                </button>
              </span>
            )
          })}
        </div>

        <SectionLabel style={{ marginBottom: 8 }}>NUTRITION ESTIMATE · PER 100 G</SectionLabel>
        <div style={{ background: T.paper, border: '1px solid ' + T.line, borderRadius: 14, padding: '4px 14px', marginBottom: 6 }}>
          {[['Calories', n.kcal + ' kcal'], ['Sugar (added)', n.addedSugar + ' g'], ['Saturated fat', n.sat + ' g'], ['Sodium', n.sodium + ' mg'], ['Fiber', n.fiber + ' g'], ['Protein', n.protein + ' g']].map(([k, vv], i, arr) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < arr.length - 1 ? '1px solid ' + T.line : 'none' }}>
              <span style={{ fontSize: 13.5, color: T.ink2 }}>{k}</span>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: T.ink, fontVariantNumeric: 'tabular-nums' }}>{vv}</span>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11.5, color: T.muted, marginBottom: 20, lineHeight: 1.5 }}>Estimated from the panel — scored at <b style={{ color: T.ink }}>Low confidence</b> until a barcode match is found.</div>

        <PrimaryButton full color={T.green} onClick={commit}>{Ico.check('#fff', 18)} Looks right — score it</PrimaryButton>
        <div style={{ height: 18 }} />
      </div>
    </Screen>
  )
}
