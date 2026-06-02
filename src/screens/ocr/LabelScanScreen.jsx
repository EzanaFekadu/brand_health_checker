import { useState } from 'react'
import { TopBar } from '../../components/primitives.jsx'

export default function LabelScanScreen({ nav }) {
  const [flash, setFlash] = useState(false)

  const capture = () => {
    setFlash(true)
    setTimeout(() => { setFlash(false); nav.push('labelparsing') }, 220)
  }

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#17150f', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(100deg,#211d14 0 38px,#1b180f 38px 76px)', opacity: 0.55 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 80% at 50% 40%, rgba(0,0,0,0) 28%, rgba(0,0,0,0.6) 100%)' }} />

      <TopBar tone="light" title="SCAN THE LABEL" onBack={() => nav.pop()} />

      {/* Document guide */}
      <div style={{ position: 'absolute', top: '18%', left: 40, right: 40, bottom: '30%' }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 16, border: '2px dashed rgba(255,255,255,0.5)' }} />
        <div style={{ position: 'absolute', inset: 18, background: '#f3efe6', borderRadius: 8, padding: '14px', opacity: 0.92, transform: 'rotate(-1.2deg)' }}>
          <div style={{ height: 10, width: '62%', background: '#cfc8b8', borderRadius: 3, marginBottom: 10 }} />
          {[92, 80, 88, 70, 84, 60, 76].map((w, i) => (
            <div key={i} style={{ height: 6, width: w + '%', background: '#ddd7c7', borderRadius: 3, marginBottom: 7 }} />
          ))}
        </div>
      </div>

      <div style={{ position: 'absolute', top: '14%', left: 0, right: 0, textAlign: 'center', color: 'rgba(255,255,255,0.85)', fontSize: 13.5, padding: '0 50px', lineHeight: 1.45 }}>
        Fit the <b style={{ color: '#fff' }}>ingredients &amp; nutrition panel</b> inside the frame.
      </div>

      {/* Shutter button */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, paddingBottom: 'calc(env(safe-area-inset-bottom) + 80px)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <button onClick={capture} style={{ width: 76, height: 76, borderRadius: 99, border: '5px solid rgba(255,255,255,0.85)', background: 'rgba(255,255,255,0.18)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ width: 56, height: 56, borderRadius: 99, background: '#fff' }} />
        </button>
        <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12 }}>Tap to capture · we'll read the text</span>
      </div>

      {flash && <div style={{ position: 'absolute', inset: 0, background: '#fff', zIndex: 60 }} />}
    </div>
  )
}
