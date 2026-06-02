import { T, bandColor, bandTint, flag } from '../theme.js'
import { Ico } from '../components/icons.jsx'
import { Screen, TopBar, Chip, SectionLabel } from '../components/primitives.jsx'
import { ScoreReadout } from '../components/ScoreHero.jsx'

function NutRow({ label, value, unit, warn }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: '1px solid ' + T.line }}>
      <span style={{ fontSize: 14, color: T.ink, fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 700, color: warn ? T.clay : T.ink, fontVariantNumeric: 'tabular-nums' }}>{value}{unit}</span>
    </div>
  )
}

export default function BreakdownScreen({ nav, data, gtin, region, isAvoided, toggleAvoidLabel }) {
  const p = data.products[gtin]
  const v = p.variants[region] || Object.values(p.variants)[0]
  const n = v.nutrition
  const ingList = v.ingredients.replace(/\.$/, '').split(',').map((s) => s.trim()).filter(Boolean)
  const comps = [
    ['Nutrition quality', v.components.nutrition, 'Sugar, sodium, saturated fat vs fiber & protein, per 100 g/ml.'],
    ['Additives & ingredients', v.components.additives, 'Synthetic colors, sweeteners, preservatives & emulsifiers.'],
    ['Processing level', v.components.processing, 'NOVA-based proxy from ingredient count & industrial markers.'],
  ]

  return (
    <Screen pb="calc(env(safe-area-inset-bottom) + 24px)">
      <TopBar onBack={() => nav.pop()} title="FULL BREAKDOWN" />
      <div style={{ padding: '0 22px' }}>
        <div style={{ fontSize: 11, letterSpacing: 1, color: T.muted, fontWeight: 700 }}>{p.brand.toUpperCase()} · {flag(region)} {region}</div>
        <div style={{ fontSize: 21, fontWeight: 600, fontFamily: T.display, marginBottom: 16 }}>{p.name}</div>

        <div style={{ background: bandTint(v.score), borderRadius: 18, padding: '18px 20px', marginBottom: 22 }}>
          <ScoreReadout score={v.score} comp={v.components} style="breakdown" />
        </div>

        <SectionLabel style={{ marginBottom: 12 }}>HOW THE SCORE IS BUILT</SectionLabel>
        {comps.map(([label, val, desc], i) => (
          <div key={i} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
              <span style={{ fontSize: 14.5, fontWeight: 700, color: T.ink }}>{label}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: bandColor(val), fontVariantNumeric: 'tabular-nums' }}>{val}/100</span>
            </div>
            <div style={{ height: 7, borderRadius: 9, background: T.line, overflow: 'hidden', marginBottom: 6 }}>
              <div style={{ width: val + '%', height: '100%', background: bandColor(val), borderRadius: 9 }} />
            </div>
            <div style={{ fontSize: 12.5, color: T.muted, lineHeight: 1.45 }}>{desc}</div>
          </div>
        ))}

        <SectionLabel style={{ margin: '24px 0 4px' }}>NUTRITION · PER 100{p.size.includes('ml') ? ' ML' : ' G'}</SectionLabel>
        <NutRow label="Calories" value={n.kcal} unit=" kcal" />
        <NutRow label="Sugar" value={n.sugar} unit=" g" warn={n.sugar > 15} />
        <NutRow label="of which added" value={n.addedSugar} unit=" g" warn={n.addedSugar > 10} />
        <NutRow label="Saturated fat" value={n.sat} unit=" g" warn={n.sat > 5} />
        <NutRow label="Sodium" value={n.sodium} unit=" mg" warn={n.sodium > 400} />
        <NutRow label="Fiber" value={n.fiber} unit=" g" />
        <NutRow label="Protein" value={n.protein} unit=" g" />

        <SectionLabel style={{ margin: '24px 0 10px' }}>ADDITIVES DETECTED</SectionLabel>
        {v.additives.length === 0 ? (
          <Chip tone="good">{Ico.check(T.green, 14)} None of concern</Chip>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {v.additives.map((a, i) => {
              const avoided = isAvoided(a.name)
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 11,
                  background: avoided ? T.clayTint : T.paper,
                  border: '1px solid ' + (avoided ? T.clay : T.line),
                  borderRadius: 12, padding: '10px 12px', transition: 'background .15s,border-color .15s',
                }}>
                  <span style={{
                    fontSize: 11, fontWeight: 800, color: T.ink,
                    background: avoided ? 'rgba(207,83,64,0.14)' : T.cream,
                    borderRadius: 7, padding: '4px 7px', fontFamily: T.display, flex: 'none',
                  }}>{a.code}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: avoided ? T.clayDeep : T.ink }}>{a.name}</div>
                    <div style={{ fontSize: 11.5, color: T.muted, display: 'flex', alignItems: 'center', gap: 6 }}>
                      {a.note}
                      <span style={{
                        fontSize: 9.5, fontWeight: 800, letterSpacing: 0.3, borderRadius: 5, padding: '2px 5px',
                        background: a.flag === 'US' ? T.clayTint : a.flag === 'EU' ? T.amberTint : T.cream,
                        color: a.flag === 'US' ? T.clayDeep : a.flag === 'EU' ? T.amberDeep : T.ink2,
                      }}>{a.flag === 'Both' ? 'US + EU' : a.flag + ' ONLY'}</span>
                    </div>
                  </div>
                  <button onClick={() => toggleAvoidLabel(a.name)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', flex: 'none' }}>
                    {avoided ? Ico.check(T.clay, 18) : Ico.plus(T.muted, 18)}
                  </button>
                </div>
              )
            })}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '24px 0 8px' }}>
          <SectionLabel>INGREDIENTS ({region})</SectionLabel>
          <span style={{ fontSize: 11.5, color: T.muted }}>tap to avoid</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {ingList.map((ing, i) => {
            const avoided = isAvoided(ing)
            return (
              <button key={i} onClick={() => toggleAvoidLabel(ing)} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontFamily: T.ui,
                background: avoided ? T.clayTint : T.paper,
                border: '1px solid ' + (avoided ? T.clay : T.line),
                color: avoided ? T.clayDeep : T.ink2,
                borderRadius: 9, padding: '7px 11px', fontSize: 12.5, fontWeight: 600,
                transition: 'background .15s,border-color .15s',
              }}>
                {avoided ? Ico.alert(T.clay, 12) : Ico.plus(T.muted, 13)}
                {ing}
              </button>
            )
          })}
        </div>
        <div style={{ height: 16 }} />
      </div>
    </Screen>
  )
}
