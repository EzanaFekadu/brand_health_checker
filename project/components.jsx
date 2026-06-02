// components.jsx — shared UI for Brand Health Checker prototype
// Theme, custom phone frame, Direction-C score hero, rows, chips, nav, icons.

const T = {
  canvas: '#f7f6f2', paper: '#ffffff', paperWarm: '#fcfbf6',
  ink: '#211f18', ink2: '#54503f', muted: '#8c8674',
  line: '#e7e3da', lineSoft: '#efece4',
  green: '#2f7d4f', greenDeep: '#245f3d', greenTint: '#e7f0ea',
  amber: '#cf9622', amberDeep: '#9a6c12', amberTint: '#f6ecd6',
  clay: '#cf5340', clayDeep: '#9a3527', clayTint: '#f6e2dc',
  cream: '#f4efe2',
  ui: "'Hanken Grotesk', sans-serif",
  display: "'Bricolage Grotesque', sans-serif",
};

const bandColor = (s) => (s >= 70 ? T.green : s >= 45 ? T.amber : T.clay);
const bandDeep = (s) => (s >= 70 ? T.greenDeep : s >= 45 ? T.amberDeep : T.clayDeep);
const bandTint = (s) => (s >= 70 ? T.greenTint : s >= 45 ? T.amberTint : T.clayTint);
const bandWord = (s) => (s >= 80 ? 'GOOD' : s >= 70 ? 'OK' : s >= 45 ? 'FAIR' : 'POOR');
const gradeLetter = (s) => (s >= 80 ? 'A' : s >= 70 ? 'B' : s >= 55 ? 'C' : s >= 40 ? 'D' : 'E');
const flag = (r) => (r === 'US' ? '🇺🇸' : r === 'EU' ? '🇪🇺' : '🏳️');

