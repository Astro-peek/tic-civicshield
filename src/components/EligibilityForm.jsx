// src/components/EligibilityForm.jsx
import React from 'react';

export default function EligibilityForm({ onFind, onDigiLocker }) {
  return (
    <div style={{ background: '#111827', borderRadius: 20, padding: '24px', border: '1px solid rgba(255,255,255,0.08)', animation: 'fadeUp 0.3s' }}>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Find Your Scheme / योजना ढूंढें</h2>
      <p style={{ fontSize: 13, color: '#6b7fa8', marginBottom: 24 }}>Enter your details to discover government benefits</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ fontSize: '11px', color: '#8b9cc8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Full Name</label>
          <input style={{ width: '100%', padding: '12px', background: '#1a2540', border: '1px solid #2a3b5a', color: '#fff', borderRadius: '10px', boxSizing: 'border-box' }} placeholder="e.g. Ashish Sahu" />
        </div>
        <div>
          <label style={{ fontSize: '11px', color: '#8b9cc8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Annual Income (₹)</label>
          <input style={{ width: '100%', padding: '12px', background: '#1a2540', border: '1px solid #2a3b5a', color: '#fff', borderRadius: '10px', boxSizing: 'border-box' }} placeholder="e.g. 500000" type="number" />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <select style={{ padding: '12px', background: '#1a2540', border: '1px solid #2a3b5a', color: '#fff', borderRadius: '10px' }}>
            <option>General</option><option>OBC</option><option>SC/ST</option>
          </select>
          <select style={{ padding: '12px', background: '#1a2540', border: '1px solid #2a3b5a', color: '#fff', borderRadius: '10px' }}>
            <option>Madhya Pradesh</option><option>Maharashtra</option><option>Delhi</option>
          </select>
        </div>

        <button style={{ padding: '14px', background: 'linear-gradient(135deg, #ff9933, #e65c00)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', marginTop: '10px' }} onClick={onFind}>
          Find My Scheme
        </button>
        
        <button style={{ padding: '14px', background: 'rgba(79,142,247,0.1)', color: '#4f8ef7', border: '1px solid rgba(79,142,247,0.3)', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }} onClick={onDigiLocker}>
          Fetch from DigiLocker 🔒
        </button>
      </div>
    </div>
  );
}