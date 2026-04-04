import React from 'react'
import { User, BadgeCheck, Clock, AlertTriangle, Phone, Building2, Timer, Star, CheckCircle2 } from 'lucide-react'
import { OFFICERS_MAP, SCHEMES, getDelayDays } from '../data/mockData'

function daysSince(dateStr) {
  return Math.floor((new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24))
}

export default function OfficerCard({ schemeId }) {
  const officer = OFFICERS_MAP[schemeId]
  const scheme = SCHEMES.find(s => s.id === schemeId)
  const delayDays = getDelayDays(schemeId) || 0

  // New dynamic schemes don't have an officer assigned yet
  if (!officer) {
    return (
      <div style={{ background:'#141d2e', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, padding:24, textAlign:'center' }}>
        <div style={{ fontSize:36, marginBottom:12 }}>👮</div>
        <div style={{ fontSize:15, fontWeight:700, color:'#f0f4ff', marginBottom:8 }}>Officer Being Assigned</div>
        <div style={{ fontSize:12, color:'#6b7fa8', lineHeight:1.6 }}>
          Your application is new. An officer will be assigned within 3 working days.<br/>
          <span style={{ color:'#f5a623' }}>आपका आवेदन नया है। 3 कार्य दिवसों में अधिकारी नियुक्त होगा।</span>
        </div>
        <div style={{ marginTop:16, fontSize:11, color:'#4a5580', background:'rgba(255,255,255,0.03)', borderRadius:10, padding:'10px 14px' }}>
          📞 Anti-corruption helpline: <b style={{ color:'#00d4aa' }}>1064 (free)</b>
        </div>
      </div>
    )
  }

  const daysSinceAssigned = daysSince(officer.assignedDate)
  const isDelayed = delayDays > 0
  const processingProgress = Math.min(100, Math.round((daysSinceAssigned / officer.maxProcessingDays) * 100))

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-navy-100 overflow-hidden">
      {/* Header */}
      <div className={`px-5 py-4 border-b ${isDelayed ? 'bg-red-50 border-red-100' : 'bg-navy-50 border-navy-100'}`}>
        <div className="flex items-center gap-2 mb-1">
          <Shield16 isDelayed={isDelayed} />
          <h3 className="text-navy-900 font-bold text-sm">Officer Transparency</h3>
          {isDelayed && (
            <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold status-pulse">
              DELAYED
            </span>
          )}
        </div>
        <p className="text-navy-500 text-xs">Anti-corruption accountability layer</p>
      </div>

      {/* Officer info */}
      <div className="px-5 py-4 space-y-4">
        {/* Officer profile */}
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-navy-600 to-navy-800 flex items-center justify-center flex-shrink-0">
            <User size={22} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <p className="text-navy-900 font-bold text-sm">{officer.name}</p>
              <BadgeCheck size={14} className="text-teal-500" />
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[10px] bg-navy-100 text-navy-600 px-2 py-0.5 rounded font-mono font-medium">
                ID: {officer.id}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-1.5 text-navy-500">
              <Building2 size={11} />
              <span className="text-xs">{officer.department}</span>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="flex items-center justify-between border border-navy-100 rounded-xl p-3 bg-navy-50/50">
          <div className="text-center flex-1 border-r border-navy-100 last:border-0 pl-0 pr-2">
            <div className="flex items-center justify-center gap-1 text-yellow-500 mb-0.5">
              <Star size={14} className="fill-current" />
              <span className="font-bold text-sm text-navy-900">{officer.rating || 'N/A'}</span>
            </div>
            <p className="text-[10px] text-navy-500 font-medium tracking-wide uppercase">Rating</p>
          </div>
          <div className="text-center flex-1 border-r border-navy-100 px-2">
            <div className="flex items-center justify-center gap-1 text-teal-600 mb-0.5">
              <CheckCircle2 size={14} />
              <span className="font-bold text-sm text-navy-900">{officer.casesResolved || 0}</span>
            </div>
            <p className="text-[10px] text-navy-500 font-medium tracking-wide uppercase">Cases</p>
          </div>
          <div className="text-center flex-1 px-2">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <Timer size={14} className={(officer.onTimePercentage || 0) >= 80 ? 'text-green-500' : 'text-orange-500'} />
              <span className="font-bold text-sm text-navy-900">{officer.onTimePercentage || 0}%</span>
            </div>
            <p className="text-[10px] text-navy-500 font-medium tracking-wide uppercase">On Time</p>
          </div>
        </div>

        {/* Processing time */}
        <div className={`rounded-xl p-4 border ${isDelayed ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-100'}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Timer size={14} className={isDelayed ? 'text-red-500' : 'text-blue-500'} />
              <span className="text-xs font-semibold text-navy-700">Processing Time</span>
            </div>
            <span className={`text-xs font-bold ${isDelayed ? 'text-red-600' : 'text-blue-600'}`}>
              {daysSinceAssigned} / {officer.maxProcessingDays} days
            </span>
          </div>

          {/* Timer bar */}
          <div className="h-2.5 bg-white rounded-full overflow-hidden border border-navy-100">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isDelayed
                  ? 'bg-gradient-to-r from-red-400 to-red-600'
                  : processingProgress > 75
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                  : 'bg-gradient-to-r from-teal-400 to-blue-500'
              }`}
              style={{ width: `${Math.min(processingProgress, 100)}%` }}
            />
          </div>

          <div className="flex justify-between mt-1.5 text-[10px] text-navy-400">
            <span>Assigned: {new Date(officer.assignedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
            <span>Max: {officer.maxProcessingDays} days</span>
          </div>
        </div>

        {/* Delay alert */}
        {isDelayed && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-bold text-xs">Processing Delay Detected</p>
                <p className="text-red-600 text-xs mt-0.5">
                  This application is <span className="font-bold">{delayDays} days overdue</span> for processing. 
                  You have the right to file a complaint.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Mandate info */}
        <div className="bg-navy-950 rounded-xl p-3">
          <p className="text-teal-400 text-[10px] font-bold uppercase tracking-widest mb-1.5">Your Rights</p>
          <div className="space-y-1">
            <p className="text-navy-200 text-xs flex items-start gap-1.5">
              <span className="text-saffron-400 mt-0.5">→</span>
              Max processing time: <span className="font-semibold text-white ml-1">{officer.maxProcessingDays} working days</span>
            </p>
            <p className="text-navy-200 text-xs flex items-start gap-1.5">
              <span className="text-saffron-400 mt-0.5">→</span>
              Bribe demand is a criminal offense under <span className="font-semibold text-white ml-1">PC Act, 1988</span>
            </p>
            <p className="text-navy-200 text-xs flex items-start gap-1.5">
              <span className="text-saffron-400 mt-0.5">→</span>
              Anti-corruption helpline: <span className="font-semibold text-white ml-1">1064 (free)</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Shield16({ isDelayed }) {
  return (
    <div className={`w-6 h-6 rounded-md flex items-center justify-center ${isDelayed ? 'bg-red-100' : 'bg-navy-100'}`}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isDelayed ? '#ef4444' : '#162d7a'} strokeWidth="2.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    </div>
  )
}
