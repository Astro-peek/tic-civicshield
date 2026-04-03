import React, { useState, useEffect } from "react";
import LandingPage from "./components/LandingPage";
import Sidebar from "./components/Sidebar";
import DashboardHeader from "./components/DashboardHeader";
import SchemeList from "./components/SchemeList";
import SchemeTracker from "./components/SchemeTracker";
import InstalmentLog from "./components/InstalmentLog";
import BenefitCounter from "./components/BenefitCounter";
import BrowserReminder from "./components/BrowserReminder";
import OfficerCard from "./components/OfficerCard";
import ComplaintModal from "./components/ComplaintModal";
import WhatsAppShare from "./components/WhatsAppShare";
import DirectApplyForm from "./components/DirectApplyForm";
import HindiChatbot from "./components/HindiChatbot";
import ManualStageAdvance from "./components/ManualStageAdvance";
import AdminDashboard from "./components/AdminDashboard";
import SchemeFinder from "./components/SchemeFinder";
import {
  getDelayDays,
  getTotalEntitled,
  getTotalReceived,
  SCHEMES,
  getActiveStageIndex,
} from "./data/mockData";
import { getDynActiveStageIndex } from "./stores/applicationStore";
import { ChevronLeft } from "lucide-react";

const SCHEME_IDS = ["PM-KISAN-2024-001", "PMAY-2024-002", "AYUSH-2024-003"];
const totalNotifications = SCHEME_IDS.filter(
  (id) => getDelayDays(id) > 0,
).length;

// ── Tab header config ─────────────────────────────────────────────────────────
const TAB_META = {
  schemes: {
    title: "My Schemes",
    subtitle: "मेरी सरकारी योजनाएं / Track all your applications",
  },
  ai: {
    title: "Apply for a Scheme",
    subtitle: "35 government schemes · Fill form · Upload docs · Track instantly",
  },
  tracker: {
    title: "Live Scheme Tracker",
    subtitle: "Swiggy-style delivery tracking for government schemes",
  },
  counter: {
    title: "Benefit Counter",
    subtitle: "Live ₹ you are entitled to vs received",
  },
  chat: {
    title: "Hindi AI Chatbot",
    subtitle: "CivicShield AI · Ask in Hindi or English",
  },
  complaint: {
    title: "Report Issue / Bribe",
    subtitle: "🚨 CivicShield Anti-Corruption System",
  },
  admin: {
    title: "Admin Dashboard",
    subtitle: "Manage all scheme applications",
  },
};

