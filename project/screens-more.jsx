// screens-more.jsx — Compare, Alternatives, ManualEntry, NotFound, History, Saved, Preferences
const { T, Ico, Slot, Screen, TopBar, ScoreReadout, Chip, SectionLabel,
  PrimaryButton, GhostButton, bandColor, bandDeep, bandTint, bandWord, gradeLetter, flag } = window;

function BigTitle({ children, sub }) {
  return (
    <div style={{ padding: '8px 22px 14px' }}>
      <div style={{ fontSize: 34, fontWeight: 800, fontFamily: T.display, letterSpacing: -1, color: T.ink, lineHeight: 1 }}>{children}</div>
      {sub && <div style={{ fontSize: 13.5, color: T.muted, marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

function ProductRow({ p, gtin, region, score, onClick, right }) {
  return (
    <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 13, width: '100%', textAlign: 'left', border: 'none', background: T.paper, borderRadius: 16, padding: 12, cursor: onClick ? 'pointer' : 'default', fontFamily: T.ui, marginBottom: 10, boxShadow: '0 1px 2px rgba(40,35,20,0.04)' }}>
      <Slot w={48} h={48} r={12} emoji={p.emoji} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, letterSpacing: 0.5, color: T.muted, fontWeight: 700 }}>{p.brand.toUpperCase()}</div>
        <div style={{ fontSize: 14.5, fontWeight: 600, color: T.ink, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
      </div>
      {right || (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 'none' }}>
          <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: 26, color: bandColor(score), lineHeight: 1 }}>{score}</span>
          {Ico.arrow(T.muted, 18)}
        </span>
      )}
    </button>
  );
}

// ───────────────────────── Compare US vs EU ─────────────────────────
function CompareScreen({ nav, data, gtin }) {
  const p = data.products[gtin];
  const us = p.variants.US, eu = p.variants.EU;
  const col = (v) => (
    <div style={{ flex: 1, background: T.paper, border: '1px solid ' + T.line, borderRadius: 18, padding: '16px 14px', textAlign: 'center' }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: T.ink2 }}>{flag(v.region)} {v.region}</div>
      <div style={{ fontFamily: T.display, fontWeight: 800, fontSize: 60, lineHeight: 0.85, color: bandColor(v.score), margin: '8px 0 2px' }}>{v.score}</div>
      <div style={{ fontSize: 12, fontWeight: 800, color: bandColor(v.score), fontFamily: T.display }}>{bandWord(v.score)}</div>
    </div>
  );
  const metric = (label, a, b, hint) => (
    <div style={{ padding: '13px 0', borderBottom: '1px solid ' + T.line }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ flex: 1, textAlign: 'center', fontSize: 14, fontWeight: 700, color: T.ink, fontVariantNumeric: 'tabular-nums' }}>{a}</span>
        <span style={{ flex: 'none', width: 110, textAlign: 'center', fontSize: 11, color: T.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</span>
        <span style={{ flex: 1, textAlign: 'center', fontSize: 14, fontWeight: 700, color: T.ink, fontVariantNumeric: 'tabular-nums' }}>{b}</span>
      </div>
      {hint && <div style={{ textAlign: 'center', fontSize: 11, color: T.muted, marginTop: 4 }}>{hint}</div>}
    </div>
  );
  // narrative diffs
  const diffs = [];
  if (us.nutrition.addedSugar !== eu.nutrition.addedSugar) diffs.push(`${us.nutrition.addedSugar > eu.nutrition.addedSugar ? 'US' : 'EU'} has more added sugar (${Math.abs(us.nutrition.addedSugar - eu.nutrition.addedSugar).toFixed(1)} g/100 difference).`);
  const usDyes = us.additives.filter((a) => a.note.toLowerCase().includes('dye')).length;
  const euDyes = eu.additives.filter((a) => a.note.toLowerCase().includes('dye')).length;
  if (usDyes !== euDyes) diffs.push(`${usDyes > euDyes ? 'US' : 'EU'} version uses ${Math.abs(usDyes - euDyes)} synthetic dye(s) the other doesn't.`);
  if (us.additives.length !== eu.additives.length) diffs.push(`${us.additives.length > eu.additives.length ? 'US' : 'EU'} lists more flagged additives overall.`);

  return (
    <Screen statusTone="dark" pb={28}>
      <TopBar onBack={() => nav.pop()} title="US vs EU" />
      <div style={{ padding: '6px 22px 0' }}>
        <div style={{ fontSize: 11, letterSpacing: 1, color: T.muted, fontWeight: 700 }}>{p.brand.toUpperCase()}</div>
        <div style={{ fontSize: 21, fontWeight: 600, fontFamily: T.display, marginBottom: 6 }}>{p.name}</div>
        <Chip tone="good">{Ico.check(T.green, 13)} Confirmed same product family</Chip>

        <div style={{ display: 'flex', gap: 12, margin: '16px 0 6px' }}>{col(us)}{col(eu)}</div>

        <div style={{ marginTop: 10 }}>
          {metric('Added sugar', us.nutrition.addedSugar + ' g', eu.nutrition.addedSugar + ' g', 'per 100 g/ml')}
          {metric('Sodium', us.nutrition.sodium + ' mg', eu.nutrition.sodium + ' mg')}
          {metric('Flagged additives', us.additives.length, eu.additives.length)}
          {metric('NOVA group', us.novaGroup, eu.novaGroup, 'processing level')}
        </div>

        <SectionLabel style={{ margin: '22px 0 10px' }}>WHAT'S DIFFERENT</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {diffs.map((d, i) => (
            <div key={i} style={{ display: 'flex', gap: 11, background: T.paper, border: '1px solid ' + T.line, borderRadius: 14, padding: '13px 14px' }}>
              <span style={{ flex: 'none' }}>{Ico.swap(T.ink, 18)}</span>
              <span style={{ fontSize: 13.5, color: T.ink, lineHeight: 1.4 }}>{d}</span>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 11.5, color: T.muted, marginTop: 18, lineHeight: 1.5 }}>
          Regional rules differ — an additive permitted in one market may be restricted in the other. We flag, but never claim “illegal.” Sources: brand labels · Open Food Facts.
        </div>
      </div>
    </Screen>
  );
}

