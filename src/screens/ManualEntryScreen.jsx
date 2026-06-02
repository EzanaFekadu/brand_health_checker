import { useState } from 'react'
import { T } from '../theme.js'
import { Ico } from '../components/icons.jsx'
import { Screen, TopBar } from '../components/primitives.jsx'

function padKey(bg, fg) {
  return {
    height: 60, borderRadius: 16, border: '1px solid ' + T.line, background: bg, color: fg,
    fontSize: 24, fontWeight: 700, fontFamily: T.display, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }
}

export default function ManualEntryScreen({ nav, data }) {
  const [code, setCode] = useState('')
  const press = (d) => setCode((c) => (c + d).slice(0, 13))
  const del = () => setCode((c) => c.slice(0, -1))
  const submit = () => {
    if (data.products[code]) nav.replace('result', { gtin: code })
    else nav.replace('notfound', { gtin: code || data.unknownBarcode })
  }
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'del', '0', 'go']

  return (
    <Screen pb="calc(env(safe-area-inset-bottom) + 24px)">
      <TopBar onBack={() => nav.pop()} title="ENTER BARCODE" />
      <div style={{ padding: '12px 26px 0', display: 'flex', flexDirection: 'column', flex: 1, height: 'calc(100% - 80px)' }}>
        <div style={{ fontSize: 13.5, color: T.muted, marginBottom: 14 }}>Type the GTIN / UPC printed under the barcode.</div>
        <div style={{ background: T.paper, border: '1px solid ' + T.line, borderRadius: 16, padding: '22px 18px', textAlign: 'center', fontFamily: T.display, fontWeight: 700, fontSize: 30, letterSpacing: 3, color: code ? T.ink : T.line }}>{code || '000000000000'}</div>
        <div style={{ fontSize: 12, color: T.muted, marginTop: 10, textAlign: 'center' }}>Try <b style={{ color: T.ink }}>009800895007</b> (known) or any number (unknown).</div>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, paddingBottom: 24 }}>
          {keys.map((k) => {
            if (k === 'del') return <button key={k} onClick={del} style={padKey(T.cream, T.ink)}>⌫</button>
            if (k === 'go') return <button key={k} onClick={submit} style={padKey(T.ink, '#fff')}>{Ico.arrow('#fff', 22)}</button>
            return <button key={k} onClick={() => press(k)} style={padKey(T.paper, T.ink)}>{k}</button>
          })}
        </div>
      </div>
    </Screen>
  )
}
