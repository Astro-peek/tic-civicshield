import React from "react";
import { Bell } from "lucide-react";

export default function DashboardHeader({
  title,
  subtitle,
  notifications = 0,
  onNotif,
}) {
  return (
    <header
      style={{
        background: "rgba(10,14,26,0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "0 24px",
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 50,
        fontFamily: "'Plus Jakarta Sans',sans-serif",
      }}
    >
      <div>
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "#f0f4ff",
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: 11, color: "#4a5580" }}>{subtitle}</div>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ position: "relative" }}>
          <button
            onClick={onNotif}
            title="Open notifications"
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.07)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <Bell size={15} color="#8b9cc8" />
          </button>
          {notifications > 0 && (
            <div
              className="animate-pulse-dot"
              style={{
                position: "absolute",
                top: -4,
                right: -4,
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: "#f43f5e",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 8,
                fontWeight: 800,
                color: "#fff",
              }}
            >
              {notifications}
            </div>
          )}
        </div>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#FF9933,#ff6b00)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 800,
            fontSize: 12,
          }}
        >
          R
        </div>
      </div>
    </header>
  );
}
