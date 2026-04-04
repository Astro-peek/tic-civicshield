import React, { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import ComplaintModal from './ComplaintModal'
import WhatsAppShare from './WhatsAppShare'
import { getDelayDays } from '../data/mockData'

export default function ActionBar({ schemeId }) {
  const [showComplaint, setShowComplaint] = useState(false)
  const delayDays = getDelayDays(schemeId)

  return (
    <>
      <div className="space-y-3">
        {/* Complaint button */}
        <button
          onClick={() => setShowComplaint(true)}
          className={`w-full py-4 px-5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg ${
            delayDays > 0
              ? 'bg-gradient-to-r from-red-600 to-red-700 text-white glow-saffron hover:from-red-700 hover:to-red-800'
              : 'bg-white border-2 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-400'
          }`}
        >
          <AlertTriangle size={18} />
          Report Issue / Bribe
          {delayDays > 0 && (
            <span className="ml-1 text-[10px] bg-white/20 px-2 py-0.5 rounded-full">
              {delayDays}d delay
            </span>
          )}
        </button>

        {/* WhatsApp share */}
        <WhatsAppShare schemeId={schemeId} />
      </div>

      {showComplaint && (
        <ComplaintModal schemeId={schemeId} onClose={() => setShowComplaint(false)} />
      )}
    </>
  )
}