// ───────────────────────── Alternatives ─────────────────────────
function AlternativesScreen({ nav, data, gtin, region, favs, toggleFav }) {
  const p = data.products[gtin];
  const v = p.variants[region] || Object.values(p.variants)[0];
  const alts = (p.alternatives || []).map((id) => data.alternatives[id]);
  return (
    <Screen statusTone="dark" pb={28}>
      <TopBar onBack={() => nav.pop()} title="HEALTHIER PICKS" />
      <div style={{ padding: '6px 22px 0' }}>
        <div style={{ fontSize: 26, fontWeight: 800, fontFamily: T.display, letterSpacing: -0.5, lineHeight: 1.05, marginBottom: 6 }}>Better options in<br />{p.category.toLowerCase()}</div>
        <div style={{ fontSize: 13.5, color: T.muted, marginBottom: 18 }}>You scanned <b style={{ color: T.ink }}>{p.brand}</b> · scored <b style={{ color: bandColor(v.score) }}>{v.score}</b>. These rank higher in the same category.</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {alts.map((a, i) => (
            <div key={i} style={{ background: T.paper, border: '1px solid ' + T.line, borderRadius: 18, padding: 14, display: 'flex', alignItems: 'center', gap: 13 }}>
              <Slot w={52} h={52} r={13} emoji={a.emoji} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, letterSpacing: 0.5, color: T.muted, fontWeight: 700 }}>{a.brand.toUpperCase()}</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: T.ink, lineHeight: 1.2 }}>{a.name}</div>
                <div style={{ fontSize: 12, color: T.green, fontWeight: 600, marginTop: 3 }}>{a.note}</div>
              </div>
              <div style={{ textAlign: 'center', flex: 'none' }}>
                <div style={{ fontFamily: T.display, fontWeight: 800, fontSize: 30, color: bandColor(a.score), lineHeight: 1 }}>{a.score}</div>
                <div style={{ fontSize: 9, fontWeight: 800, color: bandColor(a.score), letterSpacing: 0.5 }}>{bandWord(a.score)}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11.5, color: T.muted, marginTop: 18, lineHeight: 1.5 }}>Ranked by health score within the same category. Not sponsored.</div>
      </div>
    </Screen>
  );
}

