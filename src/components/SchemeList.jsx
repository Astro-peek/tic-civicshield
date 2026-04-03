// src/components/SchemeList.jsx
import React, { useState, useEffect } from 'react';
import { getAppliedSchemes, subscribe } from '../stores/applicationstore';

export default function SchemeList({ onSelect }) {
  const [schemes, setSchemes] = useState(getAppliedSchemes());

  useEffect(() => {
    const unsub = subscribe(() => setSchemes([...getAppliedSchemes()]));
    return unsub;
  }, []);

  return (
    <div style={{ animation: 'fadeUp 0.3s ease-out' }}>
      <h3 style={{ color: '#f0f4ff', marginBottom: '16px', fontSize: '16px' }}>Your Applications / आपके आवेदन</h3>
      {schemes.map(scheme => (
        <button key={scheme.id} onClick={() => onSelect(scheme.id)} style={{
          width: '100%', background: '#141d2e', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 18, padding: 18, marginBottom: 12, cursor: 'pointer', textAlign: 'left',
          transition: 'transform 0.2s'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '14px' }}>{scheme.name}</div>
            <div style={{ color: '#f5a623', fontWeight: 800, fontSize: '14px' }}>{scheme.amount}</div>
          </div>
          <div style={{ marginTop: 14, height: 5, background: 'rgba(255,255,255,0.05)', borderRadius: 5 }}>
             <div style={{ width: '25%', height: '100%', background: 'linear-gradient(90deg, #00d4aa, #4f8ef7)', borderRadius: 5 }} />
          </div>
        </button>
      ))}
    </div>
  );
}