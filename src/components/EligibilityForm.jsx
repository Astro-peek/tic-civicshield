import React, { useState } from 'react';

const S = {
  card: {
    background: '#111827',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: '24px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  label: {
    fontSize: 11,
    color: '#6b7fa8',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    display: 'block',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.05)',
    color: '#fff',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: 16,
    transition: 'all 0.2s',
  },
  btnPrimary: {
    width: '100%',
    padding: '14px',
    borderRadius: 12,
    border: 'none',
    background: 'linear-gradient(135deg, #4f8ef7, #7c6fef)',
    color: '#fff',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    marginBottom: 12,
  },
  btnSecondary: {
    width: '100%',
    padding: '14px',
    borderRadius: 12,
    border: '1px solid rgba(79,142,247,0.3)',
    background: 'rgba(79,142,247,0.05)',
    color: '#4f8ef7',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  }
};

const CATEGORIES = ['general', 'obc', 'sc', 'st', 'ews', 'minority'];
const OCCUPATIONS = ['farmer', 'unemployed', 'student', 'salaried', 'self', 'homemaker'];
const GENDERS = ['male', 'female', 'other'];

export default function EligibilityForm({ onFind, onDigiLocker }) {
  const [profile, setProfile] = useState({
    name: '',
    income: 300000,
    category: 'general',
    occupation: 'unemployed',
    gender: 'male',
    state: 'Maharashtra'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: name === 'income' ? Number(value) : value }));
  };

  return (
    <div style={S.card}>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Find Your Scheme</h2>
      <p style={{ fontSize: 13, color: '#6b7fa8', marginBottom: 24 }}>Enter your details to discover government benefits</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ gridColumn: 'span 2' }}>
          <label style={S.label}>Full Name</label>
          <input 
            style={{...S.input, marginBottom: 12}} 
            name="name"
            value={profile.name}
            onChange={handleChange}
            type="text" 
            placeholder="e.g. Ashish Sahu" 
          />
        </div>

        <div style={{ gridColumn: 'span 2' }}>
          <label style={S.label}>Annual Income (₹)</label>
          <input 
            style={{...S.input, marginBottom: 12}} 
            name="income"
            value={profile.income}
            onChange={handleChange}
            type="number" 
            placeholder="e.g. 500000" 
          />
        </div>

        <div>
          <label style={S.label}>Category</label>
          <select style={S.input} name="category" value={profile.category} onChange={handleChange}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
          </select>
        </div>

        <div>
          <label style={S.label}>Occupation</label>
          <select style={S.input} name="occupation" value={profile.occupation} onChange={handleChange}>
            {OCCUPATIONS.map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
          </select>
        </div>

        <div>
          <label style={S.label}>Gender</label>
          <select style={S.input} name="gender" value={profile.gender} onChange={handleChange}>
            {GENDERS.map(g => <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>)}
          </select>
        </div>

        <div>
          <label style={S.label}>Current State</label>
          <input 
            style={S.input} 
            name="state"
            value={profile.state}
            onChange={handleChange}
            type="text" 
            placeholder="e.g. Madhya Pradesh" 
          />
        </div>
      </div>

      <button style={S.btnPrimary} onClick={() => onFind(profile)}>Find My Scheme</button>
      
      <button style={S.btnSecondary} onClick={() => onDigiLocker()}>
        <span>🔒</span> Fetch from DigiLocker
      </button>
    </div>
  );
}
