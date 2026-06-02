// screens-core.jsx — Scan, Result, Breakdown
const { T, Ico, Slot, Screen, TopBar, ScoreHero, ScoreReadout, ComponentBars,
  ReasonRow, Chip, SectionLabel, PrimaryButton, GhostButton,
  bandColor, bandDeep, bandTint, bandWord, flag } = window;

// ───────────────────────── Scan ─────────────────────────
function ScanScreen({ nav, data, scanStyle }) {
  const [scanning, setScanning] = React.useState(null); // gtin being scanned
  const demo = ['009800895007', '049000028904', '028400090858', data.unknownBarcode];

  const runScan = (gtin) => {
    setScanning(gtin);
    setTimeout(() => {
      setScanning(null);
      if (gtin === data.unknownBarcode) nav.push('notfound', { gtin });
      else nav.scan(gtin);
    }, 1050);
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#17150f', overflow: 'hidden' }}>
      {/* faux shelf viewfinder */}
      <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(100deg,#211d14 0 38px,#1b180f 38px 76px)', opacity: 0.6 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 80% at 50% 38%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.55) 100%)' }} />

      <TopBar tone="light" title="SCAN A BARCODE"
        right={<button style={{ width: 38, height: 38, borderRadius: 12, border: 'none', background: 'rgba(255,255,255,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>{Ico.flash('#fff', 19)}</button>} />

      {/* reticle */}
      <div style={{ position: 'absolute', top: 200, left: '50%', transform: 'translateX(-50%)', width: 250, height: 160 }}>
        {[['tl', 0, 0], ['tr', 1, 0], ['bl', 0, 1], ['br', 1, 1]].map(([k, x, y]) => (
          <div key={k} style={{ position: 'absolute', [x ? 'right' : 'left']: 0, [y ? 'bottom' : 'top']: 0, width: 34, height: 34, [x ? 'borderRight' : 'borderLeft']: '3px solid #fff', [y ? 'borderBottom' : 'borderTop']: '3px solid #fff', borderRadius: x ? (y ? '0 0 14px 0' : '0 14px 0 0') : (y ? '0 0 0 14px' : '14px 0 0 0') }} />
        ))}
        <div style={{ position: 'absolute', left: 14, right: 14, top: scanning ? '88%' : '12%', height: 2, background: bandColor(80), boxShadow: '0 0 12px ' + bandColor(80), borderRadius: 9, transition: 'top 0.9s ease', opacity: 0.95 }} />
        {scanning && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>READING…</div>}
      </div>
      <div style={{ position: 'absolute', top: 376, left: 0, right: 0, textAlign: 'center', color: 'rgba(255,255,255,0.85)', fontSize: 14, padding: '0 40px', lineHeight: 1.5 }}>
        Point at any barcode — results appear in under a second.
      </div>

      {/* demo shelf + manual entry */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 92, padding: '0 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 11, letterSpacing: 1.2, fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>DEMO SHELF · TAP TO SCAN</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => nav.push('labelscan')} style={{ display: 'flex', alignItems: 'center', gap: 6, border: 'none', background: 'rgba(255,255,255,0.16)', color: '#fff', borderRadius: 9, padding: '6px 11px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: T.ui }}>{Ico.scan('#fff', 16)} Label</button>
            <button onClick={() => nav.push('manual')} style={{ display: 'flex', alignItems: 'center', gap: 6, border: 'none', background: 'rgba(255,255,255,0.16)', color: '#fff', borderRadius: 9, padding: '6px 11px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: T.ui }}>{Ico.keyboard('#fff', 16)} Code</button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
          {demo.map((g) => {
            const p = data.products[g];
            const known = !!p;
            return (
              <button key={g} onClick={() => runScan(g)} disabled={!!scanning} style={{ flex: 'none', width: 132, textAlign: 'left', border: 'none', borderRadius: 16, background: T.paper, padding: 11, cursor: 'pointer', opacity: scanning && scanning !== g ? 0.5 : 1, fontFamily: T.ui }}>
                <Slot w={42} h={42} r={11} emoji={known ? p.emoji : '❔'} />
                <div style={{ fontSize: 12.5, fontWeight: 700, color: T.ink, marginTop: 8, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{known ? p.brand : 'Unknown item'}</div>
                <div style={{ fontSize: 10.5, color: T.muted, marginTop: 1, fontVariantNumeric: 'tabular-nums' }}>{g.slice(0, 7)}…</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ───────────────────────── Result ─────────────────────────
function Shimmer({ w, h, r = 8, light, style }) {
  return <div className="bhc-shimmer" style={{ width: w, height: h, borderRadius: r, background: light ? 'rgba(255,255,255,0.28)' : '#e9e5dc', ...style }} />;
}

function ResultSkeleton({ product }) {
  return (
    <Screen pt={0} pb={28} statusTone="light">
      {/* neutral hero while the score resolves */}
      <div style={{ background: '#cfc9bb', color: '#fff', padding: '0 0 26px' }}>
        <TopBar tone="light" />
        <div style={{ padding: '4px 26px 0' }}>
          <Shimmer w={92} h={26} r={9} light style={{ marginBottom: 14 }} />
          <Shimmer w={110} h={12} light style={{ marginBottom: 8 }} />
          <Shimmer w={200} h={20} light style={{ marginBottom: 18 }} />
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
            <Shimmer w={120} h={92} r={14} light />
            <Shimmer w={90} h={30} light />
          </div>
          <Shimmer w={220} h={12} light style={{ marginTop: 16 }} />
        </div>
      </div>
      <div style={{ background: T.canvas, borderTopLeftRadius: 26, borderTopRightRadius: 26, marginTop: -20, position: 'relative', padding: '26px 22px 0' }}>
        <Shimmer w={90} h={11} style={{ marginBottom: 18 }} />
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '13px 0' }}>
            <Shimmer w={28} h={28} r={9} />
            <div style={{ flex: 1 }}>
              <Shimmer w={i % 2 ? '55%' : '70%'} h={13} style={{ marginBottom: 7 }} />
              <Shimmer w="30%" h={10} />
            </div>
          </div>
        ))}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 18 }}>
          <Shimmer w="100%" h={52} r={14} />
          <Shimmer w="100%" h={52} r={14} />
        </div>
        <div style={{ textAlign: 'center', marginTop: 22, fontSize: 12.5, color: T.muted, fontWeight: 600 }}>Scoring this product…</div>
      </div>
    </Screen>
  );
}

function ResultScreen({ nav, data, gtin, region, setRegion, scanStyle, driversStyle = 'rows', fresh, favs, toggleFav, avoidList, avoidOptions }) {
  const p = data.products[gtin];
  const v = p.variants[region] || p.variants.US || Object.values(p.variants)[0];
  const matched = avoidOptions.filter((o) => avoidList.includes(o.key) && v.reasons.some((r) => r.tag === o.key && r.type === 'neg'));
  const otherRegion = region === 'US' ? 'EU' : 'US';
  const hasOther = !!p.variants[otherRegion];

  // brief skeleton after a fresh scan, then reveal the result
  const [loading, setLoading] = React.useState(!!fresh);
  React.useEffect(() => {
    if (!fresh) return;
    const id = setTimeout(() => setLoading(false), 750);
    return () => clearTimeout(id);
  }, [fresh]);

  if (loading) return <ResultSkeleton product={p} />;

  return (
    <Screen pt={0} pb={28} statusTone="light">
      <ScoreHero product={p} variant={v} region={region} onRegion={setRegion} scoreStyle={scanStyle} onBack={() => nav.pop()} isFav={favs.includes(gtin)} onToggleFav={() => toggleFav(gtin)} />

      {/* sheet */}
      <div style={{ background: T.canvas, borderTopLeftRadius: 26, borderTopRightRadius: 26, marginTop: -20, position: 'relative', padding: '22px 22px 0' }}>
        {matched.length > 0 && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', background: T.clayTint, borderRadius: 14, padding: '12px 14px', marginBottom: 18 }}>
            <span style={{ flex: 'none' }}>{Ico.alert(T.clay, 20)}</span>
            <span style={{ fontSize: 13, color: T.clayDeep, fontWeight: 600, lineHeight: 1.35 }}>Contains {matched.map((m) => m.label.toLowerCase()).join(' & ')} — on your avoid list.</span>
          </div>
        )}

        <SectionLabel>TOP DRIVERS</SectionLabel>
        {driversStyle === 'chips' ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
            {v.reasons.map((r, i) => (
              <Chip key={i} tone={r.type === 'pos' ? 'good' : 'bad'}>
                <span style={{ fontFamily: T.display, fontWeight: 800 }}>{r.type === 'pos' ? '+' : '−'}</span>{r.find}
              </Chip>
            ))}
          </div>
        ) : (
          <div style={{ marginTop: 4 }}>
            {v.reasons.map((r, i) => (
              <ReasonRow key={i} r={r} last={i === v.reasons.length - 1} flagged={avoidList.includes(r.tag) && r.type === 'neg'} />
            ))}
          </div>
        )}

        <button onClick={() => nav.push('breakdown', { gtin })} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, width: '100%', marginTop: 14, border: 'none', background: 'none', color: T.ink2, fontSize: 13.5, fontWeight: 700, cursor: 'pointer', fontFamily: T.ui, padding: 6 }}>
          {Ico.info(T.ink2, 16)} See full breakdown & methodology
        </button>

        {/* actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14, paddingBottom: 22 }}>
          {hasOther ? (
            <PrimaryButton full color={T.ink} onClick={() => nav.push('compare', { gtin })}>
              {Ico.swap('#fff', 18)} Compare {flag(region)} {region} vs {flag(otherRegion)} {otherRegion}
            </PrimaryButton>
          ) : (
            <div style={{ textAlign: 'center', fontSize: 12.5, color: T.muted, padding: '10px 0' }}>No verified regional variant yet.</div>
          )}
          {(p.alternatives && p.alternatives.length > 0) && (
            <GhostButton full onClick={() => nav.push('alternatives', { gtin })}>{Ico.leaf(T.green, 18)} See healthier alternatives</GhostButton>
          )}
        </div>

        {/* provenance */}
        <div style={{ borderTop: '1px solid ' + T.line, paddingTop: 16, paddingBottom: 26 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <SectionLabel>DATA & SOURCES</SectionLabel>
            <Chip tone={v.confidence === 'High' ? 'good' : 'warn'}>{v.confidence} confidence</Chip>
          </div>
          <div style={{ fontSize: 12.5, color: T.muted, marginTop: 10, lineHeight: 1.5 }}>
            {p.fromLabel
              ? <span>Read from a label photo · estimated values.<br />Informational only — not medical advice.</span>
              : <span>Open Food Facts · brand label · last verified Apr 2026.<br />Informational only — not medical advice.</span>}
          </div>
        </div>
      </div>
    </Screen>
  );
}

// ───────────────────────── Breakdown ─────────────────────────
function NutRow({ label, value, unit, warn }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: '1px solid ' + T.line }}>
      <span style={{ fontSize: 14, color: T.ink, fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 700, color: warn ? T.clay : T.ink, fontVariantNumeric: 'tabular-nums' }}>{value}{unit}</span>
    </div>
  );
}

function BreakdownScreen({ nav, data, gtin, region, isAvoided, toggleAvoidLabel }) {
  const p = data.products[gtin];
  const v = p.variants[region] || Object.values(p.variants)[0];
  const n = v.nutrition;
  const ingList = v.ingredients.replace(/\.$/, '').split(',').map((s) => s.trim()).filter(Boolean);
  const comps = [
    ['Nutrition quality', v.components.nutrition, 'Sugar, sodium, saturated fat vs fiber & protein, per 100 g/ml.'],
    ['Additives & ingredients', v.components.additives, 'Synthetic colors, sweeteners, preservatives & emulsifiers.'],
    ['Processing level', v.components.processing, 'NOVA-based proxy from ingredient count & industrial markers.'],
  ];
  return (
    <Screen statusTone="dark" pb={28}>
      <TopBar onBack={() => nav.pop()} title="FULL BREAKDOWN" />
      <div style={{ padding: '6px 22px 0' }}>
        <div style={{ fontSize: 11, letterSpacing: 1, color: T.muted, fontWeight: 700 }}>{p.brand.toUpperCase()} · {flag(region)} {region}</div>
        <div style={{ fontSize: 21, fontWeight: 600, fontFamily: T.display, marginBottom: 16 }}>{p.name}</div>

        {/* overall */}
        <div style={{ background: bandTint(v.score), borderRadius: 18, padding: '18px 20px', marginBottom: 22 }}>
          <ScoreReadout score={v.score} comp={v.components} style="breakdown" />
        </div>

        <SectionLabel style={{ marginBottom: 12 }}>HOW THE SCORE IS BUILT</SectionLabel>
        {comps.map(([label, val, desc], i) => (
          <div key={i} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
              <span style={{ fontSize: 14.5, fontWeight: 700, color: T.ink }}>{label}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: bandColor(val), fontVariantNumeric: 'tabular-nums' }}>{val}/100</span>
            </div>
            <div style={{ height: 7, borderRadius: 9, background: T.line, overflow: 'hidden', marginBottom: 6 }}>
              <div style={{ width: val + '%', height: '100%', background: bandColor(val), borderRadius: 9 }} />
            </div>
            <div style={{ fontSize: 12.5, color: T.muted, lineHeight: 1.45 }}>{desc}</div>
          </div>
        ))}

        {/* nutrition */}
        <SectionLabel style={{ margin: '24px 0 4px' }}>NUTRITION · PER 100{n.kcal && p.size.includes('ml') ? ' ML' : ' G'}</SectionLabel>
        <div>
          <NutRow label="Calories" value={n.kcal} unit=" kcal" />
          <NutRow label="Sugar" value={n.sugar} unit=" g" warn={n.sugar > 15} />
          <NutRow label="of which added" value={n.addedSugar} unit=" g" warn={n.addedSugar > 10} />
          <NutRow label="Saturated fat" value={n.sat} unit=" g" warn={n.sat > 5} />
          <NutRow label="Sodium" value={n.sodium} unit=" mg" warn={n.sodium > 400} />
          <NutRow label="Fiber" value={n.fiber} unit=" g" />
          <NutRow label="Protein" value={n.protein} unit=" g" />
        </div>

        {/* additives */}
        <SectionLabel style={{ margin: '24px 0 10px' }}>ADDITIVES DETECTED</SectionLabel>
        {v.additives.length === 0 ? (
          <Chip tone="good">{Ico.check(T.green, 14)} None of concern</Chip>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {v.additives.map((a, i) => {
              const avoided = isAvoided(a.name);
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11, background: avoided ? T.clayTint : T.paper, border: '1px solid ' + (avoided ? T.clay : T.line), borderRadius: 12, padding: '10px 12px', transition: 'background .15s, border-color .15s' }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: T.ink, background: avoided ? 'rgba(207,83,64,0.14)' : T.cream, borderRadius: 7, padding: '4px 7px', fontFamily: T.display, flex: 'none' }}>{a.code}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: avoided ? T.clayDeep : T.ink }}>{a.name}</div>
                    <div style={{ fontSize: 11.5, color: T.muted, display: 'flex', alignItems: 'center', gap: 6 }}>
                      {a.note}
                      <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 0.3, borderRadius: 5, padding: '2px 5px', background: a.flag === 'US' ? T.clayTint : a.flag === 'EU' ? T.amberTint : T.cream, color: a.flag === 'US' ? T.clayDeep : a.flag === 'EU' ? T.amberDeep : T.ink2 }}>{a.flag === 'Both' ? 'US + EU' : a.flag + ' ONLY'}</span>
                    </div>
                  </div>
                  <button onClick={() => toggleAvoidLabel(a.name)} title={avoided ? 'On your avoid list — tap to remove' : 'Add to avoid list'} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                    {avoided ? Ico.check(T.clay, 18) : Ico.plus(T.muted, 18)}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* ingredients */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '24px 0 8px' }}>
          <SectionLabel>INGREDIENTS ({region})</SectionLabel>
          <span style={{ fontSize: 11.5, color: T.muted }}>tap to avoid</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {ingList.map((ing, i) => {
            const avoided = isAvoided(ing);
            return (
              <button key={i} onClick={() => toggleAvoidLabel(ing)} title={avoided ? 'On your avoid list — tap to remove' : 'Add to avoid list'} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontFamily: T.ui,
                background: avoided ? T.clayTint : T.paper, border: '1px solid ' + (avoided ? T.clay : T.line),
                color: avoided ? T.clayDeep : T.ink2, borderRadius: 9, padding: '7px 11px', fontSize: 12.5, fontWeight: 600,
                transition: 'background .15s, border-color .15s',
              }}>
                {avoided ? Ico.alert(T.clay, 12) : Ico.plus(T.muted, 13)}
                {ing}
              </button>
            );
          })}
        </div>
        <div style={{ height: 16 }} />
      </div>
    </Screen>
  );
}

Object.assign(window, { ScanScreen, ResultScreen, BreakdownScreen });
