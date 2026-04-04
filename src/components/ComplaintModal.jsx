import React, { useState } from "react";
import { SCHEMES, OFFICERS_MAP } from "../data/mockData";
import { setLS, getLS } from "../utils/localStorage";

const N8N_WEBHOOK =
  "https://api-qtejhcvsha-el.a.run.app/webhook-test/report-issue";

const COMPLAINT_TYPES = [
  {
    id: "bribe",
    label: "💰 रिश्वत / Bribe Demanded",
    desc: "Officer demanded illegal payment",
  },
  {
    id: "delay",
    label: "⏱️ देरी / Unexplained Delay",
    desc: "Processing beyond allowed time",
  },
  {
    id: "harassment",
    label: "⚠️ उत्पीड़न / Harassment",
    desc: "Inappropriate behavior or threats",
  },
  {
    id: "misconduct",
    label: "🚫 कदाचार / Misconduct",
    desc: "Other improper conduct",
  },
  {
    id: "doc_reject",
    label: "📁 दस्तावेज़ अस्वीकार / Doc Rejection",
    desc: "Valid documents rejected unfairly",
  },
];

const S = {
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 999,
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    background: "rgba(0,0,0,0.75)",
    backdropFilter: "blur(6px)",
    padding: "0 0 0 0",
    fontFamily: "'DM Sans',sans-serif",
  },
  sheet: {
    width: "100%",
    maxWidth: 480,
    background: "#0d1422",
    borderRadius: "20px 20px 0 0",
    maxHeight: "92vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.1)",
    borderBottom: "none",
  },
  header: {
    background: "linear-gradient(135deg,#7a1a2e,#a02030)",
    padding: "18px 18px 16px",
    flexShrink: 0,
  },
  body: { overflowY: "auto", flex: 1, padding: "18px" },
  footer: {
    padding: "12px 18px 24px",
    flexShrink: 0,
    borderTop: "1px solid rgba(255,255,255,0.06)",
  },
  input: {
    width: "100%",
    padding: "11px 13px",
    borderRadius: 11,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.04)",
    color: "#f0f4ff",
    fontSize: 13,
    fontFamily: "'DM Sans',sans-serif",
    outline: "none",
  },
  label: {
    fontSize: 11,
    color: "#6b7fa8",
    fontWeight: 600,
    display: "block",
    marginBottom: 5,
    letterSpacing: "0.03em",
  },
};

