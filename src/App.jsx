import { useState, useMemo, useCallback, useEffect } from 'react'
import { T, bandColor } from './theme.js'
import { DATA } from './data.js'
import { fetchProduct } from './api.js'
import { usePersist } from './hooks/usePersist.js'
import BottomNav from './components/BottomNav.jsx'
import ScanScreen from './screens/ScanScreen.jsx'
import ResultScreen from './screens/ResultScreen.jsx'
import BreakdownScreen from './screens/BreakdownScreen.jsx'
import CompareScreen from './screens/CompareScreen.jsx'
import AlternativesScreen from './screens/AlternativesScreen.jsx'
import ManualEntryScreen from './screens/ManualEntryScreen.jsx'
import NotFoundScreen from './screens/NotFoundScreen.jsx'
import HistoryScreen from './screens/HistoryScreen.jsx'
import SavedScreen from './screens/SavedScreen.jsx'
import PreferencesScreen from './screens/PreferencesScreen.jsx'
import LabelScanScreen from './screens/ocr/LabelScanScreen.jsx'
import LabelParsingScreen from './screens/ocr/LabelParsingScreen.jsx'
import LabelReviewScreen from './screens/ocr/LabelReviewScreen.jsx'

const AVOID_OPTIONS = [
  { key: 'palm oil', label: 'Palm oil' },
  { key: 'hfcs', label: 'High-fructose corn syrup' },
  { key: 'dyes', label: 'Synthetic dyes' },
  { key: 'msg', label: 'MSG / flavor enhancers' },
  { key: 'sugar', label: 'High added sugar' },
  { key: 'caramel', label: 'Caramel color (E150d)' },
]

const TAB_ROOT = { scan: 'scan', history: 'history', saved: 'saved', you: 'you' }

const THEME_COLORS = {
  scan: '#17150f',
  labelscan: '#17150f',
  labelparsing: T.canvas,
  labelreview: T.canvas,
}

function setThemeColor(color) {
  const el = document.querySelector('meta[name="theme-color"]')
  if (el) el.setAttribute('content', color)
}

