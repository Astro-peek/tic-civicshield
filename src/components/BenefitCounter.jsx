import React, { useEffect, useRef, useState } from 'react'
import { getTotalEntitled, getTotalReceived, SCHEMES, getActiveStageIndex, STAGE_CONFIG } from '../data/mockData'

function useCountUp(target, duration = 1200) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setVal(target); clearInterval(timer) }
      else setVal(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [target])
  return val
}

function fmt(n) {
  if (n >= 100000) return '₹' + (n / 100000).toFixed(1) + 'L'
  if (n >= 1000)   return '₹' + (n / 1000).toFixed(1) + 'K'
  return '₹' + n
}

export default function BenefitCounter() {
  const entitled = getTotalEntitled()
  const received = getTotalReceived()
  const pending  = entitled - received
  const pct      = Math.round((received / entitled) * 100)

  const animEntitled = useCountUp(entitled)
  const animReceived = useCountUp(received)
  const animPending  = useCountUp(pending)

  return (
    <div style={{ background: '#141d2e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 18, marginBottom: 14, fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 18 }}>💹</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#f0f4ff' }}>मिस्ड ₹ काउंटर / Live Benefit Counter</div>
          <div style={{ fontSize: 11, color: '#6b7fa8' }}>सभी योजनाओं का सारांश · All schemes combined</div>
        </div>
      </div>

      {/* Big numbers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
        <MiniStat value={fmt(animEntitled)} label="हक़दार / Entitled" color="#7c6fef" />
        <MiniStat value={fmt(animReceived)} label="मिला / Received"  color="#22c55e" />
        <MiniStat value={fmt(animPending)}  label="बाकी / Pending"   color="#f5a623" />
      </div>

      {/* Stacked bar */}
      <div style={{ height: 10, background: 'rgba(255,255,255,0.05)', borderRadius: 10, overflow: 'hidden', marginBottom: 8 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#22c55e,#00d4aa)', borderRadius: 10, transition: 'width 1.2s ease' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#6b7fa8' }}>
        <span>{pct}% प्राप्त / received</span>
        <span>{100 - pct}% बाकी / remaining</span>
      </div>

      {/* Per scheme mini list */}
      <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        {SCHEMES.map(sc => {
          const paid = (sc.instalments || []).filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0)
          const p = Math.round((paid / sc.amountNum) * 100)
          const activeIdx = getActiveStageIndex(sc.id)
          const stage = STAGE_CONFIG[activeIdx]
          return (
            <div key={sc.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 14, width: 22, textAlign: 'center' }}>
                {sc.category === 'Agriculture' ? '🌾' : sc.category === 'Housing' ? '🏠' : '❤️'}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: '#8b9cc8', fontWeight: 500 }}>{sc.nameHi}</span>
                  <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 700 }}>₹{paid.toLocaleString('en-IN')} / {sc.amount}</span>
                </div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${p}%`, background: p === 100 ? '#22c55e' : 'linear-gradient(90deg,#4f8ef7,#7c6fef)', borderRadius: 4 }} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function MiniStat({ value, label, color }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '10px 8px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ fontSize: 17, fontWeight: 700, color, marginBottom: 3 }}>{value}</div>
      <div style={{ fontSize: 9, color: '#6b7fa8', lineHeight: 1.3 }}>{label}</div>
    </div>
  )
}
