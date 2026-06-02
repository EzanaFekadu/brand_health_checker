import { useState } from 'react'
import { T, bandColor, bandWord, gradeLetter, flag } from '../theme.js'
import { Ico } from '../components/icons.jsx'
import { Screen, SectionLabel } from '../components/primitives.jsx'

function BigTitle({ children, sub }) {
  return (
    <div style={{ padding: '8px 22px 14px' }}>
      <div style={{ fontSize: 34, fontWeight: 800, fontFamily: T.display, letterSpacing: -1, color: T.ink, lineHeight: 1 }}>{children}</div>
      {sub && <div style={{ fontSize: 13.5, color: T.muted, marginTop: 6 }}>{sub}</div>}
    </div>
  )
}

function MiniScore({ style, s = 38 }) {
  const c = bandColor(s)
  if (style === 'scale') return (
    <div style={{ width: 70 }}>
      <div style={{ fontFamily: T.display, fontWeight: 800, fontSize: 30, lineHeight: 0.8, color: c }}>{s}</div>
      <div style={{ height: 5, borderRadius: 9, marginTop: 6, background: 'linear-gradient(90deg,' + T.clay + ',' + T.amber + ',' + T.green + ')', position: 'relative' }}>
        <div style={{ position: 'absolute', left: s + '%', top: -2, width: 9, height: 9, borderRadius: 99, background: '#fff', border: '2px solid ' + T.ink, transform: 'translateX(-50%)' }} />
      </div>
    </div>
  )
  if (style === 'grade') return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: 34, lineHeight: 0.8 }}>{s}</span>
      <span style={{ width: 26, height: 26, borderRadius: 8, background: c, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, fontFamily: T.display }}>{gradeLetter(s)}</span>
    </div>
  )
  if (style === 'breakdown') return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
      <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: 34, lineHeight: 0.8, color: c }}>{s}</span>
      <div style={{ display: 'flex', gap: 3 }}>
        {[30, 62, 20].map((v, i) => (
          <div key={i} style={{ width: 6, height: 26, borderRadius: 3, background: T.line, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: v + '%', background: c }} />
          </div>
        ))}
      </div>
    </div>
  )
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
      <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: 38, lineHeight: 0.78 }}>{s}</span>
      <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: 14, color: c }}>{bandWord(s)}</span>
    </div>
  )
}

const SCORE_STYLES = [
  { key: 'verdict', label: 'Verdict', desc: 'Big number + word' },
  { key: 'scale', label: 'Scale', desc: 'Number on a poor→good scale' },
  { key: 'grade', label: 'Letter grade', desc: 'Number with an A–E grade' },
  { key: 'breakdown', label: 'Breakdown', desc: 'Number with component bars' },
]

function AddAvoidRow({ onAdd, existing }) {
  const [open, setOpen] = useState(false)
  const [val, setVal] = useState('')

  const submit = () => {
    const label = val.trim()
    if (!label) return
    if (!existing.some((o) => o.label.toLowerCase() === label.toLowerCase())) onAdd(label)
    setVal('')
    setOpen(false)
  }

  if (!open) return (
    <button onClick={() => setOpen(true)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', marginTop: 10, height: 48, borderRadius: 13, border: '1.5px dashed ' + T.line, background: 'transparent', color: T.green, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: T.ui }}>
      {Ico.plus(T.green, 18)} Add an ingredient
    </button>
  )

  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
      <input
        autoFocus
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') submit() }}
        placeholder="e.g. Carrageenan, Aspartame…"
        style={{ flex: 1, height: 48, borderRadius: 13, border: '1px solid ' + T.line, background: T.paper, padding: '0 14px', fontSize: 14.5, fontFamily: T.ui, color: T.ink, outline: 'none', boxSizing: 'border-box' }}
      />
      <button onClick={submit} style={{ height: 48, padding: '0 18px', borderRadius: 13, border: 'none', background: val.trim() ? T.green : T.line, color: '#fff', fontSize: 14, fontWeight: 700, cursor: val.trim() ? 'pointer' : 'default', fontFamily: T.ui, flex: 'none' }}>Add</button>
    </div>
  )
}

