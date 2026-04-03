// src/App.jsx
import React, { useState } from "react";
import LandingPage from "./components/Landingpage";

export default function App() {
  const [view, setView] = useState("landing");

  return view === "landing" ? (
    <LandingPage onLaunchApp={() => setView("dashboard")} />
  ) : (
    <div style={{ background: "#05080f", height: "100vh", color: "#fff", padding: "40px" }}>
      <h1>Dashboard Ready. Next: Sidebar and Store.</h1>
      <button onClick={() => setView("landing")}>Back to Landing</button>
    </div>
  );
}