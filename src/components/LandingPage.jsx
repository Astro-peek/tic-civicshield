import React, { useState, useEffect, useRef } from "react";

// ── Animated counter hook ────────────────────────────────────────────────────
function useCountUp(target, duration = 2000, startOnView = true) {
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!startOnView) {
      setStarted(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setStarted(true);
      },
      { threshold: 0.3 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = target / (duration / 16);
    const t = setInterval(() => {
      start += step;
      if (start >= target) {
        setVal(target);
        clearInterval(t);
      } else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(t);
  }, [started, target]);

  return [val, ref];
}

// ── Data ─────────────────────────────────────────────────────────────────────
const STATS = [
  {
    value: 90,
    suffix: "Cr+",
    label: "Citizens Underserved",
    labelHi: "नागरिक वंचित",
    color: "#FF9933",
    bg: "#fff8f0",
    border: "#ffe0b2",
  },
  {
    value: 35,
    suffix: "+",
    label: "Govt Schemes Tracked",
    labelHi: "सरकारी योजनाएं",
    color: "#138808",
    bg: "#f0fdf4",
    border: "#bbf7d0",
  },
  {
    value: 78,
    suffix: "%",
    label: "Eligibility Unknown",
    labelHi: "पात्रता अज्ञात",
    color: "#3b82f6",
    bg: "#eff6ff",
    border: "#bfdbfe",
  },
  {
    value: 3.2,
    suffix: "L Cr",
    label: "Annual DBT Leakage",
    labelHi: "वार्षिक DBT रिसाव",
    color: "#ef4444",
    bg: "#fef2f2",
    border: "#fecaca",
    decimal: true,
  },
];

const FEATURES = [
  {
    icon: "🤖",
    title: "AI Eligibility Engine",
    titleHi: "AI पात्रता इंजन",
    desc: "Gemini AI scans 35 government schemes in seconds and tells you exactly which ones you qualify for — with eligibility % and missing documents.",
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "#ddd6fe",
    tag: "Gemini AI",
  },
  {
    icon: "📍",
    title: "Live Scheme Tracker",
    titleHi: "लाइव योजना ट्रैकर",
    desc: "Track your application like a Swiggy order — 4 stages with real-time status, expected dates, and automatic delay detection.",
    color: "#0284c7",
    bg: "#f0f9ff",
    border: "#bae6fd",
    tag: "Real-time",
  },
  {
    icon: "🛡️",
    title: "Anti-Corruption Layer",
    titleHi: "भ्रष्टाचार विरोधी परत",
    desc: "Officer transparency with processing time limits, delay alerts, and a one-tap complaint system that fires to WhatsApp + Gmail + Google Sheets.",
    color: "#dc2626",
    bg: "#fef2f2",
    border: "#fecaca",
    tag: "CivicShield",
  },
  {
    icon: "💬",
    title: "Hindi AI Chatbot",
    titleHi: "हिंदी AI सहायक",
    desc: "Ask anything in Hindi or English. Our Gemini-powered assistant knows all 35 schemes and answers instantly in bilingual format.",
    color: "#0891b2",
    bg: "#ecfeff",
    border: "#a5f3fc",
    tag: "Bilingual",
  },
  {
    icon: "🪪",
    title: "DigiLocker Integration",
    titleHi: "डिजिलॉकर जोड़",
    desc: "One-tap document fetch from DigiLocker — Aadhaar, PAN, certificates pulled automatically. Zero manual upload needed.",
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
    tag: "Coming Soon",
  },
  {
    icon: "📊",
    title: "Corruption Heatmap",
    titleHi: "भ्रष्टाचार हीटमैप",
    desc: "Anonymous complaints aggregated into a live district-wise heatmap showing which officers and regions have the most delays.",
    color: "#16a34a",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    tag: "Coming Soon",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: "📝",
    title: "Fill Profile Once",
    titleHi: "एक बार प्रोफाइल भरें",
    desc: "Age, income, category, occupation — 2 minutes. AI handles the rest.",
    color: "#FF9933",
    bg: "#fff8f0",
  },
  {
    step: "02",
    icon: "🤖",
    title: "AI Finds Your Schemes",
    titleHi: "AI योजनाएं ढूंढे",
    desc: "Gemini scans 35 schemes, ranks matches by eligibility %, shows benefit amounts.",
    color: "#138808",
    bg: "#f0fdf4",
  },
  {
    step: "03",
    icon: "📤",
    title: "Apply In-App",
    titleHi: "ऐप में आवेदन करें",
    desc: "Fill the application form without leaving the app. Data saved to Firebase.",
    color: "#3b82f6",
    bg: "#eff6ff",
  },
  {
    step: "04",
    icon: "📍",
    title: "Track Live",
    titleHi: "लाइव ट्रैक करें",
    desc: "Monitor application stage, get date alerts, detect delays automatically.",
    color: "#7c3aed",
    bg: "#f5f3ff",
  },
];

const TEAM = [
  {
    name: "Ashish",
    role: "Full Stack + AI",
    emoji: "👨‍💻",
    color: "#3b82f6",
    bg: "#eff6ff",
  },
  {
    name: "Team Member 2",
    role: "UI/UX Design",
    emoji: "🎨",
    color: "#7c3aed",
    bg: "#f5f3ff",
  },
  {
    name: "Team Member 3",
    role: "Backend + n8n",
    emoji: "⚙️",
    color: "#138808",
    bg: "#f0fdf4",
  },
  {
    name: "Team Member 4",
    role: "Research + Policy",
    emoji: "📚",
    color: "#d97706",
    bg: "#fffbeb",
  },
];

const TECH = [
  "React 18",
  "Gemini AI",
  "Firebase",
  "n8n Workflows",
  "DigiLocker API",
  "Google Sheets",
  "Web Push API",
  "Tailwind CSS",
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function LandingPage({ onLaunchApp }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      style={{
        background: "#f0f4ff",
        minHeight: "100vh",
        fontFamily: "'DM Sans', sans-serif",
        color: "#1a1f36",
      }}
    >
      {/* ── NAVBAR ── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          transition: "all 0.3s",
          background: scrolled
            ? "rgba(255,255,255,0.95)"
            : "rgba(240,244,255,0.8)",
          backdropFilter: "blur(20px)",
          borderBottom: scrolled
            ? "1px solid rgba(0,0,0,0.08)"
            : "1px solid transparent",
          boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.06)" : "none",
        }}
      >
        <div className="tricolor-bar" />
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                background: "linear-gradient(135deg,#FF9933,#E65C00)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                boxShadow: "0 4px 12px rgba(255,153,51,0.3)",
              }}
            >
              🛡️
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: 16,
                  fontWeight: 800,
                  color: "#1a1f36",
                  letterSpacing: "-0.3px",
                }}
              >
                SchemeMatch
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: "#138808",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  marginTop: -2,
                }}
              >
                CivicShield
              </div>
            </div>
          </div>

          {/* Nav links */}
          <div
            style={{ display: "flex", alignItems: "center", gap: 32 }}
            className="hidden md:flex"
          >
            {["Features", "How It Works", "Impact", "Team"].map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase().replace(/ /g, "-")}`}
                style={{
                  fontSize: 14,
                  color: "#4a5580",
                  textDecoration: "none",
                  fontWeight: 500,
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#FF9933")}
                onMouseLeave={(e) => (e.target.style.color = "#4a5580")}
              >
                {l}
              </a>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={onLaunchApp}
            style={{
              padding: "10px 22px",
              borderRadius: 12,
              background: "linear-gradient(135deg,#FF9933,#E65C00)",
              border: "none",
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              display: "flex",
              alignItems: "center",
              gap: 6,
              boxShadow: "0 4px 14px rgba(255,153,51,0.35)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow =
                "0 6px 20px rgba(255,153,51,0.5)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow =
                "0 4px 14px rgba(255,153,51,0.35)")
            }
          >
            🚀 Launch App
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          paddingTop: 80,
        }}
      >
        {/* Soft decorative blobs */}
        <div
          style={{
            position: "absolute",
            top: "5%",
            left: "-5%",
            width: 600,
            height: 600,
            background:
              "radial-gradient(circle,rgba(255,153,51,0.12),transparent 65%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "5%",
            right: "-5%",
            width: 500,
            height: 500,
            background:
              "radial-gradient(circle,rgba(19,136,8,0.1),transparent 65%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "35%",
            width: 400,
            height: 400,
            background:
              "radial-gradient(circle,rgba(59,130,246,0.07),transparent 65%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: 920,
            margin: "0 auto",
            padding: "0 24px",
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Badge */}
          <div
            className="animate-fadeUp"
            style={{
              animationDelay: "0s",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#fff8f0",
              border: "1.5px solid #ffe0b2",
              borderRadius: 20,
              padding: "7px 18px",
              marginBottom: 32,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#FF9933",
              }}
              className="animate-pulse-dot"
            />
            <span
              style={{
                fontSize: 12,
                color: "#E65C00",
                fontWeight: 700,
                letterSpacing: "0.04em",
              }}
            >
              🇮🇳 Hackathon 2025 · CivicTech Innovation
            </span>
          </div>

          {/* Headline */}
          <h1
            className="animate-fadeUp"
            style={{
              animationDelay: "0.1s",
              fontFamily: "'Poppins', sans-serif",
              fontSize: "clamp(34px,5.5vw,68px)",
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: 24,
              letterSpacing: "-1px",
              color: "#1a1f36",
            }}
          >
            Every Indian Deserves
            <br />
            <span
              style={{
                background:
                  "linear-gradient(135deg,#FF9933 0%,#E65C00 50%,#FF9933 100%)",
                backgroundSize: "200%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "gradientShift 3s ease infinite",
              }}
            >
              Their Rightful Benefits
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="animate-fadeUp"
            style={{
              animationDelay: "0.2s",
              fontSize: "clamp(15px,1.8vw,19px)",
              color: "#4a5580",
              lineHeight: 1.75,
              maxWidth: 660,
              margin: "0 auto 14px",
            }}
          >
            SchemeMatch CivicShield is an AI-powered platform that helps 90
            crore underserved citizens discover, apply for, and track government
            schemes — with built-in anti-corruption protection.
          </p>
          <p
            className="animate-fadeUp"
            style={{
              animationDelay: "0.25s",
              fontSize: 14,
              color: "#8b9cc8",
              marginBottom: 40,
              fontWeight: 500,
            }}
          >
            90 करोड़ नागरिकों का हक़ — AI से खोजें, आवेदन करें, ट्रैक करें
          </p>

          {/* CTAs */}
          <div
            className="animate-fadeUp"
            style={{
              animationDelay: "0.3s",
              display: "flex",
              gap: 14,
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: 60,
            }}
          >
            <button
              onClick={onLaunchApp}
              style={{
                padding: "15px 32px",
                borderRadius: 14,
                background: "linear-gradient(135deg,#FF9933,#E65C00)",
                border: "none",
                color: "#fff",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                display: "flex",
                alignItems: "center",
                gap: 8,
                boxShadow: "0 8px 28px rgba(255,153,51,0.4)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 36px rgba(255,153,51,0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow =
                  "0 8px 28px rgba(255,153,51,0.4)";
              }}
            >
              🚀 Launch Live Demo
            </button>
            <a
              href="#how-it-works"
              style={{
                padding: "15px 32px",
                borderRadius: 14,
                background: "#ffffff",
                border: "1.5px solid rgba(0,0,0,0.1)",
                color: "#1a1f36",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                display: "flex",
                alignItems: "center",
                gap: 8,
                textDecoration: "none",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#FF9933";
                e.currentTarget.style.color = "#FF9933";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)";
                e.currentTarget.style.color = "#1a1f36";
              }}
            >
              ▶ See How It Works
            </a>
          </div>

          {/* Mini app preview card */}
          <div
            className="animate-fadeUp"
            style={{
              animationDelay: "0.4s",
              background: "#ffffff",
              border: "1px solid rgba(0,0,0,0.08)",
              borderRadius: 20,
              padding: "20px 22px",
              boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
              maxWidth: 580,
              margin: "0 auto",
            }}
          >
            {/* Window controls */}
            <div
              style={{
                display: "flex",
                gap: 6,
                marginBottom: 16,
                alignItems: "center",
              }}
            >
              {["#ef4444", "#f59e0b", "#22c55e"].map((c) => (
                <div
                  key={c}
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: c,
                  }}
                />
              ))}
              <div
                style={{
                  flex: 1,
                  height: 10,
                  background: "#f0f4ff",
                  borderRadius: 5,
                  marginLeft: 8,
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {[
                {
                  icon: "🤖",
                  label: "AI Eligibility",
                  val: "8 schemes found",
                  color: "#7c3aed",
                  bg: "#f5f3ff",
                },
                {
                  icon: "📍",
                  label: "Tracker",
                  val: "Stage 3/4 · Active",
                  color: "#0284c7",
                  bg: "#f0f9ff",
                },
                {
                  icon: "🛡️",
                  label: "CivicShield",
                  val: "0 complaints",
                  color: "#138808",
                  bg: "#f0fdf4",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    flex: 1,
                    background: item.bg,
                    borderRadius: 12,
                    padding: "12px 14px",
                    border: `1px solid ${item.color}25`,
                  }}
                >
                  <div style={{ fontSize: 20, marginBottom: 5 }}>
                    {item.icon}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "#8b9cc8",
                      marginBottom: 3,
                      fontWeight: 500,
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{ fontSize: 11, color: item.color, fontWeight: 700 }}
                  >
                    {item.val}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── IMPACT STATS ── */}
      <section
        id="impact"
        style={{
          padding: "90px 24px",
          background: "#ffffff",
          borderTop: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div className="section-label" style={{ marginBottom: 10 }}>
              The Problem We're Solving
            </div>
            <h2
              className="section-title"
              style={{ fontSize: "clamp(26px,3.5vw,42px)", marginBottom: 12 }}
            >
              India's Benefits Gap is a National Crisis
            </h2>
            <p
              style={{
                color: "#8b9cc8",
                fontSize: 16,
                maxWidth: 480,
                margin: "0 auto",
              }}
            >
              Real numbers that demand a solution
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
              gap: 20,
            }}
          >
            {STATS.map((stat, i) => {
              const [count, ref] = useCountUp(stat.value, 1800);
              return (
                <div
                  ref={ref}
                  key={stat.label}
                  className="hover-card"
                  style={{
                    background: stat.bg,
                    border: `1.5px solid ${stat.border}`,
                    borderRadius: 20,
                    padding: "32px 24px",
                    textAlign: "center",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "clamp(38px,5vw,54px)",
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 800,
                      color: stat.color,
                      lineHeight: 1,
                      marginBottom: 10,
                    }}
                  >
                    {stat.decimal ? count.toFixed(1) : count}
                    {stat.suffix}
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#1a1f36",
                      marginBottom: 5,
                    }}
                  >
                    {stat.label}
                  </div>
                  <div style={{ fontSize: 12, color: "#8b9cc8" }}>
                    {stat.labelHi}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section
        id="features"
        style={{ padding: "90px 24px", background: "#f8faff" }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div
              className="section-label"
              style={{ color: "#138808", marginBottom: 10 }}
            >
              Platform Features
            </div>
            <h2
              className="section-title"
              style={{ fontSize: "clamp(26px,3.5vw,42px)", marginBottom: 12 }}
            >
              Everything in One Platform
            </h2>
            <p style={{ color: "#8b9cc8", fontSize: 16 }}>एक ही जगह — सब कुछ</p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(310px,1fr))",
              gap: 20,
            }}
          >
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="hover-card"
                style={{
                  background: "#ffffff",
                  border: `1.5px solid ${f.border}`,
                  borderRadius: 20,
                  padding: "28px 26px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -10,
                    right: -10,
                    width: 80,
                    height: 80,
                    background: `radial-gradient(circle,${f.color}15,transparent 70%)`,
                    pointerEvents: "none",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 14,
                      background: f.bg,
                      border: `1.5px solid ${f.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 22,
                    }}
                  >
                    {f.icon}
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "4px 12px",
                      borderRadius: 20,
                      background: f.bg,
                      border: `1.5px solid ${f.border}`,
                      color: f.color,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {f.tag}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#1a1f36",
                    marginBottom: 4,
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  {f.title}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: f.color,
                    marginBottom: 10,
                    fontWeight: 600,
                  }}
                >
                  {f.titleHi}
                </div>
                <div
                  style={{ fontSize: 13, color: "#4a5580", lineHeight: 1.7 }}
                >
                  {f.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section
        id="how-it-works"
        style={{ padding: "90px 24px", background: "#ffffff" }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div
              className="section-label"
              style={{ color: "#3b82f6", marginBottom: 10 }}
            >
              Simple Process
            </div>
            <h2
              className="section-title"
              style={{ fontSize: "clamp(26px,3.5vw,42px)", marginBottom: 12 }}
            >
              4 Steps to Your Benefits
            </h2>
            <p style={{ color: "#8b9cc8", fontSize: 16 }}>
              4 कदम — आपका हक पाने के लिए
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
              gap: 0,
              position: "relative",
            }}
          >
            {HOW_IT_WORKS.map((step, i) => (
              <div
                key={step.step}
                style={{
                  position: "relative",
                  padding: "32px 20px",
                  textAlign: "center",
                }}
              >
                {i < HOW_IT_WORKS.length - 1 && (
                  <div
                    style={{
                      position: "absolute",
                      top: 50,
                      right: 0,
                      width: "50%",
                      height: 2,
                      background: `linear-gradient(90deg,${step.color},transparent)`,
                      opacity: 0.4,
                    }}
                  />
                )}
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    background: step.bg,
                    border: `2.5px solid ${step.color}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 26,
                    margin: "0 auto 18px",
                    position: "relative",
                    boxShadow: `0 4px 16px ${step.color}25`,
                  }}
                >
                  {step.icon}
                  <div
                    style={{
                      position: "absolute",
                      top: -10,
                      right: -10,
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: step.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      fontWeight: 800,
                      color: "#fff",
                      boxShadow: `0 2px 8px ${step.color}50`,
                    }}
                  >
                    {step.step}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#1a1f36",
                    marginBottom: 4,
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  {step.title}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: step.color,
                    marginBottom: 8,
                    fontWeight: 600,
                  }}
                >
                  {step.titleHi}
                </div>
                <div
                  style={{ fontSize: 12, color: "#4a5580", lineHeight: 1.65 }}
                >
                  {step.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECH STACK ── */}
      <section
        style={{
          padding: "48px 24px",
          background: "#f8faff",
          borderTop: "1px solid rgba(0,0,0,0.05)",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
          <div
            style={{
              fontSize: 11,
              color: "#8b9cc8",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            Powered By
          </div>
          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {TECH.map((t) => (
              <span
                key={t}
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "7px 16px",
                  borderRadius: 20,
                  background: "#ffffff",
                  border: "1.5px solid rgba(0,0,0,0.08)",
                  color: "#4a5580",
                  fontFamily: "'DM Mono', monospace",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEMO CTA ── */}
      <section style={{ padding: "90px 24px", background: "#ffffff" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <div
            style={{
              background: "linear-gradient(135deg,#fff8f0,#f0fdf4)",
              border: "2px solid #ffe0b2",
              borderRadius: 28,
              padding: "60px 44px",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 8px 40px rgba(255,153,51,0.12)",
            }}
          >
            {/* Decorative corner */}
            <div
              style={{
                position: "absolute",
                top: -30,
                right: -30,
                width: 120,
                height: 120,
                background:
                  "radial-gradient(circle,rgba(255,153,51,0.15),transparent 70%)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: -30,
                left: -30,
                width: 120,
                height: 120,
                background:
                  "radial-gradient(circle,rgba(19,136,8,0.1),transparent 70%)",
                pointerEvents: "none",
              }}
            />
            <div style={{ fontSize: 44, marginBottom: 18 }}>🇮🇳</div>
            <h2
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "clamp(22px,3.5vw,36px)",
                fontWeight: 800,
                color: "#1a1f36",
                marginBottom: 14,
                letterSpacing: "-0.3px",
              }}
            >
              See It Live Right Now
            </h2>
            <p
              style={{
                color: "#4a5580",
                fontSize: 15,
                lineHeight: 1.7,
                marginBottom: 8,
              }}
            >
              Fill the AI Eligibility form → get matched schemes → apply in-app
              → track live → report issues. Full demo in under 5 minutes.
            </p>
            <p style={{ color: "#8b9cc8", fontSize: 13, marginBottom: 36 }}>
              AI पात्रता → योजना मिलान → आवेदन → ट्रैकिंग → शिकायत — 5 मिनट में
            </p>
            <button
              onClick={onLaunchApp}
              style={{
                padding: "16px 40px",
                borderRadius: 16,
                background: "linear-gradient(135deg,#FF9933,#E65C00)",
                border: "none",
                color: "#fff",
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: "0 8px 32px rgba(255,153,51,0.4)",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 40px rgba(255,153,51,0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow =
                  "0 8px 32px rgba(255,153,51,0.4)";
              }}
            >
              🚀 Launch Demo Now
            </button>
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section
        id="team"
        style={{
          padding: "90px 24px",
          background: "#f8faff",
          borderTop: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div
              className="section-label"
              style={{ color: "#d97706", marginBottom: 10 }}
            >
              The Builders
            </div>
            <h2
              className="section-title"
              style={{ fontSize: "clamp(26px,3.5vw,40px)" }}
            >
              Team CivicShield
            </h2>
          </div>
          <div
            style={{
              display: "flex",
              gap: 20,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {TEAM.map((member) => (
              <div
                key={member.name}
                className="hover-card"
                style={{
                  background: "#ffffff",
                  border: `1.5px solid ${member.color}20`,
                  borderRadius: 20,
                  padding: "28px 26px",
                  textAlign: "center",
                  minWidth: 185,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    width: 68,
                    height: 68,
                    borderRadius: "50%",
                    background: member.bg,
                    border: `2.5px solid ${member.color}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 28,
                    margin: "0 auto 16px",
                    boxShadow: `0 4px 14px ${member.color}25`,
                  }}
                >
                  {member.emoji}
                </div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#1a1f36",
                    marginBottom: 4,
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  {member.name}
                </div>
                <div
                  style={{ fontSize: 12, color: member.color, fontWeight: 600 }}
                >
                  {member.role}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          padding: "44px 24px",
          background: "#1a1f36",
          color: "#f0f4ff",
        }}
      >
        <div
          className="tricolor-bar"
          style={{ marginBottom: 32, borderRadius: 4 }}
        />
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: "linear-gradient(135deg,#FF9933,#E65C00)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
              }}
            >
              🛡️
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#f0f4ff",
                }}
              >
                SchemeMatch CivicShield
              </div>
              <div style={{ fontSize: 11, color: "#4a5580", marginTop: 1 }}>
                आपका अधिकार, आपका पैसा · Your Rights, Your Money
              </div>
            </div>
          </div>
          <div style={{ fontSize: 12, color: "#4a5580" }}>
            Built with ❤️ for Hackathon 2025 · 🇮🇳 Jai Hind
          </div>
        </div>
      </footer>
    </div>
  );
}
