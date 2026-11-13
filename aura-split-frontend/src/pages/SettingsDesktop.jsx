import React, { useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { api } from "../api";
import "./SettingsDesktop.css";

export default function SettingsDesktop() {
  const outletCtx = useOutletContext();
  const onToggleSidebar = outletCtx?.onToggleSidebar;
  const nav = useNavigate();

  const [name, setName] = useState(localStorage.getItem("name") || "Rahul Sharma");
  const [email] = useState("rahul.sharma@example.com");
  const [language, setLanguage] = useState("Hinglish (Hindi + English)");
  const [speechReadback, setSpeechReadback] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const handlePlaySample = () => {
    setIsPlaying(true);
    api.speak("Rahul, 1,420 split evenly among 4 Goa friends.");
    setTimeout(() => setIsPlaying(false), 3000);
  };

  const handleSave = () => {
    localStorage.setItem("name", name);
    showToast("Preferences saved successfully!");
  };

  const handleDiscard = () => {
    setName(localStorage.getItem("name") || "Rahul Sharma");
    setLanguage("Hinglish (Hindi + English)");
    setSpeechReadback(true);
    showToast("Changes reverted");
  };

  const handleLogout = () => {
    localStorage.clear();
    nav("/");
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2600);
  };

  return (
    <div className="as-set-desktop-layout">
      {/* 1. TOP BAR (Matches Dashboard & Group) */}
      <div className="as-dash-topbar">
        <div className="as-dash-title-wrap">
          {onToggleSidebar && (
            <button
              className="as-sidebar-toggle-btn"
              onClick={onToggleSidebar}
              title="Toggle Navigation"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </svg>
            </button>
          )}

          <Link to="/app" className="as-grp-back-circle" title="Back to Dashboard">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </Link>

          <div className="as-grp-header-text">
            <h1 className="as-dash-title">Settings</h1>
            <span className="as-grp-subtitle">Account & Experience</span>
          </div>
        </div>

        {/* User Avatar Menu */}
        <div className="as-user-menu-wrap">
          <button
            className="as-user-avatar-btn"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            title="User Profile"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </button>

          {isUserMenuOpen && (
            <div className="as-user-dropdown">
              <span className="as-dropdown-name">{name}</span>
              <button
                className="as-dropdown-item"
                onClick={() => { setIsUserMenuOpen(false); nav("/app"); }}
              >
                Dashboard
              </button>
              <button
                className="as-dropdown-item"
                onClick={() => { setIsUserMenuOpen(false); nav("/app/settings"); }}
              >
                Setting
              </button>
              <button
                className="as-dropdown-item logout"
                onClick={handleLogout}
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. MAIN SETTINGS CONTENT (Exact match to Image 1) */}
      <div className="as-set-content-container">
        {/* Header Block */}
        <div className="as-set-header-block">
          <div className="as-set-overline">
            <span className="as-set-orange-dot" />
            <span>Account & Experience</span>
          </div>
          <h1 className="as-set-title">Settings</h1>
          <p className="as-set-sub">
            Manage your profile details, voice prompts, and sync settings.
          </p>
        </div>

        {/* Card 1: Profile */}
        <div className="as-set-card">
          <div className="as-set-card-head">
            <div className="as-set-card-title-group">
              <div className="as-set-icon-box purple">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <span className="as-set-card-heading">Profile</span>
            </div>
            <span className="as-set-meta-tag">Public ID: @rahulsharma</span>
          </div>

          {/* Profile Banner */}
          <div className="as-set-profile-banner">
            <div className="as-set-avatar-wrapper">
              <span>RS</span>
              <div className="as-set-avatar-edit-badge" title="Edit avatar">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </div>
            </div>
            <div className="as-set-banner-text">
              <span className="as-set-banner-name">{name}</span>
              <span className="as-set-banner-sub">Default payer for 4 recent shared settlements</span>
            </div>
          </div>

          {/* Form Inputs Grid */}
          <div className="as-set-input-grid">
            <div className="as-set-field-group">
              <label className="as-set-field-label">Full Name</label>
              <div className="as-set-input-box">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                />
                <span className="as-set-check-icon">✓</span>
              </div>
            </div>

            <div className="as-set-field-group">
              <div className="as-set-field-label-row">
                <label className="as-set-field-label">Email Address</label>
                <span className="as-set-field-locked">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  Locked
                </span>
              </div>
              <div className="as-set-input-box disabled">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        </div>

        {/* Card 2: Voice & Speech */}
        <div className="as-set-card">
          <div className="as-set-card-head">
            <div className="as-set-card-title-group">
              <div className="as-set-icon-box amber">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="23"/>
                  <line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
              </div>
              <span className="as-set-card-heading">Voice & Speech</span>
            </div>
            <span className="as-set-meta-tag amber">Active AI Assist</span>
          </div>

          <div className="as-set-field-group">
            <label className="as-set-field-label">Voice readout language</label>
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
              Expense commands and bill confirmations will respond in this preferred language accent.
            </p>
          </div>

          {/* Neural Speech Toggle Box */}
          <div className="as-set-toggle-row">
            <div className="as-set-toggle-left">
              <div className="as-set-toggle-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
                </svg>
              </div>
              <div>
                <div className="as-set-toggle-title">Neural speech readback on confirm</div>
                <div className="as-set-toggle-sub">
                  Audio voice prompt affirms the calculated split after microphone bills are submitted.
                </div>
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

          {/* Quote Audio Preview */}
          <div className="as-set-quote-preview">
            <div className="as-set-quote-left">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 11l19-9-9 19-2-8-8-2z"/>
              </svg>
              <span className="as-set-quote-text">
                “Rahul, ₹1,420 split evenly among 4 Goa friends.”
              </span>
            </div>
            <button
              type="button"
              className="as-set-btn-sample"
              onClick={handlePlaySample}
            >
              {isPlaying ? "Playing..." : "Play sample"}
            </button>
          </div>
        </div>

        {/* Card 3: Account Actions */}
        <div className="as-set-card">
          <div className="as-set-card-head">
            <div className="as-set-card-title-group">
              <div className="as-set-icon-box rose">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="8.5" cy="7" r="4"/>
                  <line x1="18" y1="8" x2="23" y2="13"/>
                  <line x1="23" y1="8" x2="18" y2="13"/>
                </svg>
              </div>
              <span className="as-set-card-heading">Account Actions</span>
            </div>
            <span className="as-set-meta-tag">Session Active</span>
          </div>

          <div className="as-set-session-row">
            <div>
              <div className="as-set-session-title">End Current Session</div>
              <div className="as-set-session-sub">
                You will be logged out on this Mac browser. Your Goa Trip ledger remains safely synchronized.
              </div>
            </div>
            <button
              type="button"
              className="as-set-btn-logout"
              onClick={handleLogout}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              <span>Log out</span>
            </button>
          </div>

          <div className="as-set-actions-bar">
            <button
              type="button"
              className="as-set-btn-discard"
              onClick={handleDiscard}
            >
              Discard changes
            </button>
            <button
              type="button"
              className="as-set-btn-save"
              onClick={handleSave}
            >
              Save Preferences
            </button>
          </div>
        </div>

        {/* Bottom Tips Grid */}
        <div className="as-set-tips-grid">
          <div className="as-set-tip-card">
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

          <div className="as-set-tip-card">
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

      {toastMsg && (
        <div className="as-set-toast">
          <span>✓</span>
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}