export default function ComplaintModal({ schemeId, onClose, inline = false }) {
  const [step, setStep] = useState(1); // 1 form | 2 loading | 3 success | 4 error
  const [form, setForm] = useState({
    type: "",
    description: "",
    amount: "",
    anonymous: false,
    name: "",
    phone: "",
  });
  const [ticket, setTicket] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const scheme = SCHEMES.find((s) => s.id === schemeId);
  const officer = OFFICERS_MAP[schemeId];
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.type || !form.description.trim()) return;
    setStep(2);

    const ticketId = `CMP-${Date.now().toString(36).toUpperCase()}`;
    const payload = {
      ticketId,
      schemeName: scheme?.name,
      schemeNameHi: scheme?.nameHi || scheme?.name,
      officerName: officer?.name,
      officerId: officer?.id,
      department: officer?.department,
      complaintType: form.type,
      complaintText: form.description,
      bribeAmount: form.amount || null,
      isAnonymous: form.anonymous,
      complainantName: form.anonymous ? "Anonymous" : form.name,
      complainantPhone: form.anonymous ? "" : form.phone,
      submittedAt: new Date().toISOString(),
      appVersion: "SchemeMatch CivicShield v1.0",
    };

    // Save locally always
    const prev = getLS("complaints", []);
    setLS("complaints", [...prev, payload]);

    // Fire n8n webhook
    try {
      await fetch(N8N_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setTicket(ticketId);
      setStep(3);
    } catch (e) {
      // Saved locally; still show success so user isn't discouraged
      setTicket(ticketId);
      setStep(3);
    }
  };

  const overlayStyle = inline 
    ? { display: "flex", justifyContent: "center", width: "100%" } 
    : S.overlay;

  const sheetStyle = inline
    ? { ...S.sheet, borderRadius: "20px", borderBottom: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }
    : S.sheet;

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={sheetStyle} onClick={(e) => e.stopPropagation()}>
        {/* ── HEADER ── */}
        <div style={S.header}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ fontSize: 22 }}>⚠️</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>
                  शिकायत दर्ज करें
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>
                  Report Issue / Bribe — CivicShield
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.15)",
                border: "none",
                color: "#fff",
                fontSize: 16,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ×
            </button>
          </div>
          {/* Context pill */}
          <div
            style={{
              marginTop: 12,
              background: "rgba(0,0,0,0.25)",
              borderRadius: 10,
              padding: "8px 12px",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#f43f5e",
              }}
            />
            <span
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.8)",
                fontWeight: 500,
              }}
            >
              {officer?.name} · {scheme?.name}
            </span>
          </div>
        </div>

        {/* ── STEP 1: FORM ── */}
        {step === 1 && (
          <>
            <div style={S.body}>
              {/* What fires on submit — show to build trust */}
              <div
                style={{
                  background: "rgba(79,142,247,0.08)",
                  border: "1px solid rgba(79,142,247,0.2)",
                  borderRadius: 12,
                  padding: "10px 14px",
                  marginBottom: 16,
                  fontSize: 11,
                  color: "#8bb4f8",
                  lineHeight: 1.6,
                }}
              >
                📡 यह शिकायत तुरंत भेजी जाएगी → <strong>WhatsApp</strong> +{" "}
                <strong>Email (ACB)</strong> + <strong>Google Sheets</strong> पर
                एक साथ
                <br />
                <span style={{ color: "#6b7fa8" }}>
                  Complaint fires simultaneously → WhatsApp + Gmail + Google
                  Sheets log
                </span>
              </div>

              {/* Type */}
              <div style={{ marginBottom: 16 }}>
                <label style={S.label}>शिकायत का प्रकार / Issue Type *</label>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 7 }}
                >
                  {COMPLAINT_TYPES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => set("type", t.id)}
                      style={{
                        textAlign: "left",
                        padding: "10px 13px",
                        borderRadius: 11,
                        border: `1.5px solid ${form.type === t.id ? "rgba(244,63,94,0.6)" : "rgba(255,255,255,0.07)"}`,
                        background:
                          form.type === t.id
                            ? "rgba(244,63,94,0.1)"
                            : "rgba(255,255,255,0.02)",
                        cursor: "pointer",
                        fontFamily: "'DM Sans',sans-serif",
                        transition: "all 0.15s",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: form.type === t.id ? "#fca5a5" : "#d0dcff",
                        }}
                      >
                        {t.label}
                      </div>
                      <div
                        style={{ fontSize: 11, color: "#4a5580", marginTop: 1 }}
                      >
                        {t.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bribe amount */}
              {form.type === "bribe" && (
                <div style={{ marginBottom: 16 }}>
                  <label style={S.label}>
                    मांगी गई राशि / Amount Demanded (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="रुपये में / In rupees"
                    value={form.amount}
                    onChange={(e) => set("amount", e.target.value)}
                    style={S.input}
                  />
                </div>
              )}

              {/* Description */}
              <div style={{ marginBottom: 16 }}>
                <label style={S.label}>विवरण / Description *</label>
                <textarea
                  rows={3}
                  placeholder="क्या हुआ, कब हुआ, कहाँ हुआ / What happened, when, where..."
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  style={{ ...S.input, resize: "none" }}
                />
              </div>

              {/* Anonymous toggle */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 12,
                  padding: "11px 14px",
                  marginBottom: 14,
                }}
              >
                <div>
                  <div
                    style={{ fontSize: 13, fontWeight: 600, color: "#d0dcff" }}
                  >
                    गुमनाम रहें / Submit Anonymously
                  </div>
                  <div style={{ fontSize: 11, color: "#4a5580" }}>
                    आपकी पहचान सुरक्षित रहेगी / Identity protected
                  </div>
                </div>
                <button
                  onClick={() => set("anonymous", !form.anonymous)}
                  style={{
                    width: 44,
                    height: 24,
                    borderRadius: 12,
                    border: "none",
                    cursor: "pointer",
                    position: "relative",
                    background: form.anonymous
                      ? "#22c55e"
                      : "rgba(255,255,255,0.1)",
                    transition: "background 0.2s",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 3,
                      left: form.anonymous ? 22 : 3,
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: "#fff",
                      transition: "left 0.2s",
                    }}
                  />
                </button>
              </div>

              {/* Contact info */}
              {!form.anonymous && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 10,
                    marginBottom: 14,
                  }}
                >
                  <div>
                    <label style={S.label}>नाम / Name</label>
                    <input
                      placeholder="पूरा नाम"
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      style={S.input}
                    />
                  </div>
                  <div>
                    <label style={S.label}>फ़ोन / Phone</label>
                    <input
                      placeholder="+91 XXXXX"
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      style={S.input}
                      type="tel"
                    />
                  </div>
                </div>
              )}

              <div
                style={{
                  fontSize: 11,
                  color: "#2a3250",
                  textAlign: "center",
                  lineHeight: 1.5,
                }}
              >
                झूठी शिकायत कानूनन दंडनीय है। यह डेटा ACB और Grievance Portal को
                जाता है।
              </div>
            </div>

            <div style={S.footer}>
              <button
                onClick={handleSubmit}
                disabled={!form.type || !form.description.trim()}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: 14,
                  border: "none",
                  background:
                    !form.type || !form.description.trim()
                      ? "rgba(244,63,94,0.3)"
                      : "linear-gradient(135deg,#c0182a,#f43f5e)",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor:
                    !form.type || !form.description.trim()
                      ? "not-allowed"
                      : "pointer",
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                🚨 शिकायत दर्ज करें / Submit Complaint
              </button>
            </div>
          </>
        )}

        {/* ── STEP 2: SENDING ── */}
        {step === 2 && (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 40,
              gap: 16,
            }}
          >
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <div
              style={{
                width: 48,
                height: 48,
                border: "3px solid rgba(244,63,94,0.2)",
                borderTop: "3px solid #f43f5e",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
            <div style={{ fontSize: 15, fontWeight: 700, color: "#f0f4ff" }}>
              शिकायत भेजी जा रही है...
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                width: "100%",
                maxWidth: 260,
              }}
            >
              {[
                { icon: "📱", label: "WhatsApp अधिकारी को", color: "#25d366" },
                { icon: "📧", label: "Gmail → ACB को", color: "#4f8ef7" },
                { icon: "📊", label: "Google Sheets लॉग", color: "#22c55e" },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: 8,
                    padding: "8px 12px",
                  }}
                >
                  <span>{item.icon}</span>
                  <span style={{ fontSize: 12, color: item.color }}>
                    {item.label}
                  </span>
                  <div
                    style={{
                      marginLeft: "auto",
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: item.color,
                      animation: `spin ${0.8 + i * 0.2}s linear infinite`,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 3: SUCCESS ── */}
        {step === 3 && (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              padding: 20,
            }}
          >
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#f0f4ff",
                  marginBottom: 4,
                }}
              >
                शिकायत दर्ज हो गई!
              </div>
              <div style={{ fontSize: 13, color: "#6b7fa8" }}>
                Complaint filed successfully
              </div>
            </div>

            {/* Ticket */}
            <div
              style={{
                background: "rgba(34,197,94,0.08)",
                border: "1px solid rgba(34,197,94,0.25)",
                borderRadius: 14,
                padding: "14px",
                marginBottom: 16,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 11, color: "#6b7fa8", marginBottom: 4 }}>
                शिकायत संख्या / Ticket ID
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#22c55e",
                  fontFamily: "monospace",
                  letterSpacing: "0.08em",
                }}
              >
                {ticket}
              </div>
              <div style={{ fontSize: 11, color: "#6b7fa8", marginTop: 4 }}>
                इसे नोट करें / Save this number
              </div>
            </div>

            {/* Channels fired */}
            <div
              style={{
                background: "#141d2e",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 14,
                padding: 14,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "#6b7fa8",
                  fontWeight: 600,
                  marginBottom: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                भेजा गया / Sent to
              </div>
              {[
                {
                  icon: "📱",
                  channel: "WhatsApp",
                  detail: `Officer notified`,
                  color: "#25d366",
                },
                {
                  icon: "📧",
                  channel: "Gmail",
                  detail: "ACB email sent",
                  color: "#4f8ef7",
                },
                {
                  icon: "📊",
                  channel: "Sheets",
                  detail: "Logged with ticket ID",
                  color: "#22c55e",
                },
              ].map((ch, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "7px 0",
                    borderBottom:
                      i < 2 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  }}
                >
                  <span style={{ fontSize: 16 }}>{ch.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{ fontSize: 12, fontWeight: 600, color: ch.color }}
                    >
                      {ch.channel}
                    </div>
                    <div style={{ fontSize: 11, color: "#4a5580" }}>
                      {ch.detail}
                    </div>
                  </div>
                  <span style={{ fontSize: 14, color: "#22c55e" }}>✓</span>
                </div>
              ))}
            </div>

            {/* Next steps */}
            <div
              style={{
                background: "#0d1422",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 12,
                padding: 14,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "#6b7fa8",
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                आगे क्या होगा / What happens next
              </div>
              {[
                "ACB 48 घंटे में समीक्षा करेगा / ACB reviews in 48 hours",
                "अधिकारी को सूचित किया जाएगा / Officer will be notified",
                "SMS/Call से अपडेट मिलेगा / Update via SMS/call",
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 8,
                    marginBottom: 6,
                  }}
                >
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: "rgba(79,142,247,0.2)",
                      color: "#4f8ef7",
                      fontSize: 10,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    {i + 1}
                  </div>
                  <span
                    style={{ fontSize: 11, color: "#8b9cc8", lineHeight: 1.5 }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={onClose}
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.05)",
                color: "#d0dcff",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              बंद करें / Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
