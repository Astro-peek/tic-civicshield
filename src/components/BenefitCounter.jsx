// src/components/BenefitCounter.jsx
import React from 'react'

export default function BenefitCounter() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14, marginBottom: 24, padding: '0 2px' }}>
      {[
        { val: '1', label: 'Active Applications', color: '#4f8ef7' },
        { val: '₹6,000', label: 'Total Entitled', color: '#7c6fef' },
        { val: '₹2,000', label: 'Received', color: '#22c55e' },
      ].map(s => (
        <div key={s.label} style={{ background: '#141d2e', borderRadius: 16, padding: '16px 18px', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: s.color, marginBottom: 4 }}>{s.val}</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#f0f4ff' }}>{s.label}</div>
        </div>
      ))}
    </div>
  )
}