// ───────────────────────── Manual entry ─────────────────────────
function ManualEntryScreen({ nav, data }) {
  const [code, setCode] = React.useState('');
  const press = (d) => setCode((c) => (c + d).slice(0, 13));
  const del = () => setCode((c) => c.slice(0, -1));
  const submit = () => {
    if (data.products[code]) nav.replace('result', { gtin: code });
    else nav.replace('notfound', { gtin: code || data.unknownBarcode });
  };
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'del', '0', 'go'];
  return (
    <Screen statusTone="dark" pb={28}>
      <TopBar onBack={() => nav.pop()} title="ENTER BARCODE" />
      <div style={{ padding: '20px 26px 0', display: 'flex', flexDirection: 'column', height: 'calc(100% - 50px)' }}>
        <div style={{ fontSize: 13.5, color: T.muted, marginBottom: 14 }}>Type the GTIN / UPC printed under the barcode.</div>
        <div style={{ background: T.paper, border: '1px solid ' + T.line, borderRadius: 16, padding: '22px 18px', textAlign: 'center', fontFamily: T.display, fontWeight: 700, fontSize: 30, letterSpacing: 3, color: code ? T.ink : T.line, minHeight: 38 }}>{code || '000000000000'}</div>
        <div style={{ fontSize: 12, color: T.muted, marginTop: 10, textAlign: 'center' }}>Try <b style={{ color: T.ink }}>009800895007</b> (known) or any number (unknown).</div>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, paddingBottom: 24 }}>
          {keys.map((k) => {
            if (k === 'del') return <button key={k} onClick={del} style={padKey(T.cream, T.ink)}>⌫</button>;
            if (k === 'go') return <button key={k} onClick={submit} style={padKey(T.ink, '#fff')}>{Ico.arrow('#fff', 22)}</button>;
            return <button key={k} onClick={() => press(k)} style={padKey(T.paper, T.ink)}>{k}</button>;
          })}
        </div>
      </div>
    </Screen>
  );
}
function padKey(bg, fg) {
  return { height: 58, borderRadius: 16, border: '1px solid ' + T.line, background: bg, color: fg, fontSize: 24, fontWeight: 700, fontFamily: T.display, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
}

// ───────────────────────── Not found / add ─────────────────────────
function NotFoundScreen({ nav, gtin }) {
  const [submitted, setSubmitted] = React.useState(false);
  const [form, setForm] = React.useState({ name: '', brand: '', region: 'US' });
  if (submitted) {
    return (
      <Screen statusTone="dark">
        <TopBar onBack={() => nav.tab('scan')} />
        <div style={{ padding: '40px 30px 0', textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: 99, background: T.greenTint, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>{Ico.check(T.green, 36)}</div>
          <div style={{ fontSize: 24, fontWeight: 800, fontFamily: T.display, marginBottom: 8 }}>Thanks — added to the queue</div>
          <div style={{ fontSize: 14, color: T.muted, lineHeight: 1.5, marginBottom: 28 }}>A moderator will verify your submission. We’ll score it once there’s enough data. You earned <b style={{ color: T.ink }}>+10 points</b>.</div>
          <PrimaryButton full color={T.ink} onClick={() => nav.tab('scan')}>{Ico.scan('#fff', 18)} Scan another</PrimaryButton>
        </div>
      </Screen>
    );
  }
  const field = (label, key, ph) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: T.ink2, marginBottom: 6 }}>{label}</div>
      <input value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={ph} style={{ width: '100%', height: 48, borderRadius: 13, border: '1px solid ' + T.line, background: T.paper, padding: '0 14px', fontSize: 15, fontFamily: T.ui, color: T.ink, outline: 'none', boxSizing: 'border-box' }} />
    </div>
  );
  return (
    <Screen statusTone="dark" pb={28}>
      <TopBar onBack={() => nav.pop()} title="NOT FOUND" />
      <div style={{ padding: '10px 22px 0' }}>
        <div style={{ width: 60, height: 60, borderRadius: 16, background: T.amberTint, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>{Ico.alert(T.amber, 30)}</div>
        <div style={{ fontSize: 25, fontWeight: 800, fontFamily: T.display, letterSpacing: -0.5, lineHeight: 1.05, marginBottom: 8 }}>Not in our database yet</div>
        <div style={{ fontSize: 14, color: T.muted, lineHeight: 1.5, marginBottom: 4 }}>Barcode <b style={{ color: T.ink, fontVariantNumeric: 'tabular-nums' }}>{gtin}</b> isn’t scored. Add the basics and we’ll take it from here.</div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', margin: '20px 0' }}>
          <Slot w={64} h={64} r={14} label="add photo" />
          <div style={{ fontSize: 12.5, color: T.muted, lineHeight: 1.4 }}>A label photo speeds up verification (optional).</div>
        </div>

        {field('Product name', 'name', 'e.g. Almond Granola')}
        {field('Brand', 'brand', 'e.g. Nature Valley')}
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.ink2, marginBottom: 6 }}>Region</div>
          <div style={{ display: 'inline-flex', background: T.cream, borderRadius: 11, padding: 3 }}>
            {['US', 'EU'].map((r) => (
              <button key={r} onClick={() => setForm({ ...form, region: r })} style={{ border: 'none', cursor: 'pointer', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 700, fontFamily: T.ui, background: form.region === r ? T.paper : 'transparent', color: T.ink }}>{flag(r)} {r}</button>
            ))}
          </div>
        </div>
        <PrimaryButton full color={T.ink} onClick={() => setSubmitted(true)}>{Ico.plus('#fff', 18)} Submit for review</PrimaryButton>
        <div style={{ height: 16 }} />
      </div>
    </Screen>
  );
}

