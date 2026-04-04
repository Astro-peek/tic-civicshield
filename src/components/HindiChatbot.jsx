import React, { useState, useRef, useEffect } from "react";
import schemes from "../data/schemes";

const GEMINI_MODELS = [
  "gemini-1.5-flash",
  "gemini-1.5-flash-latest",
  "gemini-1.5-flash-8b",
];
const GEMINI_API_KEY = "AIzaSyA5CURfWeLK1aAP_6R9uox7cbspsBhniTA";

// Build scheme context for the AI
const SCHEME_CONTEXT = schemes
  .map(
    (s) =>
      `${s.id}. ${s.name} (${s.nameHi}) — ${s.category} — ${s.benefit} — Eligibility: income ${s.eligibility.maxIncome}, categories: ${s.eligibility.categories.join(",")}, occupations: ${s.eligibility.occupations.join(",")}, gender: ${s.eligibility.genders.join(",")} — Apply: ${s.applyLink}`,
  )
  .join("\n");

const SYSTEM_PROMPT = `You are CivicShield AI Assistant — a helpful government scheme advisor for Indian citizens. You speak both Hindi and English.

IMPORTANT RULES:
1. Always reply in BOTH Hindi and English — Hindi first, then English translation
2. Be warm, simple and helpful — like talking to a friend
3. You know these 35 government schemes in detail:
${SCHEME_CONTEXT}

4. When recommending schemes, always mention:
   - Scheme name in Hindi and English
   - The benefit amount
   - Who qualifies
   - End with: "Apply करने के लिए नीचे Apply बटन दबाएं / Press Apply button below to apply"

5. Keep answers short — max 4-5 lines per language
6. Use emojis to make it friendly
7. If asked something unrelated to schemes, gently redirect: "मैं केवल सरकारी योजनाओं में मदद कर सकता हूं।"

Format your response exactly like:
🇮🇳 [Hindi answer]

🇬🇧 [English answer]`;

function extractGeminiText(data) {
  const first = data?.candidates?.[0];
  const text = first?.content?.parts
    ?.map((p) => p?.text)
    .filter(Boolean)
    .join("\n")
    ?.trim();

  if (text) return text;

  const blockReason = data?.promptFeedback?.blockReason;
  if (blockReason) {
    throw new Error(`Prompt blocked: ${blockReason}`);
  }

  throw new Error("Gemini returned an empty response");
}

async function callGemini(messages) {
  const contents = messages.map((m) => ({
    role: m.role === "bot" ? "model" : "user",
    parts: [{ text: m.text }],
  }));

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  const errors = [];

  try {
    for (const model of GEMINI_MODELS) {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY.trim()}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents,
            generationConfig: { temperature: 0.4, maxOutputTokens: 800 },
          }),
          signal: controller.signal,
        },
      );

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        const msg = payload?.error?.message || `HTTP ${res.status}`;
        errors.push(`${model}: ${msg}`);
        continue;
      }

      const data = await res.json();
      return extractGeminiText(data);
    }
  } finally {
    clearTimeout(timeout);
  }

  throw new Error(errors.join(" | ") || "Gemini request failed");
}

function getLocalFallbackReply(userText) {
  const q = userText.toLowerCase();

  const matched = schemes
    .filter((s) => {
      const hay =
        `${s.name} ${s.nameHi} ${s.category} ${s.benefit}`.toLowerCase();
      return q.split(/\s+/).some((w) => w.length > 2 && hay.includes(w));
    })
    .slice(0, 3);

  if (matched.length === 0) {
    return `🇮🇳 अभी Gemini से कनेक्शन में दिक्कत है। आप योजना का नाम लिखें (जैसे: PM Kisan, Ayushman, Ujjwala), मैं तुरंत मदद करूंगा।\n\n🇬🇧 I’m having trouble connecting to Gemini right now. Please type a scheme name (like PM Kisan, Ayushman, Ujjwala) and I’ll help right away.`;
  }

  const hiLines = matched.map(
    (s, i) => `${i + 1}) ${s.nameHi} (${s.name}) — लाभ: ${s.benefit}`,
  );
  const enLines = matched.map(
    (s, i) => `${i + 1}) ${s.name} (${s.nameHi}) — Benefit: ${s.benefit}`,
  );

  return `🇮🇳 Gemini अभी उपलब्ध नहीं है, पर आपके सवाल से ये योजनाएं मैच हुईं:\n${hiLines.join("\n")}\n\nApply करने के लिए नीचे Apply बटन दबाएं।\n\n🇬🇧 Gemini is temporarily unavailable, but these schemes match your query:\n${enLines.join("\n")}\n\nPress the Apply button below to apply.`;
}