// ───────────────────────── icons ─────────────────────────
const Ico = {
  scan: (c, s = 24) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" stroke={c} strokeWidth="2" strokeLinecap="round"/><path d="M3 12h18" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>,
  clock: (c, s = 24) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={c} strokeWidth="2"/><path d="M12 7v5l3 2" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  heart: (c, s = 24, fill = 'none') => <svg width={s} height={s} viewBox="0 0 24 24" fill={fill}><path d="M12 20s-7-4.5-7-9.5A3.8 3.8 0 0 1 12 7a3.8 3.8 0 0 1 7 3.5C19 15.5 12 20 12 20z" stroke={c} strokeWidth="2" strokeLinejoin="round"/></svg>,
  user: (c, s = 24) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke={c} strokeWidth="2"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>,
  back: (c, s = 24) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke={c} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  flash: (c, s = 22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" stroke={c} strokeWidth="2" strokeLinejoin="round"/></svg>,
  keyboard: (c, s = 22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><rect x="2" y="6" width="20" height="12" rx="2" stroke={c} strokeWidth="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>,
  plus: (c, s = 22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke={c} strokeWidth="2.2" strokeLinecap="round"/></svg>,
  arrow: (c, s = 20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  check: (c, s = 18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 6" stroke={c} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  x: (c, s = 18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke={c} strokeWidth="2.4" strokeLinecap="round"/></svg>,
  swap: (c, s = 20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M7 4L3 8l4 4M3 8h13M17 20l4-4-4-4M21 16H8" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  leaf: (c, s = 20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M4 20C4 11 11 4 20 4c0 9-7 16-16 16z" stroke={c} strokeWidth="2" strokeLinejoin="round"/><path d="M9 15c3-3 6-4 9-4" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>,
  info: (c, s = 18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={c} strokeWidth="2"/><path d="M12 11v5M12 7.5v.5" stroke={c} strokeWidth="2.2" strokeLinecap="round"/></svg>,
  alert: (c, s = 18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 3l9 16H3l9-16z" stroke={c} strokeWidth="2" strokeLinejoin="round"/><path d="M12 10v4M12 17v.5" stroke={c} strokeWidth="2.2" strokeLinecap="round"/></svg>,
  star: (c, s = 16, fill = 'none') => <svg width={s} height={s} viewBox="0 0 24 24" fill={fill}><path d="M12 3l2.6 5.6 6 .7-4.4 4.1 1.2 6L12 16.9 6.6 19.4l1.2-6L3.4 9.3l6-.7L12 3z" stroke={c} strokeWidth="1.6" strokeLinejoin="round"/></svg>,
};

// striped placeholder
function Slot({ w, h, label, r = 14, emoji, style }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r, flex: 'none',
      background: emoji ? T.cream : 'repeating-linear-gradient(45deg,#efece3 0 9px,#f5f2ea 9px 18px)',
      border: '1px solid ' + T.line, display: 'flex', alignItems: 'center',
      justifyContent: 'center', color: T.muted, fontFamily: 'monospace',
      fontSize: emoji ? Math.round(h * 0.5) : 9, ...style,
    }}>{emoji || label}</div>
  );
}

// ───────────────────────── phone frame ─────────────────────────
function StatusBar({ tone = 'dark' }) {
  const c = tone === 'dark' ? T.ink : '#fff';
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: 50, zIndex: 40,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 30px 0', fontFamily: T.ui, pointerEvents: 'none',
    }}>
      <span style={{ fontSize: 15, fontWeight: 700, color: c }}>9:41</span>
      <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <svg width="17" height="11" viewBox="0 0 17 11"><rect x="0" y="7" width="3" height="4" rx="0.6" fill={c}/><rect x="4.5" y="4.5" width="3" height="6.5" rx="0.6" fill={c}/><rect x="9" y="2" width="3" height="9" rx="0.6" fill={c}/><rect x="13.5" y="0" width="3" height="11" rx="0.6" fill={c}/></svg>
        <svg width="24" height="12" viewBox="0 0 24 12"><rect x="0.5" y="0.5" width="20" height="11" rx="3" stroke={c} strokeOpacity="0.4" fill="none"/><rect x="2" y="2" width="15" height="8" rx="1.6" fill={c}/><path d="M22 4v4c.7-.3 1.2-1 1.2-2S22.7 4.3 22 4z" fill={c} fillOpacity="0.5"/></svg>
      </span>
    </div>
  );
}

function PhoneFrame({ children, statusTone = 'dark', homeTone = 'dark' }) {
  return (
    <div style={{
      width: 390, height: 844, borderRadius: 56, background: '#0c0b09', padding: 12,
      boxShadow: '0 50px 100px rgba(40,35,20,0.28), 0 0 0 1px rgba(0,0,0,0.2)',
      position: 'relative', flex: 'none',
    }}>
      <div style={{
        width: '100%', height: '100%', borderRadius: 44, overflow: 'hidden',
        position: 'relative', background: T.canvas, fontFamily: T.ui,
      }}>
        {/* dynamic island */}
        <div style={{ position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)', width: 116, height: 34, borderRadius: 22, background: '#0c0b09', zIndex: 45 }} />
        <StatusBar tone={statusTone} />
        {children}
        {/* home indicator */}
        <div style={{ position: 'absolute', bottom: 7, left: '50%', transform: 'translateX(-50%)', width: 130, height: 5, borderRadius: 99, background: homeTone === 'dark' ? 'rgba(33,31,24,0.32)' : 'rgba(255,255,255,0.85)', zIndex: 45, pointerEvents: 'none' }} />
      </div>
    </div>
  );
}

// scrollable screen body with safe-area padding
function Screen({ children, bg = T.canvas, pt = 50, pb = 24, style }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, background: bg, overflowY: 'auto', overflowX: 'hidden',
      paddingTop: pt, paddingBottom: pb, WebkitOverflowScrolling: 'touch', ...style,
    }}>{children}</div>
  );
}

