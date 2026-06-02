// screens-ocr.jsx — OCR / label-scan flow: capture → parsing → review → result
const { T, Ico, Slot, Screen, TopBar, Chip, SectionLabel, PrimaryButton, GhostButton,
  bandColor, bandWord, flag } = window;

// A predetermined "read" used to simulate OCR for the demo.
const OCR_SAMPLE = {
  brand: 'From label', name: 'Maple Almond Granola', size: '300 g pouch', category: 'Cereal & granola', emoji: '🥣',
  ingredients: ['Rolled oats', 'Almonds', 'Maple syrup', 'Sunflower oil', 'Honey', 'Pumpkin seeds', 'Sea salt', 'Cinnamon'],
  nutrition: { kcal: 442, sugar: 19, addedSugar: 14, sat: 2.4, sodium: 120, fiber: 7.2, protein: 9.8 },
  additives: [],
  region: 'US',
};

// score the parsed read (transparent, simple — mirrors the methodology copy)
function scoreFromOcr(p) {
  const n = p.nutrition;
  // nutrition 0–60
  let nut = 45;
  nut -= Math.min(26, Math.max(0, n.addedSugar - 3) * 2.0);
  nut -= Math.min(12, Math.max(0, n.sodium - 120) / 35);
  nut -= Math.min(10, Math.max(0, n.sat - 3) * 2.2);
  nut += Math.min(11, n.fiber * 1.4) + Math.min(8, n.protein * 0.6);
  nut = Math.max(0, Math.min(60, nut));
  // additives 0–25, processing 0–15
  const additives = Math.max(0, 25 - p.additives.length * 6);
  const processing = Math.max(0, 15 - Math.max(0, p.ingredients.length - 5) * 1.6);
  const overall = Math.max(0, Math.min(100, Math.round(nut + additives + processing)));
  const reasons = [];
  if (n.fiber >= 5) reasons.push({ type: 'pos', find: 'Good source of fiber', ev: n.fiber + ' g / 100g', tag: 'fiber' });
  if (n.protein >= 8) reasons.push({ type: 'pos', find: 'Decent protein', ev: n.protein + ' g / 100g', tag: 'protein' });
  if (p.additives.length === 0) reasons.push({ type: 'pos', find: 'No additives detected', ev: 'clean label', tag: 'additives' });
  if (n.addedSugar > 10) reasons.push({ type: 'neg', find: 'High added sugar', ev: n.addedSugar + ' g / 100g', tag: 'sugar' });
  else if (n.addedSugar > 5) reasons.push({ type: 'neg', find: 'Some added sugar', ev: n.addedSugar + ' g / 100g', tag: 'sugar' });
  if (p.ingredients.length > 10) reasons.push({ type: 'neg', find: 'Many ingredients', ev: p.ingredients.length + ' listed', tag: 'processing' });
  return {
    region: p.region, score: overall, novaGroup: 3, confidence: 'Low',
    components: { nutrition: Math.round(nut / 60 * 100), additives: Math.round(additives / 25 * 100), processing: Math.round(processing / 15 * 100) },
    reasons: reasons.slice(0, 4),
    nutrition: n, additives: p.additives,
    ingredients: p.ingredients.join(', ') + '.',
  };
}

