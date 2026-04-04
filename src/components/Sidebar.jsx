import React from 'react'

const NAV = [
  { id: 'schemes',   icon: '📋', label: 'My Schemes',    labelHi: 'मेरी योजनाएं' },
  { id: 'ai',        icon: '📋', label: 'Apply for Scheme', labelHi: 'योजना आवेदन' },
  { id: 'tracker',   icon: '📍', label: 'Live Tracker',   labelHi: 'लाइव ट्रैकर' },
  { id: 'counter',   icon: '💹', label: 'Benefit Counter', labelHi: 'लाभ काउंटर' },
  { id: 'chat',      icon: '💬', label: 'Hindi Chatbot',  labelHi: 'हिंदी सहायक' },
  { id: 'admin',     icon: '🗂️', label: 'Admin Panel',    labelHi: 'व्यवस्थापक' },
  { id: 'complaint', icon: '🚨', label: 'Report Issue',   labelHi: 'शिकायत करें', danger: true },
]

export default function Sidebar({ activeTab, onTab, notifications, onHome, userName = 'Rajesh Kumar', location = 'Bhopal, MP' }) {
  return (
    <aside style={{ background: '#0a0e1a', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <div className="tricolor-bar" />

      {/* Logo */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <button onClick={onHome} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0, width: '100%' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#FF9933,#ff6b00)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🛡️</div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 14, fontWeight: 800, color: '#f0f4ff', letterSpacing: '-0.3px' }}>SchemeMatch</div>
            <div style={{ fontSize: 9, color: '#00d4aa', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>CivicShield</div>
          </div>
        </button>
      </div>

      {/* User card */}
      <div style={{ margin: '12px 12px 8px', background: 'rgba(255,255,255,0.03)', borderRadius: 14, padding: '12px 14px', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#FF9933,#ff6b00)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>
            {userName.charAt(0)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#f0f4ff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userName}</div>
            <div style={{ fontSize: 10, color: '#4a5580' }}>{location}</div>
          </div>
          {notifications > 0 && (
            <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#f43f5e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, color: '#fff', flexShrink: 0 }}>{notifications}</div>
          )}
        </div>
        <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          <MiniStat value="3" label="Schemes" color="#4f8ef7" />
          <MiniStat value="₹8K" label="Received" color="#22c55e" />
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '8px 12px' }}>
        {NAV.map(item => {
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => onTab(item.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 12, border: 'none', cursor: 'pointer',
                marginBottom: 4, fontFamily: "'Plus Jakarta Sans',sans-serif", textAlign: 'left',
                transition: 'all 0.15s',
                background: isActive
                  ? item.danger ? 'rgba(244,63,94,0.15)' : 'rgba(255,153,51,0.12)'
                  : 'transparent',
                borderLeft: isActive ? `3px solid ${item.danger ? '#f43f5e' : '#FF9933'}` : '3px solid transparent',
              }}
            >
              <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: isActive ? (item.danger ? '#f43f5e' : '#FF9933') : '#8b9cc8', lineHeight: 1.2 }}>{item.label}</div>
                <div style={{ fontSize: 10, color: '#3a4460', lineHeight: 1.2 }}>{item.labelHi}</div>
              </div>
              {item.id === 'complaint' && (
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f43f5e' }} className="animate-pulse-dot" />
              )}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '12px 16px 20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ fontSize: 10, color: '#2a3250', textAlign: 'center', lineHeight: 1.6 }}>
          🇮🇳 SchemeMatch CivicShield<br />
          Hackathon 2025 · आपका अधिकार
        </div>
      </div>
    </aside>
  )
}

function MiniStat({ value, label, color }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '5px 8px' }}>
      <div style={{ fontSize: 12, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 9, color: '#3a4460', marginTop: 1 }}>{label}</div>
    </div>
  )
}
