// deck-slides.jsx — PPTX-friendly slide layout of the style frames
// Reuses screen components from screens.jsx (DirEditorial, etc.)
const { DirEditorial, DirWholesome, DirBold, ScoreStudies, HC } = window;

function Slide({ children, bg }) {
  return (
    <section className="pslide" style={{ background: bg || HC.canvas }}>{children}</section>
  );
}

function Caption({ tag, title, blurb, points, accent }) {
  return (
    <div style={{ maxWidth: 720, fontFamily: "'Hanken Grotesk', sans-serif" }}>
      <div style={{ fontSize: 22, letterSpacing: 3, color: HC.muted, fontWeight: 700, marginBottom: 18 }}>{tag}</div>
      <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 76, lineHeight: 0.98, letterSpacing: -1.5, color: HC.ink, marginBottom: 22 }}>{title}</div>
      <div style={{ fontSize: 27, lineHeight: 1.5, color: HC.ink2, marginBottom: 30 }}>{blurb}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {points.map((p, i) => (
          <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <span style={{ width: 12, height: 12, borderRadius: 99, background: accent, marginTop: 9, flex: 'none' }} />
            <span style={{ fontSize: 23, lineHeight: 1.4, color: HC.ink }}><b>{p[0]}</b>{p[1]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DirSlide({ phone, cap }) {
  return (
    <Slide>
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', padding: '0 140px', gap: 120 }}>
        <div style={{ flex: 'none', transform: 'scale(1.18)', transformOrigin: 'center' }}>{phone}</div>
        <div style={{ flex: 1 }}>{cap}</div>
      </div>
    </Slide>
  );
}

function TitleSlide() {
  const swatches = [['Canvas', HC.canvas], ['Ink', HC.ink], ['Good', HC.green], ['Fair', HC.amber], ['Poor', HC.clay], ['Cream', HC.cream]];
  return (
    <Slide bg={HC.cream}>
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 140px', fontFamily: "'Hanken Grotesk', sans-serif" }}>
        <div style={{ fontSize: 24, letterSpacing: 4, color: HC.muted, fontWeight: 700, marginBottom: 24 }}>STYLE FRAMES · SCAN RESULT</div>
        <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 128, lineHeight: 0.95, letterSpacing: -3, color: HC.ink, marginBottom: 28 }}>Brand Health<br/>Checker</div>
        <div style={{ fontSize: 30, color: HC.ink2, maxWidth: 1000, lineHeight: 1.45, marginBottom: 60 }}>Three visual directions for the moment that matters most — the scan result — in one warm-natural system with a big-numeral health score.</div>
        <div style={{ display: 'flex', gap: 56, alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 52, color: HC.ink }}>Bricolage Grotesque</div>
            <div style={{ fontSize: 26, color: HC.ink2, marginTop: 4 }}>Hanken Grotesk · plain-language UI</div>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            {swatches.map(([n, c], i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ width: 76, height: 76, borderRadius: 14, background: c, border: '1px solid ' + HC.line }} />
                <div style={{ fontSize: 16, color: HC.muted, marginTop: 8, fontWeight: 600 }}>{n}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Slide>
  );
}

function StudiesSlide() {
  return (
    <Slide>
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 140px', fontFamily: "'Hanken Grotesk', sans-serif" }}>
        <div style={{ fontSize: 22, letterSpacing: 3, color: HC.muted, fontWeight: 700, marginBottom: 14 }}>SCORE VISUALIZATION</div>
        <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 68, letterSpacing: -1.5, color: HC.ink, marginBottom: 44 }}>Six ways to render the number</div>
        <div style={{ width: 812, display: 'flex', flexWrap: 'wrap', gap: 20, transform: 'scale(1.42)', transformOrigin: 'left top' }}><ScoreStudies /></div>
      </div>
    </Slide>
  );
}

function Deck() {
  return (
    <React.Fragment>
      <TitleSlide />
      <DirSlide phone={<DirEditorial />} cap={<Caption tag="DIRECTION A" title="Editorial Calm" accent={HC.green}
        blurb="Restrained and near-monochrome. Color appears only on the score band, so the page reads as a calm, trustworthy reference — closest to a clinical tool."
        points={[['Big tabular numeral', ' anchors the top, word label beside it.'], ['Hairline reason list', ' with evidence values right-aligned.'], ['Quietest use of color', ' — least anxiety-inducing of the three.']]} />} />
      <DirSlide phone={<DirWholesome />} cap={<Caption tag="DIRECTION B" title="Wholesome Card" accent={HC.amber}
        blurb="Friendlier and warmer. Tinted panels carry the score band, component bars break down the rating, and a healthier-pick teaser invites the next step."
        points={[['Tinted score panel', ' with Nutrition / Additives / Processing bars.'], ['Findings as soft chips', ' — green for good, clay for concerns.'], ['Built-in alternative', ' nudge at the bottom of the screen.']]} />} />
      <DirSlide phone={<DirBold />} cap={<Caption tag="DIRECTION C" title="Bold Verdict" accent={HC.clay}
        blurb="A full-bleed colored hero puts the score and verdict front and center — legible from across the aisle — then a clean sheet lists the top drivers."
        points={[['Color-coded hero', ' encodes the verdict at a glance.'], ['Oversized numeral', ' for one-handed, in-store scanning.'], ['Most confident', ' and opinionated of the directions.']]} />} />
      <StudiesSlide />
    </React.Fragment>
  );
}

window.Deck = Deck;
