import React, { useState, useEffect } from 'react';
import { getAppliedSchemes, getDynActiveStageIndex, subscribe } from '../stores/applicationStore';
import { STAGE_CONFIG } from '../data/mockData';

const CAT_BG = {
  Agriculture: 'linear-gradient(135deg,#1a4a2e,#0d7a4a)',
  Housing:     'linear-gradient(135deg,#1a2a4a,#2a5bd4)',
  Health:      'linear-gradient(135deg,#3a1a1a,#c23a3a)',
  Education:   'linear-gradient(135deg,#1a1a4a,#4a2a8a)',
  Employment:  'linear-gradient(135deg,#3a2a1a,#c47a2a)',
  Women:       'linear-gradient(135deg,#3a1a2a,#c43a7a)',
  Business:    'linear-gradient(135deg,#1a3a2a,#2a8a5a)',
};
const CAT_ICON = {
  Agriculture: '🌾', Housing: '🏠', Health: '❤️',
  Education: '🎓', Employment: '⚙️', Women: '💜', Business: '💼',
};

export default function SchemeList({ selectedId, onSelect }) {
  // Subscribe to store changes so live-applied schemes re-render instantly
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const unsub = subscribe(() => setTick(t => t + 1));
    return unsub;
  }, []);

  const schemes = getAppliedSchemes();

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#f0f4ff' }}>आपके आवेदन / Your Applications</div>
          <div style={{ fontSize: 12, color: '#6b7fa8' }}>{schemes.length} योजनाएं ट्रैक हो रही हैं</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.25)', borderRadius: 20, padding: '4px 10px' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00d4aa', animation: 'dotBlink 1.8s ease-in-out infinite' }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: '#00d4aa' }}>LIVE</span>
        </div>
      </div>
      <style>{`@keyframes dotBlink{0%,100%{opacity:1}50%{opacity:0.4}} @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {schemes.length === 0 && (
        <div style={{ textAlign: 'center', color: '#4a5580', padding: '40px 0', fontSize: 13 }}>
          No applications yet. Go to <b style={{ color: '#4f8ef7' }}>Apply for Scheme</b> to get started!
        </div>
      )}

      {schemes.map((scheme, idx) => {
        const activeIdx = getDynActiveStageIndex(scheme.id);
        const stage     = STAGE_CONFIG[activeIdx] || STAGE_CONFIG[0];
        const progress  = Math.round((activeIdx / (STAGE_CONFIG.length - 1)) * 100);
        const isSelected = selectedId === scheme.id;
        const paid = (scheme.instalments || []).filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
        const isNew = scheme._new;

        return (
          <button
            key={scheme.id}
            onClick={() => onSelect(scheme.id)}
            style={{
              width: '100%', textAlign: 'left', display: 'block',
              background: isSelected
                ? 'linear-gradient(135deg,rgba(79,142,247,0.12),rgba(0,212,170,0.08))'
                : isNew ? 'rgba(34,197,94,0.04)' : '#141d2e',
              border: `1.5px solid ${isSelected ? 'rgba(79,142,247,0.4)' : isNew ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.07)'}`,
              borderRadius: 18, padding: 16, marginBottom: 10,
              cursor: 'pointer', fontFamily: "'DM Sans',sans-serif",
              transition: 'all 0.2s',
              animation: isNew ? `fadeUp ${0.1 + idx * 0.05}s ease-out` : 'none',
            }}
          >
            {isNew && (
              <div style={{ fontSize: 9, color: '#22c55e', fontWeight: 700, marginBottom: 6, letterSpacing: '0.08em' }}>
                🆕 NEWLY APPLIED
              </div>
            )}
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 44, height: 44, borderRadius: 13, background: CAT_BG[scheme.category] || 'linear-gradient(135deg,#1a2a4a,#2a5bd4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                {CAT_ICON[scheme.category] || '📄'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 2 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#f0f4ff', lineHeight: 1.3 }}>{scheme.name}</div>
                    <div style={{ fontSize: 10, color: '#4a5580', fontFamily: 'monospace' }}>{scheme.id}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#f5a623' }}>{scheme.amount}</div>
                    {paid > 0 && <div style={{ fontSize: 9, color: '#22c55e' }}>₹{paid.toLocaleString('en-IN')} मिला</div>}
                  </div>
                </div>
                {/* Progress */}
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: '#8b9cc8', fontWeight: 500 }}>{stage.labelHi} · {stage.label}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#f0f4ff' }}>{progress}%</span>
                  </div>
                  <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 5, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#00d4aa,#4f8ef7)', borderRadius: 5, transition: 'width 0.8s ease' }} />
                  </div>
                </div>
                {/* Stage badge */}
                <div style={{ marginTop: 8 }}>
                  <StageBadge activeIdx={activeIdx} />
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function StageBadge({ activeIdx }) {
  if (activeIdx >= STAGE_CONFIG.length - 1)
    return <span style={{ fontSize: 10, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e', padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>✓ भुगतान हो गया / Disbursed</span>;
  if (activeIdx === 0)
    return <span style={{ fontSize: 10, background: 'rgba(245,166,35,0.12)', border: '1px solid rgba(245,166,35,0.3)', color: '#f5a623', padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>● आवेदन / Applied</span>;
  return <span style={{ fontSize: 10, background: 'rgba(79,142,247,0.12)', border: '1px solid rgba(79,142,247,0.3)', color: '#4f8ef7', padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>● प्रगति में / In Progress</span>;
}