// ───────────────────────── top bar ─────────────────────────
function TopBar({ onBack, title, tone = 'dark', right }) {
  const c = tone === 'dark' ? T.ink : '#fff';
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 16px 8px', minHeight: 44 }}>
      {onBack ? (
        <button onClick={onBack} style={{ width: 38, height: 38, borderRadius: 12, border: 'none', background: tone === 'dark' ? T.paper : 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: tone === 'dark' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none' }}>{Ico.back(c, 22)}</button>
      ) : <div style={{ width: 38 }} />}
      {title && <span style={{ fontSize: 12, letterSpacing: 1.5, fontWeight: 700, color: tone === 'dark' ? T.muted : 'rgba(255,255,255,0.85)' }}>{title}</span>}
      <div style={{ minWidth: 38, display: 'flex', justifyContent: 'flex-end' }}>{right}</div>
    </div>
  );
}

// ───────────────────────── score hero (Direction C) ─────────────────────────
function ComponentBars({ comp, color, light }) {
  const items = [['Nutrition', comp.nutrition], ['Additives', comp.additives], ['Processing', comp.processing]];
  return (
    <div style={{ display: 'flex', gap: 9, marginTop: 16 }}>
      {items.map(([lab, v], i) => (
        <div key={i} style={{ flex: 1 }}>
          <div style={{ height: 6, borderRadius: 9, background: light ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.08)', overflow: 'hidden' }}>
            <div style={{ width: v + '%', height: '100%', background: light ? '#fff' : color, borderRadius: 9 }} />
          </div>
          <div style={{ fontSize: 10, marginTop: 5, fontWeight: 600, color: light ? 'rgba(255,255,255,0.9)' : T.ink2 }}>{lab}</div>
        </div>
      ))}
    </div>
  );
}

// the bold colored hero; scoreStyle drives how the number reads
function ScoreHero({ product, variant, scoreStyle = 'verdict', onToggleFav, isFav, region, onRegion, onBack }) {
  const s = variant.score, c = bandColor(s);
  const v = product.variants[region] || variant;
  return (
    <div style={{ background: bandColor(v.score), color: '#fff', padding: '0 0 26px' }}>
      <TopBar tone="light" onBack={onBack}
        right={<button onClick={onToggleFav} style={{ width: 38, height: 38, borderRadius: 12, border: 'none', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>{Ico.heart('#fff', 20, isFav ? '#fff' : 'none')}</button>} />
      <div style={{ padding: '4px 26px 0' }}>
        {/* region switch */}
        <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.16)', borderRadius: 10, padding: 3, marginBottom: 14 }}>
          {['US', 'EU'].map((r) => (
            <button key={r} onClick={() => onRegion(r)} disabled={!product.variants[r]} style={{
              border: 'none', cursor: product.variants[r] ? 'pointer' : 'default', borderRadius: 8, padding: '5px 12px',
              fontSize: 12.5, fontWeight: 700, fontFamily: T.ui,
              background: region === r ? '#fff' : 'transparent',
              color: region === r ? bandDeep(v.score) : 'rgba(255,255,255,0.85)',
              opacity: product.variants[r] ? 1 : 0.4,
            }}>{flag(r)} {r}</button>
          ))}
        </div>
        <div style={{ fontSize: 12, letterSpacing: 1, fontWeight: 700, opacity: 0.9 }}>{product.brand.toUpperCase()}</div>
        <div style={{ fontSize: 23, fontWeight: 600, fontFamily: T.display, lineHeight: 1.1, marginBottom: 10 }}>{product.name}</div>
        <ScoreReadout score={v.score} comp={v.components} style={scoreStyle} light />
        <div style={{ fontSize: 12.5, opacity: 0.9, marginTop: 12 }}>{product.size} · NOVA {v.novaGroup} · {v.confidence} confidence</div>
      </div>
    </div>
  );
}

// the swappable score readout (used in hero + studies)
function ScoreReadout({ score, comp, style = 'verdict', light }) {
  const s = score, c = light ? '#fff' : bandColor(s);
  const sub = light ? 'rgba(255,255,255,0.9)' : T.muted;
  if (style === 'grade') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: 92, lineHeight: 0.8, letterSpacing: -3 }}>{s}</span>
        <span style={{ width: 58, height: 58, borderRadius: 16, background: light ? 'rgba(255,255,255,0.2)' : bandColor(s), color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 800, fontFamily: T.display, border: light ? '2px solid rgba(255,255,255,0.5)' : 'none' }}>{gradeLetter(s)}</span>
      </div>
    );
  }
  if (style === 'scale') {
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: 88, lineHeight: 0.8, letterSpacing: -3 }}>{s}</span>
          <span style={{ fontSize: 26, fontWeight: 800, fontFamily: T.display }}>{bandWord(s)}</span>
        </div>
        <div style={{ height: 7, borderRadius: 9, background: light ? 'rgba(255,255,255,0.28)' : T.line, marginTop: 14, position: 'relative' }}>
          <div style={{ position: 'absolute', left: s + '%', top: -3.5, width: 14, height: 14, borderRadius: 99, background: '#fff', border: '3px solid ' + (light ? bandDeep(s) : bandColor(s)), transform: 'translateX(-50%)' }} />
        </div>
      </div>
    );
  }
  if (style === 'breakdown') {
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: 84, lineHeight: 0.8, letterSpacing: -3 }}>{s}</span>
          <span style={{ fontSize: 24, fontWeight: 800, fontFamily: T.display }}>{bandWord(s)}</span>
        </div>
        {comp && <ComponentBars comp={comp} color={bandColor(s)} light={light} />}
      </div>
    );
  }
  // verdict (default — Direction C)
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
      <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: 112, lineHeight: 0.78, letterSpacing: -5 }}>{s}</span>
      <div>
        <div style={{ fontSize: 30, fontWeight: 800, fontFamily: T.display, letterSpacing: 0.5 }}>{bandWord(s)}</div>
        <div style={{ fontSize: 12.5, color: sub }}>{s} of 100</div>
      </div>
    </div>
  );
}

