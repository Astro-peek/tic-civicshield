const [detailTab, setDetailTab] = useState('tracker');
import React, { useState } from "react";
import LandingPage from "./components/LandingPage";
import Sidebar from "./components/Sidebar";
import DashboardHeader from "./components/DashboardHeader";
import BenefitCounter from "./components/BenefitCounter";
import SchemeList from "./components/SchemeList";
import InstalmentLog from "./components/InstalmentLog";
import OfficerCard from "./components/Officercard";
import WhatsAppShare from "./components/WhatsAppshare";
import SchemeTracker from "./components/SchemeTracker";
import EligibilityForm from "./components/EligibilityForm";
import DigiLockerModal from "./components/DigiLockerModal"


const TAB_META = {
  schemes: { title: "My Schemes", subtitle: "Track all your applications" },
  ai: { title: "Apply for a Scheme", subtitle: "35 government schemes available" },
  admin: { title: "Admin Panel", subtitle: "Manage scheme life-cycle" },
  complaint: { title: "Report Issue", subtitle: "Anti-corruption system" },
};

export default function App() {
  const [view, setView] = useState("landing");
  const [activeTab, setActiveTab] = useState("schemes");
  const [selectedScheme, setSelectedScheme] = useState(null);

  if (view === "landing") return <LandingPage onLaunchApp={() => setView("dashboard")} />;

  const meta = TAB_META[activeTab];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#05080f" }}>
      <Sidebar activeTab={activeTab} onTab={setActiveTab} onHome={() => setView("landing")} />
      <main style={{ flex: 1 }}>
        <DashboardHeader title={meta.title} subtitle={meta.subtitle} />
        <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
           {activeTab === 'schemes' && !selectedScheme && (
              <>
                <BenefitCounter />
                <SchemeList onSelect={setSelectedScheme} />
              </>
           )}
           {selectedScheme && (
              <div style={{ color: '#8b9cc8' }}>
                <button onClick={() => setSelectedScheme(null)} style={{ background: 'none', border: 'none', color: '#ff9933', cursor: 'pointer', marginBottom: '20px' }}>← Back to Schemes</button>
                <div style={{ padding: '40px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', textAlign: 'center' }}>
                  <h3>Tracking Scheme: {selectedScheme}</h3>
                  <p>Tracker UI coming in Task 5...</p>
                </div>
              </div>
           )}
        </div>
      </main>
    </div>
  );
}

selectedScheme && (
  <div style={{ animation: 'fadeUp 0.3s ease-out' }}>
    <button onClick={() => { setSelectedScheme(null); setDetailTab('tracker'); }} style={{ background: 'none', border: 'none', color: '#4a5580', cursor: 'pointer', marginBottom: '20px', fontWeight: 600 }}>
       ← Back to My Schemes
    </button>
    
    <div style={{ display: 'flex', gap: 6, marginBottom: '20px', background: '#0a0e1a', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
       {['tracker', 'payments', 'officer', 'share'].map(t => (
         <button key={t} onClick={() => setDetailTab(t)} style={{ 
           flex: 1, padding: '10px 4px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase',
           background: detailTab === t ? '#141d2e' : 'transparent', 
           border: detailTab === t ? '1px solid rgba(255,153,51,0.3)' : 'none',
           color: detailTab === t ? '#ff9933' : '#4a5580', borderRadius: '8px', cursor: 'pointer' 
         }}>
           {t}
         </button>
       ))}
    </div>

    {detailTab === 'tracker' && <SchemeTracker schemeId={selectedScheme} />}
    {detailTab === 'payments' && <InstalmentLog schemeId={selectedScheme} />}
    {detailTab === 'officer' && <OfficerCard schemeId={selectedScheme} />}
    {detailTab === 'share' && <WhatsAppShare schemeId={selectedScheme} />}
  </div>
)
{activeTab === 'ai' && (
  <div>
    <EligibilityForm 
      onFind={() => alert('Discovery Engine coming in Task 8!')} 
      onDigiLocker={() => setShowDigiLocker(true)} 
    />
    
    {showDigiLocker && (
      <DigiLockerModal 
        onClose={() => setShowDigiLocker(false)} 
        onSuccess={() => {
          setShowDigiLocker(false);
          alert('Success: Data pre-filled from DigiLocker!');
        }} 
      />
    )}
  </div>
)}