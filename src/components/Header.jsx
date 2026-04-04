import React from 'react'
import { Bell } from 'lucide-react'

export default function Header({ notifications = 0 }) {
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, background: '#080f2e', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
      <div style={{ maxWidth: 896, margin: '0 auto', padding: '0 16px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#00d4aa,#4f8ef7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div style={{ lineHeight: 1 }}>
            <div style={{ color: '#f0f4ff', fontWeight: 700, fontSize: 14, letterSpacing: '-0.3px' }}>SchemeMatch</div>
            <div style={{ color: '#00d4aa', fontSize: 10, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase' }}>CivicShield</div>
          </div>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ position: 'relative' }}>
            <button style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Bell size={15} color="#8b9cc8" />
            </button>
            {notifications > 0 && (
              <span className="alert-badge" style={{ position: 'absolute', top: -4, right: -4, width: 16, height: 16, background: '#f5a623', borderRadius: '50%', fontSize: 9, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {notifications}
              </span>
            )}
          </div>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#f5a623,#d4860a)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 12 }}>
            RK
          </div>
        </div>
      </div>
      {/* India flag ribbon */}
      <div style={{ background: 'linear-gradient(90deg,#FF9933,#FF9933 33%,#fff 33%,#fff 66%,#138808 66%)', height: 3 }} />
    </header>
  )
}
