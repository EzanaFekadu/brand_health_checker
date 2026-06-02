import { useState } from 'react'
import { T, flag } from '../theme.js'
import { Ico } from '../components/icons.jsx'
import { Screen, TopBar, Slot, PrimaryButton } from '../components/primitives.jsx'

export default function NotFoundScreen({ nav, gtin }) {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', brand: '', region: 'US' })

  if (submitted) return (
    <Screen pb="calc(env(safe-area-inset-bottom) + 24px)">
      <TopBar onBack={() => nav.tab('scan')} />
      <div style={{ padding: '40px 30px 0', textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: 99, background: T.greenTint, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>{Ico.check(T.green, 36)}</div>
        <div style={{ fontSize: 24, fontWeight: 800, fontFamily: T.display, marginBottom: 8 }}>Thanks — added to the queue</div>
        <div style={{ fontSize: 14, color: T.muted, lineHeight: 1.5, marginBottom: 28 }}>A moderator will verify your submission. We'll score it once there's enough data.</div>
        <PrimaryButton full color={T.ink} onClick={() => nav.tab('scan')}>{Ico.scan('#fff', 18)} Scan another</PrimaryButton>
      </div>
    </Screen>
  )

  const field = (label, key, ph) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: T.ink2, marginBottom: 6 }}>{label}</div>
      <input
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        placeholder={ph}
        style={{ width: '100%', height: 48, borderRadius: 13, border: '1px solid ' + T.line, background: T.paper, padding: '0 14px', fontSize: 15, fontFamily: T.ui, color: T.ink, outline: 'none', boxSizing: 'border-box' }}
      />
    </div>
  )

  return (
    <Screen pb="calc(env(safe-area-inset-bottom) + 24px)">
      <TopBar onBack={() => nav.pop()} title="NOT FOUND" />
      <div style={{ padding: '4px 22px 0' }}>

        {/* Primary CTA — instant score via label scan */}
        <div style={{ background: T.ink, borderRadius: 20, padding: '20px', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {Ico.scan('#fff', 24)}
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, fontFamily: T.display, color: '#fff', lineHeight: 1.1, marginBottom: 4 }}>Get a score right now</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.4 }}>Scan the nutrition label — no database needed.</div>
            </div>
          </div>
          <button
            onClick={() => nav.push('labelscan')}
            style={{
              border: 'none', cursor: 'pointer', borderRadius: 13,
              background: '#fff', color: T.ink,
              padding: '13px 0', width: '100%',
              fontSize: 15, fontWeight: 700, fontFamily: T.ui,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            {Ico.scan(T.ink, 18)} Scan nutrition label
          </button>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: T.line }} />
          <div style={{ fontSize: 12, fontWeight: 600, color: T.muted }}>or submit for review</div>
          <div style={{ flex: 1, height: 1, background: T.line }} />
        </div>

        <div style={{ width: 48, height: 48, borderRadius: 14, background: T.amberTint, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>{Ico.alert(T.amber, 24)}</div>
        <div style={{ fontSize: 22, fontWeight: 800, fontFamily: T.display, letterSpacing: -0.5, lineHeight: 1.05, marginBottom: 6 }}>Not in any database yet</div>
        <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.5, marginBottom: 18 }}>
          Barcode <b style={{ color: T.ink, fontVariantNumeric: 'tabular-nums' }}>{gtin}</b> isn't in Open Food Facts, USDA, or Nutritionix. Add the basics and we'll take it from here.
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 18 }}>
          <Slot w={64} h={64} r={14} label="add photo" />
          <div style={{ fontSize: 12.5, color: T.muted, lineHeight: 1.4 }}>A label photo speeds up verification (optional).</div>
        </div>

        {field('Product name', 'name', 'e.g. Almond Granola')}
        {field('Brand', 'brand', 'e.g. Nature Valley')}

        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.ink2, marginBottom: 6 }}>Region</div>
          <div style={{ display: 'inline-flex', background: T.cream, borderRadius: 11, padding: 3 }}>
            {['US', 'EU'].map((r) => (
              <button key={r} onClick={() => setForm({ ...form, region: r })} style={{ border: 'none', cursor: 'pointer', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 700, fontFamily: T.ui, background: form.region === r ? T.paper : 'transparent', color: T.ink }}>{flag(r)} {r}</button>
            ))}
          </div>
        </div>

        <PrimaryButton full color={T.ink} onClick={() => setSubmitted(true)}>{Ico.plus('#fff', 18)} Submit for review</PrimaryButton>
        <div style={{ height: 16 }} />
      </div>
    </Screen>
  )
}
