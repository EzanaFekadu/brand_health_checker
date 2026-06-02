import { useState, useEffect } from 'react'
import { T, bandColor, flag } from '../theme.js'
import { Ico } from '../components/icons.jsx'
import { Screen, TopBar, Chip, SectionLabel, PrimaryButton, GhostButton } from '../components/primitives.jsx'
import ScoreHero from '../components/ScoreHero.jsx'
import { fetchProduct } from '../api.js'

function Shimmer({ w, h, r = 8, light, style }) {
  return (
    <div className="bhc-shimmer" style={{
      width: w, height: h, borderRadius: r,
      background: light ? 'rgba(255,255,255,0.28)' : '#e9e5dc', ...style,
    }} />
  )
}

function ResultSkeleton() {
  return (
    <Screen pt={0} pb="calc(env(safe-area-inset-bottom) + 80px)">
      <div style={{ background: '#cfc9bb', color: '#fff', paddingBottom: 26 }}>
        <TopBar tone="light" />
        <div style={{ padding: '4px 24px 0' }}>
          <Shimmer w={92} h={26} r={9} light style={{ marginBottom: 14 }} />
          <Shimmer w={110} h={12} light style={{ marginBottom: 8 }} />
          <Shimmer w={200} h={20} light style={{ marginBottom: 18 }} />
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
            <Shimmer w={120} h={92} r={14} light />
            <Shimmer w={90} h={30} light />
          </div>
          <Shimmer w={220} h={12} light style={{ marginTop: 16 }} />
        </div>
      </div>
      <div style={{ background: T.canvas, borderTopLeftRadius: 26, borderTopRightRadius: 26, marginTop: -20, padding: '26px 22px 0' }}>
        <Shimmer w={90} h={11} style={{ marginBottom: 18 }} />
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '13px 0' }}>
            <Shimmer w={28} h={28} r={9} />
            <div style={{ flex: 1 }}>
              <Shimmer w={i % 2 ? '55%' : '70%'} h={13} style={{ marginBottom: 7 }} />
              <Shimmer w="30%" h={10} />
            </div>
          </div>
        ))}
        <div style={{ textAlign: 'center', marginTop: 22, fontSize: 12.5, color: T.muted, fontWeight: 600 }}>Scoring this product…</div>
      </div>
    </Screen>
  )
}

function ReasonRow({ r, last, flagged }) {
  const pos = r.type === 'pos'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '14px 0', borderBottom: last ? 'none' : '1px solid ' + T.line }}>
      <span style={{
        width: 28, height: 28, borderRadius: 9, flex: 'none',
        background: pos ? T.greenTint : T.clayTint, color: pos ? T.green : T.clay,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, fontFamily: T.display,
      }}>{pos ? '+' : '−'}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: T.ink, lineHeight: 1.25 }}>{r.find}</div>
        <div style={{ fontSize: 12, color: T.muted, marginTop: 1 }}>{r.ev}</div>
      </div>
      {flagged && <span style={{ fontSize: 10, fontWeight: 800, color: T.clay, background: T.clayTint, borderRadius: 6, padding: '3px 7px', letterSpacing: 0.4 }}>YOU AVOID</span>}
    </div>
  )
}