// ── Detail view for a specific scheme ────────────────────────────────────────
function SchemeDetailView({ schemeId, onBack }) {
  const [detailTab, setDetailTab] = useState("tracker");
  const [complaint, setComplaint] = useState(false);
  const activeIdx = getDynActiveStageIndex(schemeId);
  const delayDays = getDelayDays(schemeId) || 0;

  const DTABS = [
    { id: "tracker", label: "📍 Tracker" },
    { id: "kisht", label: "💰 Instalments" },
    { id: "officer", label: "👮 Officer" },
    { id: "share", label: "📤 Share" },
  ];

  return (
    <div style={{ padding: "24px", maxWidth: 680, margin: "0 auto" }}>
      <button
        onClick={onBack}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          color: "#8b9cc8",
          fontSize: 13,
          fontWeight: 500,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "8px 0",
          marginBottom: 16,
          fontFamily: "'Plus Jakarta Sans',sans-serif",
        }}
      >
        <ChevronLeft size={16} /> Back to Schemes
      </button>

      <ManualStageAdvance schemeId={schemeId} activeIdx={activeIdx} />

      {/* Detail tabs */}
      <div
        style={{
          display: "flex",
          gap: 4,
          background: "#111827",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 14,
          padding: 4,
          marginTop: 14,
          marginBottom: 18,
        }}
      >
        {DTABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setDetailTab(t.id)}
            style={{
              flex: 1,
              padding: "9px 6px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: 11,
              fontWeight: 600,
              transition: "all 0.15s",
              background:
                detailTab === t.id ? "rgba(255,153,51,0.15)" : "transparent",
              color: detailTab === t.id ? "#FF9933" : "#4a5580",
              borderBottom:
                detailTab === t.id
                  ? "2px solid #FF9933"
                  : "2px solid transparent",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {detailTab === "tracker" && <SchemeTracker schemeId={schemeId} />}
      {detailTab === "kisht" && <InstalmentLog schemeId={schemeId} />}
      {detailTab === "officer" && <OfficerCard schemeId={schemeId} />}
      {detailTab === "share" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <WhatsAppShare schemeId={schemeId} />
          <BrowserReminder />
        </div>
      )}

      {/* Report button */}
      <div
        style={{
          marginTop: 24,
          paddingTop: 16,
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <button
          onClick={() => setComplaint(true)}
          style={{
            width: "100%",
            padding: "13px",
            borderRadius: 14,
            border: `1px solid ${delayDays > 0 ? "rgba(244,63,94,0.5)" : "rgba(244,63,94,0.2)"}`,
            background:
              delayDays > 0 ? "rgba(244,63,94,0.15)" : "rgba(244,63,94,0.06)",
            color: "#f43f5e",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "'Plus Jakarta Sans',sans-serif",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          ⚠ शिकायत करें / Report Issue or Bribe
          {delayDays > 0 && (
            <span
              style={{
                fontSize: 10,
                background: "rgba(244,63,94,0.2)",
                border: "1px solid rgba(244,63,94,0.3)",
                borderRadius: 20,
                padding: "2px 8px",
              }}
            >
              {delayDays}d delay
            </span>
          )}
        </button>
      </div>

      {complaint && (
        <ComplaintModal
          schemeId={schemeId}
          onClose={() => setComplaint(false)}
        />
      )}
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({ onHome }) {
  const [activeTab, setActiveTab] = useState("schemes");
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [complaint, setComplaint] = useState(false);
  const [flashMsg, setFlashMsg] = useState("");
  const [newSchemeId, setNewSchemeId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleTab = (tab) => {
    setActiveTab(tab);
    setSelectedScheme(null);
    if (tab === "complaint") {
      setComplaint(true);
      setActiveTab("schemes");
    }
  };

  // Called after a successful application — navigate to My Schemes & highlight new entry
  const handleApplicationSuccess = (appId) => {
    setNewSchemeId(appId);
    setActiveTab("schemes");
    setSelectedScheme(appId);
    setFlashMsg("✅ Application submitted! Your scheme now appears in My Schemes with live tracking.");
  };

  const handleNotificationClick = () => {
    setFlashMsg(
      totalNotifications > 0
        ? `${totalNotifications} scheme update(s): delay alerts need your attention.`
        : "No pending alerts. All schemes are on track ✅",
    );
  };

  useEffect(() => {
    if (!flashMsg) return;
    const t = setTimeout(() => setFlashMsg(""), 2800);
    return () => clearTimeout(t);
  }, [flashMsg]);

  const meta = TAB_META[activeTab] || TAB_META.schemes;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#05080f",
        display: "flex",
        fontFamily: "'Plus Jakarta Sans',sans-serif",
      }}
    >
      {/* Sidebar — desktop only */}
      {!isMobile && (
        <div
          style={{
            width: 260,
            flexShrink: 0,
            position: "sticky",
            top: 0,
            height: "100vh",
          }}
        >
          <Sidebar
            activeTab={activeTab}
            onTab={handleTab}
            notifications={totalNotifications}
            onHome={onHome}
          />
        </div>
      )}

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        <DashboardHeader
          title={meta.title}
          subtitle={meta.subtitle}
          notifications={totalNotifications}
          onNotif={handleNotificationClick}
        />

        {flashMsg && (
          <div
            style={{
              margin: "10px auto 0",
              maxWidth: 860,
              width: "calc(100% - 20px)",
              background: "rgba(79,142,247,0.12)",
              border: "1px solid rgba(79,142,247,0.35)",
              color: "#9dc0ff",
              padding: "10px 14px",
              borderRadius: 12,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            🔔 {flashMsg}
          </div>
        )}

        <main
          style={{
            flex: 1,
            overflowY: "auto",
            background:
              "radial-gradient(circle at top right, rgba(79,142,247,0.08), transparent 35%), #070912",
          }}
        >
          {selectedScheme ? (
            <SchemeDetailView
              schemeId={selectedScheme}
              onBack={() => setSelectedScheme(null)}
            />
          ) : (
            <div
              style={{
                padding: "24px",
                maxWidth:
                  activeTab === "ai" || activeTab === "chat" ? 900 : 800,
                margin: "0 auto",
              }}
            >
              {/* ── SCHEMES TAB ── */}
              {activeTab === "schemes" && (
                <div>
                  <div
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(79,142,247,0.16), rgba(124,111,239,0.12))",
                      border: "1px solid rgba(124,111,239,0.35)",
                      borderRadius: 18,
                      padding: "18px 18px 16px",
                      marginBottom: 16,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 17,
                        fontWeight: 800,
                        color: "#f0f4ff",
                        marginBottom: 4,
                      }}
                    >
                      Welcome back 👋
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#93a8d7",
                        marginBottom: 14,
                      }}
                    >
                      Launch quick actions to navigate the app faster.
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit,minmax(145px,1fr))",
                        gap: 10,
                      }}
                    >
                      {[
                        {
                          label: "Apply for Scheme",
                          icon: "📋",
                          onClick: () => handleTab("ai"),
                        },
                        {
                          label: "Track Live",
                          icon: "📍",
                          onClick: () => handleTab("tracker"),
                        },
                        {
                          label: "Open Chatbot",
                          icon: "💬",
                          onClick: () => handleTab("chat"),
                        },
                        {
                          label: "Report Issue",
                          icon: "🚨",
                          onClick: () => setComplaint(true),
                        },
                      ].map((action) => (
                        <button
                          key={action.label}
                          onClick={action.onClick}
                          style={{
                            border: "1px solid rgba(255,255,255,0.12)",
                            background: "rgba(8,13,26,0.55)",
                            color: "#dce8ff",
                            borderRadius: 12,
                            fontSize: 12,
                            fontWeight: 700,
                            padding: "10px 12px",
                            cursor: "pointer",
                            textAlign: "left",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <span style={{ fontSize: 15 }}>{action.icon}</span>
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Stats row */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
                      gap: 14,
                      marginBottom: 24,
                    }}
                  >
                    {[
                      {
                        val: SCHEMES.length,
                        label: "Active Applications",
                        sub: "चालू आवेदन",
                        color: "#4f8ef7",
                      },
                      {
                        val: `₹${(getTotalEntitled() / 100000).toFixed(1)}L`,
                        label: "Total Entitled",
                        sub: "कुल हक़दार",
                        color: "#7c6fef",
                      },
                      {
                        val: `₹${(getTotalReceived() / 1000).toFixed(0)}K`,
                        label: "Received",
                        sub: "प्राप्त राशि",
                        color: "#22c55e",
                      },
                      {
                        val: totalNotifications,
                        label: "Delays",
                        sub: "देरी",
                        color: "#f43f5e",
                      },
                    ].map((s) => (
                      <div
                        key={s.label}
                        style={{
                          background: "#141d2e",
                          border: "1px solid rgba(255,255,255,0.07)",
                          borderRadius: 16,
                          padding: "16px 18px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 22,
                            fontWeight: 800,
                            color: s.color,
                            marginBottom: 4,
                            fontFamily: "Syne,sans-serif",
                          }}
                        >
                          {s.val}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: "#f0f4ff",
                          }}
                        >
                          {s.label}
                        </div>
                        <div
                          style={{
                            fontSize: 10,
                            color: "#4a5580",
                            marginTop: 1,
                          }}
                        >
                          {s.sub}
                        </div>
                      </div>
                    ))}
                  </div>
                  <SchemeList
                    selectedId={selectedScheme}
                    onSelect={setSelectedScheme}
                  />
                </div>
              )}

              {activeTab === "ai" && <SchemeFinder onApplicationSuccess={handleApplicationSuccess} />}
              {activeTab === "tracker" && (
                <div>
                  <p
                    style={{ fontSize: 13, color: "#6b7fa8", marginBottom: 16 }}
                  >
                    Select a scheme from the list below to view its tracker:
                  </p>
                  <SchemeList
                    selectedId={selectedScheme}
                    onSelect={(s) => {
                      setSelectedScheme(s);
                    }}
                  />
                </div>
              )}
              {activeTab === "counter" && <BenefitCounter />}
              {activeTab === "chat" && <HindiChatbot />}
              {activeTab === "admin" && <AdminDashboard />}
            </div>
          )}
        </main>

        {/* Mobile bottom nav */}
        {isMobile && (
          <nav
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              background: "#0a0e1a",
              borderTop: "1px solid rgba(255,255,255,0.07)",
              display: "flex",
              padding: "8px 4px 16px",
              zIndex: 50,
            }}
          >
            {[
              { id: "schemes", icon: "📋", label: "Schemes" },
              { id: "ai", icon: "🤖", label: "AI" },
              { id: "admin", icon: "🗂️", label: "Admin" },
              { id: "tracker", icon: "📍", label: "Tracker" },
              { id: "chat", icon: "💬", label: "Chat" },
              { id: "complaint", icon: "🚨", label: "Report" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => handleTab(t.id)}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "6px 2px",
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                }}
              >
                <span style={{ fontSize: 18 }}>{t.icon}</span>
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 600,
                    color: activeTab === t.id ? "#FF9933" : "#4a5580",
                  }}
                >
                  {t.label}
                </span>
                {activeTab === t.id && (
                  <div
                    style={{
                      width: 16,
                      height: 2,
                      borderRadius: 2,
                      background: "#FF9933",
                    }}
                  />
                )}
              </button>
            ))}
          </nav>
        )}
      </div>

      {/* Floating chatbot (desktop only) */}
      {!isMobile && activeTab !== "chat" && <HindiChatbot floating={true} />}

      {complaint && (
        <ComplaintModal
          schemeId={SCHEME_IDS[0]}
          onClose={() => setComplaint(false)}
        />
      )}
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("landing"); // 'landing' | 'dashboard'

  return view === "landing" ? (
    <LandingPage onLaunchApp={() => setView("dashboard")} />
  ) : (
    <Dashboard onHome={() => setView("landing")} />
  );
}
