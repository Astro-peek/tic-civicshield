import React from 'react'
import { CheckCircle2, Clock, AlertCircle, FileText, Upload } from 'lucide-react'
import { DOCUMENTS_MAP } from '../data/mockData'

const STATUS_CONFIG = {
  submitted: {
    icon: CheckCircle2,
    color: 'text-teal-500',
    bg: 'bg-teal-50 border-teal-200',
    label: 'Submitted',
    labelColor: 'text-teal-700 bg-teal-100',
  },
  pending: {
    icon: Clock,
    color: 'text-yellow-500',
    bg: 'bg-yellow-50 border-yellow-200',
    label: 'Pending',
    labelColor: 'text-yellow-700 bg-yellow-100',
  },
  missing: {
    icon: AlertCircle,
    color: 'text-red-500',
    bg: 'bg-red-50 border-red-200',
    label: 'Missing',
    labelColor: 'text-red-700 bg-red-100',
  },
}

export default function DocumentChecklist({ schemeId }) {
  const documents = DOCUMENTS_MAP[schemeId] || []

  const counts = {
    submitted: documents.filter(d => d.status === 'submitted').length,
    pending: documents.filter(d => d.status === 'pending').length,
    missing: documents.filter(d => d.status === 'missing').length,
  }

  const completionPct = Math.round((counts.submitted / documents.length) * 100)

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-navy-100 overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-navy-50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-navy-100 flex items-center justify-center">
              <FileText size={16} className="text-navy-600" />
            </div>
            <div>
              <h3 className="text-navy-900 font-bold text-sm">Document Checklist</h3>
              <p className="text-navy-500 text-xs">{documents.length} documents required</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-navy-900 font-bold text-lg">{completionPct}%</p>
            <p className="text-navy-400 text-[10px]">Complete</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-navy-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-400 to-green-500 transition-all duration-700"
            style={{ width: `${completionPct}%` }}
          />
        </div>

        {/* Stats */}
        <div className="flex gap-3 mt-3">
          <StatPill count={counts.submitted} label="Submitted" color="teal" />
          <StatPill count={counts.pending} label="Pending" color="yellow" />
          <StatPill count={counts.missing} label="Missing" color="red" />
        </div>
      </div>

      {/* Document list */}
      <div className="px-5 py-3 space-y-2">
        {documents.map((doc) => {
          const cfg = STATUS_CONFIG[doc.status]
          const Icon = cfg.icon

          return (
            <div
              key={doc.id}
              className={`flex items-center gap-3 p-3 rounded-xl border ${cfg.bg} transition-all`}
            >
              <Icon size={18} className={cfg.color} />
              <div className="flex-1 min-w-0">
                <p className="text-navy-800 text-sm font-medium truncate">{doc.name}</p>
                {doc.required && (
                  <p className="text-[10px] text-navy-400">Required</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.labelColor}`}>
                  {cfg.label}
                </span>
                {doc.status === 'missing' && (
                  <button className="w-7 h-7 rounded-lg bg-navy-600 flex items-center justify-center hover:bg-navy-700 transition-colors" title="Upload document">
                    <Upload size={12} className="text-white" />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {counts.missing > 0 && (
        <div className="mx-5 mb-5 mt-1 bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
          <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-red-700 text-xs">
            <span className="font-bold">{counts.missing} required document(s) missing.</span> Upload them to avoid delays in processing.
          </p>
        </div>
      )}
    </div>
  )
}

function StatPill({ count, label, color }) {
  const colors = {
    teal: 'bg-teal-100 text-teal-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
  }
  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${colors[color]}`}>
      <span className="font-bold text-sm">{count}</span>
      <span className="text-[11px]">{label}</span>
    </div>
  )
}
