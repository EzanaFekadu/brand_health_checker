import { T, bandColor, bandDeep, bandWord, gradeLetter } from '../theme.js'
import { Ico } from './icons.jsx'

export function Slot({ w, h, label, r = 14, emoji, imgSrc, style }) {
  if (imgSrc) {
    return (
      <div style={{ width: w, height: h, borderRadius: r, flex: 'none', overflow: 'hidden', background: T.cream, border: '1px solid ' + T.line, ...style }}>
        <img src={imgSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none' }} />
      </div>
    )
  }
  return (
    <div style={{
      width: w, height: h, borderRadius: r, flex: 'none',
      background: emoji ? T.cream : 'repeating-linear-gradient(45deg,#efece3 0 9px,#f5f2ea 9px 18px)',
      border: '1px solid ' + T.line, display: 'flex', alignItems: 'center',
      justifyContent: 'center', color: T.muted, fontFamily: 'monospace',
      fontSize: emoji ? Math.round(h * 0.5) : 9, ...style,
    }}>{emoji || label}</div>
  )
}

export function Screen({ children, bg = T.canvas, pt = 'calc(env(safe-area-inset-top) + 44px)', pb = 'calc(env(safe-area-inset-bottom) + 80px)', style }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, background: bg, overflowY: 'auto', overflowX: 'hidden',
      paddingTop: pt, paddingBottom: pb, WebkitOverflowScrolling: 'touch', ...style,
    }}>{children}</div>
  )
}

export function TopBar({ onBack, title, tone = 'dark', right, safeTop = true }) {
  const c = tone === 'dark' ? T.ink : '#fff'
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: safeTop ? 'calc(env(safe-area-inset-top) + 8px) 16px 8px' : '8px 16px',
      minHeight: safeTop ? 'calc(env(safe-area-inset-top) + 52px)' : 52,
    }}>
      {onBack ? (
        <button onClick={onBack} style={{
          width: 40, height: 40, borderRadius: 13, border: 'none',
          background: tone === 'dark' ? T.paper : 'rgba(255,255,255,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          boxShadow: tone === 'dark' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
        }}>{Ico.back(c, 22)}</button>
      ) : <div style={{ width: 40 }} />}
      {title && <span style={{ fontSize: 12, letterSpacing: 1.5, fontWeight: 700, color: tone === 'dark' ? T.muted : 'rgba(255,255,255,0.85)' }}>{title}</span>}
      <div style={{ minWidth: 40, display: 'flex', justifyContent: 'flex-end' }}>{right}</div>
    </div>
  )
}

export function Chip({ children, tone = 'neutral', onClick }) {
  const map = {
    neutral: [T.cream, T.ink2],
    good: [T.greenTint, T.greenDeep],
    bad: [T.clayTint, T.clayDeep],
    warn: [T.amberTint, T.amberDeep],
  }
  const [bg, col] = map[tone]
  return (
    <span onClick={onClick} style={{
      fontSize: 12, fontWeight: 700, padding: '6px 11px', borderRadius: 9,
      background: bg, color: col, display: 'inline-flex', alignItems: 'center', gap: 6,
      cursor: onClick ? 'pointer' : 'default',
    }}>{children}</span>
  )
}

export function SectionLabel({ children, style }) {
  return <div style={{ fontSize: 11, letterSpacing: 1.5, color: T.muted, fontWeight: 700, ...style }}>{children}</div>
}

export function PrimaryButton({ children, onClick, color = T.ink, full }) {
  return (
    <button onClick={onClick} style={{
      height: 52, width: full ? '100%' : undefined, borderRadius: 14, border: 'none',
      background: color, color: '#fff', fontSize: 15, fontWeight: 700, fontFamily: T.ui,
      cursor: 'pointer', padding: '0 22px',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    }}>{children}</button>
  )
}

export function GhostButton({ children, onClick, full }) {
  return (
    <button onClick={onClick} style={{
      height: 52, width: full ? '100%' : undefined, borderRadius: 14,
      border: '1px solid ' + T.line, background: T.paper, color: T.ink,
      fontSize: 15, fontWeight: 700, fontFamily: T.ui, cursor: 'pointer', padding: '0 20px',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    }}>{children}</button>
  )
}
