import React from 'react'
import { getAppliedSchemes } from '../stores/applicationStore'

const STATUS = {
  paid:     { color: '#22c55e', bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.25)',   icon: '✓', label: 'मिल गया / Paid' },
  pending:  { color: '#f97316', bg: 'rgba(249,115,22,0.1)',  border: 'rgba(249,115,22,0.25)',  icon: '⏳', label: 'बाकी / Pending' },
  upcoming: { color: '#4f8ef7', bg: 'rgba(79,142,247,0.08)', border: 'rgba(79,142,247,0.2)',   icon: '📅', label: 'आने वाला / Upcoming' },
}

function fmt(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function InstalmentLog({ schemeId }) {
  const scheme = getAppliedSchemes().find(s => s.id === schemeId)
  if (!scheme) return null
  const instalments = scheme.instalments || []
  const paid = instalments.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0)
  const total = instalments.reduce((s, i) => s + i.amount, 0)
  const pct = total > 0 ? Math.round((paid / total) * 100) : 0

  if (instalments.length === 0) {
    return (
      <div style={{ background:'#141d2e', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, padding:28, textAlign:'center', fontFamily:"'DM Sans',sans-serif" }}>
        <div style={{ fontSize:34, marginBottom:12 }}>💰</div>
        <div style={{ fontSize:15, fontWeight:700, color:'#f0f4ff', marginBottom:8 }}>Instalments Pending</div>
        <div style={{ fontSize:12, color:'#6b7fa8', lineHeight:1.6 }}>
          Your application is under review. Instalment details will appear here once your scheme is approved.<br/>
          <span style={{ color:'#f5a623' }}>आवेदन समीक्षा में है। स्वीकृति के बाद किस्त विवरण यहाँ दिखेगा।</span>
        </div>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif" }}>
      {/* Summary */}
      <div style={{ background: '#141d2e', border: '1px solid rgba(245,166,35,0.2)', borderRadius: 16, padding: 16, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: '#6b7fa8', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 2 }}>किस्त / Instalment Log</div>
            <div style={{ fontSize: 13, color: '#f0f4ff', fontWeight: 600 }}>{scheme.name}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#22c55e' }}>₹{paid.toLocaleString('en-IN')}</div>
            <div style={{ fontSize: 10, color: '#6b7fa8' }}>of ₹{total.toLocaleString('en-IN')} received</div>
          </div>
        </div>
        {/* progress */}
        <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 6, overflow: 'hidden', marginBottom: 6 }}>
          <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#22c55e,#00d4aa)', borderRadius: 6, transition: 'width 0.8s ease' }} />
        </div>
        <div style={{ fontSize: 11, color: '#6b7fa8' }}>{pct}% प्राप्त / received</div>
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {instalments.map((inst, i) => {
          const st = STATUS[inst.status]
          return (
            <div key={inst.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: st.bg, border: `1px solid ${st.border}`, borderRadius: 14, padding: '13px 15px' }}>
              {/* Icon */}
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${st.color}20`, border: `1.5px solid ${st.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>
                {st.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#d0dcff', marginBottom: 2 }}>{inst.labelHi} · {inst.label}</div>
                <div style={{ fontSize: 11, color: '#6b7fa8' }}>📅 {fmt(inst.date)}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: st.color }}>₹{inst.amount.toLocaleString('en-IN')}</div>
                <div style={{ fontSize: 10, color: st.color, fontWeight: 600 }}>{st.label.split('/')[inst.status === 'paid' ? 0 : 1]?.trim()}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
