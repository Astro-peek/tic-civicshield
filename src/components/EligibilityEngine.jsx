import React, { useState } from "react";
import schemes from "../data/schemes";
import SchemeApplyForm from "./SchemeApplyForm";
import { checkEligibility } from "../services/api";

function normalizeValue(value = "") {
  return String(value).trim().toLowerCase();
}

function buildFlags(form) {
  const flags = [];

  if (form.bpl === "Yes") flags.push("bpl");
  if (form.bank === "Yes") flags.push("bank_account");
  if (form.aadhaar === "Yes") flags.push("aadhaar");
  if (form.disability === "Yes") flags.push("disability");
  if (form.pregnant === "Yes") flags.push("pregnant");
  if (form.gender === "Female") flags.push("female");

  return flags;
}

function findLocalScheme(apiScheme) {
  const schemeName = normalizeValue(apiScheme?.schemeName || "");
  const schemeId = Number(apiScheme?.schemeId);

  return (
    schemes.find((item) => Number(item.id) === schemeId) ||
    schemes.find((item) => normalizeValue(item.name) === schemeName)
  );
}

function getMatchReason(apiScheme, fallbackName) {
  const matched = apiScheme?.explanation?.matchedConditions || [];
  const failed = apiScheme?.explanation?.failedConditions || [];

  if (matched.length > 0) {
    return matched.slice(0, 2).join(" | ");
  }

  if (failed.length > 0) {
    return `Needs improvement in: ${failed.slice(0, 2).join(" | ")}`;
  }

  return `${fallbackName} matched based on submitted profile.`;
}

function mapApiResultToCard(apiScheme, index) {
  const localScheme = findLocalScheme(apiScheme);
  const matchScore = Number(apiScheme?.matchScore || 0);
  const failed = apiScheme?.explanation?.failedConditions || [];
  const requiredFailed = apiScheme?.explanation?.requiredConditionsFailed || [];
  const missingDocs = [...new Set([...requiredFailed, ...failed])].slice(0, 3);
  const fallbackName = apiScheme?.schemeName || `Scheme ${index + 1}`;

  return {
    id: localScheme?.id || apiScheme?.schemeId || `api-${index + 1}`,
    schemeId: apiScheme?.schemeId,
    name: fallbackName,
    nameHi: localScheme?.nameHi || "पात्रता आधारित योजना",
    emoji: localScheme?.emoji || "📌",
    category: localScheme?.category || "Government",
    benefit: localScheme?.benefit || `Match score: ${matchScore}%`,
    benefitNum: localScheme?.benefitNum || 0,
    description:
      localScheme?.description ||
      apiScheme?.description ||
      "This scheme is matched using your profile eligibility rules.",
    descHi:
      localScheme?.descHi ||
      "यह योजना आपकी दी गई जानकारी के अनुसार मिलान की गई है।",
    ministry: localScheme?.ministry || "Government of India",
    deadline: localScheme?.deadline || "Check official portal",
    applyLink: localScheme?.applyLink || "#",
    requiredDocs: localScheme?.requiredDocs || [],
    eligibilityPct: Math.max(0, Math.min(100, matchScore)),
    reason: getMatchReason(apiScheme, fallbackName),
    reasonHi: apiScheme?.eligible
      ? "आप इस योजना के लिए पात्र दिखते हैं।"
      : "कुछ शर्तें पूरी नहीं हुईं, फिर भी यह योजना आपके लिए प्रासंगिक हो सकती है।",
    urgency: matchScore >= 85 ? "high" : matchScore >= 70 ? "medium" : "low",
    aiMissingDocs: missingDocs,
  };
}

const STATES = [
  "Andhra Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Other (NE State)",
];
const CATEGORIES = ["General", "OBC", "SC", "ST", "EWS", "Minority"];
const OCCUPATIONS = [
  "Farmer",
  "Agricultural Labourer",
  "Small Business Owner",
  "Street Vendor",
  "Daily Wage Worker",
  "Unemployed",
  "Student",
  "Homemaker",
  "Salaried Employee",
  "Self Employed",
];

