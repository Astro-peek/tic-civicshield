// src/components/SchemeResultList.jsx
import React from 'react';

export default function SchemeResultList({ onApply }) {
  const matches = [
    { id: 1, name: 'PM-KISAN Samman Nidhi', benefit: '₹6,000/year', match: '98%', category: 'Agriculture' },
    { id: 2, name: 'Ayushman Bharat PM-JAY', benefit: '₹5L Insurance', match: '85%', category: 'Health' },
  ];

  return (
    <div style={{ animation: 'fadeUp 0.3s' }}>
      <h3 style={{ color: '#fff', marginBottom: '20px', fontSize: '18px' }}>Matched Schemes Based on Your AI Profile</h3>
      {matches.map(s => (
        <div key={s.id} style={{ background: '#111827', padding: '24px', borderRadius: '18px', marginBottom: '16px', border: '1px solid rgba(255,153,51,0.2)', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: '16px' }}>{s.name}</div>
            <div style={{ color: '#00d4aa', fontWeight: 900, background: 'rgba(0,212,170,0.1)', padding: '4px 10px', borderRadius: '8px', fontSize: '12px' }}>{s.match} Match</div>
          </div>
          <p style={{ color: '#8b9cc8', fontSize: '13px', margin: '0 0 20px' }}>Benefit: <span style={{ color: '#f5a623', fontWeight: 700 }}>{s.benefit}</span></p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)', color: '#8b9cc8', border: 'none', borderRadius: '10px', fontSize: '12px', fontWeight: 700 }}>View Details</button>
            <button style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #4f8ef7, #7c6fef)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }} onClick={() => onApply(s)}>Apply Now</button>
          </div>
        </div>
      ))}
    </div>
  );
}