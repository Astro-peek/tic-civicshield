import React, { useState } from "react";
import { auth, googleProvider } from "../config/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

export default function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(""); setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      onLogin();
    } catch (e) {
      setError(e.message.replace("Firebase: ", ""));
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setError(""); setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      onLogin();
    } catch (e) {
      setError(e.message.replace("Firebase: ", ""));
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Plus Jakarta Sans', sans-serif", padding: 16,
      position: "relative", overflow: "hidden"
    }}>
      {/* Background circles */}
      <div style={{
        position: "absolute", top: -100, right: -100,
        width: 400, height: 400, borderRadius: "50%",
        background: "rgba(34,197,94,0.15)", pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute", bottom: -80, left: -80,
        width: 300, height: 300, borderRadius: "50%",
        background: "rgba(21,128,61,0.1)", pointerEvents: "none"
      }} />

      <div style={{
        background: "#ffffff",
        borderRadius: 28,
        padding: "44px 40px",
        width: "100%", maxWidth: 420,
        boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
        position: "relative", zIndex: 1
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 20,
            background: "linear-gradient(135deg, #22c55e, #16a34a)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, margin: "0 auto 14px", 
            boxShadow: "0 8px 24px rgba(34,197,94,0.35)"
          }}>🛡️</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#14532d" }}>
            CivicShield
          </div>
          <div style={{ fontSize: 13, color: "#4ade80", marginTop: 4, fontWeight: 600 }}>
            SchemeMatch Platform
          </div>
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>
            {isLogin ? "Welcome back! Sign in to continue" : "Create your account to get started"}
          </div>
        </div>

        {/* Toggle Login/Signup */}
        <div style={{
          display: "flex", background: "#f0fdf4",
          borderRadius: 14, padding: 4, marginBottom: 24,
          border: "1px solid #bbf7d0"
        }}>
          {["Login", "Sign Up"].map((t, i) => (
            <button key={t} onClick={() => { setIsLogin(i === 0); setError(""); }} style={{
              flex: 1, padding: "10px", borderRadius: 11, border: "none",
              cursor: "pointer", fontSize: 13, fontWeight: 700,
              background: isLogin === (i === 0) ? "linear-gradient(135deg, #22c55e, #16a34a)" : "transparent",
              color: isLogin === (i === 0) ? "#ffffff" : "#6b7280",
              boxShadow: isLogin === (i === 0) ? "0 4px 12px rgba(34,197,94,0.3)" : "none",
              transition: "all 0.2s"
            }}>{t}</button>
          ))}
        </div>

        {/* Email Input */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6, display: "block" }}>
            Email Address
          </label>
          <input
            type="email" placeholder="you@example.com"
            value={email} onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            style={{
              width: "100%", padding: "13px 16px", borderRadius: 12,
              border: "2px solid #e5e7eb", background: "#f9fafb",
              color: "#111827", fontSize: 13, outline: "none",
              boxSizing: "border-box", transition: "border 0.2s",
            }}
            onFocus={e => e.target.style.border = "2px solid #22c55e"}
            onBlur={e => e.target.style.border = "2px solid #e5e7eb"}
          />
        </div>

        {/* Password Input */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6, display: "block" }}>
            Password
          </label>
          <input
            type="password" placeholder="Min 6 characters"
            value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            style={{
              width: "100%", padding: "13px 16px", borderRadius: 12,
              border: "2px solid #e5e7eb", background: "#f9fafb",
              color: "#111827", fontSize: 13, outline: "none",
              boxSizing: "border-box", transition: "border 0.2s",
            }}
            onFocus={e => e.target.style.border = "2px solid #22c55e"}
            onBlur={e => e.target.style.border = "2px solid #e5e7eb"}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: "#fef2f2", border: "1px solid #fecaca",
            color: "#dc2626", borderRadius: 10, padding: "10px 14px",
            fontSize: 12, marginBottom: 16, fontWeight: 500
          }}>{error}</div>
        )}

        {/* Submit Button */}
        <button onClick={handleSubmit} disabled={loading} style={{
          width: "100%", padding: "14px", borderRadius: 12, border: "none",
          background: "linear-gradient(135deg, #22c55e, #16a34a)",
          color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
          marginBottom: 12, opacity: loading ? 0.7 : 1,
          boxShadow: "0 4px 16px rgba(34,197,94,0.4)",
          transition: "all 0.2s"
        }}>
          {loading ? "Please wait..." : isLogin ? "Sign In →" : "Create Account →"}
        </button>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
          <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>OR</span>
          <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
        </div>

        {/* Google Button */}
        <button onClick={handleGoogle} disabled={loading} style={{
          width: "100%", padding: "13px", borderRadius: 12,
          border: "2px solid #e5e7eb", background: "#ffffff",
          color: "#374151", fontSize: 13, fontWeight: 700, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          opacity: loading ? 0.7 : 1, transition: "all 0.2s"
        }}
          onMouseOver={e => e.currentTarget.style.border = "2px solid #22c55e"}
          onMouseOut={e => e.currentTarget.style.border = "2px solid #e5e7eb"}
        >
          <img src="https://www.google.com/favicon.ico" width={16} height={16} alt="G" />
          Continue with Google
        </button>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 20, fontSize: 11, color: "#9ca3af" }}>
          🔒 Secured by Firebase Authentication
        </div>
      </div>
    </div>
  );
}