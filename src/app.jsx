// src/App.jsx (Update)
import React, { useState } from "react";
import LandingPage from "./components/LandingPage";
import Sidebar from "./components/Sidebar";
import DashboardHeader from "./components/DashboardHeader";
import BenefitCounter from "./components/BenefitCounter";
import SchemeList from "./components/SchemeList";

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