import { useState, useEffect } from 'react'
import { T, bandColor, bandWord } from '../theme.js'
import { Ico } from '../components/icons.jsx'
import { Screen, TopBar, Slot } from '../components/primitives.jsx'
import { fetchAlternatives } from '../api.js'

function AltSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{ background: T.paper, border: '1px solid ' + T.line, borderRadius: 18, padding: 14, display: 'flex', alignItems: 'center', gap: 13 }}>
          <div className="bhc-shimmer" style={{ width: 52, height: 52, borderRadius: 13, background: '#e9e5dc', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div className="bhc-shimmer" style={{ width: '40%', height: 10, borderRadius: 6, background: '#e9e5dc', marginBottom: 8 }} />
            <div className="bhc-shimmer" style={{ width: '70%', height: 14, borderRadius: 6, background: '#e9e5dc' }} />
          </div>
          <div className="bhc-shimmer" style={{ width: 36, height: 36, borderRadius: 10, background: '#e9e5dc' }} />
        </div>
      ))}
    </div>
  )
}

export default function AlternativesScreen({ nav, data, gtin, region }) {
  const [alts, setAlts] = useState(null)
  const p = data.products[gtin]
  const v = p ? (p.variants[region] || Object.values(p.variants)[0]) : null

  useEffect(() => {
    if (!p) return
    fetchAlternatives(p.category, p.categoryTag, gtin).then(setAlts)
  }, [gtin])

  if (!p || !v) return null

  return (
    <Screen pb="calc(env(safe-area-inset-bottom) + 24px)">
      <TopBar onBack={() => nav.pop()} title="HEALTHIER PICKS" />
      <div style={{ padding: '0 22px' }}>
        <div style={{ fontSize: 26, fontWeight: 800, fontFamily: T.display, letterSpacing: -0.5, lineHeight: 1.05, marginBottom: 6 }}>
          Better options in<br /><span style={{ color: T.muted, fontWeight: 600 }}>{p.category.toLowerCase()}</span>
        </div>
        <div style={{ fontSize: 13.5, color: T.muted, marginBottom: 20 }}>
          You scanned <b style={{ color: T.ink }}>{p.brand}</b> · scored <b style={{ color: bandColor(v.score) }}>{v.score}</b>. These rank higher in the same category.
        </div>

        {alts === null ? (
          <AltSkeleton />
        ) : alts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px' }}>
            <div style={{ width: 56, height: 56, borderRadius: 99, background: T.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>{Ico.leaf(T.muted, 26)}</div>
            <div style={{ fontSize: 17, fontWeight: 700, fontFamily: T.display, color: T.ink, marginBottom: 6 }}>No alternatives found</div>
            <div style={{ fontSize: 13.5, color: T.muted, lineHeight: 1.5 }}>We couldn't find comparable products in this category right now.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {alts.map((a, i) => {
              const av = a.variants[region] || Object.values(a.variants)[0]
              const better = av.score > v.score
              return (
                <button key={a.gtin || i} onClick={() => nav.scan(a.gtin)} style={{ display: 'flex', alignItems: 'center', gap: 13, width: '100%', textAlign: 'left', border: '1px solid ' + T.line, borderRadius: 18, padding: 14, cursor: 'pointer', background: T.paper, fontFamily: T.ui }}>
                  <Slot w={52} h={52} r={13} imgSrc={a.image} emoji={a.emoji} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, letterSpacing: 0.5, color: T.muted, fontWeight: 700 }}>{a.brand.toUpperCase()}</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: T.ink, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.name}</div>
                    {better && <div style={{ fontSize: 11.5, color: T.green, fontWeight: 600, marginTop: 3 }}>+{av.score - v.score} pts better</div>}
                  </div>
                  <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    <div style={{ fontFamily: T.display, fontWeight: 800, fontSize: 28, color: bandColor(av.score), lineHeight: 1 }}>{av.score}</div>
                    <div style={{ fontSize: 9, fontWeight: 800, color: bandColor(av.score), letterSpacing: 0.5 }}>{bandWord(av.score)}</div>
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {alts !== null && alts.length > 0 && (
          <div style={{ fontSize: 11.5, color: T.muted, marginTop: 18, lineHeight: 1.5 }}>Ranked by health score within the same category. Not sponsored. Data from Open Food Facts.</div>
        )}
      </div>
    </Screen>
  )
}