// ───────────────────────── reason row ─────────────────────────
function ReasonRow({ r, last, flagged }) {
  const pos = r.type === 'pos';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '14px 0', borderBottom: last ? 'none' : '1px solid ' + T.line }}>
      <span style={{ width: 28, height: 28, borderRadius: 9, flex: 'none', background: pos ? T.greenTint : T.clayTint, color: pos ? T.green : T.clay, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, fontFamily: T.display }}>{pos ? '+' : '−'}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: T.ink, lineHeight: 1.25 }}>{r.find}</div>
        <div style={{ fontSize: 12, color: T.muted, marginTop: 1 }}>{r.ev}</div>
      </div>
      {flagged && <span style={{ fontSize: 10, fontWeight: 800, color: T.clay, background: T.clayTint, borderRadius: 6, padding: '3px 7px', letterSpacing: 0.4 }}>YOU AVOID</span>}
    </div>
  );
}

function Chip({ children, tone = 'neutral', onClick }) {
  const map = {
    neutral: [T.cream, T.ink2], good: [T.greenTint, T.greenDeep], bad: [T.clayTint, T.clayDeep], warn: [T.amberTint, T.amberDeep],
  };
  const [bg, col] = map[tone];
  return <span onClick={onClick} style={{ fontSize: 12, fontWeight: 700, padding: '6px 11px', borderRadius: 9, background: bg, color: col, display: 'inline-flex', alignItems: 'center', gap: 6, cursor: onClick ? 'pointer' : 'default' }}>{children}</span>;
}

function SectionLabel({ children, style }) {
  return <div style={{ fontSize: 11, letterSpacing: 1.5, color: T.muted, fontWeight: 700, ...style }}>{children}</div>;
}

function PrimaryButton({ children, onClick, color = T.ink, full }) {
  return <button onClick={onClick} style={{ height: 52, width: full ? '100%' : undefined, borderRadius: 14, border: 'none', background: color, color: '#fff', fontSize: 15, fontWeight: 700, fontFamily: T.ui, cursor: 'pointer', padding: '0 22px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>{children}</button>;
}

function GhostButton({ children, onClick, full }) {
  return <button onClick={onClick} style={{ height: 52, width: full ? '100%' : undefined, borderRadius: 14, border: '1px solid ' + T.line, background: T.paper, color: T.ink, fontSize: 15, fontWeight: 700, fontFamily: T.ui, cursor: 'pointer', padding: '0 20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>{children}</button>;
}

// ───────────────────────── bottom nav ─────────────────────────
function BottomNav({ tab, onTab }) {
  const tabs = [['scan', 'Scan', Ico.scan], ['history', 'History', Ico.clock], ['saved', 'Saved', Ico.heart], ['you', 'You', Ico.user]];
  return (
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 78, background: 'rgba(252,251,246,0.92)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', borderTop: '1px solid ' + T.line, display: 'flex', paddingBottom: 16, zIndex: 30 }}>
      {tabs.map(([id, lab, ico]) => {
        const on = tab === id;
        return (
          <button key={id} onClick={() => onTab(id)} style={{ flex: 1, border: 'none', background: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, paddingTop: 12 }}>
            {ico(on ? T.green : T.muted, 23)}
            <span style={{ fontSize: 10.5, fontWeight: 700, color: on ? T.green : T.muted }}>{lab}</span>
          </button>
        );
      })}
    </div>
  );
}

Object.assign(window, {
  T, bandColor, bandDeep, bandTint, bandWord, gradeLetter, flag, Ico,
  Slot, PhoneFrame, Screen, TopBar, ScoreHero, ScoreReadout, ComponentBars,
  ReasonRow, Chip, SectionLabel, PrimaryButton, GhostButton, BottomNav,
});
