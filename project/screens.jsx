// screens.jsx — style-frame screens for Brand Health Checker
// Warm-natural palette, Bricolage + Hanken type, big-numeral score.
// Exports components to window for the canvas app.

const HC = {
  canvas: '#f7f6f2',
  paper: '#ffffff',
  paperWarm: '#fcfbf6',
  ink: '#211f18',
  ink2: '#54503f',
  muted: '#8c8674',
  line: '#e7e3da',
  green: '#2f7d4f',
  greenDeep: '#245f3d',
  greenTint: '#e7f0ea',
  amber: '#d99a2b',
  amberTint: '#f6ecd6',
  clay: '#cf5340',
  clayTint: '#f6e2dc',
  cream: '#f4efe2',
};

const bandColor = (s) => (s >= 70 ? HC.green : s >= 45 ? HC.amber : HC.clay);
const bandTint = (s) => (s >= 70 ? HC.greenTint : s >= 45 ? HC.amberTint : HC.clayTint);
const bandWord = (s) => (s >= 80 ? 'GOOD' : s >= 70 ? 'OK' : s >= 45 ? 'FAIR' : 'POOR');

// diagonal-striped image placeholder with monospace caption
function Slot({ w, h, label, r = 14, style }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r,
      background: 'repeating-linear-gradient(45deg, #efece3 0 10px, #f5f2ea 10px 20px)',
      border: '1px solid ' + HC.line, display: 'flex', alignItems: 'center',
      justifyContent: 'center', color: HC.muted, fontFamily: 'monospace',
      fontSize: 10, letterSpacing: 0.3, textAlign: 'center', flex: 'none', ...style,
    }}>{label}</div>
  );
}

function PhoneShell({ children, bg = HC.canvas }) {
  return (
    <div style={{
      width: 360, height: 740, background: bg, position: 'relative',
      fontFamily: "'Hanken Grotesk', sans-serif", color: HC.ink,
      overflow: 'hidden', display: 'flex', flexDirection: 'column',
    }}>
      {/* status bar */}
      <div style={{
        height: 44, flex: 'none', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 22px', fontSize: 13,
        fontWeight: 600, color: HC.ink, opacity: 0.85,
      }}>
        <span>9:41</span>
        <span style={{ display: 'flex', gap: 5, alignItems: 'center', fontSize: 11 }}>
          <span>●●●</span><span>WiFi</span><span style={{
            border: '1px solid ' + HC.ink, borderRadius: 3, padding: '0 3px', opacity: 0.7,
          }}>82</span>
        </span>
      </div>
      {children}
    </div>
  );
}

function Dot({ c, s = 8 }) {
  return <span style={{ width: s, height: s, borderRadius: 99, background: c, flex: 'none', display: 'inline-block' }} />;
}

// shared sample product
const PROD = {
  name: 'Hazelnut Cocoa Spread',
  brand: 'Nutella',
  size: '350 g jar',
  score: 38,
  reasons: [
    { t: 'neg', find: 'Very high in sugar', ev: '56.3 g / 100g' },
    { t: 'neg', find: 'Contains palm oil', ev: 'refined oil' },
    { t: 'pos', find: 'No artificial colors', ev: 'verified' },
    { t: 'neg', find: 'Ultra-processed (NOVA 4)', ev: '8 ingredients' },
  ],
};

/* ───────────────────────── Direction A — Editorial Calm ───────────────────────── */
function DirEditorial() {
  const s = PROD.score, c = bandColor(s);
  return (
    <PhoneShell>
      <div style={{ padding: '4px 24px 0', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <span style={{ fontSize: 22, lineHeight: 1 }}>‹</span>
          <span style={{ fontSize: 11, letterSpacing: 1.5, color: HC.muted, fontWeight: 600 }}>SCAN RESULT</span>
          <span style={{ fontSize: 18 }}>♡</span>
        </div>

        <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 26 }}>
          <Slot w={52} h={52} r={10} label="jar" />
          <div>
            <div style={{ fontSize: 11, letterSpacing: 1, color: HC.muted, fontWeight: 700, textTransform: 'uppercase' }}>{PROD.brand}</div>
            <div style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.15, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{PROD.name}</div>
            <div style={{ fontSize: 12, color: HC.muted, marginTop: 2 }}>{PROD.size} · 🇺🇸 US</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
          <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 92, lineHeight: 0.82, color: HC.ink, letterSpacing: -3 }}>{s}</div>
          <div style={{ paddingBottom: 10 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: c, lineHeight: 1, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{bandWord(s)}</div>
            <div style={{ fontSize: 11, color: HC.muted }}>health score · / 100</div>
          </div>
        </div>
        <div style={{ height: 4, borderRadius: 9, background: HC.line, marginTop: 16, marginBottom: 4, position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: s + '%', background: c, borderRadius: 9 }} />
        </div>

        <div style={{ fontSize: 11, letterSpacing: 1.5, color: HC.muted, fontWeight: 700, margin: '26px 0 4px' }}>WHY THIS SCORE</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {PROD.reasons.map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '13px 0', borderBottom: '1px solid ' + HC.line }}>
              <Dot c={r.t === 'pos' ? HC.green : HC.clay} />
              <span style={{ flex: 1, fontSize: 14.5, color: HC.ink, fontWeight: 500 }}>{r.find}</span>
              <span style={{ fontSize: 12, color: HC.muted, fontVariantNumeric: 'tabular-nums' }}>{r.ev}</span>
            </div>
          ))}
        </div>

        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: 10, paddingBottom: 18 }}>
          <button style={{ flex: 1, height: 50, borderRadius: 13, border: 'none', background: HC.ink, color: HC.cream, fontSize: 14.5, fontWeight: 600, fontFamily: 'inherit' }}>Compare US / EU</button>
          <button style={{ width: 50, height: 50, borderRadius: 13, border: '1px solid ' + HC.line, background: HC.paper, fontSize: 20 }}>⤢</button>
        </div>
      </div>
    </PhoneShell>
  );
}

