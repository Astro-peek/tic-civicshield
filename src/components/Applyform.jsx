import React, { useState } from 'react';

const S = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 2000,
    background: 'rgba(0,0,0,0.8)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  card: {
    background: '#111827',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 24,
    padding: '32px',
    maxWidth: 520,
    width: '100%',
    textAlign: 'left',
    boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    position: 'relative'
  },
  label: {
    fontSize: 12,
    color: '#6b7fa8',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    display: 'block',
    marginBottom: 8
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.05)',
    color: '#fff',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: 16
  },
  docSection: {
    padding: '16px',
    background: 'rgba(79,142,247,0.05)',
    border: '1px solid rgba(79,142,247,0.15)',
    borderRadius: 14,
    marginBottom: 24
  },
  docItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  btn: {
    width: '100%',
    padding: '14px',
    borderRadius: 12,
    border: 'none',
    background: 'linear-gradient(135deg, #4f8ef7, #7c6fef)',
    color: '#fff',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer'
  }
};

export default function ApplyForm({ scheme, onBack, onSubmit }) {
  const [name, setName] = useState('');
  const [income, setIncome] = useState('');
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!scheme) return null;

  const handleSubmit = async () => {
    if (!name || !income) {
      alert("Please fill all mandatory fields.");
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit({ name, income, file });
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
    }
  };

  return (
    <div style={S.overlay}>
      <div style={S.card}>
        <button 
          onClick={onBack}
          style={{ marginBottom: 16, background: 'none', border: 'none', color: '#4f8ef7', cursor: 'pointer', fontSize: 13, padding: 0 }}
        >
          ← Back to Schemes
        </button>

        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Apply for Scheme</h2>
        <p style={{ fontSize: 13, color: '#8b9cc8', marginBottom: 24 }}>Official application form for: <b style={{ color: '#fff' }}>{scheme.name}</b></p>

        <div style={{ marginBottom: 20 }}>
          <label style={S.label}>Applicant Full Name *</label>
          <input 
            style={S.input} 
            type="text" 
            placeholder="e.g. Ashish Sahu" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />

          <label style={S.label}>Annual Income (₹) *</label>
          <input 
            style={S.input} 
            type="number" 
            placeholder="5,00,000" 
            value={income} 
            onChange={(e) => setIncome(e.target.value)} 
          />

          <label style={S.label}>Upload ID Proof (Aadhaar/PAN)</label>
          <input 
            style={{ ...S.input, padding: '10px' }} 
            type="file" 
            onChange={(e) => setFile(e.target.files?.[0])}
          />
        </div>

        <div style={S.docSection}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#4f8ef7', textTransform: 'uppercase', marginBottom: 12 }}>Required Documents Templates</p>
          
          <div style={S.docItem}>
            <span style={{ fontSize: 13, color: '#f0f4ff' }}>📄 Aadhaar Card Template</span>
            <a href="/aadhaar_sample.txt" download="Aadhaar_Template.txt" style={{ textDecoration: 'none', padding: '6px 12px', borderRadius: 8, background: '#1c2533', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 12, cursor: 'pointer' }}>Download</a>
          </div>

          <div style={{ ...S.docItem, marginBottom: 0 }}>
            <span style={{ fontSize: 13, color: '#f0f4ff' }}>📄 Income Certificate Template</span>
            <a href="/income_certificate_sample.txt" download="Income_Template.txt" style={{ textDecoration: 'none', padding: '6px 12px', borderRadius: 8, background: '#1c2533', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 12, cursor: 'pointer' }}>Download</a>
          </div>
        </div>

        <button 
          style={{ 
            ...S.btn, 
            opacity: isSubmitting ? 0.7 : 1, 
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10
          }} 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting && <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />}
          {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
        </button>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>

        <button 
          onClick={onBack}
          style={{ position: 'absolute', top: 24, right: 24, background: 'none', border: 'none', color: '#6b7fa8', fontSize: 20, cursor: 'pointer' }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
