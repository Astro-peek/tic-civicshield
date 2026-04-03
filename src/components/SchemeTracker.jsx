
import React from 'react'
import { STAGE_CONFIG } from '../data/mockdata'

export default function SchemeTracker({ schemeId }) {
  const activeIdx = 0; 

  return (
    <div style={{ background: '#141d2e', borderRadius: 20, padding: 24, border: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        {STAGE_CONFIG.map((stage, i) => (
          <div key={stage.id} style={{ textAlign: 'center', flex: 1, position: 'relative' }}>
            <div style={{ 
              width: 40, height: 40, borderRadius: '50%', margin: '0 auto 8px',
              background: i <= activeIdx ? '#ff9933' : '#1a2540',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: i <= activeIdx ? 'none' : '1px solid rgba(255,255,255,0.1)',
              color: '#fff', fontWeight: 700
            }}>
              {i < activeIdx ? '✓' : stage.icon}
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: i <= activeIdx ? '#fff' : '#4a5580' }}>{stage.label}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: '20px', background: 'rgba(255,153,51,0.05)', borderRadius: 12, border: '1px solid rgba(255,153,51,0.2)' }}>
         <div style={{ color: '#ff9933', fontWeight: 700, fontSize: 13, marginBottom: 4 }}>Next Step: Document Verification</div>
         <div style={{ color: '#8b9cc8', fontSize: 12 }}>Officer will verify your Aadhaar within 3 days.</div>
      </div>
    </div>
  )
}