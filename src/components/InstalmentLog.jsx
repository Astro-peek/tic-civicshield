// src/components/InstalmentLog.jsx
import React from 'react'

export default function InstalmentLog({ schemeId }) {
  return (
    <div style={{ background: '#141d2e', padding: '20px', borderRadius: '16px', border: '1px solid rgba(34,197,94,0.2)', animation: 'fadeUp 0.3s' }}>
      <h4 style={{ color: '#22c55e', margin: '0 0 16px', fontSize: '15px' }}>💰 Payment Ledger / भुगतान विवरण</h4>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div>
          <div style={{ color: '#fff', fontSize: '13px', fontWeight: 600 }}>1st Instalment</div>
          <div style={{ color: '#6b7fa8', fontSize: '11px' }}>March 12, 2024</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: '#22c55e', fontWeight: 800, fontSize: '14px' }}>₹2,000</div>
          <div style={{ color: '#22c55e', fontSize: '10px' }}>PAID ✓</div>
        </div>
      </div>
    </div>
  )
}