/* ───────────────────────── Direction B — Wholesome Card ───────────────────────── */
function DirWholesome() {
  const s = PROD.score, c = bandColor(s), tint = bandTint(s);
  return (
    <PhoneShell>
      <div style={{ padding: '4px 18px 0', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 22 }}>‹</span>
          <span style={{ fontSize: 18 }}>♡</span>
        </div>

        {/* hero card */}
        <div style={{ background: HC.paper, borderRadius: 22, border: '1px solid ' + HC.line, padding: 16, display: 'flex', gap: 14, alignItems: 'center', marginBottom: 14 }}>
          <Slot w={66} h={66} r={16} label="product" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10.5, letterSpacing: 1, color: HC.muted, fontWeight: 700 }}>{PROD.brand.toUpperCase()}</div>
            <div style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.1, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{PROD.name}</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
              <span style={{ fontSize: 10.5, background: HC.cream, borderRadius: 6, padding: '2px 7px', color: HC.ink2 }}>🇺🇸 US</span>
              <span style={{ fontSize: 10.5, background: HC.cream, borderRadius: 6, padding: '2px 7px', color: HC.ink2 }}>{PROD.size}</span>
            </div>
          </div>
        </div>

        {/* score panel */}
        <div style={{ background: tint, borderRadius: 22, padding: '20px 20px 18px', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 76, lineHeight: 0.8, color: c, letterSpacing: -2 }}>{s}</div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: c, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{bandWord(s)}</div>
              <div style={{ fontSize: 12, color: HC.ink2 }}>Health score / 100</div>
            </div>
          </div>
          {/* component mini-bars */}
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            {[['Nutrition', 30], ['Additives', 62], ['Processing', 20]].map(([lab, v], i) => (
              <div key={i} style={{ flex: 1 }}>
                <div style={{ height: 6, borderRadius: 9, background: 'rgba(0,0,0,0.07)', overflow: 'hidden' }}>
                  <div style={{ width: v + '%', height: '100%', background: c, borderRadius: 9 }} />
                </div>
                <div style={{ fontSize: 9.5, color: HC.ink2, marginTop: 5, fontWeight: 600 }}>{lab}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 11, letterSpacing: 1, color: HC.muted, fontWeight: 700, marginBottom: 9 }}>WHAT WE FOUND</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {PROD.reasons.map((r, i) => (
            <span key={i} style={{
              fontSize: 12.5, fontWeight: 600, padding: '8px 12px', borderRadius: 11,
              background: r.t === 'pos' ? HC.greenTint : HC.clayTint,
              color: r.t === 'pos' ? HC.greenDeep : '#9a3527',
              display: 'flex', alignItems: 'center', gap: 7,
            }}><Dot c={r.t === 'pos' ? HC.green : HC.clay} s={7} />{r.find}</span>
          ))}
        </div>

        <div style={{ flex: 1 }} />
        {/* alternative teaser */}
        <div style={{ background: HC.paper, border: '1px solid ' + HC.line, borderRadius: 18, padding: 12, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <Slot w={42} h={42} r={11} label="alt" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: HC.muted, fontWeight: 700 }}>HEALTHIER PICK · 74</div>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>No-sugar cocoa spread</div>
          </div>
          <span style={{ fontSize: 18, color: HC.green }}>→</span>
        </div>
      </div>
    </PhoneShell>
  );
}

