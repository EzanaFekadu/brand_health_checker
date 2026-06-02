import { T, bandColor } from '../theme.js'
import { Ico } from '../components/icons.jsx'
import { Screen, Slot } from '../components/primitives.jsx'

function BigTitle({ children, sub }) {
  return (
    <div style={{ padding: '8px 22px 14px' }}>
      <div style={{ fontSize: 34, fontWeight: 800, fontFamily: T.display, letterSpacing: -1, color: T.ink, lineHeight: 1 }}>{children}</div>
      {sub && <div style={{ fontSize: 13.5, color: T.muted, marginTop: 6 }}>{sub}</div>}
    </div>
  )
}

function EmptyState({ icon, title, body }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 30px' }}>
      <div style={{ width: 64, height: 64, borderRadius: 99, background: T.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>{icon(T.muted, 28)}</div>
      <div style={{ fontSize: 18, fontWeight: 700, fontFamily: T.display, color: T.ink, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13.5, color: T.muted, lineHeight: 1.5 }}>{body}</div>
    </div>
  )
}

function ProductRow({ p, region, onClick }) {
  const v = p.variants[region] || Object.values(p.variants)[0]
  return (
    <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 13, width: '100%', textAlign: 'left', border: 'none', background: T.paper, borderRadius: 16, padding: 12, cursor: 'pointer', fontFamily: T.ui, marginBottom: 10, boxShadow: '0 1px 2px rgba(40,35,20,0.04)' }}>
      <Slot w={48} h={48} r={12} imgSrc={p.image} emoji={p.emoji} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, letterSpacing: 0.5, color: T.muted, fontWeight: 700 }}>{p.brand.toUpperCase()}</div>
        <div style={{ fontSize: 14.5, fontWeight: 600, color: T.ink, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
      </div>
      <span style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 'none' }}>
        <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: 26, color: bandColor(v.score), lineHeight: 1 }}>{v.score}</span>
        {Ico.arrow(T.muted, 18)}
      </span>
    </button>
  )
}

export default function HistoryScreen({ nav, data, history, region }) {
  return (
    <Screen>
      <BigTitle sub={history.length + ' items scanned'}>History</BigTitle>
      <div style={{ padding: '0 16px' }}>
        {history.length === 0
          ? <EmptyState icon={Ico.clock} title="No scans yet" body="Scanned products appear here, even offline." />
          : history.map((g, i) => {
              const p = data.products[g]
              if (!p) return null
              return <ProductRow key={g + i} p={p} region={region} onClick={() => nav.push('result', { gtin: g })} />
            })
        }
        {history.length > 0 && (
          <div style={{ fontSize: 11.5, color: T.muted, textAlign: 'center', marginTop: 8, lineHeight: 1.5 }}>Cached on this device — available without a connection.</div>
        )}
      </div>
    </Screen>
  )
}
