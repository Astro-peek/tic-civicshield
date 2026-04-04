// src/components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { getAppliedSchemes, advanceStage, subscribe } from '../stores/applicationstore';

export default function AdminDashboard() {
  const [apps, setApps] = useState(getAppliedSchemes());

  // Subscribe to live changes
  useEffect(() => {
    const unsub = subscribe(() => setApps([...getAppliedSchemes()]));
    return unsub;
  }, []);

  return (
    <div style={{ animation: 'fadeUp 0.3s ease-out' }}>
      <h3 style={{ color: '#fff', marginBottom: '20px', fontSize: '18px' }}>Government Admin: Applications Ledger</h3>
      <div style={{ background: '#121a2f', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#f0f4ff', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
              <th style={{ padding: '16px' }}>Applicant</th>
              <th style={{ padding: '16px' }}>Scheme</th>
              <th style={{ padding: '16px' }}>Status</th>
              <th style={{ padding: '16px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {apps.map(app => (
              <tr key={app.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '16px' }}>
                   <div style={{ fontWeight: 700 }}>{app.applicantName || 'Citizen'}</div>
                   <div style={{ fontSize: '10px', color: '#4a5580' }}>ID: {app.id}</div>
                </td>
                <td style={{ padding: '16px' }}>{app.name || app.schemeName}</td>
                <td style={{ padding: '16px' }}>
                   <span style={{ color: '#ff9933', fontWeight: 700 }}>Stage {app.activeStageIndex || 0} / 3</span>
                </td>
                <td style={{ padding: '16px' }}>
                  <button 
                    onClick={() => advanceStage(app.id)}
                    style={{ padding: '8px 14px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}
                  >
                    Move to Next Stage →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}