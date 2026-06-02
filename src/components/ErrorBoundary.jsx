import React from 'react'
import { T } from '../theme.js'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div style={{
        position: 'fixed', inset: 0, background: T.canvas, display: 'flex',
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '40px 30px', textAlign: 'center', fontFamily: T.ui,
      }}>
        <div style={{ fontSize: 48, marginBottom: 20 }}>⚠️</div>
        <div style={{ fontSize: 22, fontWeight: 800, fontFamily: T.display, color: T.ink, marginBottom: 10 }}>Something went wrong</div>
        <div style={{ fontSize: 14, color: T.muted, lineHeight: 1.6, marginBottom: 32, maxWidth: 300 }}>
          {this.state.error?.message || 'An unexpected error occurred.'}
        </div>
        <button
          onClick={() => window.location.reload()}
          style={{
            height: 52, padding: '0 28px', borderRadius: 14, border: 'none',
            background: T.ink, color: '#fff', fontSize: 15, fontWeight: 700,
            fontFamily: T.ui, cursor: 'pointer',
          }}
        >
          Reload app
        </button>
      </div>
    )
  }
}
