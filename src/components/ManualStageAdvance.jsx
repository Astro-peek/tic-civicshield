import React, { useState } from 'react'
import { STAGE_CONFIG, SCHEMES, STAGE_TIMELINES } from '../data/mockData'
import { getLS, setLS } from '../utils/localStorage'

const STAGE_COLORS = ['#00d4aa','#4f8ef7','#7c6fef','#f5a623']

export default function ManualStageAdvance({ schemeId, activeIdx, onAdvance }) {
  const [confirming, setConfirming] = useState(false)
  const [success, setSuccess]       = useState(false)

  const scheme    = SCHEMES.find(s => s.id === schemeId)
  const nextStage = STAGE_CONFIG[activeIdx + 1]
  const color     = STAGE_COLORS[activeIdx + 1] || '#f5a623'

  if (!nextStage || activeIdx >= STAGE_CONFIG.length - 1) return null

  const handleConfirm = () => {
    // Save override to localStorage
    const overrides = getLS('stageOverrides', {})
    if (!overrides[schemeId]) overrides[schemeId] = {}
    overrides[schemeId][nextStage.id] = new Date().toISOString().split('T')[0]
    setLS('stageOverrides', overrides)

    setSuccess(true)
    setConfirming(false)
    setTimeout(() => { setSuccess(false); onAdvance && onAdvance() }, 2000)
  }

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif" }}>
      {!confirming && !success && (
        <div style={{ background: '#141d2e', border: `1px solid rgba(255,255,255,0.08)`, borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: '#6b7fa8', marginBottom: 2 }}>अगला चरण चिह्नित करें / Mark next stage</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#f0f4ff' }}>
              {nextStage.icon} {nextStage.labelHi} · {nextStage.label}
            </div>
          </div>
          <button
            onClick={() => setConfirming(true)}
            style={{ background: `${color}20`, border: `1px solid ${color}50`, borderRadius: 10, padding: '8px 14px', color, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", whiteSpace: 'nowrap' }}
          >
            मार्क करें →
          </button>
        </div>
      )}

      {confirming && (
        <div style={{ background: '#141d2e', border: `1px solid ${color}40`, borderRadius: 14, padding: '16px' }}>
          <div style={{ fontSize: 13, color: '#f0f4ff', fontWeight: 600, marginBottom: 4 }}>
            क्या आप "{nextStage.labelHi}" चरण पूरा करना चाहते हैं?
          </div>
          <div style={{ fontSize: 11, color: '#6b7fa8', marginBottom: 14 }}>
            Are you sure you want to mark "{nextStage.label}" as done? This will update your tracker.
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setConfirming(false)} style={{ flex: 1, padding: '9px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#8b9cc8', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>
              रद्द / Cancel
            </button>
            <button onClick={handleConfirm} style={{ flex: 1, padding: '9px', borderRadius: 10, border: `1px solid ${color}60`, background: `${color}20`, color, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>
              हाँ, मार्क करें ✓
            </button>
          </div>
        </div>
      )}

      {success && (
        <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>✅</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#22c55e' }}>चरण अपडेट हो गया! Stage updated!</div>
            <div style={{ fontSize: 11, color: '#6b7fa8' }}>Tracker refreshing...</div>
          </div>
        </div>
      )}
    </div>
  )
}
