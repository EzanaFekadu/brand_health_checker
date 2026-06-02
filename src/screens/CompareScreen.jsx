import { T, bandColor, bandWord, flag } from '../theme.js'
import { Ico } from '../components/icons.jsx'
import { Screen, TopBar, Chip, SectionLabel } from '../components/primitives.jsx'

export default function CompareScreen({ nav, data, gtin }) {
  const p = data.products[gtin]
  const us = p.variants.US
  const eu = p.variants.EU

  const ScoreCol = ({ v }) => (
    <div style={{ flex: 1, background: T.paper, border: '1px solid ' + T.line, borderRadius: 18, padding: '16px 14px', textAlign: 'center' }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: T.ink2 }}>{flag(v.region)} {v.region}</div>
      <div style={{ fontFamily: T.display, fontWeight: 800, fontSize: 60, lineHeight: 0.85, color: bandColor(v.score), margin: '8px 0 2px' }}>{v.score}</div>
      <div style={{ fontSize: 12, fontWeight: 800, color: bandColor(v.score), fontFamily: T.display }}>{bandWord(v.score)}</div>
    </div>
  )

  const metric = (label, a, b, hint) => (
    <div style={{ padding: '13px 0', borderBottom: '1px solid ' + T.line }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ flex: 1, textAlign: 'center', fontSize: 14, fontWeight: 700, color: T.ink, fontVariantNumeric: 'tabular-nums' }}>{a}</span>
        <span style={{ flex: 'none', width: 110, textAlign: 'center', fontSize: 11, color: T.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</span>
        <span style={{ flex: 1, textAlign: 'center', fontSize: 14, fontWeight: 700, color: T.ink, fontVariantNumeric: 'tabular-nums' }}>{b}</span>
      </div>
      {hint && <div style={{ textAlign: 'center', fontSize: 11, color: T.muted, marginTop: 4 }}>{hint}</div>}
    </div>
  )

  const diffs = []
  if (us.nutrition.addedSugar !== eu.nutrition.addedSugar)
    diffs.push(`${us.nutrition.addedSugar > eu.nutrition.addedSugar ? 'US' : 'EU'} has more added sugar (${Math.abs(us.nutrition.addedSugar - eu.nutrition.addedSugar).toFixed(1)} g/100 difference).`)
  const usDyes = us.additives.filter((a) => a.note.toLowerCase().includes('dye')).length
  const euDyes = eu.additives.filter((a) => a.note.toLowerCase().includes('dye')).length
  if (usDyes !== euDyes)
    diffs.push(`${usDyes > euDyes ? 'US' : 'EU'} version uses ${Math.abs(usDyes - euDyes)} synthetic dye(s) the other doesn't.`)
  if (us.additives.length !== eu.additives.length)
    diffs.push(`${us.additives.length > eu.additives.length ? 'US' : 'EU'} lists more flagged additives overall.`)

  return (
    <Screen pb="calc(env(safe-area-inset-bottom) + 24px)">
      <TopBar onBack={() => nav.pop()} title="US vs EU" />
      <div style={{ padding: '0 22px' }}>
        <div style={{ fontSize: 11, letterSpacing: 1, color: T.muted, fontWeight: 700 }}>{p.brand.toUpperCase()}</div>
        <div style={{ fontSize: 21, fontWeight: 600, fontFamily: T.display, marginBottom: 6 }}>{p.name}</div>
        <Chip tone="good">{Ico.check(T.green, 13)} Confirmed same product family</Chip>

        <div style={{ display: 'flex', gap: 12, margin: '16px 0 6px' }}>
          <ScoreCol v={us} />
          <ScoreCol v={eu} />
        </div>

        <div style={{ marginTop: 10 }}>
          {metric('Added sugar', us.nutrition.addedSugar + ' g', eu.nutrition.addedSugar + ' g', 'per 100 g/ml')}
          {metric('Sodium', us.nutrition.sodium + ' mg', eu.nutrition.sodium + ' mg')}
          {metric('Flagged additives', us.additives.length, eu.additives.length)}
          {metric('NOVA group', us.novaGroup, eu.novaGroup, 'processing level')}
        </div>

        <SectionLabel style={{ margin: '22px 0 10px' }}>WHAT'S DIFFERENT</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {diffs.map((d, i) => (
            <div key={i} style={{ display: 'flex', gap: 11, background: T.paper, border: '1px solid ' + T.line, borderRadius: 14, padding: '13px 14px' }}>
              <span style={{ flex: 'none' }}>{Ico.swap(T.ink, 18)}</span>
              <span style={{ fontSize: 13.5, color: T.ink, lineHeight: 1.4 }}>{d}</span>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 11.5, color: T.muted, marginTop: 18, lineHeight: 1.5 }}>
          Regional rules differ — an additive permitted in one market may be restricted in the other. We flag, but never claim "illegal." Sources: brand labels · Open Food Facts.
        </div>
      </div>
    </Screen>
  )
}
