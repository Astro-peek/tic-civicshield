import React, { useState, useEffect } from 'react'
import { STAGE_CONFIG } from '../data/mockData'
import { getAppliedSchemes, getTimelines, getDocuments, getDynActiveStageIndex, subscribe } from '../stores/applicationStore'

// ─── Helpers ────────────────────────────────────────────────────────────────

function fmt(dateStr) {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function daysFromNow(dateStr) {
  if (!dateStr) return null
  const diff = Math.round((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24))
  return diff
}

// Calculate expected approval date = applied date + 30 working days
function calcApprovalDate(appliedDate) {
  const d = new Date(appliedDate)
  d.setDate(d.getDate() + 30)
  return d.toISOString().split('T')[0]
}

// Calculate expected disbursement = approval + 15 days
function calcDisbursementDate(approvalDate) {
  const d = new Date(approvalDate)
  d.setDate(d.getDate() + 15)
  return d.toISOString().split('T')[0]
}

// ─── Hindi + English next step messages ──────────────────────────────────────
const NEXT_STEPS = {
  'PM-KISAN-2024-001': {
    en: 'Your application is under review by the Agriculture Officer. Upload your Income Certificate to avoid delays.',
    hi: 'आपका आवेदन कृषि अधिकारी द्वारा समीक्षा में है। देरी से बचने के लिए आय प्रमाण पत्र अपलोड करें।',
    action: 'Upload Income Certificate',
    urgency: 'high',
  },
  'PMAY-2024-002': {
    en: 'Application approved! Disbursement is being processed. Your bank account will be credited soon.',
    hi: 'आवेदन स्वीकृत हो गया! भुगतान प्रक्रिया चल रही है। जल्द ही आपके बैंक खाते में राशि आएगी।',
    action: 'Check bank account',
    urgency: 'low',
  },
  'AYUSH-2024-003': {
    en: 'Application submitted. Officer will verify your documents within 8 days. Keep your Aadhaar ready.',
    hi: 'आवेदन जमा हो गया। अधिकारी 8 दिनों में आपके दस्तावेज़ सत्यापित करेंगे। आधार तैयार रखें।',
    action: 'Keep documents ready',
    urgency: 'medium',
  },
}

const STAGE_COLORS = [
  { node: 'linear-gradient(135deg,#00c49a,#00d4aa)', accent: '#00d4aa', glow: 'rgba(0,212,170,0.4)', pillBg: 'rgba(0,212,170,0.12)', pillBorder: 'rgba(0,212,170,0.3)', pillText: '#00d4aa', connDone: '#00d4aa' },
  { node: 'linear-gradient(135deg,#3b7ef5,#4f8ef7)', accent: '#4f8ef7', glow: 'rgba(79,142,247,0.4)', pillBg: 'rgba(79,142,247,0.12)', pillBorder: 'rgba(79,142,247,0.3)', pillText: '#4f8ef7', connDone: '#4f8ef7' },
  { node: 'linear-gradient(135deg,#6c5fd4,#7c6fef)', accent: '#7c6fef', glow: 'rgba(124,111,239,0.4)', pillBg: 'rgba(124,111,239,0.12)', pillBorder: 'rgba(124,111,239,0.3)', pillText: '#7c6fef', connDone: '#7c6fef' },
  { node: 'linear-gradient(135deg,#d4860a,#f5a623)', accent: '#f5a623', glow: 'rgba(245,166,35,0.4)', pillBg: 'rgba(245,166,35,0.12)', pillBorder: 'rgba(245,166,35,0.3)', pillText: '#f5a623', connDone: '#f5a623' },
]

const DOC_STATUS = {
  submitted: { color: '#22c55e', bg: 'rgba(34,197,94,0.1)',  border: 'rgba(34,197,94,0.25)',  icon: '✓', label: 'जमा / Done' },
  pending:   { color: '#f97316', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.25)', icon: '⏳', label: 'बाकी / Pending' },
  missing:   { color: '#f43f5e', bg: 'rgba(244,63,94,0.1)',  border: 'rgba(244,63,94,0.25)',  icon: '✕', label: 'नहीं है / Missing' },
}

const URGENCY_COLORS = {
  high:   { bg: 'rgba(244,63,94,0.1)',   border: 'rgba(244,63,94,0.25)',   dot: '#f43f5e', label: 'तुरंत करें / Urgent' },
  medium: { bg: 'rgba(245,166,35,0.1)',  border: 'rgba(245,166,35,0.25)',  dot: '#f5a623', label: 'जल्द करें / Soon' },
  low:    { bg: 'rgba(0,212,170,0.08)',  border: 'rgba(0,212,170,0.2)',    dot: '#00d4aa', label: 'जानकारी / Info' },
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const skel = {
  background: 'linear-gradient(90deg,#141d2e 25%,#1a2540 50%,#141d2e 75%)',
  backgroundSize: '800px 100%',
  animation: 'shimmer 1.4s infinite',
  borderRadius: 8,
}

function SkeletonLoader() {
  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif" }}>
      <style>{`@keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}`}</style>
      <div style={{ background: '#141d2e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 20, marginBottom: 14 }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
          <div style={{ ...skel, width: 44, height: 44, borderRadius: 12 }} />
          <div style={{ flex: 1 }}>
            <div style={{ ...skel, height: 14, width: '55%', marginBottom: 8 }} />
            <div style={{ ...skel, height: 10, width: '35%' }} />
          </div>
          <div style={{ ...skel, width: 70, height: 44, borderRadius: 10 }} />
        </div>
        <div style={{ ...skel, height: 6, marginBottom: 24 }} />
        {[1,2,3,4].map(i => (
          <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 10 }}>
            <div style={{ ...skel, width: 40, height: 40, borderRadius: 12, flexShrink: 0 }} />
            <div style={{ ...skel, flex: 1, height: 72, borderRadius: 14 }} />
          </div>
        ))}
      </div>
      {[1,2].map(i => <div key={i} style={{ ...skel, height: 80, borderRadius: 16, marginBottom: 12 }} />)}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SchemeTracker({ schemeId }) {
  const [loading, setLoading] = useState(true)
  const [expandedDoc, setExpandedDoc] = useState(false)
  const [tick, setTick] = useState(0)  // force re-render on store update

  useEffect(() => {
    const unsub = subscribe(() => setTick(t => t + 1))
    return unsub
  }, [])

  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 850)
    return () => clearTimeout(t)
  }, [schemeId])

  const timelines  = getTimelines()[schemeId]
  const activeIdx  = getDynActiveStageIndex(schemeId)
  const scheme     = getAppliedSchemes().find(s => s.id === schemeId)
  const docs       = getDocuments()[schemeId] || []
  
  const nextStep = NEXT_STEPS[schemeId] || {
    en: 'Your application has been received and is currently under initial review. Please check back later for updates.',
    hi: 'आपका आवेदन प्राप्त हो गया है और प्रारंभिक समीक्षा के अधीन है। कृपया अपडेट के लिए जाँच करते रहें।',
    action: 'In Progress',
    urgency: 'medium',
  };

  const progress   = Math.round((activeIdx / (STAGE_CONFIG.length - 1)) * 100)

  if (!timelines || !scheme) return null
  if (loading) return <SkeletonLoader />

  // Calculated dates
  const approvalDate     = timelines.approved?.completedDate  || timelines.approved?.expectedDate  || calcApprovalDate(scheme.appliedDate)
  const disbursementDate = timelines.disbursed?.completedDate || timelines.disbursed?.expectedDate || calcDisbursementDate(approvalDate)
  const daysToApproval   = daysFromNow(approvalDate)
  const daysToDisburse   = daysFromNow(disbursementDate)

  const docCounts = {
    submitted: docs.filter(d => d.status === 'submitted').length,
    pending:   docs.filter(d => d.status === 'pending').length,
    missing:   docs.filter(d => d.status === 'missing').length,
  }
  const urgency = nextStep?.urgency || 'medium'
  const uc = URGENCY_COLORS[urgency]

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif" }}>
      <style>{`
        @keyframes nodePulse{0%,100%{box-shadow:0 0 0 0 rgba(79,142,247,0.5),0 4px 20px rgba(79,142,247,0.3)}50%{box-shadow:0 0 0 9px rgba(79,142,247,0),0 4px 30px rgba(79,142,247,0.6)}}
        @keyframes connFlow{0%{transform:translateY(-100%)}100%{transform:translateY(100%)}}
        @keyframes pillBlink{0%,100%{opacity:1}50%{opacity:0.55}}
        @keyframes dotBlink{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(0.65)}}
        @keyframes progFlow{0%{background-position:0% 0%}100%{background-position:-200% 0%}}
        @keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .tracker-card{animation:fadeUp 0.35s ease-out}
      `}</style>

      {/* ── MAIN TIMELINE CARD ── */}
      <div className="tracker-card" style={{ background: '#141d2e', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 20, padding: 20, marginBottom: 14, position: 'relative', overflow: 'hidden' }}>
        {/* Top shine */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '45%', background: 'linear-gradient(180deg,rgba(255,255,255,0.03) 0%,transparent 100%)', pointerEvents: 'none', borderRadius: '20px 20px 0 0' }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16, position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flex: 1 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: scheme.category === 'Agriculture' ? 'linear-gradient(135deg,#1a4a2e,#0d7a4a)' : scheme.category === 'Housing' ? 'linear-gradient(135deg,#1a2a4a,#2a5bd4)' : 'linear-gradient(135deg,#3a1a1a,#c23a3a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
              {scheme.category === 'Agriculture' ? '🌾' : scheme.category === 'Housing' ? '🏠' : '❤️'}
            </div>
            <div>
              <div style={{ color: '#f0f4ff', fontWeight: 700, fontSize: 15, marginBottom: 2, lineHeight: 1.2 }}>{scheme.name}</div>
              <div style={{ color: '#4a5580', fontSize: 11, fontFamily: 'monospace' }}>{scheme.id}</div>
            </div>
          </div>
          <div style={{ background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.28)', borderRadius: 10, padding: '6px 12px', textAlign: 'right', flexShrink: 0 }}>
            <div style={{ color: '#f5a623', fontWeight: 700, fontSize: 16 }}>{scheme.amount}</div>
            <div style={{ color: '#4a5580', fontSize: 10, marginTop: 1 }}>लाभ / Benefit</div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 20, position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
            <span style={{ fontSize: 12, color: '#8b9cc8' }}>प्रगति / Progress</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#f0f4ff' }}>{progress}%</span>
          </div>
          <div style={{ height: 7, background: 'rgba(255,255,255,0.06)', borderRadius: 7, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, borderRadius: 7, background: 'linear-gradient(90deg,#00d4aa,#4f8ef7,#7c6fef)', backgroundSize: '200% 100%', animation: 'progFlow 3s linear infinite', transition: 'width 1s cubic-bezier(0.4,0,0.2,1)' }} />
          </div>
        </div>

        {/* Timeline stages */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {STAGE_CONFIG.map((stage, i) => {
            const tl      = timelines[stage.id]
            const isDone  = i < activeIdx
            const isActive= i === activeIdx
            const isLast  = i === STAGE_CONFIG.length - 1
            const c       = STAGE_COLORS[i]

            return (
              <div key={stage.id} style={{ display: 'flex', gap: 14, alignItems: 'stretch' }}>
                {/* Node + connector */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 42, flexShrink: 0 }}>
                  {/* Node */}
                  <div style={{
                    width: 42, height: 42, borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: isDone ? 16 : 19, flexShrink: 0, position: 'relative',
                    background: isDone || isActive ? c.node : '#1a2540',
                    border: !isDone && !isActive ? '1.5px solid rgba(255,255,255,0.07)' : 'none',
                    color: isDone || isActive ? '#fff' : '#3a4460',
                    animation: isActive ? 'nodePulse 2.2s ease-in-out infinite' : 'none',
                    boxShadow: isDone ? `0 2px 12px ${c.glow}` : 'none',
                    zIndex: 1,
                  }}>
                    {isDone ? '✓' : stage.icon}
                    {/* 3D shine */}
                    {(isDone || isActive) && (
                      <div style={{ position: 'absolute', inset: 0, borderRadius: 13, background: 'linear-gradient(145deg,rgba(255,255,255,0.18) 0%,transparent 60%)', pointerEvents: 'none' }} />
                    )}
                  </div>
                  {/* Connector */}
                  {!isLast && (
                    <div style={{ flex: 1, width: 2.5, margin: '3px auto', borderRadius: 3, minHeight: 24, position: 'relative', overflow: 'hidden', background: isDone ? c.accent : 'rgba(255,255,255,0.06)' }}>
                      {isActive && (
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '60%', background: `linear-gradient(180deg,${c.accent},transparent)`, animation: 'connFlow 1.6s linear infinite' }} />
                      )}
                    </div>
                  )}
                </div>

                {/* Stage card */}
                <div style={{
                  flex: 1,
                  background: isDone ? `linear-gradient(135deg,${c.glow.replace('0.4','0.06')},transparent)` : isActive ? `linear-gradient(135deg,${c.glow.replace('0.4','0.09')},transparent)` : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${isDone ? c.pillBorder : isActive ? c.pillBorder : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: 14,
                  padding: '12px 14px',
                  marginBottom: isLast ? 0 : 10,
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'default',
                }}>
                  {/* Active glow blob */}
                  {isActive && <div style={{ position: 'absolute', top: -15, right: -15, width: 70, height: 70, background: `radial-gradient(circle,${c.glow},transparent 70%)`, pointerEvents: 'none' }} />}

                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: isActive ? c.accent : isDone ? '#c8d8ff' : '#4a5580' }}>
                      {stage.label}
                    </span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '2px 9px', borderRadius: 20, flexShrink: 0,
                      background: isDone ? c.pillBg : isActive ? c.pillBg : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${isDone ? c.pillBorder : isActive ? c.pillBorder : 'rgba(255,255,255,0.06)'}`,
                      color: isDone ? c.pillText : isActive ? c.pillText : '#3a4460',
                      letterSpacing: '0.4px',
                      animation: isActive ? 'pillBlink 2s ease-in-out infinite' : 'none',
                    }}>
                      {isDone ? '✓ हो गया' : isActive ? '● जारी है' : '○ बाकी है'}
                    </span>
                  </div>

                  <div style={{ fontSize: 12, color: '#6b7fa8', lineHeight: 1.5, marginBottom: 6 }}>{stage.description}</div>

                  {/* Date row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                    {tl?.completedDate && (
                      <span style={{ fontSize: 11, color: c.accent, display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: c.accent, display: 'inline-block' }} />
                        पूरा: {fmt(tl.completedDate)}
                      </span>
                    )}
                    {!tl?.completedDate && tl?.expectedDate && (
                      <span style={{ fontSize: 11, color: isActive ? c.accent : '#4a5580', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: isActive ? c.accent : '#4a5580', display: 'inline-block', animation: isActive ? 'dotBlink 1.5s ease-in-out infinite' : 'none' }} />
                        अपेक्षित: {fmt(tl.expectedDate)}
                        {isActive && daysFromNow(tl.expectedDate) !== null && (
                          <span style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 6, padding: '1px 6px', marginLeft: 2, color: '#8b9cc8' }}>
                            {Math.abs(daysFromNow(tl.expectedDate))} {daysFromNow(tl.expectedDate) > 0 ? 'दिन बाकी' : 'दिन हुए'}
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── DATE SUMMARY CARDS (delivery app style) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        {/* Approval date */}
        <div style={{ background: '#141d2e', border: '1px solid rgba(124,111,239,0.25)', borderRadius: 16, padding: '14px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -12, right: -12, width: 48, height: 48, background: 'radial-gradient(circle,rgba(124,111,239,0.2),transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ fontSize: 18, marginBottom: 6 }}>📅</div>
          <div style={{ fontSize: 10, color: '#6b7fa8', marginBottom: 3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>स्वीकृति / Approval</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: timelines.approved?.completedDate ? '#22c55e' : '#7c6fef', marginBottom: 2 }}>
            {timelines.approved?.completedDate ? fmt(timelines.approved.completedDate) : fmt(approvalDate)}
          </div>
          {!timelines.approved?.completedDate && daysToApproval !== null && (
            <div style={{ fontSize: 11, color: daysToApproval > 0 ? '#7c6fef' : '#f43f5e', fontWeight: 600 }}>
              {daysToApproval > 0 ? `${daysToApproval} दिन बाकी` : `${Math.abs(daysToApproval)} दिन की देरी`}
            </div>
          )}
          {timelines.approved?.completedDate && <div style={{ fontSize: 11, color: '#22c55e' }}>✓ स्वीकृत हो गया</div>}
        </div>

        {/* Disbursement date */}
        <div style={{ background: '#141d2e', border: '1px solid rgba(245,166,35,0.25)', borderRadius: 16, padding: '14px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -12, right: -12, width: 48, height: 48, background: 'radial-gradient(circle,rgba(245,166,35,0.15),transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ fontSize: 18, marginBottom: 6 }}>💰</div>
          <div style={{ fontSize: 10, color: '#6b7fa8', marginBottom: 3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>भुगतान / Disburse</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: timelines.disbursed?.completedDate ? '#22c55e' : '#f5a623', marginBottom: 2 }}>
            {timelines.disbursed?.completedDate ? fmt(timelines.disbursed.completedDate) : fmt(disbursementDate)}
          </div>
          {!timelines.disbursed?.completedDate && daysToDisburse !== null && (
            <div style={{ fontSize: 11, color: daysToDisburse > 0 ? '#f5a623' : '#f43f5e', fontWeight: 600 }}>
              {daysToDisburse > 0 ? `${daysToDisburse} दिन बाकी` : 'जल्द आएगा!'}
            </div>
          )}
          {timelines.disbursed?.completedDate && <div style={{ fontSize: 11, color: '#22c55e' }}>✓ राशि मिल गई</div>}
        </div>
      </div>

      {/* ── NEXT STEP CARD (Hindi + English) ── */}
      {nextStep && (
        <div style={{ background: '#141d2e', border: `1px solid ${uc.border}`, borderRadius: 16, padding: 16, marginBottom: 14, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 4, background: uc.dot, borderRadius: '16px 0 0 16px' }} />
          <div style={{ paddingLeft: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: uc.dot, display: 'inline-block', animation: 'dotBlink 1.5s ease-in-out infinite' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: uc.dot, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                अगला कदम / Next Step — {uc.label}
              </span>
            </div>
            {/* Hindi */}
            <div style={{ fontSize: 13, color: '#c8d8ff', lineHeight: 1.7, marginBottom: 8, fontWeight: 500 }}>
              🇮🇳 {nextStep.hi}
            </div>
            {/* English */}
            <div style={{ fontSize: 12, color: '#6b7fa8', lineHeight: 1.6, marginBottom: 12 }}>
              🇬🇧 {nextStep.en}
            </div>
            {/* Action button */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: uc.bg, border: `1px solid ${uc.border}`, borderRadius: 10, padding: '7px 14px', fontSize: 12, fontWeight: 700, color: uc.dot, cursor: 'pointer' }}>
              ⚡ {nextStep.action}
            </div>
          </div>
        </div>
      )}

      {/* ── DOCUMENT CHECKLIST ── */}
      <div style={{ background: '#141d2e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden', marginBottom: 4 }}>
        {/* Header */}
        <button
          onClick={() => setExpandedDoc(!expandedDoc)}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 16 }}>📁</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#f0f4ff' }}>दस्तावेज़ / Documents</div>
              <div style={{ fontSize: 11, color: '#6b7fa8', marginTop: 1 }}>{docCounts.submitted}/{docs.length} जमा किए</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Mini dots */}
            <div style={{ display: 'flex', gap: 4 }}>
              {docCounts.submitted > 0 && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />}
              {docCounts.pending  > 0 && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f97316' }} />}
              {docCounts.missing  > 0 && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f43f5e' }} />}
            </div>
            <span style={{ fontSize: 16, color: '#4a5580', transform: expandedDoc ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s', display: 'inline-block' }}>⌄</span>
          </div>
        </button>

        {/* Doc progress bar */}
        <div style={{ height: 3, background: 'rgba(255,255,255,0.04)', margin: '0 16px' }}>
          <div style={{ height: '100%', width: `${Math.round((docCounts.submitted / docs.length) * 100)}%`, background: 'linear-gradient(90deg,#22c55e,#00d4aa)', borderRadius: 3, transition: 'width 0.6s ease' }} />
        </div>

        {/* Doc list */}
        {expandedDoc && (
          <div style={{ padding: '10px 14px 14px' }}>
            {docs.map((doc, i) => {
              const ds = DOC_STATUS[doc.status]
              return (
                <div key={doc.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px', borderRadius: 12, marginBottom: i < docs.length - 1 ? 6 : 0,
                  background: ds.bg, border: `1px solid ${ds.border}`,
                  animation: `fadeUp ${0.1 + i * 0.05}s ease-out`,
                }}>
                  {/* Status icon circle */}
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${ds.color}22`, border: `1.5px solid ${ds.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: ds.color, fontWeight: 700, flexShrink: 0 }}>
                    {ds.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#d0dcff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.name}</div>
                    <div style={{ fontSize: 10, color: ds.color, marginTop: 1, fontWeight: 600 }}>{ds.label}</div>
                  </div>
                  {doc.status === 'missing' && (
                    <div style={{ fontSize: 10, fontWeight: 700, background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.3)', color: '#f43f5e', padding: '3px 8px', borderRadius: 8, flexShrink: 0, cursor: 'pointer' }}>
                      अपलोड करें ↑
                    </div>
                  )}
                  {doc.status === 'pending' && (
                    <div style={{ fontSize: 10, fontWeight: 700, background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.25)', color: '#f97316', padding: '3px 8px', borderRadius: 8, flexShrink: 0 }}>
                      जाँच में है
                    </div>
                  )}
                </div>
              )
            })}

            {/* Legend */}
            <div style={{ display: 'flex', gap: 14, marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              {[['#22c55e','जमा/Done'],['#f97316','बाकी/Pending'],['#f43f5e','नहीं/Missing']].map(([c,l]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: c, display: 'inline-block' }} />
                  <span style={{ fontSize: 10, color: '#6b7fa8' }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Celebration */}
      {activeIdx >= STAGE_CONFIG.length - 1 && (
        <div style={{ marginTop: 14, background: 'linear-gradient(135deg,rgba(0,212,170,0.12),rgba(34,197,94,0.08))', border: '1px solid rgba(0,212,170,0.3)', borderRadius: 16, padding: 18, textAlign: 'center' }}>
          <div style={{ fontSize: 28, marginBottom: 6 }}>🎉</div>
          <div style={{ fontWeight: 700, color: '#f0f4ff', fontSize: 16 }}>बधाई हो! Congratulations!</div>
          <div style={{ fontSize: 13, color: '#8b9cc8', marginTop: 4 }}>{scheme.amount} आपके खाते में ट्रांसफर हो गया</div>
          <div style={{ fontSize: 12, color: '#6b7fa8', marginTop: 2 }}>{scheme.amount} transferred to your bank account</div>
        </div>
      )}
    </div>
  )
}