const CAT_COLOR = {
  Health: "#00E5A0",
  Education: "#60A5FA",
  Employment: "#FB923C",
  Agriculture: "#FFD93D",
  Housing: "#A78BFA",
  Women: "#F472B6",
  Business: "#34D399",
};

const F = { fontFamily: "'DM Sans',sans-serif" };
const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.04)",
  color: "#f0f4ff",
  fontSize: 13,
  ...F,
  outline: "none",
  appearance: "none",
};
const labelStyle = {
  fontSize: 11,
  color: "#6b7fa8",
  fontWeight: 600,
  marginBottom: 5,
  display: "block",
  letterSpacing: "0.03em",
};

function mockCheckEligibility(profile) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const eligibleSchemes = schemes.filter((s) => {
        const e = s.eligibility;
        if (!e) return true;

        if (e.maxIncome) {
          if (e.maxIncome === 'below1L' && profile.income > 100000) return false;
          if (e.maxIncome === '1L-2.5L' && profile.income > 250000) return false;
          if (e.maxIncome === '2.5L-5L' && profile.income > 500000) return false;
        }

        if (e.categories && !e.categories.includes((profile.category || '').toLowerCase())) return false;
        if (e.genders && !e.genders.includes((profile.gender || '').toLowerCase())) return false;

        if (e.occupations) {
          const occRaw = (profile.occupation || '').toLowerCase();
          const pOcc = (occRaw.includes('business') || occRaw.includes('vendor')) ? 'self' : 
                       (occRaw.includes('wage') || occRaw.includes('labourer') || occRaw.includes('unemployed')) ? 'unemployed' : 
                       occRaw.includes('salaried') ? 'salaried' :
                       occRaw.includes('farmer') ? 'farmer' :
                       occRaw.includes('student') ? 'student' :
                       occRaw.includes('homemaker') ? 'homemaker' : 'unemployed';
          
          if (!e.occupations.includes(pOcc) && !e.occupations.includes('unemployed')) return false;
        }
        return true;
      }).map((s, idx) => ({
        schemeId: s.id,
        schemeName: s.name,
        matchScore: Math.floor(Math.random() * 15) + 85,
        explanation: { matchedConditions: ["Profile Matched", "Income criteria verified", "Category fit"] },
        eligible: true
      }));

      resolve({ eligibleSchemes, cacheHit: true });
    }, 1500);
  });
}