// ───────────────────────── History (tab) ─────────────────────────
function HistoryScreen({ nav, data, history, region }) {
  return (
    <Screen pb={92}>
      <BigTitle sub={history.length + ' items scanned'}>History</BigTitle>
      <div style={{ padding: '0 16px' }}>
        {history.length === 0 ? (
          <EmptyState icon={Ico.clock} title="No scans yet" body="Scanned products appear here, even offline." />
        ) : history.map((g, i) => {
          const p = data.products[g];
          const v = p.variants[region] || Object.values(p.variants)[0];
          return <ProductRow key={g + i} p={p} score={v.score} onClick={() => nav.push('result', { gtin: g })} />;
        })}
        <div style={{ fontSize: 11.5, color: T.muted, textAlign: 'center', marginTop: 8, lineHeight: 1.5 }}>Cached on this device — available without a connection.</div>
      </div>
    </Screen>
  );
}

// ───────────────────────── Saved (tab) ─────────────────────────
function SavedScreen({ nav, data, favs, region }) {
  return (
    <Screen pb={92}>
      <BigTitle sub={favs.length ? favs.length + ' saved' : undefined}>Saved</BigTitle>
      <div style={{ padding: '0 16px' }}>
        {favs.length === 0 ? (
          <EmptyState icon={Ico.heart} title="Nothing saved yet" body="Tap the heart on any result to keep it here for quick comparison." />
        ) : favs.map((g, i) => {
          const p = data.products[g];
          const v = p.variants[region] || Object.values(p.variants)[0];
          return <ProductRow key={g + i} p={p} score={v.score} onClick={() => nav.push('result', { gtin: g })} />;
        })}
      </div>
    </Screen>
  );
}

function EmptyState({ icon, title, body }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 30px' }}>
      <div style={{ width: 64, height: 64, borderRadius: 99, background: T.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>{icon(T.muted, 28)}</div>
      <div style={{ fontSize: 18, fontWeight: 700, fontFamily: T.display, color: T.ink, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13.5, color: T.muted, lineHeight: 1.5 }}>{body}</div>
    </div>
  );
}

// compact live preview of each score-display style (sample score)
function MiniScore({ style, s = 38 }) {
  const c = bandColor(s);
  if (style === 'scale') {
    return (
      <div style={{ width: 70 }}>
        <div style={{ fontFamily: T.display, fontWeight: 800, fontSize: 30, lineHeight: 0.8, color: c }}>{s}</div>
        <div style={{ height: 5, borderRadius: 9, marginTop: 6, background: 'linear-gradient(90deg,' + T.clay + ',' + T.amber + ',' + T.green + ')', position: 'relative' }}>
          <div style={{ position: 'absolute', left: s + '%', top: -2, width: 9, height: 9, borderRadius: 99, background: '#fff', border: '2px solid ' + T.ink, transform: 'translateX(-50%)' }} />
        </div>
      </div>
    );
  }
  if (style === 'grade') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: 34, lineHeight: 0.8 }}>{s}</span>
        <span style={{ width: 26, height: 26, borderRadius: 8, background: c, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, fontFamily: T.display }}>{gradeLetter(s)}</span>
      </div>
    );
  }
  if (style === 'breakdown') {
    return (
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
    );
  }
  // verdict
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
      <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: 38, lineHeight: 0.78 }}>{s}</span>
      <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: 14, color: c }}>{bandWord(s)}</span>
    </div>
  );
}

