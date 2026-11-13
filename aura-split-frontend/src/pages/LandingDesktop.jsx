import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./LandingDesktop.css";

export function LandingDesktop() {
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

  const spectrumBars = [10, 16, 26, 14, 22, 34, 12, 28, 32, 14, 24, 28, 12, 18, 30, 10];

  return (
    <div className="as-page">
      {/* 1. TOP NAVIGATION (MATCHING PICTURE 1) */}
      <header className="as-nav-wrapper">
        <nav className="as-nav">
          {/* Logo Left */}
          <Link to="/" className="as-brand-col">
            <div className="as-logo-icon-wrap">
              {/* 4 horizontal wave lines in gold */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M4 7C7 5 11 9 14 7C17 5 20 7 20 7" stroke="#f59e0b" strokeWidth="2.4" strokeLinecap="round" />
                <path d="M4 11C7 9 11 13 14 11C17 9 20 11 20 11" stroke="#f59e0b" strokeWidth="2.4" strokeLinecap="round" />
                <path d="M4 15C7 13 11 17 14 15C17 13 20 15 20 15" stroke="#f59e0b" strokeWidth="2.4" strokeLinecap="round" />
                <path d="M4 19C7 17 11 21 14 19C17 17 20 19 20 19" stroke="#f59e0b" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
            </div>
            <div className="as-brand-text">
              <div className="as-brand-title-row">
                <span className="as-brand-name">Aura Split</span>
                <span className="as-ai-badge">🎙 Voice AI</span>
              </div>
              <span className="as-brand-sub">Intelligent Group Pay</span>
            </div>
          </Link>

          {/* Center Pill Nav Links */}
          <div className="as-nav-pill-center">
            <a href="#how-it-works" className="as-nav-link active">How It Works</a>
            <a href="#demo" className="as-nav-link">Live Demo</a>
            <a href="#features" className="as-nav-link">Features</a>
            <a href="#security" className="as-nav-link">Security</a>
            <a href="#pricing" className="as-nav-link">Pricing</a>
          </div>

          {/* Right Action Items */}
          <div className="as-nav-right">
            <div className="as-lang-picker">
              <span>🌐</span>
              <span>EN</span>
              <span style={{ fontSize: 9 }}>⌵</span>
            </div>
            <Link to="/login" className="as-login-link">Log In</Link>
            <Link to="/signup" className="as-start-btn">
              <span>Start Free</span>
              <span>→</span>
            </Link>
            <div className="as-avatar-btn" title="Account">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>
        </nav>
      </header>

      {/* 2. HERO SECTION (MATCHING PICTURE 1) */}
      <section className="as-hero-section">
        <div className="as-hero-tag">
          <span className="as-tag-dot"></span>
          <span>⚡ Next-Gen Voice Expense Engine</span>
          <span className="as-vlive-badge">v3.4 Live</span>
        </div>

        <h1 className="as-hero-title">
          Split bills at the{" "}
          <span className="as-highlight-wrap">
            speed of speech.
            {/* Hand-drawn brush swoop underline */}
            <svg className="as-brush-underline" viewBox="0 0 260 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 10C50 4 170 3 256 9" stroke="#fed7aa" strokeWidth="6" strokeLinecap="round" />
              <path d="M12 11C70 6 180 5 248 10" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </span>
        </h1>

        <p className="as-hero-desc">
          Just say <b>"Rahul paid ₹800 for dinner split between 4"</b>. Aura listens in Hinglish or English, parses shares, and settles up without messy spreadsheets.
        </p>

        <div className="as-hero-actions">
          <Link to="/signup" className="as-btn-split-free">
            <span>Start Splitting Free</span>
            <span>→</span>
          </Link>
          <button className="as-btn-watch-demo" onClick={playDemoAudio}>
            <div className="as-demo-play-circle">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            </div>
            <span>{isPlaying ? "Playing 20s Demo..." : "Watch 20s Live Demo"}</span>
          </button>
        </div>

        {/* Social Proof Row */}
        <div className="as-trust-row">
          <div className="as-avatar-stack">
            <div className="as-stack-img" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces')" }} />
            <div className="as-stack-img" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=faces')" }} />
            <div className="as-stack-img" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=faces')" }} />
            <div className="as-stack-img" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=faces')" }} />
          </div>
          <span className="as-stars">★★★★★</span>
          <span className="as-trust-text">4.9/5 ★ (12,000+ groups split expenses across India & UK)</span>
        </div>
      </section>

      {/* 3. TWO INTERACTIVE SHOWCASE CARDS (MATCHING PICTURE 2, SPREAD RESPONSIVELY) */}
      <section className="as-showcase-container" id="demo">
        <div className="as-showcase-grid">
          {/* LEFT CARD: Live Acoustic Transcriber */}
          <div className="as-card-shell">
            <div className="as-transcriber-head">
              <div className="as-transcriber-head-left">
                <div className="as-mic-icon-circle">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                    <line x1="12" y1="19" x2="12" y2="23"/>
                    <line x1="8" y1="23" x2="16" y2="23"/>
                  </svg>
                </div>
                <div>
                  <div className="as-title-with-badge">
                    <h3 className="as-card-main-title">Live Acoustic Transcriber</h3>
                    <span className="as-whisper-tag">v3.4 Whisper</span>
                  </div>
                  <p className="as-card-subtext">Prisma Hinglish Acoustic Model v4.2</p>
                </div>
              </div>
              <div className="as-confidence-pill">
                <span>✓</span>
                <span>99.1% Model Confidence</span>
              </div>
            </div>

            {/* Dark Frequency Waveform */}
            <div className="as-spectrum-box">
              <div className="as-spectrum-meta">
                <span>VOICE SPECTRUM FREQUENCY DETECTION</span>
                <span>00:03 / 00:04</span>
              </div>
              <div className="as-spectrum-bars">
                {spectrumBars.map((h, i) => (
                  <div
                    key={i}
                    className="as-spec-bar"
                    style={{
                      height: isPlaying ? `${Math.min(36, Math.max(8, h * (0.8 + Math.sin(i * 1.6) * 0.45)))}px` : `${h}px`
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Heard Speech Box */}
            <div className="as-heard-quote-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 10v4M6 6v12M10 3v18M14 8v8M18 5v14M22 10v4" />
              </svg>
              <p className="as-heard-quote-text">
                “Goa Trip: Kabir ne ₹2,400 diesel ke diye, split equally between Kabir, Justin and Drad”
              </p>
            </div>

            {/* Expense Breakdown Subcard */}
            <div className="as-expense-subcard">
              <div className="as-expense-sub-top">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div className="as-receipt-icon">⛽</div>
                  <div>
                    <h4 className="as-exp-name">Goa Diesel Refill</h4>
                    <p className="as-exp-part">Paid by Kabir • 3 participants</p>
                  </div>
                </div>
                <h3 className="as-exp-amount">₹2,400.00</h3>
              </div>

              {/* 3 Shares Breakdown */}
              <div className="as-shares-grid">
                <div className="as-share-chip">
                  <div className="as-chip-name">
                    <span>Kabir</span>
                    <span className="as-chip-status paid">Paid</span>
                  </div>
                  <div className="as-chip-net pos">Net: +₹1,600</div>
                </div>
                <div className="as-share-chip">
                  <div className="as-chip-name">
                    <span>Justin</span>
                    <span className="as-chip-status owes">Owes</span>
                  </div>
                  <div className="as-chip-net neg">Net: -₹800</div>
                </div>
                <div className="as-share-chip">
                  <div className="as-chip-name">
                    <span>Drad</span>
                    <span className="as-chip-status owes">Owes</span>
                  </div>
                  <div className="as-chip-net neg">Net: -₹800</div>
                </div>
              </div>

              {/* Confirm Button */}
              <button
                className="as-btn-confirm-split"
                onClick={() => setConfirmed(!confirmed)}
              >
                <span>⚡</span>
                <span>{confirmed ? "✓ Split Recorded in Ledger" : "Confirm & Auto-Record Split"}</span>
              </button>
              <button className="as-btn-edit-split">
                ✎ Edit Breakdown Split
              </button>
            </div>

            {/* Suggestions at bottom */}
            <div className="as-suggestions-row">
              <span>Try saying:</span>
              <span className="as-sugg-pill">“1200 for snacks split 50-50 with Ronit”</span>
              <span className="as-sugg-pill">“Anand gave 2500 for dinner keep personal”</span>
            </div>
          </div>

          {/* RIGHT CARD: Goa Summer Getaway Group Balance */}
          <div className="as-card-shell">
            <div className="as-group-head">
              <div>
                <p className="as-group-tag">ACTIVE GROUP SETTLEMENT</p>
                <h3 className="as-group-name">Goa Summer Getaway 🏖️</h3>
              </div>
              <span className="as-members-count-pill">3 members</span>
            </div>

            {/* Net Balances */}
            <p className="as-sec-title">NET BALANCES</p>
            <div className="as-members-list">
              {/* Member 1 */}
              <div className="as-member-row">
                <div className="as-member-info">
                  <div className="as-avatar-circ blue">JR</div>
                  <div>
                    <h4 className="as-m-name">Justin Roy</h4>
                    <p className="as-m-status owes">Owes ₹800.00</p>
                  </div>
                </div>
                <button className="as-btn-settle-mini">Settle</button>
              </div>

              {/* Member 2 */}
              <div className="as-member-row">
                <div className="as-member-info">
                  <div className="as-avatar-circ green">DM</div>
                  <div>
                    <h4 className="as-m-name">Drad Mehta</h4>
                    <p className="as-m-status settled">Settled at 0.00</p>
                  </div>
                </div>
                <span style={{ color: "#16a34a", fontSize: 16 }}>✓</span>
              </div>

              {/* Member 3 */}
              <div className="as-member-row">
                <div className="as-member-info">
                  <div className="as-avatar-circ amber">KF</div>
                  <div>
                    <h4 className="as-m-name">Kabir Fernandez</h4>
                    <p className="as-m-status gets">Gets back ₹1,600.00</p>
                  </div>
                </div>
                <span className="as-tag-you">+ You</span>
              </div>
            </div>

            {/* Recent Transactions */}
            <p className="as-sec-title">RECENT TRANSACTIONS (MINIMAL EXPENSES)</p>
            <div className="as-tx-list">
              <div className="as-tx-row">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div className="as-tx-icon-round">🍽️</div>
                  <div>
                    <h4 className="as-tx-name">Fisherman's Wharf</h4>
                    <p className="as-tx-sub">Split 4 ways • 08:32 PM</p>
                  </div>
                </div>
                <span className="as-tx-amount">₹2,800.00</span>
              </div>

              <div className="as-tx-row">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div className="as-tx-icon-round">🍹</div>
                  <div>
                    <h4 className="as-tx-name">Curlies Anjuna Beach</h4>
                    <p className="as-tx-sub">Paid by Kabir • 03:14 PM</p>
                  </div>
                </div>
                <span className="as-tx-amount">₹1,200.00</span>
              </div>
            </div>

            {/* Optimal Settlement Bottom Bar */}
            <div className="as-optimal-bar">
              <div className="as-optimal-left">
                <span>⚡</span>
                <span>Optimal Settlement Computed</span>
              </div>
              <div className="as-optimal-right">
                1 transfer (₹800 Total)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURES SECTION ("Engineered to eliminate awkward bill talk") */}
      <section className="as-features-section" id="features">
        <span className="as-feat-badge">DESIGNED FOR SOCIAL HARMONY</span>
        <h2 className="as-feat-heading">Engineered to eliminate awkward bill talk</h2>
        <p className="as-feat-sub">
          From high-decibel clubs to quiet dinner bistros, Aura is built to understand human conversational intent.
        </p>

        <div className="as-feat-grid">
          {/* Feature 1 */}
          <div className="as-feat-card">
            <div className="as-feat-icon-box peach">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="8.5" cy="7" r="4"/>
                <line x1="20" y1="8" x2="20" y2="14"/>
                <line x1="23" y1="11" x2="17" y2="11"/>
              </svg>
            </div>
            <h3 className="as-feat-card-title">Natural Multilingual Voice</h3>
            <p className="as-feat-card-desc">
              Speak colloquially in English, Hinglish, or mixed dialects. Aura populates merchants, calculates tax, and assigns the whole bill to somebody without rigid syntax.
            </p>
            <div className="as-feat-pill-box">
              <span>“Swiggy paid 780 for momos, cut into halves”</span>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="as-feat-card">
            <div className="as-feat-icon-box purple">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"/>
                <circle cx="6" cy="12" r="3"/>
                <circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
            </div>
            <h3 className="as-feat-card-title">One-Tap Minimum Settle Up</h3>
            <p className="as-feat-card-desc">
              Optimized flow algorithm reduces N-person vacation debts to fewer than 2.1 payments per person. Clean balance lines without anyone needing to calculate complex chains.
            </p>
            <div className="as-feat-pill-box">
              <span>● 26 payments reduced to 3</span>
              <span className="as-feat-pill-link">See Loan Web</span>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="as-feat-card">
            <div className="as-feat-icon-box gray">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="3"/>
                <line x1="12" y1="18" x2="12.01" y2="18"/>
              </svg>
            </div>
            <h3 className="as-feat-card-title">Zero App Lock-In</h3>
            <p className="as-feat-card-desc">
              Friends don’t even need the app downloaded. Aura broadcasts a WhatsApp summary regardless, with direct UPI deep links to Google Pay, PhonePe, and Paytm.
            </p>
            <div className="as-feat-pill-box">
              <span>🔗 Instant Direct UPI Deep Links Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BOTTOM LUXURY DARK BANNER (MATCHING PICTURE 2) */}
      <section className="as-banner-section">
        <div className="as-banner-card">
          <span className="as-banner-badge">ZERO FRICTION • 100% SECURE</span>
          <h2 className="as-banner-h2">
            Ready to voice split?<br />
            Free forever for personal groups.
          </h2>
          <p className="as-banner-sub">
            No credit card required. No app installs mandatory for your friends. Start your next road trip or house party with seamless speech settlement.
          </p>

          <div className="as-banner-ctas">
            <Link to="/signup" className="as-btn-banner-start">
              <span>Get Started Free</span>
              <span>→</span>
            </Link>
            <a href="https://chat.whatsapp.com" target="_blank" rel="noreferrer" className="as-btn-banner-wa">
              <span>💬 Join WhatsApp Beta</span>
            </a>
          </div>

          <div className="as-banner-checks">
            <div className="as-banner-check-item">
              <span>✓</span>
              <span>Sub-second latency Whisper ASR</span>
            </div>
            <div className="as-banner-check-item">
              <span>✓</span>
              <span>End-to-end UPI payment integrations</span>
            </div>
            <div className="as-banner-check-item">
              <span>✓</span>
              <span>Up to 100 members per group</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. COMPREHENSIVE FOOTER (MATCHING PICTURE 2) */}
      <footer className="as-footer-wrapper">
        <div className="as-footer-inner">
          <div className="as-footer-cols">
            {/* Col 1 */}
            <div className="as-footer-col as-footer-col-brand">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div className="as-logo-icon-wrap" style={{ width: 30, height: 30 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M4 8C7 6 11 10 14 8C17 6 20 8 20 8" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
                    <path d="M4 12C7 10 11 14 14 12C17 10 20 12 20 12" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
                    <path d="M4 16C7 14 11 18 14 16C17 14 20 16 20 16" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <span style={{ fontSize: 18, fontWeight: 800 }}>Aura Split</span>
              </div>
              <p>
                Revolutionizing group finances through natural voice interactions, zero-friction smart splits, and automated social harmony.
              </p>
              <div className="as-footer-awards">
                <span className="as-award-pill">★ Best in Class AI 2024</span>
                <span className="as-award-pill">⚡ 100% In-house</span>
              </div>
            </div>

            {/* Col 2 */}
            <div className="as-footer-col">
              <h4>Product</h4>
              <ul>
                <li><a href="#how-it-works">How It Works</a></li>
                <li><a href="#voice">Voice Splitting</a></li>
                <li><a href="#demo">Live Interactive Demo</a></li>
                <li><a href="#pricing">Plans & Pricing</a></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div className="as-footer-col">
              <h4>Trust & Security</h4>
              <ul>
                <li><a href="#security">Security Center</a></li>
                <li><a href="#privacy">Privacy Architecture</a></li>
                <li><a href="#compliance">Compliance & Audits</a></li>
                <li><a href="#banking">Open Banking API</a></li>
              </ul>
            </div>

            {/* Col 4 */}
            <div className="as-footer-col">
              <h4>Legal & Regions</h4>
              <ul>
                <li><a href="#terms">Terms of Service</a></li>
                <li><a href="#privacy">Privacy Policy</a></li>
                <li><a href="#cookies">Cookie Preferences</a></li>
                <li><a href="#bharat">Made for Bharat & Beyond</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="as-footer-bottom-bar">
            <span>© 2026 Aura Split Inc. Dual patented algorithm for multi-directional debt tracking.</span>
            <span>ISO 27001 Certified • RBI / NPCI Compliant • GDPR Compliant</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingDesktop;