// ───────────────────────── 1 · capture ─────────────────────────
function LabelScanScreen({ nav }) {
  const [flash, setFlash] = React.useState(false);
  const capture = () => {
    setFlash(true);
    setTimeout(() => { setFlash(false); nav.push('labelparsing'); }, 220);
  };
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#17150f', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(100deg,#211d14 0 38px,#1b180f 38px 76px)', opacity: 0.55 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 80% at 50% 40%, rgba(0,0,0,0) 28%, rgba(0,0,0,0.6) 100%)' }} />
      <TopBar tone="light" title="SCAN THE LABEL" onBack={() => nav.pop()} />

      {/* document guide framing a faux nutrition panel */}
      <div style={{ position: 'absolute', top: 150, left: 40, right: 40, bottom: 250 }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 16, border: '2px dashed rgba(255,255,255,0.5)' }} />
        <div style={{ position: 'absolute', inset: 18, background: '#f3efe6', borderRadius: 8, padding: '14px 14px', opacity: 0.92, transform: 'rotate(-1.2deg)' }}>
          <div style={{ height: 10, width: '62%', background: '#cfc8b8', borderRadius: 3, marginBottom: 10 }} />
          {[92, 80, 88, 70, 84, 60, 76].map((w, i) => (
            <div key={i} style={{ height: 6, width: w + '%', background: '#ddd7c7', borderRadius: 3, marginBottom: 7 }} />
          ))}
        </div>
      </div>
      <div style={{ position: 'absolute', top: 116, left: 0, right: 0, textAlign: 'center', color: 'rgba(255,255,255,0.85)', fontSize: 13.5, padding: '0 50px', lineHeight: 1.45 }}>
        Fit the <b style={{ color: '#fff' }}>ingredients & nutrition panel</b> inside the frame.
      </div>

      {/* shutter */}
      <div style={{ position: 'absolute', bottom: 120, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 36 }}>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 700, letterSpacing: 0.5, width: 60, textAlign: 'right' }}>DEMO</span>
        <button onClick={capture} style={{ width: 76, height: 76, borderRadius: 99, border: '5px solid rgba(255,255,255,0.85)', background: 'rgba(255,255,255,0.18)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ width: 56, height: 56, borderRadius: 99, background: '#fff' }} />
        </button>
        <span style={{ width: 60 }} />
      </div>
      <div style={{ position: 'absolute', bottom: 70, left: 0, right: 0, textAlign: 'center', color: 'rgba(255,255,255,0.55)', fontSize: 12 }}>Tap to capture · we’ll read the text</div>

      {flash && <div style={{ position: 'absolute', inset: 0, background: '#fff', zIndex: 60 }} />}
    </div>
  );
}

