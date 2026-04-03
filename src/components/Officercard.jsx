// src/components/OfficerCard.jsx
import React from 'react'

export default function OfficerCard({ schemeId }) {
  return (
    <div style={{ background: '#141d2e', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', animation: 'fadeUp 0.3s' }}>
      <p style={{ color: '#8b9cc8', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px' }}>Assigned Officer / संबंधित अधिकारी</p>
      <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
        <div style={{ width: 50, height: 50, borderRadius: '16px', background: 'linear-gradient(135deg, #ff9933, #e65c00)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>👮</div>
        <div>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: '15px' }}>Rajesh Sharma</div>
          <div style={{ color: '#8b9cc8', fontSize: '12px' }}>Agriculture Dept · MP Government</div>
          <div style={{ color: '#00d4aa', fontSize: '11px', marginTop: '4px', fontWeight: 600 }}>ID: BH-44291-AG</div>
        </div>
      </div>
    </div>
  )
}