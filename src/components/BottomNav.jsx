import { T } from '../theme.js'
import { Ico } from './icons.jsx'

export default function BottomNav({ tab, onTab }) {
  const tabs = [
    ['scan', 'Scan', Ico.scan],
    ['history', 'History', Ico.clock],
    ['saved', 'Saved', Ico.heart],
    ['you', 'You', Ico.user],
  ]
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, maxWidth: 520, margin: '0 auto',
      background: 'rgba(252,251,246,0.94)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
      borderTop: '1px solid ' + T.line, display: 'flex',
      paddingBottom: 'env(safe-area-inset-bottom)', zIndex: 100,
    }}>
      {tabs.map(([id, lab, ico]) => {
        const on = tab === id
        return (
          <button key={id} onClick={() => onTab(id)} style={{
            flex: 1, border: 'none', background: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '12px 0 10px',
          }}>
            {ico(on ? T.green : T.muted, 23)}
            <span style={{ fontSize: 10.5, fontWeight: 700, color: on ? T.green : T.muted }}>{lab}</span>
          </button>
        )
      })}
    </div>
  )
}
