import { T, bandColor, bandDeep, bandWord, gradeLetter, flag } from '../theme.js'
import { Ico } from './icons.jsx'
import { TopBar } from './primitives.jsx'

function ComponentBars({ comp, light }) {
  const items = [['Nutrition', comp.nutrition], ['Additives', comp.additives], ['Processing', comp.processing]]
  return (
    <div style={{ display: 'flex', gap: 9, marginTop: 16 }}>
      {items.map(([lab, v], i) => (
        <div key={i} style={{ flex: 1 }}>
          <div style={{ height: 6, borderRadius: 9, background: light ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.08)', overflow: 'hidden' }}>
            <div style={{ width: v + '%', height: '100%', background: light ? '#fff' : bandColor(v), borderRadius: 9 }} />
          </div>
          <div style={{ fontSize: 10, marginTop: 5, fontWeight: 600, color: light ? 'rgba(255,255,255,0.9)' : T.ink2 }}>{lab}</div>
        </div>
      ))}
    </div>
  )
}

export function ScoreReadout({ score, comp, style = 'verdict', light }) {
  const s = score
  const sub = light ? 'rgba(255,255,255,0.9)' : T.muted
  if (style === 'grade') return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: 92, lineHeight: 0.8, letterSpacing: -3 }}>{s}</span>
      <span style={{
        width: 58, height: 58, borderRadius: 16,
        background: light ? 'rgba(255,255,255,0.2)' : bandColor(s), color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 32, fontWeight: 800, fontFamily: T.display,
        border: light ? '2px solid rgba(255,255,255,0.5)' : 'none',
      }}>{gradeLetter(s)}</span>
    </div>
  )
  if (style === 'scale') return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: 88, lineHeight: 0.8, letterSpacing: -3 }}>{s}</span>
        <span style={{ fontSize: 26, fontWeight: 800, fontFamily: T.display }}>{bandWord(s)}</span>
      </div>
      <div style={{ height: 7, borderRadius: 9, background: light ? 'rgba(255,255,255,0.28)' : T.line, marginTop: 14, position: 'relative' }}>
        <div style={{
          position: 'absolute', left: s + '%', top: -3.5, width: 14, height: 14, borderRadius: 99,
          background: '#fff', border: '3px solid ' + (light ? bandDeep(s) : bandColor(s)), transform: 'translateX(-50%)',
        }} />
      </div>
    </div>
  )
  if (style === 'breakdown') return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: 84, lineHeight: 0.8, letterSpacing: -3 }}>{s}</span>
        <span style={{ fontSize: 24, fontWeight: 800, fontFamily: T.display }}>{bandWord(s)}</span>
      </div>
      {comp && <ComponentBars comp={comp} light={light} />}
    </div>
  )
  // verdict (default — Direction C)
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
      <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: 112, lineHeight: 0.78, letterSpacing: -5 }}>{s}</span>
      <div>
        <div style={{ fontSize: 30, fontWeight: 800, fontFamily: T.display, letterSpacing: 0.5 }}>{bandWord(s)}</div>
        <div style={{ fontSize: 12.5, color: sub }}>{s} of 100</div>
      </div>
    </div>
  )
}

export default function ScoreHero({ product, variant, scoreStyle = 'verdict', onToggleFav, isFav, region, onRegion, onBack }) {
  const v = product.variants[region] || variant
  return (
    <div style={{ background: bandColor(v.score), color: '#fff', paddingBottom: 26 }}>
      <TopBar tone="light" onBack={onBack}
        right={
          <button onClick={onToggleFav} style={{
            width: 40, height: 40, borderRadius: 13, border: 'none',
            background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>{Ico.heart('#fff', 20, isFav ? '#fff' : 'none')}</button>
        } />
      <div style={{ padding: '4px 24px 0' }}>
        <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.16)', borderRadius: 10, padding: 3, marginBottom: 14 }}>
          {['US', 'EU'].map((r) => (
            <button key={r} onClick={() => onRegion(r)} disabled={!product.variants[r]} style={{
              border: 'none', cursor: product.variants[r] ? 'pointer' : 'default',
              borderRadius: 8, padding: '5px 14px', fontSize: 13, fontWeight: 700, fontFamily: T.ui,
              background: region === r ? '#fff' : 'transparent',
              color: region === r ? bandDeep(v.score) : 'rgba(255,255,255,0.85)',
              opacity: product.variants[r] ? 1 : 0.4,
            }}>{flag(r)} {r}</button>
          ))}
        </div>
        <div style={{ fontSize: 12, letterSpacing: 1, fontWeight: 700, opacity: 0.9 }}>{product.brand.toUpperCase()}</div>
        <div style={{ fontSize: 22, fontWeight: 600, fontFamily: T.display, lineHeight: 1.15, marginBottom: 10 }}>{product.name}</div>
        <ScoreReadout score={v.score} comp={v.components} style={scoreStyle} light />
        <div style={{ fontSize: 12.5, opacity: 0.9, marginTop: 12 }}>{product.size} · NOVA {v.novaGroup} · {v.confidence} confidence</div>
      </div>
    </div>
  )
}