const SCORE_STYLES = [
  { key: 'verdict', label: 'Verdict', desc: 'Big number + word' },
  { key: 'scale', label: 'Scale', desc: 'Number on a poor→good scale' },
  { key: 'grade', label: 'Letter grade', desc: 'Number with an A–E grade' },
  { key: 'breakdown', label: 'Breakdown', desc: 'Number with component bars' },
];

// ───────────────────────── You / Preferences (tab) ─────────────────────────
function AddAvoidRow({ onAdd, existing }) {
  const [open, setOpen] = React.useState(false);
  const [val, setVal] = React.useState('');
  const submit = () => {
    const label = val.trim();
    if (!label) return;
    const dupe = existing.some((o) => o.label.toLowerCase() === label.toLowerCase());
    if (!dupe) onAdd(label);
    setVal(''); setOpen(false);
  };
  if (!open) {
    return (
      <button onClick={() => setOpen(true)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', marginTop: 10, height: 46, borderRadius: 13, border: '1.5px dashed ' + T.line, background: 'transparent', color: T.green, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: T.ui }}>
        {Ico.plus(T.green, 18)} Add an ingredient
      </button>
    );
  }
  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
      <input autoFocus value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
        placeholder="e.g. Carrageenan, Aspartame…"
        style={{ flex: 1, height: 46, borderRadius: 13, border: '1px solid ' + T.line, background: T.paper, padding: '0 14px', fontSize: 14.5, fontFamily: T.ui, color: T.ink, outline: 'none', boxSizing: 'border-box' }} />
      <button onClick={submit} style={{ height: 46, padding: '0 18px', borderRadius: 13, border: 'none', background: val.trim() ? T.green : T.line, color: '#fff', fontSize: 14, fontWeight: 700, cursor: val.trim() ? 'pointer' : 'default', fontFamily: T.ui, flex: 'none' }}>Add</button>
    </div>
  );
}

function PreferencesScreen({ region, setRegion, avoidList, setAvoidList, avoidOptions, addAvoid, removeAvoid, scoreStyle, setScoreStyle }) {
  const toggle = (key) => setAvoidList(avoidList.includes(key) ? avoidList.filter((k) => k !== key) : [...avoidList, key]);
  return (
    <Screen pb={92}>
      <BigTitle sub="Personalize how products are scored">You</BigTitle>
      <div style={{ padding: '0 22px' }}>
        <SectionLabel style={{ margin: '6px 0 4px' }}>SCORE DISPLAY</SectionLabel>
        <div style={{ fontSize: 12.5, color: T.muted, marginBottom: 12, lineHeight: 1.4 }}>Choose how the health score reads on every result.</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
          {SCORE_STYLES.map((o) => {
            const on = scoreStyle === o.key;
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
            );
          })}
        </div>

        <SectionLabel style={{ margin: '6px 0 10px' }}>DEFAULT REGION</SectionLabel>
        <div style={{ display: 'flex', background: T.paper, border: '1px solid ' + T.line, borderRadius: 13, padding: 4, marginBottom: 24 }}>
          {['US', 'EU'].map((r) => (
            <button key={r} onClick={() => setRegion(r)} style={{ flex: 1, border: 'none', cursor: 'pointer', borderRadius: 10, padding: '11px 0', fontSize: 14, fontWeight: 700, fontFamily: T.ui, background: region === r ? T.ink : 'transparent', color: region === r ? '#fff' : T.ink2 }}>{flag(r)} {r}</button>
          ))}
        </div>

        <SectionLabel style={{ marginBottom: 4 }}>INGREDIENTS I AVOID</SectionLabel>
        <div style={{ fontSize: 12.5, color: T.muted, marginBottom: 12, lineHeight: 1.4 }}>We’ll flag these on every result and warn you up top.</div>
        <div style={{ background: T.paper, border: '1px solid ' + T.line, borderRadius: 16, overflow: 'hidden' }}>
          {avoidOptions.map((o, i) => {
            const on = avoidList.includes(o.key);
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
                  <button onClick={() => removeAvoid(o.key)} aria-label={'Remove ' + o.label} style={{ width: 26, height: 26, borderRadius: 8, border: 'none', background: T.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flex: 'none' }}>{Ico.x(T.muted, 13)}</button>
                )}
              </div>
            );
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
  );
}

Object.assign(window, { CompareScreen, AlternativesScreen, ManualEntryScreen, NotFoundScreen, HistoryScreen, SavedScreen, PreferencesScreen, ProductRow, BigTitle, EmptyState });
