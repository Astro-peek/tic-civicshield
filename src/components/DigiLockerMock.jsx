import React, { useState } from 'react';

/**
 * 🔒 DigiLockerMock Component
 * Simulates a DigiLocker authentication and data retrieval flow.
 * 
 * Flow: Aadhaar -> OTP (123456) -> Success -> Call onSuccess
 */

const MOCK_USER_DATA = {
  name: "Ashish Sahu",
  age: 20,
  income: 200000,
  state: "Madhya Pradesh",
  category: "OBC",
  documents: [
    {
      type: "Aadhaar",
      number: "XXXX-XXXX-1234"
    },
    {
      type: "Income Certificate",
      income: 200000
    }
  ]
};

const S = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 3000,
    background: 'rgba(0,0,0,0.8)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  card: {
    background: '#1a2436',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 24,
    padding: 32,
    maxWidth: 420,
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
    fontFamily: "'Plus Jakarta Sans', sans-serif"
  },
  header: {
    marginBottom: 24
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 16,
    borderRadius: 12
  },
  title: {
    fontSize: 20,
    fontWeight: 800,
    color: '#fff',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 13,
    color: '#8b9cc8',
    lineHeight: 1.5
  },
  inputGroup: {
    marginBottom: 20,
    textAlign: 'left'
  },
  label: {
    fontSize: 11,
    fontWeight: 700,
    color: '#6b7fa8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    display: 'block',
    marginBottom: 8
  },
  input: {
    width: '100%',
    padding: '14px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12,
    color: '#fff',
    fontSize: 15,
    outline: 'none',
    transition: 'all 0.2s',
    boxSizing: 'border-box'
  },
  btn: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #0056b3, #007bff)',
    border: 'none',
    borderRadius: 12,
    color: '#fff',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  secondaryBtn: {
    background: 'transparent',
    border: 'none',
    color: '#6b7fa8',
    fontSize: 13,
    marginTop: 16,
    cursor: 'pointer'
  }
};

export default function DigiLockerMock({ onSuccess, onClose }) {
  const [step, setStep] = useState('aadhaar'); // aadhaar | otp | success
  const [aadhaar, setAadhaar] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const simulateDelay = (nextStep, duration = 1500) => {
    setLoading(true);
    setError('');
    setTimeout(() => {
      setLoading(false);
      setStep(nextStep);
    }, duration);
  };

  const handleSendOtp = () => {
    if (aadhaar.length < 12) {
      setError('Please enter a valid 12-digit Aadhaar number');
      return;
    }
    simulateDelay('otp');
  };

  const handleVerifyOtp = () => {
    if (otp === '123456') {
      simulateDelay('success');
    } else {
      setError('Invalid OTP. Please use 123456');
    }
  };

  const handleFinish = () => {
    onSuccess(MOCK_USER_DATA);
  };

  return (
    <div style={S.overlay}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          display: inline-block;
          margin-right: 10px;
          vertical-align: middle;
        }
      `}</style>
      
      <div style={S.card}>
        {/* Logo Section */}
        <div style={S.header}>
          <div style={{...S.logo, background: 'linear-gradient(135deg, #0056b3, #00d4aa)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24}}>
            🔒
          </div>
          <div style={S.title}>DigiLocker Integration</div>
          <div style={S.subtitle}>Securely fetch your documents for instant application</div>
        </div>

        {step === 'aadhaar' && (
          <div className="step-content">
            <div style={S.inputGroup}>
              <label style={S.label}>Aadhaar Number</label>
              <input 
                style={S.input} 
                type="text" 
                placeholder="XXXX-XXXX-XXXX" 
                maxLength={12}
                value={aadhaar}
                onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ''))}
                disabled={loading}
              />
            </div>
            {error && <div style={{color: '#ff4d4d', fontSize: 12, marginBottom: 12}}>{error}</div>}
            <button style={S.btn} onClick={handleSendOtp} disabled={loading}>
              {loading ? <><span className="spinner"></span>Sending OTP...</> : 'Send OTP'}
            </button>
          </div>
        )}

        {step === 'otp' && (
          <div className="step-content">
            <div style={S.inputGroup}>
              <label style={S.label}>Enter 6-digit OTP</label>
              <div style={{fontSize: 11, color: '#f5a623', marginBottom: 8}}>Test OTP: 123456</div>
              <input 
                style={S.input} 
                type="text" 
                placeholder="000000" 
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                disabled={loading}
              />
            </div>
            {error && <div style={{color: '#ff4d4d', fontSize: 12, marginBottom: 12}}>{error}</div>}
            <button style={S.btn} onClick={handleVerifyOtp} disabled={loading}>
              {loading ? <><span className="spinner"></span>Verifying...</> : 'Verify & Fetch'}
            </button>
            <button style={S.secondaryBtn} onClick={() => setStep('aadhaar')}>Back to Aadhaar</button>
          </div>
        )}

        {step === 'success' && (
          <div className="step-content">
            <div style={{fontSize: 48, marginBottom: 16}}>🎉</div>
            <div style={{fontSize: 18, fontWeight: 700, color: '#00d4aa', marginBottom: 8}}>Authentication Successful!</div>
            <div style={{fontSize: 13, color: '#8b9cc8', marginBottom: 24}}>
              User found: <b>Ashish Sahu</b><br/>
              Documents fetched: Aadhaar, Income Certificate
            </div>
            <button style={{...S.btn, background: '#00d4aa'}} onClick={handleFinish}>
              Continue to Application
            </button>
          </div>
        )}

        {step !== 'success' && (
          <button style={S.secondaryBtn} onClick={onClose}>Cancel</button>
        )}
      </div>
    </div>
  );
}