export default function PreferencesScreen({ region, setRegion, avoidList, setAvoidList, avoidOptions, addAvoid, removeAvoid, scoreStyle, setScoreStyle }) {
  const toggle = (key) => setAvoidList(avoidList.includes(key) ? avoidList.filter((k) => k !== key) : [...avoidList, key])

  return (
    <Screen>
      <BigTitle sub="Personalize how products are scored">You</BigTitle>
      <div style={{ padding: '0 22px' }}>
        <SectionLabel style={{ margin: '6px 0 4px' }}>SCORE DISPLAY</SectionLabel>
        <div style={{ fontSize: 12.5, color: T.muted, marginBottom: 12, lineHeight: 1.4 }}>Choose how the health score reads on every result.</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
          {SCORE_STYLES.map((o) => {
            const on = scoreStyle === o.key
            return (
              <button key={o.key} onClick={() => setScoreStyle(o.key)} style={{
                textAlign: 'left', cursor: 'pointer', fontFamily: T.ui,
                border: '1.5px solid ' + (on ? T.green : T.line),
                background: on ? T.greenTint : T.paper, borderRadius: 16, padding: '13px 13px 12px',
                display: 'flex', flexDirection: 'column', gap: 10, position: 'relative',
              }}>
                <span style={{ position: 'absolute', top: 11, right: 11, width: 18, height: 18, borderRadius: 99, border: '1.5px solid ' + (on ? T.green : T.line), background: on ? T.green : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{on && Ico.check('#fff', 12)}</span>
                <span style={{ height: 30, display: 'flex', alignItems: 'center' }}><MiniScore style={o.key} /></span>
                <span>
                  <span style={{ display: 'block', fontSize: 13.5, fontWeight: 700, color: T.ink }}>{o.label}</span>
                  <span style={{ display: 'block', fontSize: 11, color: T.muted, lineHeight: 1.3, marginTop: 1 }}>{o.desc}</span>
                </span>
              </button>
            )
          })}
        </div>

        <SectionLabel style={{ margin: '6px 0 10px' }}>DEFAULT REGION</SectionLabel>
        <div style={{ display: 'flex', background: T.paper, border: '1px solid ' + T.line, borderRadius: 13, padding: 4, marginBottom: 24 }}>
          {['US', 'EU'].map((r) => (
            <button key={r} onClick={() => setRegion(r)} style={{ flex: 1, border: 'none', cursor: 'pointer', borderRadius: 10, padding: '12px 0', fontSize: 14, fontWeight: 700, fontFamily: T.ui, background: region === r ? T.ink : 'transparent', color: region === r ? '#fff' : T.ink2 }}>{flag(r)} {r}</button>
          ))}
        </div>

        <SectionLabel style={{ marginBottom: 4 }}>INGREDIENTS I AVOID</SectionLabel>
        <div style={{ fontSize: 12.5, color: T.muted, marginBottom: 12, lineHeight: 1.4 }}>We'll flag these on every result and warn you up top.</div>
        <div style={{ background: T.paper, border: '1px solid ' + T.line, borderRadius: 16, overflow: 'hidden' }}>
          {avoidOptions.map((o, i) => {
            const on = avoidList.includes(o.key)
            return (
              <div key={o.key} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px 12px 16px', borderBottom: i < avoidOptions.length - 1 ? '1px solid ' + T.line : 'none' }}>
                <button onClick={() => toggle(o.key)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, border: 'none', background: 'none', cursor: 'pointer', padding: 0, fontFamily: T.ui, textAlign: 'left' }}>
                  <span style={{ fontSize: 14.5, color: T.ink, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                    {o.label}
                    {o.custom && <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 0.4, color: T.muted, background: T.cream, borderRadius: 5, padding: '2px 5px' }}>YOURS</span>}
                  </span>
                  <span style={{ width: 46, height: 28, borderRadius: 99, background: on ? T.green : T.line, position: 'relative', transition: 'background 0.18s', flex: 'none' }}>
                    <span style={{ position: 'absolute', top: 3, left: on ? 21 : 3, width: 22, height: 22, borderRadius: 99, background: '#fff', transition: 'left 0.18s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                  </span>
                </button>
                {o.custom && (
                  <button onClick={() => removeAvoid(o.key)} style={{ width: 26, height: 26, borderRadius: 8, border: 'none', background: T.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flex: 'none' }}>
                    {Ico.x(T.muted, 13)}
                  </button>
                )}
              </div>
            )
          })}
        </div>
        <AddAvoidRow onAdd={addAvoid} existing={avoidOptions} />

        <SectionLabel style={{ margin: '24px 0 10px' }}>ABOUT</SectionLabel>
        <div style={{ background: T.paper, border: '1px solid ' + T.line, borderRadius: 16, padding: '14px 16px', fontSize: 13, color: T.ink2, lineHeight: 1.55 }}>
          Scores are informational and <b style={{ color: T.ink }}>not medical advice</b>. Built on Open Food Facts plus brand labels, with confidence shown on every product. History is stored only on this device.
        </div>
        <div style={{ height: 20 }} />
      </div>
    </Screen>
  )
}