export default function ResultScreen({ nav, data, gtin, region, setRegion, scanStyle, driversStyle = 'rows', fresh, favs, toggleFav, avoidList, avoidOptions, onProductFetched }) {
  const [loading, setLoading] = useState(!!fresh)
  const [apiError, setApiError] = useState(false)

  // If product not in data yet, fetch from OFF API
  useEffect(() => {
    if (data.products[gtin]) {
      // Product available — show skeleton briefly for fresh scans
      if (fresh) {
        const id = setTimeout(() => setLoading(false), 750)
        return () => clearTimeout(id)
      } else {
        setLoading(false)
      }
      return
    }

    // Need to fetch from API
    fetchProduct(gtin).then((product) => {
      if (product && onProductFetched) {
        onProductFetched(product)
        const id = setTimeout(() => setLoading(false), 300)
        return () => clearTimeout(id)
      } else {
        // Not found — navigate to not-found screen
        nav.replace('notfound', { gtin })
      }
    }).catch(() => {
      nav.replace('notfound', { gtin })
    })
  }, [gtin, fresh])

  if (loading || !data.products[gtin]) return <ResultSkeleton />

  const p = data.products[gtin]
  const v = p.variants[region] || p.variants.US || Object.values(p.variants)[0]
  const matched = avoidOptions.filter((o) => avoidList.includes(o.key) && v.reasons.some((r) => r.tag === o.key && r.type === 'neg'))
  const otherRegion = region === 'US' ? 'EU' : 'US'
  const hasOther = !!p.variants[otherRegion]

  return (
    <Screen pt={0} pb="calc(env(safe-area-inset-bottom) + 80px)">
      <ScoreHero product={p} variant={v} region={region} onRegion={setRegion} scoreStyle={scanStyle}
        onBack={() => nav.pop()} isFav={favs.includes(gtin)} onToggleFav={() => toggleFav(gtin)} />

      <div style={{ background: T.canvas, borderTopLeftRadius: 26, borderTopRightRadius: 26, marginTop: -20, padding: '22px 22px 0' }}>
        {matched.length > 0 && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', background: T.clayTint, borderRadius: 14, padding: '12px 14px', marginBottom: 18 }}>
            <span style={{ flex: 'none' }}>{Ico.alert(T.clay, 20)}</span>
            <span style={{ fontSize: 13, color: T.clayDeep, fontWeight: 600, lineHeight: 1.35 }}>
              Contains {matched.map((m) => m.label.toLowerCase()).join(' & ')} — on your avoid list.
            </span>
          </div>
        )}

        <SectionLabel>TOP DRIVERS</SectionLabel>
        {driversStyle === 'chips' ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
            {v.reasons.map((r, i) => (
              <Chip key={i} tone={r.type === 'pos' ? 'good' : 'bad'}>
                <span style={{ fontFamily: T.display, fontWeight: 800 }}>{r.type === 'pos' ? '+' : '−'}</span>{r.find}
              </Chip>
            ))}
          </div>
        ) : (
          <div style={{ marginTop: 4 }}>
            {v.reasons.map((r, i) => (
              <ReasonRow key={i} r={r} last={i === v.reasons.length - 1} flagged={avoidList.includes(r.tag) && r.type === 'neg'} />
            ))}
          </div>
        )}

        <button onClick={() => nav.push('breakdown', { gtin })} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, width: '100%', marginTop: 14, border: 'none', background: 'none', color: T.ink2, fontSize: 13.5, fontWeight: 700, cursor: 'pointer', fontFamily: T.ui, padding: 6 }}>
          {Ico.info(T.ink2, 16)} See full breakdown &amp; methodology
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14, paddingBottom: 22 }}>
          {hasOther ? (
            <PrimaryButton full color={T.ink} onClick={() => nav.push('compare', { gtin })}>
              {Ico.swap('#fff', 18)} Compare {flag(region)} {region} vs {flag(otherRegion)} {otherRegion}
            </PrimaryButton>
          ) : (
            <div style={{ textAlign: 'center', fontSize: 12.5, color: T.muted, padding: '10px 0' }}>No verified regional variant yet.</div>
          )}
          {p.alternatives && p.alternatives.length > 0 && (
            <GhostButton full onClick={() => nav.push('alternatives', { gtin })}>{Ico.leaf(T.green, 18)} See healthier alternatives</GhostButton>
          )}
        </div>

        <div style={{ borderTop: '1px solid ' + T.line, paddingTop: 16, paddingBottom: 26 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <SectionLabel>DATA &amp; SOURCES</SectionLabel>
            <Chip tone={v.confidence === 'High' ? 'good' : 'warn'}>{v.confidence} confidence</Chip>
          </div>
          <div style={{ fontSize: 12.5, color: T.muted, marginTop: 10, lineHeight: 1.5 }}>
            {p.fromLabel
              ? <span>Read from a label photo · estimated values.<br />Informational only — not medical advice.</span>
              : p.fromApi
                ? <span>Open Food Facts · live data · fetched just now.<br />Informational only — not medical advice.</span>
                : <span>Open Food Facts · brand label · last verified Apr 2026.<br />Informational only — not medical advice.</span>}
          </div>
        </div>
      </div>
    </Screen>
  )
}
