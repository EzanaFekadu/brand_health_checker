import { useState, useEffect, useRef } from 'react'
import { T, bandColor } from '../theme.js'
import { Ico } from '../components/icons.jsx'
import { TopBar, Slot } from '../components/primitives.jsx'

export default function ScanScreen({ nav, data }) {
  const [scanning, setScanning] = useState(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [cameraError, setCameraError] = useState(null)
  const [torchOn, setTorchOn] = useState(false)
  const videoRef = useRef(null)
  const readerRef = useRef(null)
  const trackRef = useRef(null)

  const demo = ['009800895007', '049000028904', '028400090858', data.unknownBarcode]

  // Initialize ZXing barcode reader
  useEffect(() => {
    let mounted = true
    let codeReader = null

    async function startCamera() {
      try {
        const { BrowserMultiFormatReader } = await import('@zxing/browser')
        codeReader = new BrowserMultiFormatReader()
        readerRef.current = codeReader

        // Get back camera
        const devices = await BrowserMultiFormatReader.listVideoInputDevices()
        const backCamera = devices.find((d) =>
          d.label.toLowerCase().includes('back') ||
          d.label.toLowerCase().includes('rear') ||
          d.label.toLowerCase().includes('environment')
        ) || devices[devices.length - 1]

        const deviceId = backCamera?.deviceId

        if (!mounted || !videoRef.current) return

        await codeReader.decodeFromVideoDevice(
          deviceId,
          videoRef.current,
          (result, err) => {
            if (!mounted) return
            if (result) {
              const text = result.getText()
              setCameraActive(true)
              handleBarcodeScan(text)
            }
          }
        )

        if (mounted) setCameraActive(true)

        // Save track for torch
        const stream = videoRef.current?.srcObject
        if (stream) {
          const tracks = stream.getVideoTracks()
          if (tracks.length > 0) trackRef.current = tracks[0]
        }
      } catch (e) {
        if (!mounted) return
        console.warn('Camera init failed:', e)
        if (e.name === 'NotAllowedError') {
          setCameraError('Camera permission denied. Use the demo shelf below.')
        } else if (e.name === 'NotFoundError') {
          setCameraError('No camera found. Use the demo shelf below.')
        } else {
          setCameraError('Camera unavailable. Use the demo shelf below.')
        }
      }
    }

    startCamera()

    return () => {
      mounted = false
      if (readerRef.current) {
        try { readerRef.current.reset() } catch (e) {}
        readerRef.current = null
      }
      trackRef.current = null
    }
  }, [])

  // Debounce barcode: only process the first scan for 2s
  const lastScanRef = useRef(null)
  const handleBarcodeScan = (barcode) => {
    const now = Date.now()
    if (lastScanRef.current && now - lastScanRef.current < 2000) return
    lastScanRef.current = now
    if (barcode === data.unknownBarcode) {
      nav.push('notfound', { gtin: barcode })
    } else {
      nav.scan(barcode)
    }
  }

  const toggleTorch = async () => {
    if (!trackRef.current) return
    try {
      const newState = !torchOn
      await trackRef.current.applyConstraints({ advanced: [{ torch: newState }] })
      setTorchOn(newState)
    } catch (e) {
      console.warn('Torch not supported:', e)
    }
  }

  const runDemoScan = (gtin) => {
    if (scanning) return
    setScanning(gtin)
    setTimeout(() => {
      setScanning(null)
      if (gtin === data.unknownBarcode) nav.push('notfound', { gtin })
      else nav.scan(gtin)
    }, 1050)
  }

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#17150f', overflow: 'hidden' }}>
      {/* Background pattern */}
      <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(100deg,#211d14 0 38px,#1b180f 38px 76px)', opacity: 0.6 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 80% at 50% 38%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.55) 100%)' }} />

      {/* Live camera video */}
      {!cameraError && (
        <video
          ref={videoRef}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', opacity: cameraActive ? 0.85 : 0,
            transition: 'opacity 0.5s',
          }}
          playsInline
          muted
          autoPlay
        />
      )}

      <TopBar tone="light" title="SCAN A BARCODE"
        right={
          <button onClick={toggleTorch} style={{
            width: 40, height: 40, borderRadius: 13, border: 'none',
            background: torchOn ? 'rgba(255,220,50,0.3)' : 'rgba(255,255,255,0.16)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>{Ico.flash(torchOn ? '#ffd632' : '#fff', 19)}</button>
        } />

      {/* Scanning reticle */}
      <div style={{ position: 'absolute', top: '28%', left: '50%', transform: 'translateX(-50%)', width: 260, height: 168 }}>
        {[['tl', 0, 0], ['tr', 1, 0], ['bl', 0, 1], ['br', 1, 1]].map(([k, x, y]) => (
          <div key={k} style={{
            position: 'absolute',
            [x ? 'right' : 'left']: 0,
            [y ? 'bottom' : 'top']: 0,
            width: 36, height: 36,
            [x ? 'borderRight' : 'borderLeft']: '3px solid #fff',
            [y ? 'borderBottom' : 'borderTop']: '3px solid #fff',
            borderRadius: x ? (y ? '0 0 14px 0' : '0 14px 0 0') : (y ? '0 0 0 14px' : '14px 0 0 0'),
          }} />
        ))}
        <div style={{
          position: 'absolute', left: 14, right: 14,
          top: scanning ? '88%' : '12%', height: 2,
          background: bandColor(80), boxShadow: '0 0 12px ' + bandColor(80),
          borderRadius: 9, transition: 'top 0.9s ease', opacity: 0.95,
        }} />
        {scanning && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700, letterSpacing: 1,
          }}>READING…</div>
        )}
      </div>

      {/* Camera status message */}
      <div style={{
        position: 'absolute', top: '52%', left: 0, right: 0, textAlign: 'center',
        color: 'rgba(255,255,255,0.8)', fontSize: 14, padding: '0 40px', lineHeight: 1.5,
      }}>
        {cameraError
          ? <span style={{ color: 'rgba(255,180,100,0.9)' }}>{cameraError}</span>
          : cameraActive
            ? 'Point at any barcode — results appear in under a second.'
            : 'Starting camera…'
        }
      </div>

      {/* Demo shelf + action buttons */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, paddingBottom: 'calc(env(safe-area-inset-bottom) + 80px)', padding: '0 18px' }}>
        <div style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 80px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 11, letterSpacing: 1.2, fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>DEMO SHELF · TAP TO SCAN</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => nav.push('labelscan')} style={{ display: 'flex', alignItems: 'center', gap: 6, border: 'none', background: 'rgba(255,255,255,0.16)', color: '#fff', borderRadius: 9, padding: '7px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: T.ui }}>
                {Ico.scan('#fff', 15)} Label
              </button>
              <button onClick={() => nav.push('manual')} style={{ display: 'flex', alignItems: 'center', gap: 6, border: 'none', background: 'rgba(255,255,255,0.16)', color: '#fff', borderRadius: 9, padding: '7px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: T.ui }}>
                {Ico.keyboard('#fff', 15)} Code
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
            {demo.map((g) => {
              const p = data.products[g]
              const known = !!p
              return (
                <button key={g} onClick={() => runDemoScan(g)} disabled={!!scanning} style={{ flex: 'none', width: 136, textAlign: 'left', border: 'none', borderRadius: 16, background: T.paper, padding: 12, cursor: 'pointer', opacity: scanning && scanning !== g ? 0.5 : 1, fontFamily: T.ui }}>
                  <Slot w={44} h={44} r={11} emoji={known ? p.emoji : '❔'} />
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: T.ink, marginTop: 8, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{known ? p.brand : 'Unknown item'}</div>
                  <div style={{ fontSize: 10.5, color: T.muted, marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>{g.slice(0, 7)}…</div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