export default function App() {
  const [tab, setTab] = useState('scan')
  const [stack, setStack] = useState([{ screen: 'scan', params: {} }])
  const [anim, setAnim] = useState('in')
  const [region, setRegion] = usePersist('region', 'US')
  const [scoreStyle, setScoreStyle] = usePersist('scoreStyle', 'verdict')
  const [favs, setFavs] = usePersist('favs', [])
  const [history, setHistory] = usePersist('history', [...DATA.history])
  const [avoidList, setAvoidList] = usePersist('avoidList', ['palm oil', 'dyes'])
  const [customAvoid, setCustomAvoid] = usePersist('customAvoid', [])
  const [customProducts, setCustomProducts] = usePersist('customProducts', {})

  const top = stack[stack.length - 1]

  // Sync browser theme-color with current screen
  useEffect(() => {
    const s = top.screen
    if (s === 'result') {
      const mergedData = Object.keys(customProducts).length
        ? { ...DATA, products: { ...DATA.products, ...customProducts } }
        : DATA
      const p = mergedData.products[top.params.gtin]
      if (p) {
        const v = p.variants[region] || Object.values(p.variants)[0]
        setThemeColor(bandColor(v.score))
      }
    } else if (THEME_COLORS[s]) {
      setThemeColor(THEME_COLORS[s])
    } else {
      setThemeColor(T.canvas)
    }
  }, [top.screen, top.params, region, customProducts])

  const registerProduct = useCallback((product) => {
    setCustomProducts((m) => ({ ...m, [product.gtin]: product }))
  }, [])

  const commitOcr = useCallback((product) => {
    setCustomProducts((m) => ({ ...m, [product.gtin]: product }))
    setHistory((h) => [product.gtin, ...h.filter((x) => x !== product.gtin)])
    return product.gtin
  }, [])

  const nav = useMemo(() => ({
    push(screen, params = {}) { setAnim('in'); setStack((s) => [...s, { screen, params }]) },
    replace(screen, params = {}) { setStack((s) => [...s.slice(0, -1), { screen, params }]) },
    pop() { setAnim('out'); setStack((s) => s.length > 1 ? s.slice(0, -1) : s) },
    tab(id) { setTab(id); setStack([{ screen: TAB_ROOT[id], params: {} }]) },
    scan(gtin) {
      setHistory((h) => [gtin, ...h.filter((x) => x !== gtin)])
      setAnim('in')
      setStack((s) => [...s, { screen: 'result', params: { gtin, fresh: true } }])
    },
  }), [])

  const switchTab = (id) => { setTab(id); setStack([{ screen: TAB_ROOT[id], params: {} }]) }
  const toggleFav = (g) => setFavs((f) => f.includes(g) ? f.filter((x) => x !== g) : [g, ...f])

  const avoidOptions = useMemo(() => [...AVOID_OPTIONS, ...customAvoid], [customAvoid])

  const slugify = (label) => 'c-' + label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  const keyForLabel = (label) => {
    const found = avoidOptions.find((o) => o.label.toLowerCase() === label.trim().toLowerCase())
    return found ? found.key : slugify(label)
  }
  const isAvoided = (label) => avoidList.includes(keyForLabel(label))

  const toggleAvoidLabel = (raw) => {
    const label = raw.trim()
    if (!label) return
    const key = keyForLabel(label)
    if (avoidList.includes(key)) {
      setAvoidList((l) => l.filter((k) => k !== key))
      setCustomAvoid((c) => c.filter((o) => o.key !== key))
    } else {
      if (!avoidOptions.some((o) => o.key === key)) setCustomAvoid((c) => [...c, { key, label, custom: true }])
      setAvoidList((l) => [...l, key])
    }
  }

  const addAvoid = (label) => {
    const key = slugify(label)
    if (avoidOptions.some((o) => o.key === key)) { setAvoidList((l) => l.includes(key) ? l : [...l, key]); return }
    setCustomAvoid((c) => [...c, { key, label, custom: true }])
    setAvoidList((l) => [...l, key])
  }

  const removeAvoid = (key) => {
    setCustomAvoid((c) => c.filter((o) => o.key !== key))
    setAvoidList((l) => l.filter((k) => k !== key))
  }

  // Handle ?scan=GTIN deep links on initial load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const deepGtin = params.get('scan')
    if (deepGtin) {
      window.history.replaceState({}, '', window.location.pathname)
      nav.scan(deepGtin)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const showNav = ['scan', 'history', 'saved', 'you'].includes(top.screen) && stack.length === 1

  const data = Object.keys(customProducts).length
    ? { ...DATA, products: { ...DATA.products, ...customProducts } }
    : DATA
  const common = { nav, data, region }

  const renderScreen = () => {
    const { screen, params } = top
    switch (screen) {
      case 'scan': return <ScanScreen {...common} onProductFetched={registerProduct} />
      case 'labelscan': return <LabelScanScreen {...common} />
      case 'labelparsing': return <LabelParsingScreen {...common} />
      case 'labelreview': return <LabelReviewScreen {...common} commitOcr={commitOcr} isAvoided={isAvoided} toggleAvoidLabel={toggleAvoidLabel} />
      case 'result': return (
        <ResultScreen {...common}
          gtin={params.gtin} fresh={params.fresh}
          setRegion={setRegion} scanStyle={scoreStyle} driversStyle="rows"
          favs={favs} toggleFav={toggleFav}
          avoidList={avoidList} avoidOptions={avoidOptions}
          onProductFetched={registerProduct}
        />
      )
      case 'breakdown': return <BreakdownScreen {...common} gtin={params.gtin} isAvoided={isAvoided} toggleAvoidLabel={toggleAvoidLabel} />
      case 'compare': return <CompareScreen {...common} gtin={params.gtin} />
      case 'alternatives': return <AlternativesScreen {...common} gtin={params.gtin} />
      case 'manual': return <ManualEntryScreen {...common} />
      case 'notfound': return <NotFoundScreen {...common} gtin={params.gtin} />
      case 'history': return <HistoryScreen {...common} history={history} />
      case 'saved': return <SavedScreen {...common} favs={favs} />
      case 'you': return (
        <PreferencesScreen
          region={region} setRegion={setRegion}
          avoidList={avoidList} setAvoidList={setAvoidList}
          avoidOptions={avoidOptions} addAvoid={addAvoid} removeAvoid={removeAvoid}
          scoreStyle={scoreStyle} setScoreStyle={setScoreStyle}
        />
      )
      default: return null
    }
  }

  return (
    <div style={{ position: 'absolute', inset: 0, background: T.canvas, fontFamily: T.ui, overflow: 'hidden' }}>
      <div
        key={stack.length + top.screen}
        className={'bhc-screen ' + (anim === 'out' ? 'bhc-pop' : 'bhc-push')}
        style={{ position: 'absolute', inset: 0 }}
      >
        {renderScreen()}
      </div>
      {showNav && <BottomNav tab={tab} onTab={switchTab} />}
    </div>
  )
}
