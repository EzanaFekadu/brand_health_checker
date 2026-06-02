import { useState, useEffect } from 'react'
import { T } from '../../theme.js'
import { Ico } from '../../components/icons.jsx'
import { Screen, TopBar } from '../../components/primitives.jsx'

export default function LabelParsingScreen({ nav }) {
  const steps = ['Detecting text', 'Reading ingredients', 'Matching additives', 'Estimating nutrition']
  const [done, setDone] = useState(0)

  useEffect(() => {
    if (done < steps.length) {
      const id = setTimeout(() => setDone((d) => d + 1), 520)
      return () => clearTimeout(id)
    }
    const id = setTimeout(() => nav.replace('labelreview'), 420)
    return () => clearTimeout(id)
  }, [done])

  return (
    <Screen pb="calc(env(safe-area-inset-bottom) + 24px)">
      <TopBar title="READING LABEL" />
      <div style={{ padding: '16px 26px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Captured label with sweeping scan line */}
        <div style={{ width: 190, height: 240, borderRadius: 14, background: '#f3efe6', border: '1px solid ' + T.line, padding: 16, position: 'relative', overflow: 'hidden', boxShadow: '0 16px 40px rgba(40,35,20,0.18)' }}>
          <div style={{ height: 11, width: '60%', background: '#cfc8b8', borderRadius: 3, marginBottom: 12 }} />
          {[92, 80, 88, 70, 84, 60, 76, 66, 82].map((w, i) => (
            <div key={i} style={{ height: 6, width: w + '%', background: '#ddd7c7', borderRadius: 3, marginBottom: 9 }} />
          ))}
          <div className="ocr-sweep" style={{ position: 'absolute', left: 0, right: 0, height: 36, background: 'linear-gradient(180deg,rgba(47,125,79,0) 0%,rgba(47,125,79,0.28) 50%,rgba(47,125,79,0) 100%)', borderTop: '2px solid ' + T.green }} />
        </div>

        <div style={{ width: '100%', marginTop: 30 }}>
          {steps.map((s, i) => {
            const complete = i < done
            const active = i === done
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', opacity: complete || active ? 1 : 0.4, transition: 'opacity 0.3s' }}>
                <span style={{ width: 24, height: 24, borderRadius: 99, flex: 'none', background: complete ? T.greenTint : T.cream, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {complete
                    ? Ico.check(T.green, 14)
                    : <span className={active ? 'ocr-pulse' : ''} style={{ width: 8, height: 8, borderRadius: 99, background: active ? T.green : T.line }} />
                  }
                </span>
                <span style={{ fontSize: 14.5, fontWeight: 600, color: complete ? T.ink : T.ink2 }}>{s}</span>
                {complete && <span style={{ marginLeft: 'auto', fontSize: 12, color: T.muted }}>done</span>}
              </div>
            )
          })}
        </div>

        <div style={{ fontSize: 12, color: T.muted, marginTop: 18, textAlign: 'center', lineHeight: 1.5 }}>On-device text recognition. Nothing is uploaded.</div>
      </div>
    </Screen>
  )
}
