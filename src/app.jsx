import React, { useState, useEffect } from "react";
import LandingPage from "./components/LandingPage";
import Sidebar from "./components/Sidebar";
import DashboardHeader from "./components/DashboardHeader";
import BenefitCounter from "./components/BenefitCounter";
import SchemeList from "./components/SchemeList";
import InstalmentLog from "./components/InstalmentLog";
import OfficerCard from "./components/Officercard";
import WhatsAppShare from "./components/WhatsAppshare";
import SchemeTracker from "./components/SchemeTracker";
import SchemeFinder from "./components/schemefinder";
import DigiLockerModal from "./components/DigiLockerModal";
import { auth } from "./config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import AuthPage from "./components/AuthPage";
import AdminDashboard from "./components/AdminDashboard";


const TAB_META = {
  schemes: { title: "My Schemes", subtitle: "Track all your applications" },
  ai: { title: "Apply for a Scheme", subtitle: "35 government schemes available" },
  admin: { title: "Admin Panel", subtitle: "Manage scheme life-cycle" },
  complaint: { title: "Report Issue", subtitle: "Anti-corruption system" },
};

function Dashboard({ onHome }) {
  const [activeTab, setActiveTab] = useState("schemes");
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [detailTab, setDetailTab] = useState("tracker");
  const [showDigiLocker, setShowDigiLocker] = useState(false);

  const meta = TAB_META[activeTab] || TAB_META.schemes;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#05080f" }}>
      <Sidebar activeTab={activeTab} onTab={setActiveTab} onHome={onHome} />
      <main style={{ flex: 1 }}>
        <DashboardHeader title={meta.title} subtitle={meta.subtitle} />
        <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>

          {/* SCHEMES TAB */}
          {activeTab === "schemes" && !selectedScheme && (
            <>
              <BenefitCounter />
              <SchemeList onSelect={setSelectedScheme} />
            </>
          )}

          {/* SCHEME DETAIL */}
          {activeTab === "schemes" && selectedScheme && (
            <div style={{ color: "#8b9cc8" }}>
              <button
                onClick={() => { setSelectedScheme(null); setDetailTab("tracker"); }}
                style={{ background: "none", border: "none", color: "#ff9933", cursor: "pointer", marginBottom: "20px", fontWeight: 600 }}
              >
                ← Back to My Schemes
              </button>

              <div style={{ display: "flex", gap: 6, marginBottom: "20px", background: "#0a0e1a", padding: "4px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                {["tracker", "payments", "officer", "share"].map(t => (
                  <button key={t} onClick={() => setDetailTab(t)} style={{
                    flex: 1, padding: "10px 4px", fontSize: "10px", fontWeight: 700, textTransform: "uppercase",
                    background: detailTab === t ? "#141d2e" : "transparent",
                    border: detailTab === t ? "1px solid rgba(255,153,51,0.3)" : "none",
                    color: detailTab === t ? "#ff9933" : "#4a5580", borderRadius: "8px", cursor: "pointer"
                  }}>{t}</button>
                ))}
              </div>

              {detailTab === "tracker" && <SchemeTracker schemeId={selectedScheme} />}
              {detailTab === "payments" && <InstalmentLog schemeId={selectedScheme} />}
              {detailTab === "officer" && <OfficerCard schemeId={selectedScheme} />}
              {detailTab === "share" && <WhatsAppShare schemeId={selectedScheme} />}
            </div>
          )}

          {/* AI TAB */}
          {activeTab === "ai" && (
            <>
              <SchemeFinder
                onApplicationSuccess={() => {
                  setActiveTab("schemes");
                }}
                onDigiLocker={() => setShowDigiLocker(true)}
              />
              {showDigiLocker && (
                <DigiLockerModal
                  onClose={() => setShowDigiLocker(false)}
                  onSuccess={() => setShowDigiLocker(false)}
                />
              )}
            </>
          )}

        </div>
      </main>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("landing");
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  if (authLoading) return (
    <div style={{
      minHeight: "100vh", background: "#05080f",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#4f8ef7", fontFamily: "sans-serif", fontSize: 14
    }}>Loading...</div>
  );

  if (!user) return <AuthPage onLogin={() => setUser(auth.currentUser)} />;

  return view === "landing" ? (
    <LandingPage onLaunchApp={() => setView("dashboard")} />
  ) : (
    <Dashboard onHome={() => setView("landing")} />
  );
}
{activeTab === 'admin' && <AdminDashboard />}