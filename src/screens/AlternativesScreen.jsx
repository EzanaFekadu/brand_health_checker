import { T, bandColor, bandWord } from '../theme.js'
import { Screen, TopBar, Slot } from '../components/primitives.jsx'

export default function AlternativesScreen({ nav, data, gtin, region }) {
  const p = data.products[gtin]
  const v = p.variants[region] || Object.values(p.variants)[0]
  const alts = (p.alternatives || []).map((id) => data.alternatives[id]).filter(Boolean)

  return (
    <Screen pb="calc(env(safe-area-inset-bottom) + 24px)">
      <TopBar onBack={() => nav.pop()} title="HEALTHIER PICKS" />
      <div style={{ padding: '0 22px' }}>
        <div style={{ fontSize: 26, fontWeight: 800, fontFamily: T.display, letterSpacing: -0.5, lineHeight: 1.05, marginBottom: 6 }}>
          Better options in<br />{p.category.toLowerCase()}
        </div>
        <div style={{ fontSize: 13.5, color: T.muted, marginBottom: 18 }}>
          You scanned <b style={{ color: T.ink }}>{p.brand}</b> · scored <b style={{ color: bandColor(v.score) }}>{v.score}</b>. These rank higher in the same category.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {alts.map((a, i) => (
            <div key={i} style={{ background: T.paper, border: '1px solid ' + T.line, borderRadius: 18, padding: 14, display: 'flex', alignItems: 'center', gap: 13 }}>
              <Slot w={52} h={52} r={13} emoji={a.emoji} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, letterSpacing: 0.5, color: T.muted, fontWeight: 700 }}>{a.brand.toUpperCase()}</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: T.ink, lineHeight: 1.2 }}>{a.name}</div>
                <div style={{ fontSize: 12, color: T.green, fontWeight: 600, marginTop: 3 }}>{a.note}</div>
              </div>
              <div style={{ textAlign: 'center', flex: 'none' }}>
                <div style={{ fontFamily: T.display, fontWeight: 800, fontSize: 30, color: bandColor(a.score), lineHeight: 1 }}>{a.score}</div>
                <div style={{ fontSize: 9, fontWeight: 800, color: bandColor(a.score), letterSpacing: 0.5 }}>{bandWord(a.score)}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 11.5, color: T.muted, marginTop: 18, lineHeight: 1.5 }}>Ranked by health score within the same category. Not sponsored.</div>
      </div>
    </Screen>
  )
}
