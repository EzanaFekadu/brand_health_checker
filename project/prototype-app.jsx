// prototype-app.jsx — router + state for Brand Health Checker
const {
  T, Ico, PhoneFrame, BottomNav,
  ScanScreen, ResultScreen, BreakdownScreen,
  CompareScreen, AlternativesScreen, ManualEntryScreen, NotFoundScreen,
  HistoryScreen, SavedScreen, PreferencesScreen,
  LabelScanScreen, LabelParsingScreen, LabelReviewScreen,
  useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakColor, TweakToggle,
} = window;

const DATA = window.BHC_DATA;

// persistent state hook — reads once from localStorage, writes on change
function usePersist(key, initial) {
  const [val, setVal] = React.useState(() => {
    try {
      const raw = localStorage.getItem('bhc.' + key);
      return raw != null ? JSON.parse(raw) : initial;
    } catch (e) { return initial; }
  });
  React.useEffect(() => {
    try { localStorage.setItem('bhc.' + key, JSON.stringify(val)); } catch (e) {}
  }, [key, val]);
  return [val, setVal];
}

const AVOID_OPTIONS = [
  { key: 'palm oil', label: 'Palm oil' },
  { key: 'hfcs', label: 'High-fructose corn syrup' },
  { key: 'dyes', label: 'Synthetic dyes' },
  { key: 'msg', label: 'MSG / flavor enhancers' },
  { key: 'sugar', label: 'High added sugar' },
  { key: 'caramel', label: 'Caramel color (E150d)' },
];

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "driversStyle": "rows"
}/*EDITMODE-END*/;