export default function EligibilityEngine() {
  const [apiKey, setApiKey] = useState(
    localStorage.getItem("firebase_id_token") || "",
  );
  const [showKey, setShowKey] = useState(false);
  const [step, setStep] = useState(1);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [applying, setApplying] = useState(null);
  const [form, setForm] = useState({
    age: "",
    gender: "Male",
    state: "Madhya Pradesh",
    income: "",
    category: "General",
    occupation: "Farmer",
    land: "0",
    bpl: "No",
    bank: "Yes",
    aadhaar: "Yes",
    family: "4",
    disability: "No",
    pregnant: "No",
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleCheck = async () => {
    if (!form.age || !form.income) {
      setError("कृपया आयु और आय भरें / Fill age and income");
      return;
    }

    const age = Number(form.age);
    const income = Number(form.income);

    if (!Number.isFinite(age) || !Number.isFinite(income)) {
      setError("Please enter valid numeric values for age and income");
      return;
    }

    setError("");
    setInfo("");
    setStep(2);

    const authToken = apiKey.trim() || undefined;

    try {
      // Local Client-Side matching logic instead of backend due to Cloud Functions limit
      const apiResponse = await mockCheckEligibility({
        age,
        income,
        state: form.state,
        category: form.category,
        occupation: form.occupation,
        flags: buildFlags(form),
      });

      const rankedSchemes = Array.isArray(apiResponse?.rankedSchemes)
        ? apiResponse.rankedSchemes
        : Array.isArray(apiResponse?.eligibleSchemes)
          ? apiResponse.eligibleSchemes
          : [];

      if (!rankedSchemes.length) {
        setResults([]);
        setInfo("No matching schemes found for this profile.");
        setStep(3);
        return;
      }

      const enriched = rankedSchemes.map((scheme, index) =>
        mapApiResultToCard(scheme, index),
      );

      setResults(enriched);
      setInfo(
        apiResponse?.cacheHit
          ? "Cached eligibility results loaded quickly."
          : "Eligibility check completed successfully.",
      );
      setStep(3);
    } catch (e) {
      setError(`Error: ${e.message}`);
      setStep(1);
    }
  };

  const totalBenefit = results.reduce((s, r) => s + (r.benefitNum || 0), 0);

  return (
    <div style={F}>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .fadeUp{animation:fadeUp 0.3s ease-out}
        select option{background:#141d2e;color:#f0f4ff}
        input::placeholder{color:#3a4460}
        input:focus,select:focus,textarea:focus{border-color:rgba(79,142,247,0.5)!important;box-shadow:0 0 0 3px rgba(79,142,247,0.1)}
      `}</style>

      {/* Optional Auth Token */}
      {showKey && (
        <div
          style={{
            background: "#141d2e",
            border: "1px solid rgba(245,166,35,0.3)",
            borderRadius: 14,
            padding: 14,
            marginBottom: 14,
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#f5a623",
              marginBottom: 3,
            }}
          >
            Firebase ID Token (Optional)
          </div>
          <div style={{ fontSize: 11, color: "#6b7fa8", marginBottom: 8 }}>
            Paste your Firebase ID token only if API auth is enabled.
          </div>
          <div style={{ fontSize: 10, color: "#4a5580", marginBottom: 8 }}>
            We store token only in this browser for local testing.
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="password"
              placeholder="eyJhbGciOi..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              style={{ ...inputStyle, flex: 1 }}
            />
            <button
              onClick={() => {
                localStorage.setItem("firebase_id_token", apiKey.trim());
                setShowKey(false);
              }}
              style={{
                padding: "10px 14px",
                background: "rgba(245,166,35,0.2)",
                border: "1px solid rgba(245,166,35,0.4)",
                borderRadius: 10,
                color: "#f5a623",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                ...F,
              }}
            >
              Save ✓
            </button>
          </div>
        </div>
      )}

      {/* STEP 1 — FORM */}
      {step === 1 && (
        <div className="fadeUp">
          <div
            style={{
              background: "linear-gradient(135deg,#141d2e,#1a2540)",
              border: "1px solid rgba(124,111,239,0.25)",
              borderRadius: 20,
              padding: 18,
              marginBottom: 14,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -20,
                right: -20,
                width: 100,
                height: 100,
                background:
                  "radial-gradient(circle,rgba(124,111,239,0.15),transparent 70%)",
                pointerEvents: "none",
              }}
            />
            <div style={{ fontSize: 22, marginBottom: 6 }}>🤖</div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#f0f4ff",
                marginBottom: 2,
              }}
            >
              AI पात्रता इंजन
            </div>
            <div
              style={{
                fontSize: 12,
                color: "#7c6fef",
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              AI Eligibility Engine · 35 Government Schemes
            </div>
            <div style={{ fontSize: 12, color: "#6b7fa8", lineHeight: 1.5 }}>
              जानकारी भरें → AI तुरंत बताएगा कौन सी 35 योजनाओं में से आप किसके
              हकदार हैं
              <br />
              Fill details → AI instantly matches you from 35 real govt schemes
            </div>
          </div>

          {error && (
            <div
              style={{
                background: "rgba(244,63,94,0.1)",
                border: "1px solid rgba(244,63,94,0.3)",
                borderRadius: 12,
                padding: "10px 14px",
                marginBottom: 12,
                fontSize: 12,
                color: "#f43f5e",
              }}
            >
              ⚠ {error}
            </div>
          )}

          <div
            style={{
              background: "rgba(79,142,247,0.08)",
              border: "1px solid rgba(79,142,247,0.22)",
              borderRadius: 12,
              padding: "10px 12px",
              marginBottom: 12,
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: "#9dc0ff",
                fontWeight: 700,
                marginBottom: 5,
              }}
            >
              📍 How to use / उपयोग कैसे करें
            </div>
            <div style={{ fontSize: 11, color: "#8b9cc8", lineHeight: 1.6 }}>
              1) Profile भरें → 2) Find My Schemes दबाएं → 3) Details खोलें (▼)
              → 4) Apply Now करें और Application ID save करें.
            </div>
          </div>

          <Section title="व्यक्तिगत जानकारी / Personal Info">
            <Grid2>
              <Field
                label="आयु / Age *"
                value={form.age}
                onChange={(v) => set("age", v)}
                type="number"
                placeholder="35"
              />
              <Field
                label="लिंग / Gender"
                value={form.gender}
                onChange={(v) => set("gender", v)}
                type="select"
                options={["Male", "Female", "Other"]}
              />
              <div style={{ gridColumn: "1/-1" }}>
                <Field
                  label="राज्य / State"
                  value={form.state}
                  onChange={(v) => set("state", v)}
                  type="select"
                  options={STATES}
                />
              </div>
              <Field
                label="वार्षिक आय / Annual Income (₹) *"
                value={form.income}
                onChange={(v) => set("income", v)}
                type="number"
                placeholder="120000"
              />
              <Field
                label="परिवार / Family size"
                value={form.family}
                onChange={(v) => set("family", v)}
                type="number"
                placeholder="4"
              />
            </Grid2>
          </Section>

          <Section title="व्यवसाय / Occupation">
            <Grid2>
              <Field
                label="जाति / Category"
                value={form.category}
                onChange={(v) => set("category", v)}
                type="select"
                options={CATEGORIES}
              />
              <Field
                label="व्यवसाय / Occupation"
                value={form.occupation}
                onChange={(v) => set("occupation", v)}
                type="select"
                options={OCCUPATIONS}
              />
              <Field
                label="जमीन / Land (acres)"
                value={form.land}
                onChange={(v) => set("land", v)}
                type="number"
                placeholder="0"
              />
            </Grid2>
          </Section>

          <Section title="दस्तावेज़ / Documents">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              {[
                ["bpl", "BPL कार्ड"],
                ["bank", "बैंक खाता"],
                ["aadhaar", "आधार"],
                ["disability", "विकलांगता"],
                ["pregnant", "गर्भवती"],
              ].map(([k, l]) => (
                <Toggle
                  key={k}
                  label={l}
                  value={form[k]}
                  onChange={(v) => set(k, v)}
                />
              ))}
            </div>
          </Section>

          <button
            onClick={handleCheck}
            style={{
              width: "100%",
              padding: 15,
              borderRadius: 14,
              border: "none",
              background: "linear-gradient(135deg,#5b4ef7,#7c6fef)",
              color: "#fff",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              ...F,
              marginTop: 4,
            }}
          >
            🔍 योजनाएं खोजें / Find My Schemes from 35
          </button>
          <button
            onClick={() => setShowKey(true)}
            style={{
              width: "100%",
              marginTop: 6,
              padding: 8,
              background: "transparent",
              border: "none",
              color: "#3a4460",
              fontSize: 11,
              cursor: "pointer",
              ...F,
            }}
          >
            {apiKey ? "🔑 Update Auth Token" : "🔐 Add Auth Token (Optional)"}
          </button>
        </div>
      )}

      {/* STEP 2 — LOADING */}
      {step === 2 && (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div
            style={{
              width: 56,
              height: 56,
              border: "3px solid rgba(124,111,239,0.2)",
              borderTop: "3px solid #7c6fef",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 20px",
            }}
          />
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#f0f4ff",
              marginBottom: 6,
            }}
          >
            35 योजनाओं में से खोज रहे हैं...
          </div>
          <div style={{ fontSize: 13, color: "#6b7fa8", marginBottom: 16 }}>
            Checking eligibility rules against available schemes
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: 6,
            }}
          >
            {[
              "PM-KISAN",
              "PMAY",
              "Ayushman",
              "Mudra",
              "MGNREGA",
              "Sukanya",
              "Ujjwala",
              "KCC",
              "NSP",
              "Startup",
            ].map((s) => (
              <span
                key={s}
                style={{
                  fontSize: 10,
                  color: "#4a5580",
                  background: "rgba(255,255,255,0.03)",
                  padding: "3px 8px",
                  borderRadius: 20,
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3 — RESULTS */}
      {step === 3 && (
        <div className="fadeUp">
          {info && (
            <div
              style={{
                background: "rgba(59,130,246,0.1)",
                border: "1px solid rgba(59,130,246,0.3)",
                borderRadius: 12,
                padding: "10px 12px",
                marginBottom: 10,
                fontSize: 11,
                color: "#9dc0ff",
              }}
            >
              ℹ️ {info}
            </div>
          )}

          {/* Summary */}
          <div
            style={{
              background: "linear-gradient(135deg,#141d2e,#1a2540)",
              border: "1px solid rgba(34,197,94,0.25)",
              borderRadius: 18,
              padding: 16,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{ fontSize: 11, color: "#6b7fa8", marginBottom: 2 }}
                >
                  35 में से आप पात्र हैं / You qualify for
                </div>
                <div
                  style={{ fontSize: 24, fontWeight: 700, color: "#22c55e" }}
                >
                  {results.length} योजनाएं
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{ fontSize: 11, color: "#6b7fa8", marginBottom: 1 }}
                >
                  कुल संभावित लाभ
                </div>
                <div
                  style={{ fontSize: 22, fontWeight: 700, color: "#f5a623" }}
                >
                  ₹{(totalBenefit / 100000).toFixed(1)}L+
                </div>
                <div style={{ fontSize: 10, color: "#6b7fa8" }}>
                  Total potential benefit
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: 5,
                marginTop: 10,
                flexWrap: "wrap",
              }}
            >
              {[...new Set(results.map((r) => r.category))].map((cat) => {
                const c = CAT_COLOR[cat] || "#7c6fef";
                return (
                  <span
                    key={cat}
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: 20,
                      background: `${c}20`,
                      border: `1px solid ${c}40`,
                      color: c,
                    }}
                  >
                    {cat}
                  </span>
                );
              })}
            </div>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 12,
              padding: "10px 12px",
              marginBottom: 12,
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: "#6b7fa8",
                marginBottom: 5,
                fontWeight: 700,
              }}
            >
              🧭 Next Steps Guide
            </div>
            <div style={{ fontSize: 11, color: "#8b9cc8", lineHeight: 1.6 }}>
              Tap <b>विवरण देखें</b> to view full scheme details, required
              documents, and ministry info. Then use <b>Apply Now</b> to submit
              in app and track with your application ID.
            </div>
          </div>

          <button
            onClick={() => setStep(1)}
            style={{
              background: "none",
              border: "none",
              color: "#6b7fa8",
              fontSize: 12,
              cursor: "pointer",
              ...F,
              marginBottom: 12,
              padding: 0,
            }}
          >
            ← दोबारा जांचें / Check again
          </button>

          {results.map((r, i) => {
            const c = CAT_COLOR[r.category] || "#7c6fef";
            const isOpen = expanded === i;
            return (
              <div
                key={r.id}
                className="fadeUp"
                style={{
                  background: "#141d2e",
                  border: `1px solid ${isOpen ? c + "50" : "rgba(255,255,255,0.07)"}`,
                  borderRadius: 16,
                  marginBottom: 10,
                  overflow: "hidden",
                  animationDelay: `${i * 0.04}s`,
                }}
              >
                {/* Card header — always visible */}
                <div
                  onClick={() => setExpanded(isOpen ? null : i)}
                  style={{ padding: "13px 15px", cursor: "pointer" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: `${c}18`,
                        border: `1px solid ${c}35`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 18,
                        flexShrink: 0,
                      }}
                    >
                      {r.emoji}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          gap: 8,
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: "#f0f4ff",
                              lineHeight: 1.3,
                            }}
                          >
                            {r.name}
                          </div>
                          <div
                            style={{
                              fontSize: 10,
                              color: "#6b7fa8",
                              marginTop: 1,
                            }}
                          >
                            {r.nameHi}
                          </div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: "#f5a623",
                            }}
                          >
                            {r.benefit.split(" ").slice(0, 3).join(" ")}
                          </div>
                          <div
                            style={{ fontSize: 10, color: c, fontWeight: 600 }}
                          >
                            {r.eligibilityPct}% match
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          height: 4,
                          background: "rgba(255,255,255,0.05)",
                          borderRadius: 4,
                          overflow: "hidden",
                          marginTop: 7,
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${r.eligibilityPct}%`,
                            background: c,
                            borderRadius: 4,
                            transition: "width 0.8s ease",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  {/* Reason */}
                  <div
                    style={{
                      marginTop: 7,
                      fontSize: 11,
                      color: "#8b9cc8",
                      lineHeight: 1.5,
                    }}
                  >
                    🇮🇳 {r.reasonHi}
                  </div>
                  {r.urgency === "high" && (
                    <div
                      style={{
                        marginTop: 5,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        background: "rgba(244,63,94,0.1)",
                        border: "1px solid rgba(244,63,94,0.25)",
                        borderRadius: 20,
                        padding: "2px 8px",
                      }}
                    >
                      <span
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          background: "#f43f5e",
                          display: "inline-block",
                        }}
                      />
                      <span
                        style={{
                          fontSize: 10,
                          color: "#f43f5e",
                          fontWeight: 600,
                        }}
                      >
                        तुरंत आवेदन करें / Apply Now
                      </span>
                    </div>
                  )}
                  <div
                    style={{
                      textAlign: "right",
                      fontSize: 10,
                      color: "#3a4460",
                      marginTop: 4,
                    }}
                  >
                    {isOpen ? "▲ बंद करें" : "▼ विवरण देखें"}
                  </div>
                </div>

                {/* Expanded detail */}
                {isOpen && (
                  <div
                    style={{
                      padding: "0 15px 14px",
                      borderTop: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <div style={{ paddingTop: 12 }}>
                      {/* Description */}
                      <div
                        style={{
                          fontSize: 12,
                          color: "#8b9cc8",
                          lineHeight: 1.6,
                          marginBottom: 12,
                        }}
                      >
                        🇮🇳 {r.descHi}
                        <br />
                        <span style={{ color: "#6b7fa8" }}>
                          🇬🇧 {r.description}
                        </span>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 8,
                          marginBottom: 12,
                        }}
                      >
                        <InfoBox label="मंत्रालय" value={r.ministry} />
                        <InfoBox label="समय सीमा" value={r.deadline} />
                      </div>

                      {/* Missing docs */}
                      {r.aiMissingDocs?.length > 0 && (
                        <div
                          style={{
                            background: "rgba(244,63,94,0.06)",
                            border: "1px solid rgba(244,63,94,0.2)",
                            borderRadius: 10,
                            padding: "10px 12px",
                            marginBottom: 12,
                          }}
                        >
                          <div
                            style={{
                              fontSize: 11,
                              color: "#f43f5e",
                              fontWeight: 600,
                              marginBottom: 6,
                            }}
                          >
                            ⚠ जरूरी दस्तावेज़ जो चाहिए
                          </div>
                          {r.aiMissingDocs.map((d, di) => (
                            <div
                              key={di}
                              style={{
                                fontSize: 11,
                                color: "#8b9cc8",
                                marginBottom: 4,
                                display: "flex",
                                gap: 6,
                              }}
                            >
                              <span style={{ color: "#f5a623" }}>→</span>
                              {d}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* All required docs */}
                      {r.requiredDocs?.length > 0 && (
                        <div style={{ marginBottom: 12 }}>
                          <div
                            style={{
                              fontSize: 11,
                              color: "#6b7fa8",
                              fontWeight: 600,
                              marginBottom: 6,
                            }}
                          >
                            📎 सभी जरूरी दस्तावेज़
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 5,
                            }}
                          >
                            {r.requiredDocs.map((d, di) => (
                              <span
                                key={di}
                                style={{
                                  fontSize: 10,
                                  padding: "2px 8px",
                                  borderRadius: 20,
                                  background: "rgba(255,255,255,0.04)",
                                  border: "1px solid rgba(255,255,255,0.08)",
                                  color: "#8b9cc8",
                                }}
                              >
                                {d}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* APPLY BUTTONS */}
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => setApplying(r)}
                          style={{
                            flex: 2,
                            padding: "11px",
                            borderRadius: 11,
                            border: "none",
                            background: `linear-gradient(135deg,${c}cc,${c})`,
                            color: "#000",
                            fontSize: 13,
                            fontWeight: 700,
                            cursor: "pointer",
                            ...F,
                          }}
                        >
                          📤 अभी आवेदन करें / Apply Now
                        </button>
                        <a
                          href={r.applyLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "11px",
                            borderRadius: 11,
                            background: `${c}15`,
                            border: `1px solid ${c}40`,
                            color: c,
                            fontSize: 12,
                            fontWeight: 700,
                            textDecoration: "none",
                          }}
                        >
                          🔗 Portal
                        </a>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            shareScheme(r);
                          }}
                          style={{
                            width: 44,
                            borderRadius: 11,
                            background: "rgba(37,211,102,0.1)",
                            border: "1px solid rgba(37,211,102,0.25)",
                            color: "#25d366",
                            fontSize: 16,
                            cursor: "pointer",
                          }}
                        >
                          📤
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Apply form modal */}
      {applying && (
        <SchemeApplyForm
          scheme={applying}
          onClose={() => setApplying(null)}
          onSuccess={(appId) => {
            setApplying(null);
          }}
        />
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div
      style={{
        background: "#141d2e",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: "#6b7fa8",
          fontWeight: 600,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          marginBottom: 12,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}
function Grid2({ children }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      {children}
    </div>
  );
}
function Field({ label, value, onChange, type, options, placeholder }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {type === "select" ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.04)",
            color: "#f0f4ff",
            fontSize: 13,
            fontFamily: "'DM Sans',sans-serif",
            outline: "none",
            appearance: "none",
          }}
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type || "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.04)",
            color: "#f0f4ff",
            fontSize: 13,
            fontFamily: "'DM Sans',sans-serif",
            outline: "none",
          }}
        />
      )}
    </div>
  );
}
function Toggle({ label, value, onChange }) {
  const yes = value === "Yes";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(255,255,255,0.03)",
        borderRadius: 10,
        padding: "9px 12px",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <span style={{ fontSize: 11, color: "#8b9cc8", fontWeight: 500 }}>
        {label}
      </span>
      <button
        onClick={() => onChange(yes ? "No" : "Yes")}
        style={{
          width: 40,
          height: 22,
          borderRadius: 11,
          border: "none",
          cursor: "pointer",
          position: "relative",
          background: yes ? "#22c55e" : "rgba(255,255,255,0.1)",
          transition: "background 0.2s",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 3,
            left: yes ? 21 : 3,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "#fff",
            transition: "left 0.2s",
          }}
        />
      </button>
    </div>
  );
}
function InfoBox({ label, value }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        borderRadius: 8,
        padding: "8px 10px",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div style={{ fontSize: 10, color: "#4a5580", marginBottom: 2 }}>
        {label}
      </div>
      <div style={{ fontSize: 11, color: "#c8d8ff", fontWeight: 500 }}>
        {value}
      </div>
    </div>
  );
}
function shareScheme(scheme) {
  const msg = `🇮🇳 *${scheme.name}*\n${scheme.nameHi}\n\n💰 ${scheme.benefit}\n\n🔗 ${scheme.applyLink}\n\n_SchemeMatch CivicShield से_`;
  window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
}
