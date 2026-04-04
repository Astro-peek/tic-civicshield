import React, { useState } from 'react'
import { SCHEMES, STAGE_CONFIG, getActiveStageIndex, STAGE_TIMELINES } from '../data/mockData'

function buildMsg(schemeId) {
  const scheme    = SCHEMES.find(s => s.id === schemeId)
  const activeIdx = getActiveStageIndex(schemeId)
  const stage     = STAGE_CONFIG[activeIdx]
  const tl        = STAGE_TIMELINES[schemeId]
  const progress  = Math.round((activeIdx / (STAGE_CONFIG.length - 1)) * 100)
  const paid      = (scheme.instalments || []).filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0)
  const disbDate  = tl.disbursed?.completedDate || tl.disbursed?.expectedDate

  let msg = `🛡️ *SchemeMatch CivicShield — Status*\n\n`
  msg += `📋 *योजना:* ${scheme.name}\n`
  msg += `🆔 *आवेदन ID:* ${scheme.id}\n`
  msg += `💰 *कुल लाभ:* ${scheme.amount}\n`
  msg += `✅ *अब तक मिला:* ₹${paid.toLocaleString('en-IN')}\n\n`
  msg += `📍 *वर्तमान स्थिति:* ${stage.labelHi} (${stage.label}) ${stage.icon}\n`
  msg += `📊 *प्रगति:* ${progress}% पूर्ण\n`
  if (disbDate) msg += `📅 *अपेक्षित भुगतान:* ${new Date(disbDate).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}\n`
  msg += `\n_SchemeMatch CivicShield — आपका अधिकार, आपका पैसा 🇮🇳_`
  return encodeURIComponent(msg)
}

export default function WhatsAppShare({ schemeId }) {
  const [copied, setCopied] = useState(false)

  const share = () => window.open(`https://wa.me/?text=${buildMsg(schemeId)}`, '_blank', 'noopener')
  const copy  = async () => {
    try { await navigator.clipboard.writeText(decodeURIComponent(buildMsg(schemeId))); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch {}
  }

  return (
    <div style={{ background: '#141d2e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 16, fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(37,211,102,0.15)', border: '1px solid rgba(37,211,102,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#25d366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#f0f4ff' }}>WhatsApp पर शेयर करें</div>
          <div style={{ fontSize: 11, color: '#6b7fa8' }}>Hindi + English status share</div>
        </div>
      </div>
      {/* Preview bubble */}
      <div style={{ background: 'rgba(37,211,102,0.05)', border: '1px solid rgba(37,211,102,0.15)', borderRadius: 12, padding: '10px 12px', marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: '#6b7fa8', marginBottom: 4 }}>Preview message:</div>
        <div style={{ fontSize: 11, color: '#8b9cc8', lineHeight: 1.5 }}>🛡️ SchemeMatch CivicShield — Status · योजना: ... · वर्तमान स्थिति · अपेक्षित भुगतान तारीख ...</div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={share} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'linear-gradient(135deg,#25d366,#128c7e)', border: 'none', borderRadius: 12, padding: '11px', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          WhatsApp शेयर
        </button>
        <button onClick={copy} style={{ padding: '11px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: copied ? '#22c55e' : '#8b9cc8', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
    </div>
  )
}
