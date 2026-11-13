import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import VoiceSheet from "../components/VoiceSheet";
import "./SettingsMobile.css";

export default function SettingsMobile() {
  const nav = useNavigate();
  const [name, setName] = useState(localStorage.getItem("name") || "Rahul Sharma");
  const [email] = useState("rahul.sharma@example.com");
  const [language, setLanguage] = useState("Hinglish (Hindi + English)");
  const [speechReadback, setSpeechReadback] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [isMobOptionsOpen, setIsMobOptionsOpen] = useState(false);
  const [voiceSheetOpen, setVoiceSheetOpen] = useState(false);
  const [voiceSheetMode, setVoiceSheetMode] = useState("add");

  const handlePlaySample = () => {
    setIsPlaying(true);
    api.speak("Rahul, 1,420 split evenly among 4 Goa friends.");
    setTimeout(() => setIsPlaying(false), 3000);
  };

  const handleSave = () => {
    localStorage.setItem("name", name);
    showToast("Preferences saved!");
  };

  const handleDiscard = () => {
    setName(localStorage.getItem("name") || "Rahul Sharma");
    setLanguage("Hinglish (Hindi + English)");
    setSpeechReadback(true);
    showToast("Reverted");
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2400);
  };

  return (
    <div className="as-set-mob-layout">
      {/* 1. Mobile Topbar */}
      <div className="as-set-mob-topbar">
        <div className="as-set-mob-topbar-left">
          <Link to="/app" className="as-set-mob-back-btn" title="Back to Dashboard">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </Link>
          <span className="as-set-mob-header-title">Settings</span>
        </div>

        <div className="as-user-avatar-btn" style={{ width: 34, height: 34 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
      </div>

      {/* 2. Mobile Content */}
      <div className="as-set-mob-content">
        {/* Header Block */}
        <div className="as-set-mob-header-block">
          <div className="as-set-mob-overline">
            <span className="as-set-mob-dot" />
            <span>Account & Experience</span>
          </div>
          <h1 className="as-set-mob-title">Settings</h1>
          <p className="as-set-mob-sub">
            Manage your profile details, voice prompts, and sync settings.
          </p>
        </div>

        {/* Card 1: Profile */}
        <div className="as-set-mob-card">
          <div className="as-set-mob-card-head">
            <div className="as-set-mob-card-title-group">
              <div className="as-set-icon-box purple">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <span className="as-set-mob-card-heading">Profile</span>
            </div>
            <span className="as-set-mob-meta">@rahulsharma</span>
          </div>

          <div className="as-set-mob-profile-banner">
            <div className="as-set-mob-avatar-wrap">
              <span>RS</span>
              <div className="as-set-mob-avatar-edit">
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </div>
            </div>
            <div>
              <div className="as-set-mob-banner-name">{name}</div>
              <div className="as-set-mob-banner-sub">Default payer for 4 recent shared settlements</div>
            </div>
          </div>

          <div className="as-set-mob-field">
            <label className="as-set-mob-label">Full Name</label>
            <div className="as-set-mob-input-box">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
              />
              <span style={{ color: "#16a34a", fontSize: 13, fontWeight: 700 }}>✓</span>
            </div>
          </div>

          <div className="as-set-mob-field">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label className="as-set-mob-label">Email Address</label>
              <span style={{ fontSize: 11, color: "#64748b" }}>🔒 Locked</span>
            </div>
            <div className="as-set-mob-input-box disabled">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <input
                type="email"
                value={email}
                disabled
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Card 2: Voice & Speech */}
        <div className="as-set-mob-card">
          <div className="as-set-mob-card-head">
            <div className="as-set-mob-card-title-group">
              <div className="as-set-icon-box amber">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="23"/>
                  <line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
              </div>
              <span className="as-set-mob-card-heading">Voice & Speech</span>
            </div>
            <span className="as-set-mob-meta amber">Active AI</span>
          </div>

          <div className="as-set-mob-field">
            <label className="as-set-mob-label">Voice readout language</label>
            <select
              className="as-set-select-box"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="Hinglish (Hindi + English)">Hinglish (Hindi + English)</option>
              <option value="Hindi (हिंदी)">Hindi (हिंदी)</option>
              <option value="English (India)">English (India)</option>
              <option value="Hinglish (Casual)">Hinglish (Casual)</option>
            </select>
            <p className="as-set-hint-text">
              Expense commands and bill confirmations will respond in this accent.
            </p>
          </div>

          {/* Toggle */}
          <div className="as-set-mob-toggle-box">
            <div>
              <div className="as-set-mob-toggle-title">Neural speech readback</div>
              <div className="as-set-mob-toggle-sub">
                Voice prompt affirms calculated split after submitting.
              </div>
            </div>
            <label className="as-set-switch">
              <input
                type="checkbox"
                checked={speechReadback}
                onChange={(e) => setSpeechReadback(e.target.checked)}
              />
              <span className="as-set-slider" />
            </label>
          </div>

          {/* Quote preview */}
          <div className="as-set-mob-quote-preview">
            <span className="as-set-mob-quote-text">
              “Rahul, ₹1,420 split evenly among 4 Goa friends.”
            </span>
            <button
              type="button"
              className="as-set-mob-quote-btn"
              onClick={handlePlaySample}
            >
              {isPlaying ? "Playing..." : "Play sample"}
            </button>
          </div>
        </div>

        {/* Card 3: Preferences & Save Actions (Log out removed from mobile view in Setting) */}
        <div className="as-set-mob-card">
          <div className="as-set-mob-card-head">
            <div className="as-set-mob-card-title-group">
              <div className="as-set-icon-box rose">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="8.5" cy="7" r="4"/>
                </svg>
              </div>
              <span className="as-set-mob-card-heading">Preferences</span>
            </div>
            <span className="as-set-mob-meta">Active</span>
          </div>

          <div className="as-set-mob-actions-row">
            <button
              type="button"
              className="as-set-mob-btn-discard"
              onClick={handleDiscard}
            >
              Discard
            </button>
            <button
              type="button"
              className="as-set-mob-btn-save"
              onClick={handleSave}
            >
              Save Preferences
            </button>
          </div>
        </div>

        {/* Tips */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div className="as-set-mob-tip-card">
            <div className="as-set-tip-icon blue">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              </svg>
            </div>
            <div>
              <div className="as-set-tip-title">Voice Split Shortcut</div>
              <p className="as-set-tip-desc">
                Press spacebar anytime on ledger view to trigger quick audio input.
              </p>
            </div>
          </div>

          <div className="as-set-mob-tip-card">
            <div className="as-set-tip-icon amber">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <circle cx="12" cy="12" r="4"/>
              </svg>
            </div>
            <div>
              <div className="as-set-tip-title">Offline Caching</div>
              <p className="as-set-tip-desc">
                Shacks in Goa with weak signal sync automatically once connection returns.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Mobile Bottom Nav (Exact Consistency with Dashboard: Home, Voice Add, Options) */}
      <nav className="mob-bottom-nav">
        {/* Tab 1: Home */}
        <Link to="/app" className="mob-tab-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/>
            <path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/>
            <circle cx="18" cy="14" r="2"/>
          </svg>
          <span>Home</span>
        </Link>

        {/* Center: Voice Add */}
        <button
          className="mob-tab-voice-center"
          onClick={() => {
            setVoiceSheetMode("add");
            setVoiceSheetOpen(true);
          }}
          title="Voice Add Expense"
        >
          <div className="mob-voice-circle-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
              <line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
          </div>
          <span>Voice Add</span>
        </button>

        {/* Tab 3: Options (Consistent with Dashboard) */}
        <button
          className={`mob-tab-item ${isMobOptionsOpen ? "active" : ""}`}
          onClick={() => setIsMobOptionsOpen(true)}
          title="Open Options"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="21" x2="4" y2="14"/>
            <line x1="4" y1="10" x2="4" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12" y2="3"/>
            <line x1="20" y1="21" x2="20" y2="16"/>
            <line x1="20" y1="12" x2="20" y2="3"/>
            <line x1="1" y1="14" x2="7" y2="14"/>
            <line x1="9" y1="8" x2="15" y2="8"/>
            <line x1="17" y1="16" x2="23" y2="16"/>
          </svg>
          <span>Options</span>
        </button>
      </nav>

      {/* Mobile Options Sheet */}
      {isMobOptionsOpen && (
        <div
          className="mob-Options-sheet-overlay"
          onClick={() => setIsMobOptionsOpen(false)}
        >
          <div
            className="mob-Options-sheet"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mob-Options-sheet-bar" />
            <div className="mob-Options-sheet-head">
              <h3 className="mob-Options-title">Navigation & Controls</h3>
              <button
                className="mob-Options-close-btn"
                onClick={() => setIsMobOptionsOpen(false)}
              >
                ✕
              </button>
            </div>

            <ul className="as-sidebar-menu" style={{ marginBottom: 16 }}>
              <li className="as-sidebar-item">
                <button
                  className="as-sidebar-link"
                  onClick={() => {
                    setIsMobOptionsOpen(false);
                    setVoiceSheetMode("query");
                    setVoiceSheetOpen(true);
                  }}
                >
                  <div className="as-sidebar-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                      <line x1="12" y1="19" x2="12" y2="23"/>
                      <line x1="8" y1="23" x2="16" y2="23"/>
                    </svg>
                  </div>
                  <span>Voice Query</span>
                </button>
              </li>

              <li className="as-sidebar-item">
                <button
                  className="as-sidebar-link"
                  onClick={() => { setIsMobOptionsOpen(false); nav("/app"); }}
                >
                  <div className="as-sidebar-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10 9 9 9 8 9"/>
                    </svg>
                  </div>
                  <span>Recent Bills</span>
                </button>
              </li>

              <li className="as-sidebar-item">
                <button
                  className="as-sidebar-link"
                  onClick={() => { setIsMobOptionsOpen(false); nav("/app"); }}
                >
                  <div className="as-sidebar-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </div>
                  <span>Circles</span>
                </button>
              </li>

              <li className="as-sidebar-item">
                <button
                  className="as-sidebar-link"
                  onClick={() => { setIsMobOptionsOpen(false); nav("/app"); }}
                >
                  <div className="as-sidebar-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="6" width="20" height="12" rx="2"/>
                      <circle cx="12" cy="12" r="2"/>
                      <path d="M6 12h.01M18 12h.01"/>
                    </svg>
                  </div>
                  <span>Settle Up</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Voice Assistant Sheet */}
      {voiceSheetOpen && (
        <VoiceSheet
          group={{ id: "g0", name: "Personal" }}
          mode={voiceSheetMode}
          onClose={() => setVoiceSheetOpen(false)}
          onSaved={() => setVoiceSheetOpen(false)}
        />
      )}

      {toastMsg && (
        <div className="as-set-toast" style={{ bottom: 80, right: "50%", transform: "translateX(50%)" }}>
          <span>✓</span>
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