const QUICK_QUESTIONS = [
  { hi: "मुझे कौन सी योजना मिलेगी?", en: "Which schemes do I qualify for?" },
  { hi: "किसान योजनाएं बताओ", en: "Tell me farmer schemes" },
  { hi: "महिलाओं की योजनाएं", en: "Women schemes" },
  { hi: "बिजनेस लोन कैसे मिलेगा?", en: "How to get business loan?" },
  { hi: "आयुष्मान कार्ड कैसे बनेगा?", en: "How to get Ayushman card?" },
];

export default function HindiChatbot({ onApply, floating = false }) {
  const [open, setOpen] = useState(!floating);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "🙏 नमस्ते! मैं CivicShield AI सहायक हूं।\n\nमैं आपको 35 सरकारी योजनाओं के बारे में Hindi और English दोनों में बताऊंगा।\n\n🇬🇧 Hello! I am your CivicShield AI assistant. Ask me anything about government schemes in Hindi or English!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;

    setInput("");
    const newMessages = [...messages, { role: "user", text: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const reply = await callGemini(newMessages);
      setMessages((prev) => [...prev, { role: "bot", text: reply }]);
    } catch (e) {
      console.error("Gemini chat error:", e);
      const detail =
        e?.message?.slice(0, 180) || "Unknown Gemini connection error";
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: `${getLocalFallbackReply(userText)}\n\n⚠️ Debug: ${detail}`,
        },
      ]);
    }
    setLoading(false);
  };

  const chatUI = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: floating ? "70vh" : "auto",
        maxHeight: floating ? "70vh" : 600,
        fontFamily: "'DM Sans',sans-serif",
      }}
    >
      <style>{`
        @keyframes dotJump{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .msg{animation:fadeUp 0.2s ease-out}
        textarea:focus{outline:none;border-color:rgba(124,111,239,0.5)!important}
        textarea::placeholder{color:#3a4460}
      `}</style>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", paddingRight: 4 }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className="msg"
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              marginBottom: 10,
            }}
          >
            {msg.role === "bot" && (
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#7c6fef,#4f8ef7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  flexShrink: 0,
                  marginRight: 8,
                  marginTop: 2,
                }}
              >
                🤖
              </div>
            )}
            <div
              style={{
                maxWidth: "80%",
                padding: "10px 13px",
                borderRadius:
                  msg.role === "user"
                    ? "18px 18px 4px 18px"
                    : "18px 18px 18px 4px",
                background:
                  msg.role === "user"
                    ? "linear-gradient(135deg,#5b4ef7,#7c6fef)"
                    : "#141d2e",
                border:
                  msg.role === "user"
                    ? "none"
                    : "1px solid rgba(255,255,255,0.08)",
                fontSize: 12,
                color: "#f0f4ff",
                lineHeight: 1.65,
                whiteSpace: "pre-line",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#7c6fef,#4f8ef7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
              }}
            >
              🤖
            </div>
            <div
              style={{
                background: "#141d2e",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "18px 18px 18px 4px",
                padding: "12px 16px",
                display: "flex",
                gap: 4,
              }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#7c6fef",
                    animation: `dotJump 1.2s ease-in-out ${i * 0.15}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick questions */}
      {messages.length <= 1 && (
        <div style={{ marginTop: 10, marginBottom: 10 }}>
          <div
            style={{
              fontSize: 10,
              color: "#4a5580",
              marginBottom: 6,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            जल्दी पूछें / Quick ask
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {QUICK_QUESTIONS.map((q, i) => (
              <button
                key={i}
                onClick={() => send(q.hi)}
                style={{
                  fontSize: 10,
                  padding: "5px 10px",
                  borderRadius: 20,
                  background: "rgba(124,111,239,0.1)",
                  border: "1px solid rgba(124,111,239,0.25)",
                  color: "#a78bfa",
                  cursor: "pointer",
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                {q.hi}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div style={{ display: "flex", gap: 8, marginTop: 8, flexShrink: 0 }}>
        <textarea
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder="हिंदी या English में पूछें... / Ask in Hindi or English..."
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.04)",
            color: "#f0f4ff",
            fontSize: 12,
            fontFamily: "'DM Sans',sans-serif",
            resize: "none",
            lineHeight: 1.4,
          }}
        />
        <button
          onClick={() => send()}
          disabled={!input.trim() || loading}
          style={{
            width: 44,
            borderRadius: 12,
            border: "none",
            background:
              input.trim() && !loading
                ? "linear-gradient(135deg,#7c6fef,#4f8ef7)"
                : "rgba(255,255,255,0.05)",
            color: input.trim() && !loading ? "#fff" : "#3a4460",
            fontSize: 18,
            cursor: input.trim() && !loading ? "pointer" : "not-allowed",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ➤
        </button>
      </div>
      <div
        style={{
          fontSize: 10,
          color: "#2a3250",
          textAlign: "center",
          marginTop: 5,
        }}
      >
        Powered by Gemini AI · सभी 35 योजनाओं की जानकारी
      </div>
    </div>
  );

  // ── FLOATING MODE ──
  if (floating) {
    return (
      <>
        {/* Floating bubble */}
        {!open && (
          <button
            onClick={() => setOpen(true)}
            style={{
              position: "fixed",
              bottom: 80,
              right: 16,
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#7c6fef,#4f8ef7)",
              border: "none",
              boxShadow: "0 4px 24px rgba(124,111,239,0.5)",
              cursor: "pointer",
              fontSize: 24,
              zIndex: 500,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "pulse 2s ease-in-out infinite",
            }}
          >
            💬
            <style>{`@keyframes pulse{0%,100%{box-shadow:0 4px 24px rgba(124,111,239,0.5)}50%{box-shadow:0 4px 32px rgba(124,111,239,0.8)}}`}</style>
          </button>
        )}

        {/* Floating window */}
        {open && (
          <div
            style={{
              position: "fixed",
              bottom: 80,
              right: 16,
              width: 340,
              maxWidth: "calc(100vw - 32px)",
              background: "#0d1422",
              border: "1px solid rgba(124,111,239,0.3)",
              borderRadius: 20,
              boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
              zIndex: 500,
              overflow: "hidden",
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            {/* Chat header */}
            <div
              style={{
                background: "linear-gradient(135deg,#7c6fef22,#4f8ef711)",
                borderBottom: "1px solid rgba(124,111,239,0.2)",
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#7c6fef,#4f8ef7)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                  }}
                >
                  🤖
                </div>
                <div>
                  <div
                    style={{ fontSize: 13, fontWeight: 700, color: "#f0f4ff" }}
                  >
                    CivicShield AI
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "#00d4aa",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <div
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: "#00d4aa",
                      }}
                    />{" "}
                    Online · 35 schemes
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.1)",
                  border: "none",
                  color: "#8b9cc8",
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
            <div style={{ padding: "12px 14px 14px" }}>{chatUI}</div>
          </div>
        )}
      </>
    );
  }

  // ── INLINE MODE (tab) ──
  return (
    <div
      style={{
        background: "#141d2e",
        border: "1px solid rgba(124,111,239,0.2)",
        borderRadius: 20,
        padding: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 14,
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#7c6fef,#4f8ef7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
          }}
        >
          🤖
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#f0f4ff" }}>
            CivicShield AI सहायक
          </div>
          <div style={{ fontSize: 11, color: "#00d4aa" }}>
            35 योजनाओं की जानकारी · Hindi & English
          </div>
        </div>
      </div>
      {chatUI}
    </div>
  );
}
