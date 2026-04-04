import React, { useState, useEffect } from 'react';
import { getAppliedSchemes, subscribe, getDynActiveStageIndex, setAppliedSchemes } from '../stores/applicationStore';
import { fetchApplications } from '../config/firebase';
import SchemeTracker from './SchemeTracker';
import InstalmentLog from './InstalmentLog';
import OfficerCard from './OfficerCard';
import WhatsAppShare from './WhatsAppShare';

const S = {
  card: {
    background: '#111827',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: '24px',
    marginBottom: 16,
    fontFamily: "'Plus Jakarta Sans', sans-serif"
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  statusBadge: (status) => ({
    padding: '4px 12px',
    background: status === 'Approved' ? 'rgba(34,197,94,0.1)' : 'rgba(245,166,35,0.1)',
    border: `1px solid ${status === 'Approved' ? 'rgba(34,197,94,0.3)' : 'rgba(245,166,35,0.3)'}`,
    borderRadius: 20,
    color: status === 'Approved' ? '#22c55e' : '#f5a623',
    fontSize: 11,
    fontWeight: 700
  }),
  tracking: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 0',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    marginBottom: 20
  },
  trackStep: (done, current) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    opacity: done || current ? 1 : 0.4
  }),
  dot: (done, current) => ({
    width: 24,
    height: 24,
    borderRadius: '50%',
    background: done ? '#22c55e' : current ? '#f5a623' : '#1c2533',
    border: `2px solid ${done ? '#22c55e' : current ? '#f5a623' : 'rgba(255,255,255,0.1)'}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    color: '#fff',
    fontWeight: 700
  }),
  stepLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: '#8b9cc8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  footer: {
    display: 'flex',
    gap: 12
  },
  btn: (primary) => ({
    flex: 1,
    padding: '10px',
    borderRadius: 12,
    border: primary ? 'none' : '1px solid rgba(255,255,255,0.1)',
    background: primary ? 'linear-gradient(135deg, #4f8ef7, #7c6fef)' : 'transparent',
    color: primary ? '#fff' : '#8b9cc8',
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer'
  }),
  modalOverlay: {
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
  modalContent: {
    background: '#0a0e1a',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 24,
    width: '100%',
    maxWidth: 680,
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
    padding: 24
  },
  tabBtn: (active) => ({
    flex: 1,
    padding: '10px',
    borderRadius: 10,
    border: 'none',
    cursor: 'pointer',
    fontSize: 11,
    fontWeight: 700,
    background: active ? 'rgba(79,142,247,0.15)' : 'transparent',
    color: active ? '#4f8ef7' : '#4a5580',
    borderBottom: active ? '2px solid #4f8ef7' : '2px solid transparent',
    transition: 'all 0.2s'
  })
};

export default function MySchemes() {
  const [schemes, setSchemes] = useState(getAppliedSchemes());
  const [trackingId, setTrackingId] = useState(null);
  const [detailScheme, setDetailScheme] = useState(null);
  const [activeTab, setActiveTab] = useState('tracker');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sync = async () => {
      const remote = await fetchApplications();
      if (remote && remote.length > 0) {
        setAppliedSchemes(remote);
      }
      setLoading(false);
    };
    sync();

    const unsub = subscribe(() => setSchemes([...getAppliedSchemes()]));
    return unsub;
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <div style={{ width: 40, height: 40, border: '3px solid rgba(79,142,247,0.1)', borderTop: '3px solid #4f8ef7', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
        <div style={{ color: '#6b7fa8', fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}>Synchronizing...</div>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ animation: 'fadeUp 0.4s ease-out' }}>
      <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      
      <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 6 }}>My Applied Schemes</h2>
      <p style={{ fontSize: 13, color: '#6b7fa8', marginBottom: 32 }}>Track the status of your various government scheme applications.</p>

      {schemes.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#4a5580', border: '2px dashed rgba(255,255,255,0.05)', borderRadius: 20 }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>📋</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#f0f4ff', marginBottom: 8 }}>No Applications Yet</div>
          <div style={{ fontSize: 13 }}>Go to the search tab to find and apply for schemes.</div>
        </div>
      )}

      {schemes.map(scheme => {
        const activeIdx = getDynActiveStageIndex(scheme.id);
        const status = activeIdx >= 2 ? 'Approved' : 'Pending';
        const applicantName = scheme._applicant || 'User';

        return (
          <div key={scheme.id} style={S.card}>
            <div style={S.header}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(79,142,247,0.1)', border: '1px solid rgba(79,142,247,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                  {scheme.emoji || '📄'}
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#f0f4ff', marginBottom: 4 }}>{scheme.name}</div>
                  <div style={{ fontSize: 13, color: '#6b7fa8' }}>Applicant: <span style={{ color: '#fff' }}>{applicantName}</span></div>
                </div>
              </div>
              <div style={S.statusBadge(status)}>{status}</div>
            </div>

            <div style={S.tracking}>
              {[
                { id: 0, label: 'Applied', icon: '✅' },
                { id: 1, label: 'Under Review', icon: '🟡' },
                { id: 2, label: 'Approved', icon: '🔒' }
              ].map(step => {
                const done = activeIdx > step.id;
                const current = activeIdx === step.id;
                return (
                  <div key={step.id} style={S.trackStep(done, current)}>
                    <div style={S.dot(done, current)}>
                      {done ? '✓' : current ? '⋯' : step.id + 1}
                    </div>
                    <span style={S.stepLabel}>{step.label}</span>
                  </div>
                );
              })}
            </div>

            <div style={S.footer}>
              <button style={S.btn(false)} onClick={() => setDetailScheme(scheme)}>View Details</button>
              <button style={S.btn(true)} onClick={() => { setTrackingId(scheme.id); setActiveTab('tracker'); }}>Track Status</button>
            </div>
          </div>
        );
      })}

      {/* TRACK STATUS MODAL */}
      {trackingId && (
        <div style={S.modalOverlay} onClick={() => setTrackingId(null)}>
          <div style={S.modalContent} onClick={e => e.stopPropagation()}>
            <button onClick={() => setTrackingId(null)} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: '#6b7fa8', fontSize: 22, cursor: 'pointer', zIndex: 10 }}>✕</button>
            
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: '#6b7fa8', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>LIVE TRACKING</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>{schemes.find(s => s.id === trackingId)?.name}</div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 6, background: 'rgba(255,255,255,0.04)', padding: 4, borderRadius: 12, marginBottom: 20 }}>
              <button style={S.tabBtn(activeTab === 'tracker')} onClick={() => setActiveTab('tracker')}>📍 Tracker</button>
              <button style={S.tabBtn(activeTab === 'kisht')} onClick={() => setActiveTab('kisht')}>💰 Instalments</button>
              <button style={S.tabBtn(activeTab === 'officer')} onClick={() => setActiveTab('officer')}>👮 Officer</button>
              <button style={S.tabBtn(activeTab === 'share')} onClick={() => setActiveTab('share')}>📤 Share</button>
            </div>

            <div style={{ minHeight: 300 }}>
              {activeTab === 'tracker' && <SchemeTracker schemeId={trackingId} />}
              {activeTab === 'kisht'   && <InstalmentLog schemeId={trackingId} />}
              {activeTab === 'officer' && <OfficerCard schemeId={trackingId} />}
              {activeTab === 'share'   && <WhatsAppShare schemeId={trackingId} />}
            </div>
          </div>
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      {detailScheme && (
        <div style={S.modalOverlay} onClick={() => setDetailScheme(null)}>
          <div style={{ ...S.modalContent, maxWidth: 500 }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setDetailScheme(null)} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: '#6b7fa8', fontSize: 22, cursor: 'pointer' }}>✕</button>
            
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 50, marginBottom: 12 }}>{detailScheme.emoji || '📄'}</div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{detailScheme.name}</h3>
              <div style={{ display: 'inline-block', background: 'rgba(79,142,247,0.1)', color: '#4f8ef7', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{detailScheme.category}</div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7fa8', textTransform: 'uppercase', marginBottom: 8 }}>SCHEME DESCRIPTION</div>
              <div style={{ fontSize: 14, color: '#8b9cc8', lineHeight: 1.6 }}>{detailScheme.description}</div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7fa8', textTransform: 'uppercase', marginBottom: 8 }}>KEY BENEFIT</div>
              <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 12, padding: 16 }}>
                <div style={{ color: '#22c55e', fontWeight: 800, fontSize: 16 }}>{detailScheme.amount}</div>
                <div style={{ color: '#6b7fa8', fontSize: 12, marginTop: 4 }}>Direct Financial Assistance</div>
              </div>
            </div>

            <button style={S.btn(true)} onClick={() => setDetailScheme(null)}>Close Details</button>
          </div>
        </div>
      )}
    </div>
  );
}