// ───────────────────────── 2 · parsing ─────────────────────────
function LabelParsingScreen({ nav }) {
  const steps = ['Detecting text', 'Reading ingredients', 'Matching additives', 'Estimating nutrition'];
  const [done, setDone] = React.useState(0);
  React.useEffect(() => {
    if (done < steps.length) {
      const id = setTimeout(() => setDone((d) => d + 1), 520);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => nav.replace('labelreview'), 420);
    return () => clearTimeout(id);
  }, [done]);
  return (
    <Screen statusTone="dark">
      <TopBar title="READING LABEL" />
      <div style={{ padding: '20px 26px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* captured label with sweeping scan line */}
        <div style={{ width: 190, height: 240, borderRadius: 14, background: '#f3efe6', border: '1px solid ' + T.line, padding: 16, position: 'relative', overflow: 'hidden', boxShadow: '0 16px 40px rgba(40,35,20,0.18)' }}>
          <div style={{ height: 11, width: '60%', background: '#cfc8b8', borderRadius: 3, marginBottom: 12 }} />
          {[92, 80, 88, 70, 84, 60, 76, 66, 82].map((w, i) => (
            <div key={i} style={{ height: 6, width: w + '%', background: '#ddd7c7', borderRadius: 3, marginBottom: 9 }} />
          ))}
          <div className="ocr-sweep" style={{ position: 'absolute', left: 0, right: 0, height: 36, background: 'linear-gradient(180deg, rgba(47,125,79,0) 0%, rgba(47,125,79,0.28) 50%, rgba(47,125,79,0) 100%)', borderTop: '2px solid ' + T.green }} />
        </div>

        <div style={{ width: '100%', marginTop: 30 }}>
          {steps.map((s, i) => {
            const complete = i < done, active = i === done;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', opacity: complete || active ? 1 : 0.4, transition: 'opacity 0.3s' }}>
                <span style={{ width: 24, height: 24, borderRadius: 99, flex: 'none', background: complete ? T.greenTint : T.cream, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {complete ? Ico.check(T.green, 14) : <span className={active ? 'ocr-pulse' : ''} style={{ width: 8, height: 8, borderRadius: 99, background: active ? T.green : T.line }} />}
                </span>
                <span style={{ fontSize: 14.5, fontWeight: 600, color: complete ? T.ink : T.ink2 }}>{s}</span>
                {complete && <span style={{ marginLeft: 'auto', fontSize: 12, color: T.muted }}>done</span>}
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: 12, color: T.muted, marginTop: 18, textAlign: 'center', lineHeight: 1.5 }}>On-device text recognition. Nothing is uploaded.</div>
      </div>
    </Screen>
  );
}

// ───────────────────────── 3 · review ─────────────────────────
function LabelReviewScreen({ nav, region, commitOcr, isAvoided, toggleAvoidLabel }) {
  const [ings, setIngs] = React.useState(OCR_SAMPLE.ingredients);
  const [name, setName] = React.useState(OCR_SAMPLE.name);
  const removeIng = (i) => setIngs((a) => a.filter((_, idx) => idx !== i));
  const n = OCR_SAMPLE.nutrition;
  const commit = () => {
    const product = { ...OCR_SAMPLE, name, ingredients: ings, region };
    const variant = scoreFromOcr({ ...product });
    const built = {
      gtin: 'ocr-' + Date.now(), brand: OCR_SAMPLE.brand, name, size: OCR_SAMPLE.size,
      category: OCR_SAMPLE.category, emoji: OCR_SAMPLE.emoji, fromLabel: true,
      variants: { [region]: variant }, alternatives: [],
    };
    const gtin = commitOcr(built);
    nav.replace('result', { gtin, fresh: true });
  };
  return (
    <Screen statusTone="dark" pb={28}>
      <TopBar onBack={() => nav.pop()} title="REVIEW & CONFIRM" />
      <div style={{ padding: '6px 22px 0' }}>
        <Chip tone="warn">{Ico.info(T.amberDeep, 14)} Read from a photo — please check</Chip>
        <div style={{ fontSize: 25, fontWeight: 800, fontFamily: T.display, letterSpacing: -0.5, lineHeight: 1.05, margin: '14px 0 4px' }}>What we read</div>
        <div style={{ fontSize: 13.5, color: T.muted, marginBottom: 18, lineHeight: 1.4 }}>Fix anything that looks wrong before we score it.</div>

        <div style={{ fontSize: 12, fontWeight: 700, color: T.ink2, marginBottom: 6 }}>Product name</div>
        <input value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', height: 46, borderRadius: 12, border: '1px solid ' + T.line, background: T.paper, padding: '0 14px', fontSize: 15, fontFamily: T.ui, color: T.ink, outline: 'none', boxSizing: 'border-box', marginBottom: 18 }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <SectionLabel>INGREDIENTS DETECTED ({ings.length})</SectionLabel>
          <span style={{ fontSize: 11.5, color: T.muted }}>tap to avoid · ✕ removes</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {ings.map((ing, i) => {
            const avoided = isAvoided(ing);
            return (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: avoided ? T.clayTint : T.paper, border: '1px solid ' + (avoided ? T.clay : T.line), borderRadius: 10, padding: '7px 9px 7px 12px', fontSize: 13, fontWeight: 600, color: avoided ? T.clayDeep : T.ink, transition: 'background .15s, border-color .15s' }}>
                <button onClick={() => toggleAvoidLabel(ing)} title={avoided ? 'On your avoid list — tap to remove' : 'Add to avoid list'} style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer', fontFamily: T.ui, fontSize: 13, fontWeight: 600, color: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  {avoided && <span style={{ flex: 'none', display: 'inline-flex' }}>{Ico.alert(T.clay, 13)}</span>}
                  {ing}
                </button>
                <button onClick={() => removeIng(i)} aria-label={'Remove ' + ing} style={{ border: 'none', background: avoided ? 'rgba(207,83,64,0.14)' : T.cream, borderRadius: 7, width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flex: 'none' }}>{Ico.x(avoided ? T.clay : T.muted, 12)}</button>
              </span>
            );
          })}
        </div>

        <SectionLabel style={{ marginBottom: 8 }}>NUTRITION ESTIMATE · PER 100 G</SectionLabel>
        <div style={{ background: T.paper, border: '1px solid ' + T.line, borderRadius: 14, padding: '4px 14px', marginBottom: 6 }}>
          {[['Calories', n.kcal + ' kcal'], ['Sugar (added)', n.addedSugar + ' g'], ['Saturated fat', n.sat + ' g'], ['Sodium', n.sodium + ' mg'], ['Fiber', n.fiber + ' g'], ['Protein', n.protein + ' g']].map(([k, v], i, arr) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < arr.length - 1 ? '1px solid ' + T.line : 'none' }}>
              <span style={{ fontSize: 13.5, color: T.ink2 }}>{k}</span>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: T.ink, fontVariantNumeric: 'tabular-nums' }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11.5, color: T.muted, marginBottom: 20, lineHeight: 1.5 }}>Estimated from the panel — scored at <b style={{ color: T.ink }}>Low confidence</b> until a barcode match is found.</div>

        <PrimaryButton full color={T.green} onClick={commit}>{Ico.check('#fff', 18)} Looks right — score it</PrimaryButton>
        <div style={{ height: 18 }} />
      </div>
    </Screen>
  );
}

Object.assign(window, { LabelScanScreen, LabelParsingScreen, LabelReviewScreen });
