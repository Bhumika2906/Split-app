import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./LandingMobile.css";

export function LandingMobile() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const playDemoAudio = () => {
    setIsPlaying(true);
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance("Rahul paid 800 for dinner split between 4.");
      u.rate = 0.95;
      u.onend = () => setIsPlaying(false);
      u.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(u);
    } else {
      setTimeout(() => setIsPlaying(false), 2200);
    }
  };

  const spectrumBars = [10, 16, 26, 14, 22, 34, 12, 28, 32, 14, 24, 28, 12, 18];

  return (
    <div className="mob-page">
      {/* 1. MOBILE-FIRST TOP NAVBAR WITH SLIDE-DOWN DRAWER */}
      <header className="mob-nav-header">
        <div className="mob-nav-bar">
          {/* Logo Left */}
          <Link to="/" className="mob-nav-brand">
            <div className="mob-nav-logo-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M4 7C7 5 11 9 14 7C17 5 20 7 20 7" stroke="#f59e0b" strokeWidth="2.4" strokeLinecap="round" />
                <path d="M4 11C7 9 11 13 14 11C17 9 20 11 20 11" stroke="#f59e0b" strokeWidth="2.4" strokeLinecap="round" />
                <path d="M4 15C7 13 11 17 14 15C17 13 20 15 20 15" stroke="#f59e0b" strokeWidth="2.4" strokeLinecap="round" />
                <path d="M4 19C7 17 11 21 14 19C17 17 20 19 20 19" stroke="#f59e0b" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
            </div>
            <div className="mob-brand-col">
              <div className="mob-brand-row">
                <span className="mob-brand-name">Aura Split</span>
                <span className="mob-voice-badge">🎙 AI</span>
              </div>
              <span className="mob-brand-sub">Intelligent Group Pay</span>
            </div>
          </Link>

          {/* Right Actions: Quick Start Pill + Hamburger Menu */}
          <div className="mob-nav-right">
            <Link to="/signup" className="mob-quick-start-btn">
              <span>Start Free</span>
              <span>→</span>
            </Link>
            <button
              className="mob-menu-btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {isMenuOpen ? (
                /* Close (X) icon */
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                /* Clean 3-bar hamburger */
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Slide-Down Mobile Drawer Menu */}
        {isMenuOpen && (
          <nav className="mob-drawer">
            <div className="mob-drawer-links">
              <a href="#how-it-works" className="mob-drawer-link" onClick={() => setIsMenuOpen(false)}>
                How It Works
              </a>
              <a href="#demo" className="mob-drawer-link" onClick={() => setIsMenuOpen(false)}>
                Live Interactive Demo
              </a>
              <a href="#features" className="mob-drawer-link" onClick={() => setIsMenuOpen(false)}>
                Features
              </a>
              <a href="#security" className="mob-drawer-link" onClick={() => setIsMenuOpen(false)}>
                Trust & Security
              </a>
              <a href="#pricing" className="mob-drawer-link" onClick={() => setIsMenuOpen(false)}>
                Pricing
              </a>
            </div>

            <div className="mob-drawer-divider" />

            <div className="mob-drawer-actions">
              <Link to="/login" className="mob-drawer-login-btn" onClick={() => setIsMenuOpen(false)}>
                Log In to Account
              </Link>
              <Link to="/signup" className="mob-drawer-start-btn" onClick={() => setIsMenuOpen(false)}>
                Start Splitting Free →
              </Link>
            </div>
          </nav>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <section className="mob-hero">
        <div className="mob-hero-tag">
          <span className="mob-tag-dot" />
          <span>⚡ Voice Expense Engine</span>
          <span className="mob-vlive-badge">v3.4 Live</span>
        </div>

        <h1 className="mob-hero-h1">
          Split bills at the{" "}
          <span className="mob-highlight-wrap">
            speed of speech.
            <svg className="mob-brush-underline" viewBox="0 0 260 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 10C50 4 170 3 256 9" stroke="#fed7aa" strokeWidth="6" strokeLinecap="round" />
              <path d="M12 11C70 6 180 5 248 10" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </span>
        </h1>

        <p className="mob-hero-desc">
          Just say <b>"Rahul paid ₹800 for dinner split between 4"</b>. Aura listens in Hinglish or English, parses shares, and settles up without messy spreadsheets.
        </p>

        <div className="mob-hero-actions">
          <Link to="/signup" className="mob-btn-split-free">
            <span>Start Splitting Free</span>
            <span>→</span>
          </Link>
          <button className="mob-btn-watch-demo" onClick={playDemoAudio}>
            <div className="mob-demo-play-circle">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            </div>
            <span>{isPlaying ? "Playing 20s Demo..." : "Watch 20s Live Demo"}</span>
          </button>
        </div>

        {/* Social Proof Row */}
        <div className="mob-trust-row">
          <div className="mob-avatar-stack">
            <div className="mob-stack-img" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces')" }} />
            <div className="mob-stack-img" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=faces')" }} />
            <div className="mob-stack-img" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=faces')" }} />
          </div>
          <span className="mob-stars">★★★★★</span>
          <span className="mob-trust-text">4.9/5 (12k+ groups in India & UK)</span>
        </div>
      </section>

      {/* 3. TWO STACKED INTERACTIVE SHOWCASE CARDS */}
      <section className="mob-showcase-container" id="demo">
        {/* CARD 1: Live Acoustic Transcriber */}
        <div className="mob-card-shell">
          <div className="mob-transcriber-head">
            <div className="mob-transcriber-head-left">
              <div className="mob-mic-icon-circle">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="23"/>
                  <line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <h3 className="mob-card-main-title">Live Acoustic Transcriber</h3>
                  <span className="mob-whisper-tag">v3.4</span>
                </div>
                <p className="mob-card-subtext">Hinglish Acoustic Model v4.2</p>
              </div>
            </div>
            <div className="mob-confidence-pill">
              <span>99.1% Acc.</span>
            </div>
          </div>

          {/* Dark Waveform Spectrum */}
          <div className="mob-spectrum-box">
            <div className="mob-spectrum-meta">
              <span>VOICE SPECTRUM FREQUENCY</span>
              <span>00:03 / 00:04</span>
            </div>
            <div className="mob-spectrum-bars">
              {spectrumBars.map((h, i) => (
                <div
                  key={i}
                  className="mob-spec-bar"
                  style={{
                    height: isPlaying ? `${Math.min(30, Math.max(6, h * (0.8 + Math.sin(i * 1.6) * 0.45)))}px` : `${h}px`
                  }}
                />
              ))}
            </div>
          </div>

          {/* Heard Quote Box */}
          <div className="mob-heard-quote-box">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M2 10v4M6 6v12M10 3v18M14 8v8M18 5v14M22 10v4" />
            </svg>
            <p className="mob-heard-quote-text">
              “Goa Trip: Kabir ne ₹2,400 diesel ke diye, split equally between Kabir, Justin and Drad”
            </p>
          </div>

          {/* Expense Subcard */}
          <div className="mob-expense-subcard">
            <div className="mob-expense-sub-top">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div className="mob-receipt-icon">⛽</div>
                <div>
                  <h4 className="mob-exp-name">Goa Diesel Refill</h4>
                  <p className="mob-exp-part">Paid by Kabir • 3 people</p>
                </div>
              </div>
              <h3 className="mob-exp-amount">₹2,400</h3>
            </div>

            {/* 3 Share Chips */}
            <div className="mob-shares-grid">
              <div className="mob-share-chip">
                <div className="mob-chip-name">
                  <span>Kabir</span>
                  <span className="mob-chip-status paid">Paid</span>
                </div>
                <div className="mob-chip-net pos">+₹1,600</div>
              </div>
              <div className="mob-share-chip">
                <div className="mob-chip-name">
                  <span>Justin</span>
                  <span className="mob-chip-status owes">Owes</span>
                </div>
                <div className="mob-chip-net neg">-₹800</div>
              </div>
              <div className="mob-share-chip">
                <div className="mob-chip-name">
                  <span>Drad</span>
                  <span className="mob-chip-status owes">Owes</span>
                </div>
                <div className="mob-chip-net neg">-₹800</div>
              </div>
            </div>

            {/* Action Buttons */}
            <button
              className="mob-btn-confirm-split"
              onClick={() => setConfirmed(!confirmed)}
            >
              <span>⚡</span>
              <span>{confirmed ? "✓ Split Recorded" : "Confirm & Auto-Record Split"}</span>
            </button>
            <button className="mob-btn-edit-split">
              ✎ Edit Breakdown Split
            </button>
          </div>

          {/* Suggestion Pills */}
          <div className="mob-suggestions-row">
            <span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8" }}>TRY SAYING:</span>
            <span className="mob-sugg-pill">“1200 for snacks split 50-50 with Ronit”</span>
            <span className="mob-sugg-pill">“Anand gave 2500 for dinner keep personal”</span>
          </div>
        </div>

        {/* CARD 2: Goa Summer Getaway Group Balance */}
        <div className="mob-card-shell">
          <div className="mob-group-head">
            <div>
              <p className="mob-group-tag">ACTIVE GROUP SETTLEMENT</p>
              <h3 className="mob-group-name">Goa Summer Getaway 🏖️</h3>
            </div>
            <span className="mob-members-count-pill">3 members</span>
          </div>

          {/* Net Balances */}
          <p className="mob-sec-title">NET BALANCES</p>
          <div className="mob-members-list">
            {/* Justin */}
            <div className="mob-member-row">
              <div className="mob-member-info">
                <div className="mob-avatar-circ blue">JR</div>
                <div>
                  <h4 className="mob-m-name">Justin Roy</h4>
                  <p className="mob-m-status owes">Owes ₹800.00</p>
                </div>
              </div>
              <button className="mob-btn-settle-mini">Settle</button>
            </div>

            {/* Drad */}
            <div className="mob-member-row">
              <div className="mob-member-info">
                <div className="mob-avatar-circ green">DM</div>
                <div>
                  <h4 className="mob-m-name">Drad Mehta</h4>
                  <p className="mob-m-status settled">Settled at 0.00</p>
                </div>
              </div>
              <span style={{ color: "#16a34a", fontSize: 14 }}>✓</span>
            </div>

            {/* Kabir */}
            <div className="mob-member-row">
              <div className="mob-member-info">
                <div className="mob-avatar-circ amber">KF</div>
                <div>
                  <h4 className="mob-m-name">Kabir Fernandez</h4>
                  <p className="mob-m-status gets">Gets back ₹1,600.00</p>
                </div>
              </div>
              <span className="mob-tag-you">+ You</span>
            </div>
          </div>

          {/* Recent Transactions */}
          <p className="mob-sec-title">RECENT TRANSACTIONS</p>
          <div className="mob-tx-list">
            <div className="mob-tx-row">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div className="mob-tx-icon-round">🍽️</div>
                <div>
                  <h4 className="mob-tx-name">Fisherman's Wharf</h4>
                  <p className="mob-tx-sub">Split 4 ways • 08:32 PM</p>
                </div>
              </div>
              <span className="mob-tx-amount">₹2,800.00</span>
            </div>

            <div className="mob-tx-row">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div className="mob-tx-icon-round">🍹</div>
                <div>
                  <h4 className="mob-tx-name">Curlies Anjuna Beach</h4>
                  <p className="mob-tx-sub">Paid by Kabir • 03:14 PM</p>
                </div>
              </div>
              <span className="mob-tx-amount">₹1,200.00</span>
            </div>
          </div>

          {/* Optimal Settlement Bottom Bar */}
          <div className="mob-optimal-bar">
            <span>⚡ Optimal Settlement</span>
            <span className="mob-optimal-right">1 transfer (₹800 Total)</span>
          </div>
        </div>
      </section>

      {/* 4. FEATURES SECTION */}
      <section className="mob-features-section" id="features">
        <span className="mob-feat-badge">DESIGNED FOR SOCIAL HARMONY</span>
        <h2 className="mob-feat-heading">Engineered to eliminate awkward bill talk</h2>
        <p className="mob-feat-sub">
          From high-decibel clubs to quiet dinner bistros, Aura understands natural conversational speech.
        </p>

        <div className="mob-feat-stack">
          {/* Feature 1 */}
          <div className="mob-feat-card">
            <div className="mob-feat-icon-box peach">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="8.5" cy="7" r="4"/>
                <line x1="20" y1="8" x2="20" y2="14"/>
                <line x1="23" y1="11" x2="17" y2="11"/>
              </svg>
            </div>
            <h3 className="mob-feat-card-title">Natural Multilingual Voice</h3>
            <p className="mob-feat-card-desc">
              Speak colloquially in English, Hinglish, or mixed dialects. Aura populates merchants, calculates tax, and assigns the whole bill without rigid syntax.
            </p>
            <div className="mob-feat-pill-box">
              <span>“Swiggy paid 780 for momos, cut into halves”</span>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="mob-feat-card">
            <div className="mob-feat-icon-box purple">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"/>
                <circle cx="6" cy="12" r="3"/>
                <circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
            </div>
            <h3 className="mob-feat-card-title">One-Tap Minimum Settle Up</h3>
            <p className="mob-feat-card-desc">
              Optimized flow algorithm reduces N-person vacation debts to fewer than 2.1 payments per person. Clean balance lines without complex chains.
            </p>
            <div className="mob-feat-pill-box">
              <span>● 26 payments reduced to 3</span>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="mob-feat-card">
            <div className="mob-feat-icon-box gray">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="3"/>
                <line x1="12" y1="18" x2="12.01" y2="18"/>
              </svg>
            </div>
            <h3 className="mob-feat-card-title">Zero App Lock-In</h3>
            <p className="mob-feat-card-desc">
              Friends don’t even need the app downloaded. Aura broadcasts a WhatsApp summary regardless, with direct UPI deep links to Google Pay, PhonePe, and Paytm.
            </p>
            <div className="mob-feat-pill-box">
              <span>🔗 Instant Direct UPI Deep Links Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BOTTOM DARK BANNER */}
      <section className="mob-banner-section">
        <div className="mob-banner-card">
          <span className="mob-banner-badge">ZERO FRICTION • 100% SECURE</span>
          <h2 className="mob-banner-h2">
            Ready to voice split?<br />
            Free forever for personal groups.
          </h2>
          <p className="mob-banner-sub">
            No credit card required. No app installs mandatory for your friends. Start your next road trip or house party with seamless speech settlement.
          </p>

          <div className="mob-banner-ctas">
            <Link to="/signup" className="mob-btn-banner-start">
              <span>Get Started Free</span>
              <span>→</span>
            </Link>
            <a href="https://chat.whatsapp.com" target="_blank" rel="noreferrer" className="mob-btn-banner-wa">
              <span>💬 Join WhatsApp Beta</span>
            </a>
          </div>

          <div className="mob-banner-checks">
            <div className="mob-banner-check-item">
              <span>✓</span>
              <span>Sub-second latency Whisper ASR</span>
            </div>
            <div className="mob-banner-check-item">
              <span>✓</span>
              <span>End-to-end UPI payment integrations</span>
            </div>
            <div className="mob-banner-check-item">
              <span>✓</span>
              <span>Up to 100 members per group</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. MOBILE FOOTER */}
      <footer className="mob-footer">
        <div className="mob-footer-brand-row">
          <div className="mob-nav-logo-icon" style={{ width: 28, height: 28 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M4 8C7 6 11 10 14 8C17 6 20 8 20 8" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
              <path d="M4 12C7 10 11 14 14 12C17 10 20 12 20 12" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
              <path d="M4 16C7 14 11 18 14 16C17 14 20 16 20 16" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span style={{ fontSize: 16, fontWeight: 800 }}>Aura Split</span>
        </div>
        <p className="mob-footer-desc">
          Natural voice interactions, zero-friction smart splits, and automated social harmony.
        </p>

        <div className="mob-footer-badges">
          <span className="mob-award-pill">★ Best in Class AI</span>
          <span className="mob-award-pill">⚡ 100% In-house</span>
        </div>

        <div className="mob-footer-links-grid">
          <a href="#how-it-works" className="mob-footer-link">How It Works</a>
          <a href="#features" className="mob-footer-link">Features</a>
          <a href="#security" className="mob-footer-link">Security</a>
          <Link to="/login" className="mob-footer-link">Log In</Link>
          <Link to="/signup" className="mob-footer-link">Sign Up</Link>
        </div>

        <p className="mob-footer-legal">
          © 2026 Aura Split Inc. Dual patented algorithm.
        </p>
        <p className="mob-footer-compliance">
          ISO 27001 Certified • RBI / NPCI Compliant
        </p>
      </footer>
    </div>
  );
}

export default LandingMobile;
