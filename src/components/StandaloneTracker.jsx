import React, { useState, useEffect } from "react";
import SchemeTracker from "./SchemeTracker";
import { getAppliedSchemes, subscribe } from "../stores/applicationStore";

export default function StandaloneTracker({ initialSchemeId }) {
  const [schemes, setSchemes] = useState(getAppliedSchemes());
  const [activeId, setActiveId] = useState(initialSchemeId || (schemes.length > 0 ? schemes[0].id : null));

  useEffect(() => {
    return subscribe(() => {
      const updated = getAppliedSchemes();
      setSchemes(updated);
      if (!activeId && updated.length > 0) {
        setActiveId(updated[0].id);
      }
    });
  }, [activeId]);

  if (schemes.length === 0) {
    return (
      <div style={{ background: "#111827", padding: "40px 20px", borderRadius: "16px", textAlign: "center", border: "1px solid rgba(255,255,255,0.08)", animation: "fadeUp 0.4s ease-out" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
        <h3 style={{ color: "#f0f4ff", fontSize: 18, marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>No Applications Found</h3>
        <p style={{ color: "#8b9cc8", fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>Apply for a scheme first to start tracking its progress.</p>
      </div>
    );
  }

  return (
    <div style={{ animation: "fadeUp 0.4s ease-out" }}>
      <div style={{ 
        display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 20, paddingBottom: 8,
        scrollbarWidth: 'none' // Hide scrollbar for cleaner look
      }}>
        {schemes.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveId(s.id)}
            style={{
              padding: "10px 16px",
              borderRadius: "12px",
              border: activeId === s.id ? "1px solid rgba(79,142,247,0.5)" : "1px solid rgba(255,255,255,0.08)",
              background: activeId === s.id ? "linear-gradient(135deg, rgba(79,142,247,0.15), rgba(79,142,247,0.05))" : "#141d2e",
              color: activeId === s.id ? "#fff" : "#8b9cc8",
              cursor: "pointer",
              fontWeight: 600,
              flexShrink: 0,
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 13,
              transition: "all 0.2s"
            }}
          >
            {(s.name || "Application").substring(0, 22)}{(s.name || "Application").length > 22 ? '...' : ''}
          </button>
        ))}
      </div>

      {activeId && <SchemeTracker schemeId={activeId} />}
    </div>
  );
}
