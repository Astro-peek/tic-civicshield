// src/components/WhatsAppShare.jsx
import React from 'react'

export default function WhatsAppShare({ schemeId }) {
  const share = () => {
     const msg = `🛡️ SchemeMatch Status Update\nMy application for PM-KISAN is now at the 'Verified' stage.\n\nTrack yours at: scheme-match.gov.in`;
     window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  }
  
  return (
    <div style={{ background: '#141d2e', padding: '24px', borderRadius: '20px', textAlign: 'center', border: '1px solid rgba(37,211,102,0.2)' }}>
      <div style={{ fontSize: '32px', marginBottom: '10px' }}>📲</div>
      <h4 style={{ color: '#fff', marginBottom: '8px' }}>Share with Family</h4>
      <p style={{ color: '#8b9cc8', fontSize: '12px', marginBottom: '20px' }}>Keep your family updated on your scheme status via WhatsApp.</p>
      <button onClick={share} style={{ width: '100%', padding: '14px', borderRadius: '12px', background: '#25d366', color: '#fff', border: 'none', fontWeight: 800, cursor: 'pointer', transition: '0.2s' }}>
        Share on WhatsApp
      </button>
    </div>
  )
}