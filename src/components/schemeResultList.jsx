import React from 'react';

const S = {
  card: {
    background: '#111827',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: '24px',
    marginBottom: 16,
    transition: 'all 0.2s',
    fontFamily: "'Plus Jakarta Sans', sans-serif"
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16
  },
  title: {
    fontSize: 18,
    fontWeight: 800,
    color: '#fff',
    maxWidth: '70%'
  },
  benefitPill: {
    padding: '8px 16px',
    background: 'rgba(34,197,94,0.1)',
    border: '1px solid rgba(34,197,94,0.25)',
    borderRadius: 12,
    color: '#22c55e',
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 16,
    display: 'inline-block'
  },
  tagGroup: {
    display: 'flex',
    gap: 8,
    marginBottom: 20,
    flexWrap: 'wrap'
  },
  tag: {
    padding: '4px 10px',
    background: 'rgba(79,142,247,0.1)',
    border: '1px solid rgba(79,142,247,0.2)',
    borderRadius: 8,
    color: '#4f8ef7',
    fontSize: 11,
    fontWeight: 600
  },
  btn: {
    width: '100%',
    padding: '12px',
    borderRadius: 12,
    border: 'none',
    background: 'linear-gradient(135deg, #4f8ef7, #7c6fef)',
    color: '#fff',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer'
  }
};

export default function SchemeResultList({ schemes = [], onApply, onViewDetails }) {
  if (schemes.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: 24, border: '1px dashed rgba(255,255,255,0.1)' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
        <h3 style={{ color: '#fff', fontSize: 18, marginBottom: 8 }}>No matches found yet</h3>
        <p style={{ color: '#6b7fa8', fontSize: 14 }}>Try adjusting your income or category to see more benefits.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Matched Schemes</h2>
          <p style={{ fontSize: 13, color: '#6b7fa8' }}>Found {schemes.length} benefits for your profile.</p>
        </div>
      </div>

      {schemes.map(scheme => (
        <div key={scheme.id} style={S.card}>
          <div style={S.header}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#4f8ef7', background: 'rgba(79,142,247,0.1)', padding: '2px 8px', borderRadius: 6 }}>{scheme.category.toUpperCase()}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#6b7fa8' }}>{scheme.ministry}</span>
              </div>
              <div style={S.title}>{scheme.name}</div>
            </div>
            <div style={{ fontSize: 32 }}>{scheme.emoji || '📄'}</div>
          </div>
          
          <div style={S.benefitPill}>{scheme.benefit}</div>

          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 13, color: '#8b9cc8', lineHeight: 1.5, margin: 0 }}>{scheme.description.substring(0, 100)}...</p>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button 
              style={{ ...S.btn, flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#8b9cc8' }} 
              onClick={() => onViewDetails(scheme)}
            >
              View Details
            </button>
            <button style={{ ...S.btn, flex: 1 }} onClick={() => onApply(scheme)}>Apply Now</button>
          </div>
        </div>
      ))}
    </div>
  );
}
