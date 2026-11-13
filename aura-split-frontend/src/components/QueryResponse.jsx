import React, { useState, useEffect } from "react";
import { api } from "../api";
import "./QueryResponse.css";

export default function QueryResponse({ p, group, done, redo, close }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showBreakdownMob, setShowBreakdownMob] = useState(true);
  const [busy, setBusy] = useState(false);

  // Default fallback values if p doesn't supply them
  const transcript = p?.transcript || "Rahul ko kitne paise dene hain?";
  const spokenText = p?.spokenText || p?.message || "“Rahul ko tumhe ₹450 dene hain”";
  const cleanSpoken = spokenText.replace(/^[“"]|[”"]$/g, "");
  const amountPaise = p?.amountPaise || 45000;
  const amountNum = Math.round(amountPaise / 100);
  const personName = p?.personName || "Rahul Sharma";
  const groupName = p?.groupName || group?.name || "Goa Trip 🌴";
  const contextDesc = p?.contextDesc || "Dinner at Fisherman's Wharf (₹300) + Taxi to Anjuna (₹150)";

  const items = p?.items && p.items.length > 0 ? p.items : [
    {
      id: "item-1",
      icon: "🍽",
      title: "Fisherman's Wharf Dinner",
      subtitle: "Paid by Rahul • Group total ₹1,200",
      amount: 300,
      shareTag: "your share",
    },
    {
      id: "item-2",
      icon: "🚗",
      title: "Vagator Cab",
      subtitle: "Paid by Rahul • Airport Transfer",
      amount: 150,
      shareTag: "your share",
    },
  ];

  // Auto-play / speak upon mounting
  useEffect(() => {
    setIsPlaying(true);
    api.speak(cleanSpoken);
    const timer = setTimeout(() => {
      setIsPlaying(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [cleanSpoken]);

  const handlePlayVoice = () => {
    setIsPlaying(true);
    api.speak(cleanSpoken);
    setTimeout(() => setIsPlaying(false), 3000);
  };

  const handleSettleNow = async () => {
    setBusy(true);
    try {
      const otherMember = group?.members?.find((m) => {
        const mName = typeof m === "string" ? m : m?.name;
        return mName && personName.toLowerCase().includes(mName.toLowerCase());
      });
      const toId = typeof otherMember === "object" ? otherMember?.id : "m1";
      const fromId = group?.meId || "me";
      if (group?.id) {
        await api.addPayment(group.id, {
          fromId,
          toId: toId || "m1",
          amountPaise,
        });
      }
      if (done) done();
      else if (close) close();
    } catch (err) {
      console.error("Failed to record settlement:", err);
      if (close) close();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="as-query-container">
      {/* ====================================================================
          DESKTOP VIEW (Matches Picture 2)
          ==================================================================== */}
      <div className="as-query-modal-desktop">
        {/* Top Gold Gradient Accent */}
        <div className="as-query-desktop-accent" />

        {/* Desktop Header */}
        <div className="as-query-header-desktop">
          <div className="as-query-title-row">
            <div className="as-query-mic-icon-circle">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </div>
            <h2 className="as-query-heading-desktop">
              Voice Query <span className="as-query-subhead-dot">•</span> <span className="as-query-subhead-text">Balance Check</span>
            </h2>
            <span className="as-query-nlu-pill">HINGLISH NLU</span>
          </div>

          <button
            type="button"
            className="as-query-close-btn"
            onClick={close}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Recognized Utterance Bar */}
        <div className="as-query-recognized-bar">
          <span className="as-query-rec-tag">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            RECOGNIZED:
          </span>
          <span className="as-query-rec-text">
            "{transcript}"
          </span>
        </div>

        {/* Direct Response Card */}
        <div className="as-query-direct-card">
          <div className="as-query-direct-label">DIRECT RESPONSE</div>
          <div className="as-query-direct-statement">
            {cleanSpoken}
          </div>

          <div className="as-query-amount-row">
            <div className="as-query-amount-left">
              <span className="as-query-amount-val">₹{amountNum}</span>
              <span className="as-query-amount-currency">INR remaining</span>
            </div>
            <div className="as-query-owe-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
              You owe {personName.split(" ")[0]}
            </div>
          </div>

          {/* Timbre Hindi-English Neural Readout Audio Bar */}
          <div className="as-query-audio-bar">
            <button
              type="button"
              className="as-query-audio-left"
              onClick={handlePlayVoice}
            >
              <div className="as-query-speaker-icon-btn">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              </div>
              <span>Timbre Hindi-English Neural Readout ({isPlaying ? "0:02" : "0:03"})</span>
            </button>

            <div className="as-query-mini-equalizer">
              <span style={{ height: isPlaying ? "14px" : "10px", background: "#f59e0b" }} />
              <span style={{ height: isPlaying ? "18px" : "16px", background: "#b45309" }} />
              <span style={{ height: isPlaying ? "12px" : "8px", background: "#f59e0b" }} />
              <span style={{ height: isPlaying ? "16px" : "12px", background: "#78350f" }} />
              <span style={{ height: isPlaying ? "8px" : "6px", background: "#d97706" }} />
            </div>
          </div>
        </div>

        {/* Expense Ledger Breakdown List */}
        <div className="as-query-ledger-wrap">
          <div className="as-query-ledger-header">
            <span>EXPENSE LEDGER BREAKDOWN</span>
            <span className="as-query-ledger-unsettled">{items.length} Unsettled Items</span>
          </div>

          <div className="as-query-ledger-list">
            {items.map((item) => (
              <div key={item.id} className="as-query-ledger-card">
                <div className="as-query-ledger-left">
                  <div className="as-query-ledger-icon-wrap">
                    {item.icon}
                  </div>
                  <div>
                    <div className="as-query-ledger-name">{item.title}</div>
                    <div className="as-query-ledger-sub">{item.subtitle}</div>
                  </div>
                </div>
                <div className="as-query-ledger-right">
                  <div className="as-query-ledger-amount">₹{item.amount}</div>
                  <div className="as-query-ledger-share-tag">{item.shareTag || "your share"}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Footer Actions */}
        <div className="as-query-footer-desktop">
          <button
            type="button"
            className="as-query-btn-close"
            onClick={close}
          >
            Close
          </button>

          <button
            type="button"
            className="as-query-btn-ask-again"
            onClick={redo}
          >
            Ask another query 🎙
          </button>

          <button
            type="button"
            className="as-query-btn-settle-dark"
            disabled={busy}
            onClick={handleSettleNow}
          >
            <span>Record Settle-Up ₹{amountNum}</span>
            <span>→</span>
          </button>
        </div>

        {/* Brand note */}
        <p className="as-query-brand-note">
          ⚡ Powered by Gnani Prisma NLU &amp; Timbre Neural Speech
        </p>
      </div>

      {/* ====================================================================
          MOBILE VIEW (Matches Picture 1 with Breakdown shown below price)
          ==================================================================== */}
      <div className="as-query-sheet-mobile">
        {/* Top Drag Handle */}
        <div className="as-query-mob-drag" />

        {/* Mobile Header */}
        <div className="as-query-mob-header">
          <div className="as-query-mob-header-left">
            <span className="as-query-pill-balance">
              🎙 Voice Balance Query
            </span>
            <span className="as-query-pill-hinglish">
              Hinglish
            </span>
          </div>

          <button
            type="button"
            className="as-query-close-btn"
            onClick={close}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* You asked card */}
        <div className="as-query-you-asked-card">
          <div className="as-query-you-asked-left">
            <div className="as-query-speaker-avatar">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div style={{ minWidth: 0, overflow: "hidden" }}>
              <div className="as-query-asked-tag">You asked</div>
              <div className="as-query-asked-quote">
                “{transcript}”
              </div>
            </div>
          </div>
          <span className="as-query-understood-pill">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Understood
          </span>
        </div>

        {/* AI Voice Response Card */}
        <div className="as-query-mob-response-card">
          <div className="as-query-mob-resp-topbar">
            <div className="as-query-ai-voice-tag">
              <span style={{ color: "#f59e0b", fontSize: "14px" }}>🟡</span>
              <span>AI Voice Response</span>
            </div>

            <button
              type="button"
              className="as-query-audio-pill-mob"
              onClick={handlePlayVoice}
            >
              <span>🔊</span>
              <span>{isPlaying ? "Playing (0:02)" : "Play Readout"}</span>
              <span style={{ letterSpacing: "1px", fontWeight: "900" }}>||||</span>
            </button>
          </div>

          <h3 className="as-query-mob-spoken-answer">
            “{cleanSpoken}”
          </h3>
          <p className="as-query-mob-spoken-sub">
            You owe {personName.split(" ")[0]} ₹{amountNum} for shared expenses.
          </p>

          {/* Balance Due Row */}
          <div className="as-query-mob-balance-row">
            <div className="as-query-mob-person">
              <div className="as-query-mob-person-avatar-wrap">
                <div className="as-query-mob-person-avatar">
                  {personName.charAt(0)}
                </div>
                <div className="as-query-online-dot" />
              </div>
              <div>
                <div className="as-query-due-tag">BALANCE DUE</div>
                <div className="as-query-person-name">{personName}</div>
              </div>
            </div>

            <div className="as-query-mob-amount-block">
              <div className="as-query-mob-amount-red">₹{amountNum}</div>
              <div className="as-query-mob-net-owed">Net owed</div>
            </div>
          </div>

          {/* Context box (From Goa Trip) */}
          <div className="as-query-mob-context-box">
            <div className="as-query-context-icon">🌴</div>
            <div>
              <div className="as-query-context-title">From {groupName}</div>
              <div className="as-query-context-desc">{contextDesc}</div>
            </div>
          </div>

          {/* Expense Breakdown List shown below price in mobile as requested */}
          {showBreakdownMob && (
            <div className="as-query-ledger-wrap" style={{ marginTop: "14px", marginBottom: "0px" }}>
              <div className="as-query-ledger-header">
                <span>EXPENSE BREAKDOWN</span>
                <span className="as-query-ledger-unsettled">{items.length} items</span>
              </div>

              <div className="as-query-ledger-list">
                {items.map((item) => (
                  <div key={item.id} className="as-query-ledger-card">
                    <div className="as-query-ledger-left">
                      <div className="as-query-ledger-icon-wrap">
                        {item.icon}
                      </div>
                      <div>
                        <div className="as-query-ledger-name">{item.title}</div>
                        <div className="as-query-ledger-sub">{item.subtitle}</div>
                      </div>
                    </div>
                    <div className="as-query-ledger-right">
                      <div className="as-query-ledger-amount">₹{item.amount}</div>
                      <div className="as-query-ledger-share-tag">{item.shareTag || "your share"}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Actions Row */}
        <div className="as-query-mob-actions">
          <button
            type="button"
            className="as-query-btn-breakdown-toggle"
            onClick={() => setShowBreakdownMob(!showBreakdownMob)}
          >
            <span>📄</span>
            <span>{showBreakdownMob ? "Hide breakdown" : "Breakdown"}</span>
          </button>

          <button
            type="button"
            className="as-query-btn-settle-mob"
            disabled={busy}
            onClick={handleSettleNow}
          >
            <span>Settle ₹{amountNum} now</span>
            <span>→</span>
          </button>
        </div>

        {/* Brand note */}
        <p className="as-query-brand-note">
          ⚡ Powered by Gnani Prisma &amp; Timbre
        </p>
      </div>
    </div>
  );
}

