// src/components/DigiLockerModal.jsx
import React, { useState } from 'react';

export default function DigiLockerModal({ onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const simulateStep = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(prev => prev + 1); }, 1500);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(5,8,15,0.9)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div style={{ background: '#1a2436', padding: '40px', borderRadius: '28px', maxWidth: '400px', width: '100%', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#4a5580', fontSize: '20px', cursor: 'pointer' }}>✕</button>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '30px' }}>
          {[1, 2, 3].map(i => <div key={i} style={{ width: '30px', height: '4px', background: step >= i ? '#4f8ef7' : 'rgba(255,255,255,0.1)', borderRadius: '2px' }} />)}
        </div>

        {loading ? (
          <div style={{ padding: '40px 0' }}>
            <div style={{ width: '30px', height: '30px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#4f8ef7', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }} />
            <p style={{ color: '#8b9cc8', fontSize: '14px' }}>Connecting to DigiLocker...</p>
          </div>
        ) : (
          <>
            {step === 1 && (
              <div style={{ animation: 'fadeUp 0.3s' }}>
                <h3 style={{ color: '#fff', marginBottom: '10px' }}>Enter Aadhaar</h3>
                <p style={{ color: '#8b9cc8', fontSize: '13px', marginBottom: '24px' }}>Authenticate using your 12-digit UIDAI number</p>
                <input style={{ width: '100%', padding: '14px', background: '#111827', border: '1px solid #2a3b5a', color: '#fff', borderRadius: '12px', textAlign: 'center', fontSize: '18px', letterSpacing: '4px', boxSizing: 'border-box' }} placeholder="•••• •••• ••••" maxLength={12} />
                <button onClick={simulateStep} style={{ width: '100%', padding: '15px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '12px', marginTop: '20px', fontWeight: 700, cursor: 'pointer' }}>Send OTP</button>
              </div>
            )}
            {step === 2 && (
              <div style={{ animation: 'fadeUp 0.3s' }}>
                <h3 style={{ color: '#fff', marginBottom: '10px' }}>Verify OTP</h3>
                <p style={{ color: '#8b9cc8', fontSize: '13px', marginBottom: '24px' }}>Enter the 6-digit code sent to your phone</p>
                <input style={{ width: '100%', padding: '14px', background: '#111827', border: '1px solid #2a3b5a', color: '#fff', borderRadius: '12px', textAlign: 'center', fontSize: '20px', letterSpacing: '8px', boxSizing: 'border-box' }} placeholder="••••••" maxLength={6} />
                <button onClick={simulateStep} style={{ width: '100%', padding: '15px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '12px', marginTop: '20px', fontWeight: 700, cursor: 'pointer' }}>Verify & Fetch</button>
              </div>
            )}
            {step === 3 && (
              <div style={{ animation: 'fadeUp 0.3s' }}>
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>✅</div>
                <h3 style={{ color: '#00d4aa', marginBottom: '10px' }}>Data Fetched</h3>
                <p style={{ color: '#8b9cc8', fontSize: '13px', marginBottom: '24px' }}>Authenticated as: <b>Ashish Sahu</b></p>
                <button onClick={onSuccess} style={{ width: '100%', padding: '15px', background: '#00d4aa', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>Continue to Results</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}