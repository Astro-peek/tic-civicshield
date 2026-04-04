import React, { useState } from 'react';

const S = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 2000,
    background: 'rgba(0,0,0,0.85)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  card: {
    background: '#1a2436',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 24,
    padding: '32px 40px',
    maxWidth: 440,
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
    fontFamily: "'Plus Jakarta Sans', sans-serif"
  },
  stepIndicator: {
    display: 'flex',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 32
  },
  dot: (active) => ({
    width: 32,
    height: 4,
    borderRadius: 4,
    background: active ? '#4f8ef7' : 'rgba(255,255,255,0.1)',
    transition: 'all 0.3s'
  }),
  loadingSpinner: {
    width: 24,
    height: 24,
    border: '3px solid rgba(255,255,255,0.1)',
    borderTopColor: '#4f8ef7',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 20px'
  },
  input: {
    width: '100%',
    padding: '14px 18px',
    borderRadius: 14,
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.06)',
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    outline: 'none',
    marginBottom: 20
  },
  btn: {
    width: '100%',
    padding: '16px',
    borderRadius: 14,
    border: 'none',
    background: 'linear-gradient(135deg, #0056b3, #007bff)',
    color: '#fff',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer'
  }
};

export default function DigiLockerModal({ onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const simulateStep = (nextStep) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(nextStep);
    }, 1500);
  };

  return (
    <div style={S.overlay}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      
      <div style={S.card}>
        {/* Step Indicator */}
        <div style={S.stepIndicator}>
          <div style={S.dot(step >= 1)} />
          <div style={S.dot(step >= 2)} />
          <div style={S.dot(step >= 3)} />
        </div>

        {loading ? (
          <div style={{ padding: '40px 0' }}>
            <div style={S.loadingSpinner} />
            <p style={{ color: '#8b9cc8', fontSize: 14 }}>Securely connecting to DigiLocker...</p>
          </div>
        ) : (
          <>
            {step === 1 && (
              <div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 12 }}>Aadhaar Authentication</h3>
                <p style={{ fontSize: 14, color: '#8b9cc8', marginBottom: 24 }}>Enter your 12-digit Aadhaar number to fetch details</p>
                <input style={S.input} type="text" placeholder="XXXX XXXX XXXX" maxLength={12} />
                <button style={S.btn} onClick={() => simulateStep(2)}>Send OTP</button>
              </div>
            )}

            {step === 2 && (
              <div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 12 }}>OTP Verification</h3>
                <p style={{ fontSize: 14, color: '#8b9cc8', marginBottom: 24 }}>Enter the 6-digit code sent to your mobile</p>
                <input style={S.input} type="text" placeholder="000000" maxLength={6} />
                <button style={S.btn} onClick={() => simulateStep(3)}>Verify</button>
              </div>
            )}

            {step === 3 && (
              <div>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: '#00d4aa', marginBottom: 12 }}>Success!</h3>
                <p style={{ fontSize: 14, color: '#8b9cc8', marginBottom: 24 }}>Your data has been fetched successfully.</p>
                
                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: 16, textAlign: 'left', marginBottom: 24 }}>
                  {[
                    ['Name', 'Ashish Sahu'],
                    ['Income', '₹ 5,00,000'],
                    ['State', 'Madhya Pradesh'],
                    ['Category', 'OBC']
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 12, color: '#6b7fa8' }}>{k}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{v}</span>
                    </div>
                  ))}
                </div>

                <button style={{ ...S.btn, background: '#00d4aa' }} onClick={() => onSuccess()}>Continue</button>
              </div>
            )}
          </>
        )}

        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: 24, right: 24, background: 'none', border: 'none', color: '#6b7fa8', fontSize: 20, cursor: 'pointer' }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
