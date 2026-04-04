import React, { useState } from 'react';

const S = {
  container: { padding: '30px', maxWidth: 1100, margin: '0 auto', fontFamily: "'DM Sans', sans-serif" },
  header: { fontSize: 24, fontWeight: 700, color: '#f0f4ff', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 },
  card: { background: '#121a2f', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th: { padding: '16px 20px', fontSize: 13, fontWeight: 600, color: '#6b7fa8', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' },
  td: { padding: '16px 20px', fontSize: 14, color: '#f0f4ff', borderBottom: '1px solid rgba(255,255,255,0.04)' },
  statusBadge: { padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 },
  btnView: { padding: '8px 14px', borderRadius: 8, background: 'rgba(79,142,247,0.1)', color: '#4f8ef7', border: '1px solid rgba(79,142,247,0.3)', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', gap: 6 }
};

const mockApplications = [
  { id: 'APP-1001', applicant: 'Rajesh Kumar', scheme: 'PM Kisan Support', category: 'Agriculture', status: 'Pending', date: 'Oct 12, 2024' },
  { id: 'APP-1002', applicant: 'Priya Sharma', scheme: 'Women Entrepreneur Loan', category: 'Business', status: 'Approved', date: 'Oct 11, 2024' },
  { id: 'APP-1003', applicant: 'Amit Singh', scheme: 'State SC Scholarship', category: 'Education', status: 'Rejected', date: 'Oct 10, 2024' },
  { id: 'APP-1004', applicant: 'Sunita Devi', scheme: 'PM Awas Yojana (Urban)', category: 'Housing', status: 'Pending', date: 'Oct 09, 2024' },
  { id: 'APP-1005', applicant: 'Ramesh Yadav', scheme: 'Kisan Credit Card (KCC)', category: 'Agriculture', status: 'Approved', date: 'Oct 08, 2024' },
];

const getStatusColor = (status) => {
  if (status === 'Approved') return { bg: 'rgba(34,197,94,0.15)', color: '#22c55e', dot: '#22c55e' };
  if (status === 'Pending') return { bg: 'rgba(245,166,35,0.15)', color: '#f5a623', dot: '#f5a623' };
  return { bg: 'rgba(244,63,94,0.15)', color: '#f43f5e', dot: '#f43f5e' };
};

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false);
  
  const handleViewDocument = (appId) => {
    // Placeholder function
    console.log(`Viewing document for application: ${appId}`);
    alert(`This would open the uploaded document for application ${appId}`);
  };

  return (
    <div style={S.container}>
      <style>{`
        table tr:hover td { background: rgba(255,255,255,0.02) !important; }
        .view-btn:hover { background: rgba(79,142,247,0.2) !important; color: #fff !important; }
      `}</style>
      
      <div style={S.header}>
        <span style={{ padding: 10, background: 'rgba(79,142,247,0.15)', borderRadius: 12, fontSize: 24 }}>🗂️</span>
        <div>
          <div style={{ lineHeight: 1 }}>Applications Dashboard</div>
          <div style={{ fontSize: 13, color: '#6b7fa8', marginTop: 6, fontWeight: 500 }}>Manage citizen scheme applications</div>
        </div>
      </div>

      <div style={S.card}>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>Application ID</th>
              <th style={S.th}>Applicant Details</th>
              <th style={S.th}>Scheme Name</th>
              <th style={S.th}>Status</th>
              <th style={{ ...S.th, textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {mockApplications.map((app) => {
              const statusStyle = getStatusColor(app.status);
              return (
                <tr key={app.id}>
                  <td style={{ ...S.td, width: '15%' }}>
                    <div style={{ fontFamily: 'monospace', color: '#9dc0ff', fontWeight: 600 }}>{app.id}</div>
                    <div style={{ fontSize: 12, color: '#6b7fa8', marginTop: 4 }}>{app.date}</div>
                  </td>
                  <td style={{ ...S.td, width: '25%' }}>
                    <div style={{ fontWeight: 600 }}>{app.applicant}</div>
                    <div style={{ fontSize: 12, color: '#6b7fa8', marginTop: 4 }}>View full profile</div>
                  </td>
                  <td style={{ ...S.td, width: '30%' }}>
                    <div style={{ fontWeight: 600 }}>{app.scheme}</div>
                    <div style={{ fontSize: 11, background: 'rgba(255,255,255,0.05)', display: 'inline-block', padding: '2px 8px', borderRadius: 12, marginTop: 6, color: '#8b9cc8' }}>
                      {app.category}
                    </div>
                  </td>
                  <td style={{ ...S.td, width: '15%' }}>
                    <div style={{ ...S.statusBadge, background: statusStyle.bg, color: statusStyle.color }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: statusStyle.dot }} />
                      {app.status}
                    </div>
                  </td>
                  <td style={{ ...S.td, width: '15%', textAlign: 'right' }}>
                    <button className="view-btn" style={S.btnView} onClick={() => handleViewDocument(app.id)}>
                      📄 View Document
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {loading && (
          <div style={{ padding: 40, textAlign: 'center' }}>Loading applications...</div>
        )}
      </div>
    </div>
  );
}
