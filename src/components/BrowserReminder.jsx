import React, { useState, useEffect } from 'react'
import { SCHEMES, STAGE_TIMELINES, getActiveStageIndex } from '../data/mockData'

function fmt(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function daysFrom(dateStr) {
  return Math.round((new Date(dateStr) - new Date()) / 86400000)
}

export default function BrowserReminder() {
  const [permission, setPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  )
  const [registered, setRegistered] = useState(false)
  const [toastMsg, setToastMsg] = useState('')

  // Collect upcoming disbursement dates
  const upcomingDates = SCHEMES.flatMap(sc => {
    const tl = STAGE_TIMELINES[sc.id]
    const activeIdx = getActiveStageIndex(sc.id)
    const disbDate = tl.disbursed?.expectedDate
    if (!disbDate || tl.disbursed?.completedDate) return []
    const days = daysFrom(disbDate)
    if (days < 0) return []
    return [{ scheme: sc.name, schemeHi: sc.nameHi, date: disbDate, days, amount: sc.amount }]
  }).sort((a, b) => a.days - b.days)

  const requestPermission = async () => {
    if (typeof Notification === 'undefined') {
      setToastMsg('इस ब्राउज़र में नोटिफिकेशन उपलब्ध नहीं · Notifications not supported')
      return
    }
    const result = await Notification.requestPermission()
    setPermission(result)
    if (result === 'granted') {
      setRegistered(true)
      // Fire a test notification
      new Notification('SchemeMatch CivicShield 🛡️', {
        body: `${upcomingDates.length} disbursements tracked. We'll remind you on time!`,
        icon: '/favicon.ico',
      })
      setToastMsg('रिमाइंडर सेट हो गया! ✓ Reminders enabled!')
    } else {
      setToastMsg('अनुमति नहीं मिली · Permission denied')
    }
    setTimeout(() => setToastMsg(''), 3000)
  }

  const isGranted = permission === 'granted'

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", marginBottom: 14 }}>
      {/* Header card */}
      <div style={{ background: '#141d2e', border: `1px solid ${isGranted ? 'rgba(0,212,170,0.25)' : 'rgba(79,142,247,0.2)'}`, borderRadius: 16, padding: 16, marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 20 }}>🔔</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#f0f4ff' }}>ब्राउज़र रिमाइंडर / Browser Reminder</div>
                <div style={{ fontSize: 11, color: '#6b7fa8' }}>भुगतान की तारीख पर सूचना पाएं · Get notified on disbursement dates</div>
              </div>
            </div>
            {!isGranted ? (
              <button
                onClick={requestPermission}
                style={{ background: 'linear-gradient(135deg,rgba(79,142,247,0.2),rgba(0,212,170,0.15))', border: '1px solid rgba(79,142,247,0.4)', borderRadius: 10, padding: '9px 16px', color: '#7bb3ff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}
              >
                🔔 रिमाइंडर चालू करें / Enable Reminders
              </button>
            ) : (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.3)', borderRadius: 10, padding: '7px 12px', fontSize: 11, color: '#00d4aa', fontWeight: 700 }}>
                ✓ रिमाइंडर चालू है · Reminders active
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upcoming dates */}
      {upcomingDates.length > 0 && (
        <div>
          <div style={{ fontSize: 11, color: '#6b7fa8', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 8 }}>आगामी भुगतान / Upcoming Disbursements</div>
          {upcomingDates.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#141d2e', border: '1px solid rgba(245,166,35,0.2)', borderRadius: 14, padding: '12px 14px', marginBottom: 8 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(245,166,35,0.12)', border: '1px solid rgba(245,166,35,0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#f5a623', lineHeight: 1 }}>{item.days}</div>
                <div style={{ fontSize: 8, color: '#f5a623', lineHeight: 1 }}>दिन</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#d0dcff', marginBottom: 2 }}>{item.schemeHi}</div>
                <div style={{ fontSize: 11, color: '#6b7fa8' }}>📅 {fmt(item.date)}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#f5a623' }}>{item.amount}</div>
                <div style={{ fontSize: 10, color: '#6b7fa8' }}>expected</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {toastMsg && (
        <div style={{ background: '#1a2540', border: '1px solid rgba(0,212,170,0.3)', borderRadius: 12, padding: '10px 16px', fontSize: 12, color: '#00d4aa', fontWeight: 600, marginTop: 8 }}>
          {toastMsg}
        </div>
      )}
    </div>
  )
}