/* ───────────────────────── Direction C — Bold Verdict ───────────────────────── */
function DirBold() {
  const s = PROD.score, c = bandColor(s);
  return (
    <PhoneShell bg={HC.clay}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ padding: '0 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: HC.cream }}>
          <span style={{ fontSize: 22 }}>‹</span>
          <span style={{ fontSize: 11, letterSpacing: 1.5, fontWeight: 600, opacity: 0.85 }}>SCAN RESULT</span>
          <span style={{ fontSize: 18 }}>♡</span>
        </div>

        {/* hero */}
        <div style={{ padding: '10px 26px 26px', color: HC.cream }}>
          <div style={{ fontSize: 12, letterSpacing: 1, fontWeight: 700, opacity: 0.85 }}>{PROD.brand.toUpperCase()} · 🇺🇸 US</div>
          <div style={{ fontSize: 22, fontWeight: 600, fontFamily: "'Bricolage Grotesque', sans-serif", lineHeight: 1.1, marginBottom: 6 }}>{PROD.name}</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
            <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 130, lineHeight: 0.8, letterSpacing: -5 }}>{s}</div>
            <div style={{ fontSize: 34, fontWeight: 800, fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: 1 }}>{bandWord(s)}</div>
          </div>
          <div style={{ fontSize: 13, opacity: 0.9, marginTop: 4 }}>Health score · {s} of 100</div>
        </div>

        {/* sheet */}
        <div style={{ flex: 1, background: HC.canvas, borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: '22px 24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 11, letterSpacing: 1.5, color: HC.muted, fontWeight: 700, marginBottom: 6 }}>TOP DRIVERS</div>
          {PROD.reasons.map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: i < PROD.reasons.length - 1 ? '1px solid ' + HC.line : 'none' }}>
              <span style={{ width: 26, height: 26, borderRadius: 8, background: r.t === 'pos' ? HC.greenTint : HC.clayTint, color: r.t === 'pos' ? HC.green : HC.clay, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, flex: 'none' }}>{r.t === 'pos' ? '+' : '−'}</span>
              <span style={{ flex: 1, fontSize: 15, fontWeight: 600 }}>{r.find}</span>
              <span style={{ fontSize: 12, color: HC.muted }}>{r.ev}</span>
            </div>
          ))}
          <div style={{ flex: 1 }} />
          <button style={{ height: 52, borderRadius: 14, border: 'none', background: HC.green, color: '#fff', fontSize: 15, fontWeight: 700, fontFamily: 'inherit', marginBottom: 16 }}>Compare US / EU variant</button>
        </div>
      </div>
    </PhoneShell>
  );
}

/* ───────────────────────── Score-visualization studies ───────────────────────── */
function StudyCard({ title, children }) {
  return (
    <div style={{ width: 248, background: HC.paper, borderRadius: 18, border: '1px solid ' + HC.line, padding: 18, fontFamily: "'Hanken Grotesk', sans-serif" }}>
      <div style={{ fontSize: 10.5, letterSpacing: 1, color: HC.muted, fontWeight: 700, marginBottom: 16 }}>{title}</div>
      <div style={{ minHeight: 120, display: 'flex', alignItems: 'center' }}>{children}</div>
    </div>
  );
}