// tabs are roots of their own stack; modal/detail screens push on top
const TAB_ROOT = { scan: 'scan', history: 'history', saved: 'saved', you: 'you' };

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [tab, setTab] = React.useState('scan');
  const [stack, setStack] = React.useState([{ screen: 'scan', params: {} }]);
  const [region, setRegion] = usePersist('region', 'US');
  const [scoreStyle, setScoreStyle] = usePersist('scoreStyle', 'verdict');
  const [favs, setFavs] = usePersist('favs', []);
  const [history, setHistory] = usePersist('history', [...DATA.history]);
  const [avoidList, setAvoidList] = usePersist('avoidList', ['palm oil', 'dyes']);
  const [customAvoid, setCustomAvoid] = usePersist('customAvoid', []);
  const [customProducts, setCustomProducts] = usePersist('customProducts', {});
  const [anim, setAnim] = React.useState(null); // 'in' | 'out'

  const top = stack[stack.length - 1];

  // register an OCR-built product so result/breakdown can look it up by gtin
  const commitOcr = React.useCallback((product) => {
    setCustomProducts((m) => ({ ...m, [product.gtin]: product }));
    setHistory((h) => [product.gtin, ...h.filter((x) => x !== product.gtin)]);
    return product.gtin;
  }, []);

  const nav = React.useMemo(() => ({
    push(screen, params = {}) { setAnim('in'); setStack((s) => [...s, { screen, params }]); },
    replace(screen, params = {}) { setStack((s) => [...s.slice(0, -1), { screen, params }]); },
    pop() { setAnim('out'); setStack((s) => (s.length > 1 ? s.slice(0, -1) : s)); },
    tab(id) { setTab(id); setStack([{ screen: TAB_ROOT[id], params: {} }]); },
    scan(gtin) {
      setHistory((h) => [gtin, ...h.filter((x) => x !== gtin)]);
      setAnim('in'); setStack((s) => [...s, { screen: 'result', params: { gtin, fresh: true } }]);
    },
  }), []);

  const switchTab = (id) => { setTab(id); setStack([{ screen: TAB_ROOT[id], params: {} }]); };
  const toggleFav = (g) => setFavs((f) => (f.includes(g) ? f.filter((x) => x !== g) : [g, ...f]));

  // merged avoid options (built-in + user-added); add/remove custom ingredients
  const avoidOptions = React.useMemo(() => [...AVOID_OPTIONS, ...customAvoid], [customAvoid]);
  const slugify = (label) => 'c-' + label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const keyForLabel = (label) => {
    const found = avoidOptions.find((o) => o.label.toLowerCase() === label.trim().toLowerCase());
    return found ? found.key : slugify(label);
  };
  const isAvoided = (label) => avoidList.includes(keyForLabel(label));
  // toggle avoid straight from an ingredient label (used on review + breakdown)
  const toggleAvoidLabel = (raw) => {
    const label = raw.trim();
    if (!label) return;
    const key = keyForLabel(label);
    if (avoidList.includes(key)) {
      setAvoidList((l) => l.filter((k) => k !== key));
      setCustomAvoid((c) => c.filter((o) => o.key !== key));
    } else {
      if (!avoidOptions.some((o) => o.key === key)) setCustomAvoid((c) => [...c, { key, label, custom: true }]);
      setAvoidList((l) => [...l, key]);
    }
  };
  const addAvoid = (label) => {
    const key = slugify(label);
    if (avoidOptions.some((o) => o.key === key)) { setAvoidList((l) => (l.includes(key) ? l : [...l, key])); return; }
    setCustomAvoid((c) => [...c, { key, label, custom: true }]);
    setAvoidList((l) => [...l, key]);
  };
  const removeAvoid = (key) => {
    setCustomAvoid((c) => c.filter((o) => o.key !== key));
    setAvoidList((l) => l.filter((k) => k !== key));
  };

  // is the current top screen a full-bleed/dark-status screen?
  const lightStatus = top.screen === 'scan' || top.screen === 'result' || top.screen === 'labelscan';
  const showNav = ['scan', 'history', 'saved', 'you'].includes(top.screen) && stack.length === 1;

  const render = () => {
    const { screen, params } = top;
    const data = Object.keys(customProducts).length
      ? { ...DATA, products: { ...DATA.products, ...customProducts } }
      : DATA;
    const common = { nav, data, region };
    switch (screen) {
      case 'scan': return <ScanScreen {...common} scanStyle={scoreStyle} />;
      case 'labelscan': return <LabelScanScreen {...common} />;
      case 'labelparsing': return <LabelParsingScreen {...common} />;
      case 'labelreview': return <LabelReviewScreen {...common} commitOcr={commitOcr} isAvoided={isAvoided} toggleAvoidLabel={toggleAvoidLabel} />;
      case 'result': return <ResultScreen {...common} gtin={params.gtin} fresh={params.fresh} setRegion={setRegion} scanStyle={scoreStyle} driversStyle={t.driversStyle} favs={favs} toggleFav={toggleFav} avoidList={avoidList} avoidOptions={avoidOptions} />;
      case 'breakdown': return <BreakdownScreen {...common} gtin={params.gtin} isAvoided={isAvoided} toggleAvoidLabel={toggleAvoidLabel} />;
      case 'compare': return <CompareScreen {...common} gtin={params.gtin} />;
      case 'alternatives': return <AlternativesScreen {...common} gtin={params.gtin} favs={favs} toggleFav={toggleFav} />;
      case 'manual': return <ManualEntryScreen {...common} />;
      case 'notfound': return <NotFoundScreen {...common} gtin={params.gtin} />;
      case 'history': return <HistoryScreen {...common} history={history} />;
      case 'saved': return <SavedScreen {...common} favs={favs} />;
      case 'you': return <PreferencesScreen region={region} setRegion={setRegion} avoidList={avoidList} setAvoidList={setAvoidList} avoidOptions={avoidOptions} addAvoid={addAvoid} removeAvoid={removeAvoid} scoreStyle={scoreStyle} setScoreStyle={setScoreStyle} />;
      default: return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 28, background: 'radial-gradient(120% 100% at 50% 0%, #fbfaf6 0%, #efece3 100%)' }}>
      <PhoneFrame statusTone={lightStatus ? 'light' : 'dark'} homeTone={top.screen === 'scan' ? 'light' : 'dark'}>
        <div key={stack.length + top.screen} className={'bhc-screen ' + (anim === 'out' ? 'bhc-pop' : 'bhc-push')} style={{ position: 'absolute', inset: 0 }}>
          {render()}
        </div>
        {showNav && <BottomNav tab={tab} onTab={switchTab} />}
      </PhoneFrame>

      <TweaksPanel>
        <TweakSection label="Result layout" />
        <TweakRadio label="Top drivers" value={t.driversStyle}
          options={['rows', 'chips']}
          onChange={(v) => setTweak('driversStyle', v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
