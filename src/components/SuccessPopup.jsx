import React from 'react';

const S = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 3000,
    background: 'rgba(0,0,0,0.8)',
    backdropFilter: 'blur(12px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  card: {
    background: '#1a2436',
    border: '1px solid rgba(34,197,94,0.3)',
    borderRadius: 24,
    padding: '40px 32px',
    maxWidth: 400,
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
    fontFamily: "'Plus Jakarta Sans', sans-serif"
  },
  icon: {
    width: 64,
    height: 64,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #22c55e, #00d4aa)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 28,
    color: '#fff',
    margin: '0 auto 24px',
    boxShadow: '0 10px 20px rgba(34,197,94,0.3)'
  },
  title: {
    fontSize: 22,
    fontWeight: 800,
    color: '#fff',
    marginBottom: 8
  },
  msg: {
    fontSize: 14,
    color: '#8b9cc8',
    lineHeight: 1.6,
    marginBottom: 32
  },
  btn: {
    width: '100%',
    padding: '14px',
    borderRadius: 12,
    border: 'none',
    background: 'linear-gradient(135deg, #22c55e, #00d4aa)',
    color: '#fff',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer'
  }
};

export default function SuccessPopup({ onClose, onViewDashboard }) {
  return (
    <div style={S.overlay}>
      <div style={S.card}>
        <div style={S.icon}>✓</div>
        <h3 style={S.title}>Application Submitted!</h3>
        <p style={S.msg}>Your application for the government scheme has been submitted successfully. ✅</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button style={S.btn} onClick={() => onViewDashboard()}>View My Schemes</button>
          <button 
            style={{ ...S.btn, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#8b9cc8' }} 
            onClick={() => onClose()}
          >
            Apply for Another
          </button>
        </div>
      </div>
    </div>
  );
}
