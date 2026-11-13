import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar({ isOpen, onClose, onVoiceClick, onVoiceQueryClick }) {
  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpen && (
        <div
          className="as-sidebar-mobile-overlay"
          onClick={onClose}
          aria-label="Close sidebar"
        />
      )}

      <aside className={`as-sidebar ${!isOpen ? "collapsed" : ""} ${isOpen ? "mobile-open" : ""}`}>
        <div>
          {/* Top Brand (Matching Picture 2) */}
          <Link to="/app" className="as-sidebar-brand" onClick={onClose}>
            <div className="as-sidebar-logo-icon">
              {/* Black circle with two horizontal gold bars */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect x="5" y="7" width="14" height="3" rx="1.5" fill="#f59e0b" />
                <rect x="5" y="14" width="14" height="3" rx="1.5" fill="#f59e0b" />
              </svg>
            </div>
            <span className="as-sidebar-brand-name">Aura Split</span>
          </Link>

          {/* Navigation Menu (Matching Picture 2) */}
          <ul className="as-sidebar-menu">
            {/* 1. Voice Query (Matching other sidebar buttons) */}
            <li className="as-sidebar-item">
              <button
                type="button"
                className="as-sidebar-link"
                onClick={() => {
                  if (onClose) onClose();
                  if (onVoiceQueryClick) onVoiceQueryClick();
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

            {/* 2. Recent Bills */}
            <li className="as-sidebar-item">
              <button
                to="/app"
                className="as-sidebar-link"
                onClick={onClose}
              >
                <div className="as-sidebar-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

            {/* 3. Circles */}
            <li className="as-sidebar-item">
              <button
                to="/app"
                className="as-sidebar-link"
                onClick={onClose}
              >
                <div className="as-sidebar-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <span>Circles</span>
              </button>
            </li>

            {/* 4. Settle Up */}
            <li className="as-sidebar-item">
              <button
                to="/app"
                className="as-sidebar-link"
                onClick={onClose}
              >
                <div className="as-sidebar-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

        {/* Bottom Floating Widget (Matching Picture 2) */}
        <div className="as-sidebar-bottom">
          <button
            className="as-voice-assist-card"
            onClick={onVoiceClick}
            title="Start voice dictation"
          >
            <div className="as-va-icon-round">
              {/* Sound frequency waves icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M4 10v4M8 6v12M12 3v18M16 8v8M20 10v4" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <div className="as-va-text">
              <span className="as-va-title">Voice Assist</span>
              <span className="as-va-sub">Ready for audio input</span>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}

