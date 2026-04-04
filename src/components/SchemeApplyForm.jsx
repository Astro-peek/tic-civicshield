import React, { useState } from 'react';

const S = {
  overlay: { position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 20 },
  card: { width: '100%', maxWidth: 500, background: '#121a2f', borderRadius: 24, padding: 24, border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', position: 'relative' },
  header: { fontSize: 22, fontWeight: 700, color: '#f0f4ff', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 },
  label: { fontSize: 13, color: '#8b9cc8', fontWeight: 600, display: 'block', marginBottom: 8, marginTop: 16 },
  input: { width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#fff', fontSize: 14, outline: 'none', transition: 'all 0.2s', },
  fileInputBox: { marginTop: 8, padding: 24, border: '2px dashed rgba(79,142,247,0.3)', borderRadius: 12, background: 'rgba(79,142,247,0.05)', textAlign: 'center', cursor: 'pointer', position: 'relative', transition: 'all 0.2s' },
  btn: { width: '100%', padding: '14px', borderRadius: 12, marginTop: 24, fontSize: 15, fontWeight: 700, color: '#fff', border: 'none', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }
};

export default function SchemeApplyForm({ scheme, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', income: '', category: 'General', state: '' });
  const [file, setFile] = useState(null);

  const setF = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    setStep(2); // Loading State
    // Simulate backend logic
    setTimeout(() => {
      console.log("Submitting application:", { ...form, scheme: scheme?.name, document: file?.name });
      setStep(3); // Success State
      if (onSuccess) onSuccess();
    }, 1500);
  };

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.card} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: '#8b9cc8', fontSize: 24, cursor: 'pointer' }}>&times;</button>
        
        {step === 1 && (
          <div style={{ animation: 'fadeUp 0.3s ease-out' }}>
            <div style={S.header}>
              <span style={{ fontSize: 28 }}>{scheme?.emoji || '📄'}</span>
              <div>
                <div style={{ fontSize: 18, lineHeight: 1.2 }}>Apply for</div>
                <div style={{ color: '#4f8ef7', fontSize: 14 }}>{scheme?.name || 'Scheme Name'}</div>
              </div>
            </div>

            <label style={S.label}>Full Name</label>
            <input style={S.input} placeholder="e.g. Rajesh Kumar" value={form.name} onChange={(e) => setF('name', e.target.value)} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={S.label}>Annual Income (₹)</label>
                <input style={S.input} type="number" placeholder="150000" value={form.income} onChange={(e) => setF('income', e.target.value)} />
              </div>
              <div>
                <label style={S.label}>Category</label>
                <select style={{ ...S.input, appearance: 'none' }} value={form.category} onChange={(e) => setF('category', e.target.value)}>
                  {['General', 'OBC', 'SC', 'ST', 'EWS'].map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <label style={S.label}>State</label>
            <input style={S.input} placeholder="e.g. Maharashtra" value={form.state} onChange={(e) => setF('state', e.target.value)} />

            <label style={S.label}>Upload Supporting Document</label>
            <label style={{ ...S.fileInputBox, borderColor: file ? '#22c55e' : 'rgba(79,142,247,0.3)', background: file ? 'rgba(34,197,94,0.05)' : 'rgba(79,142,247,0.05)' }}>
              <input type="file" style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} onChange={handleFileChange} />
              <div style={{ fontSize: 24, marginBottom: 8 }}>{file ? '✅' : '📄'}</div>
              <div style={{ color: file ? '#22c55e' : '#4f8ef7', fontWeight: 600, fontSize: 13 }}>
                {file ? file.name : 'Click or drag file to upload'}
              </div>
              <div style={{ fontSize: 11, color: '#6b7fa8', marginTop: 4 }}>PDF, JPG, or PNG (Max 5MB)</div>
            </label>

            <button 
              onClick={handleSubmit} 
              disabled={!form.name || !form.income || !file}
              style={{ ...S.btn, background: (!form.name || !form.income || !file) ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #4f8ef7, #2563eb)' }}
            >
              Submit Application &rarr;
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={{ textAlign: 'center', padding: '40px 0', animation: 'fadeUp 0.3s ease-out' }}>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <div style={{ width: 48, height: 48, border: '4px solid rgba(79,142,247,0.2)', borderTopColor: '#4f8ef7', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }} />
            <h3 style={{ color: '#fff', margin: '0 0 8px' }}>Processing Application...</h3>
            <p style={{ color: '#8b9cc8', fontSize: 14, margin: 0 }}>Securely uploading your document</p>
          </div>
        )}

        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '30px 0', animation: 'fadeUp 0.3s ease-out' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
            <h3 style={{ color: '#22c55e', margin: '0 0 12px', fontSize: 24 }}>Application Submitted!</h3>
            <p style={{ color: '#8b9cc8', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
              Your application for <b>{scheme?.name}</b> has been received successfully.
            </p>
            <button onClick={onClose} style={{ ...S.btn, background: 'rgba(255,255,255,0.1)' }}>Close Window</button>
          </div>
        )}
      </div>
    </div>
  );
}
