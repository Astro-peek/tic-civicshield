// src/components/ApplyForm.jsx
import React from 'react';

export default function ApplyForm({ scheme, onSubmit, onBack }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div style={{ background: '#1a2436', padding: '32px', borderRadius: '28px', maxWidth: '440px', width: '100%', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h3 style={{ color: '#fff', marginBottom: '8px', fontSize: '20px' }}>Official Application</h3>
        <p style={{ color: '#8b9cc8', fontSize: '13px' }}>Scheme: <b style={{ color: '#ff9933' }}>{scheme?.name}</b></p>
        
        <div style={{ margin: '24px 0', display: 'flex', flexDirection: 'column', gap: '15px' }}>
           <div>
              <label style={{ fontSize: '11px', color: '#4f8ef7', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Applicant Phone</label>
              <input style={{ width: '100%', padding: '14px', background: '#111827', border: '1px solid #2a3b5a', color: '#fff', borderRadius: '12px', boxSizing: 'border-box' }} placeholder="+91 XXXX XXXX XX" />
           </div>
           <div>
              <label style={{ fontSize: '11px', color: '#4f8ef7', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Identity Proof (Optional)</label>
              <input style={{ width: '100%', padding: '12px', background: '#111827', border: '1px solid #2a3b5a', color: '#8b9cc8', borderRadius: '12px', fontSize: '12px' }} type="file" />
           </div>
        </div>
        
        <button onClick={onSubmit} style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #22c55e, #00d4aa)', color: '#fff', border: 'none', borderRadius: '14px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 8px 20px rgba(34,197,94,0.3)' }}>
          Submit to Government Portal
        </button>
        <button onClick={onBack} style={{ width: '100%', marginTop: '12px', background: 'none', color: '#4a5580', border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Cancel & Go Back</button>
      </div>
    </div>
  );
}