function ScoreStudies() {
  const s = 38, c = bandColor(s);
  return (
    <React.Fragment>
      <StudyCard title="1 · NUMERAL + WORD">
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 80, lineHeight: 0.8, letterSpacing: -3 }}>{s}</span>
          <div>
            <div style={{ fontSize: 19, fontWeight: 700, color: c, fontFamily: "'Bricolage Grotesque', sans-serif" }}>FAIR</div>
            <div style={{ fontSize: 11, color: HC.muted }}>/ 100</div>
          </div>
        </div>
      </StudyCard>

      <StudyCard title="2 · NUMERAL + SCALE">
        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 14 }}>
            <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 60, lineHeight: 0.8, color: c }}>{s}</span>
            <span style={{ fontSize: 13, color: HC.muted }}>FAIR</span>
          </div>
          <div style={{ height: 8, borderRadius: 9, background: 'linear-gradient(90deg,' + HC.clay + ',' + HC.amber + ',' + HC.green + ')', position: 'relative' }}>
            <div style={{ position: 'absolute', left: s + '%', top: -3, width: 14, height: 14, borderRadius: 99, background: HC.paper, border: '3px solid ' + HC.ink, transform: 'translateX(-50%)' }} />
          </div>
        </div>
      </StudyCard>

      <StudyCard title="3 · NUMERAL + GRADE">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 72, lineHeight: 0.8 }}>{s}</span>
          <span style={{ width: 50, height: 50, borderRadius: 14, background: c, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, fontFamily: "'Bricolage Grotesque', sans-serif" }}>D</span>
        </div>
      </StudyCard>

      <StudyCard title="4 · COMPONENT BREAKDOWN">
        <div style={{ width: '100%' }}>
          <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 46, lineHeight: 0.8, color: c, marginBottom: 12 }}>{s}<span style={{ fontSize: 16, color: HC.muted }}> / 100</span></div>
          {[['Nutrition', 30], ['Additives', 62], ['Processing', 20]].map(([l, v], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 10, width: 58, color: HC.ink2, fontWeight: 600 }}>{l}</span>
              <div style={{ flex: 1, height: 5, borderRadius: 9, background: HC.line }}>
                <div style={{ width: v + '%', height: '100%', background: c, borderRadius: 9 }} />
              </div>
            </div>
          ))}
        </div>
      </StudyCard>

      <StudyCard title="5 · TINTED BLOCK">
        <div style={{ width: '100%', background: bandTint(s), borderRadius: 14, padding: '16px 18px' }}>
          <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 64, lineHeight: 0.8, color: c }}>{s}</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: c, marginTop: 4 }}>FAIR · / 100</div>
        </div>
      </StudyCard>

      <StudyCard title="6 · VS CATEGORY AVG">
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 64, lineHeight: 0.8 }}>{s}</span>
            <span style={{ fontSize: 13, color: HC.muted }}>FAIR</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 10, background: HC.clayTint, color: '#9a3527', borderRadius: 8, padding: '5px 10px', fontSize: 12, fontWeight: 700 }}>
            ↓ 9 below spreads avg (47)
          </div>
        </div>
      </StudyCard>
    </React.Fragment>
  );
}

/* ───────────────────────── Foundation card ───────────────────────── */
function Foundation() {
  const swatches = [
    ['Canvas', HC.canvas], ['Ink', HC.ink], ['Good', HC.green], ['Fair', HC.amber], ['Poor', HC.clay], ['Cream', HC.cream], ['Hairline', HC.line],
  ];
  return (
    <div style={{ width: 540, background: HC.paper, borderRadius: 20, border: '1px solid ' + HC.line, padding: 26, fontFamily: "'Hanken Grotesk', sans-serif" }}>
      <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 30, letterSpacing: -0.5, marginBottom: 2 }}>Aa Bricolage Grotesque</div>
      <div style={{ fontSize: 14, color: HC.ink2, marginBottom: 18 }}>Hanken Grotesk · plain-language UI, tabular numerals, calm and trustworthy.</div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {swatches.map(([n, col], i) => (
          <div key={i} style={{ width: 64 }}>
            <div style={{ height: 48, borderRadius: 10, background: col, border: '1px solid ' + HC.line }} />
            <div style={{ fontSize: 10.5, color: HC.muted, marginTop: 5, fontWeight: 600 }}>{n}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────── Reasoning note ───────────────────────── */
function ReasoningNote() {
  return (
    <div style={{ width: 540, background: HC.cream, borderRadius: 20, border: '1px solid ' + HC.line, padding: 26, fontFamily: "'Hanken Grotesk', sans-serif", color: HC.ink }}>
      <div style={{ fontSize: 11, letterSpacing: 1.5, color: HC.muted, fontWeight: 700, marginBottom: 10 }}>DESIGN NOTES · READ FIRST</div>
      <div style={{ fontSize: 15, lineHeight: 1.55, color: HC.ink2 }}>
        These are <b style={{ color: HC.ink }}>style frames</b> for the moment that matters most: the scan result. All three use the same warm-natural system and the big-numeral score you picked — they differ in <b style={{ color: HC.ink }}>layout, hierarchy and how much color carries meaning</b>.
        <ul style={{ margin: '12px 0 0', paddingLeft: 18 }}>
          <li style={{ marginBottom: 6 }}><b style={{ color: HC.ink }}>A · Editorial Calm</b> — restrained, mostly monochrome, color only on the score band. Most "clinical-trust".</li>
          <li style={{ marginBottom: 6 }}><b style={{ color: HC.ink }}>B · Wholesome Card</b> — friendlier, tinted panels, component bars + a healthier-pick teaser. Warmest.</li>
          <li style={{ marginBottom: 6 }}><b style={{ color: HC.ink }}>C · Bold Verdict</b> — full-bleed colored hero, the score reads from across the aisle. Most confident.</li>
        </ul>
        <div style={{ marginTop: 12 }}>Sample product scores low on purpose, to show the "poor" state. Pick a direction (or mix — e.g. A's list + B's component bars), then I'll build the clickable flow.</div>
      </div>
    </div>
  );
}

Object.assign(window, { DirEditorial, DirWholesome, DirBold, ScoreStudies, Foundation, ReasoningNote, HC });
