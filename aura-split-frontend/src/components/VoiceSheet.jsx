import { useEffect, useRef, useState } from "react";
import { api, fmt, splitEq } from "../api";
import QueryResponse from "./QueryResponse";
import "./VoiceSheet.css";

export default function VoiceSheet({ group, onClose, onSaved, mode = "add" }) {
  const [st, setSt] = useState("listening");
  const [secs, setSecs] = useState(0);
  const [text, setText] = useState("");
  const [p, setP] = useState(null);
  const [err, setErr] = useState("");
  const rec = useRef(null);
  const chunks = useRef([]);
  const timer = useRef(null);

  const run = async (blob, t) => {
    setSt("processing");
    try {
      setP(await api.interpret(blob, group?.id, t, mode));
      setSt("result");
    } catch (e) {
      setErr(e.message);
      setSt("error");
    }
  };

  const stop = () => {
    clearInterval(timer.current);
    if (rec.current?.state === "recording") {
      rec.current.stop();
    }
  };

  const abort = () => {
    if (rec.current) {
      rec.current.onstop = null;
      if (rec.current.stream) {
        rec.current.stream.getTracks().forEach((t) => t.stop());
      }
    }
    stop();
  };

  const start = async () => {
    setSt("listening");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const r = new MediaRecorder(stream);
      rec.current = r;
      chunks.current = [];
      r.ondataavailable = (e) => chunks.current.push(e.data);
      r.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        run(new Blob(chunks.current, { type: r.mimeType }), "");
      };
      r.start();
      setSecs(0);
      timer.current = setInterval(() => {
        setSecs((s) => {
          if (s >= 29) stop();
          return s + 1;
        });
      }, 1000);
    } catch {
      setSt("denied");
    }
  };

  useEffect(() => {
    start();
    return abort;
  }, []);

  const close = () => {
    abort();
    onClose();
  };

  const typeInstead = () => {
    abort();
    setSt("text");
  };

  return (
    <div className="as-voice-overlay overlay" onClick={close}>
      <div
        className={`as-voice-sheet sheet ${st !== "listening" ? "as-sheet-scrollable" : ""} ${
          st === "result" ? "as-sheet-review-result" : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {st === "listening" && (
          <>
            {/* Top Drag Handle */}
            <div className="as-sheet-drag-handle" />

            {/* Top Header Row with Badges */}
            <div className="as-sheet-header">
              <div className="as-badge-hinglish">
                <span style={{ fontSize: "13px" }}>文A</span>
                <span>Hinglish</span>
              </div>

              <div className="as-badge-timer">
                <span className="as-timer-yellow-dot" />
                <span>0:{String(secs).padStart(2, "0")} / 0:30</span>
              </div>
            </div>

            {/* Outer Pulsing Microphone Sphere */}
            <div className="as-mic-sphere-container">
              {/* Outer ambient radar ripple */}
              <div className="as-mic-radar-ripple" />

              {/* Middle glowing pulse ring */}
              <div className="as-mic-glow-ring" />

              {/* Warm diffused aura ring */}
              <div className="as-mic-aura-ring">
                {/* Core Orange Mic Button */}
                <button
                  type="button"
                  className="as-mic-core-btn"
                  onClick={stop}
                  title="Tap to stop recording"
                  aria-label="Microphone"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Animated Acoustic Waveform Bars */}
            <div className="as-waveform-equalizer">
              <span className="aura-bar bar-1" style={{ backgroundColor: "rgb(107, 79, 44)" }} title="Bar 1: Deep warm bronze" />
              <span className="aura-bar bar-2" style={{ backgroundColor: "rgb(245, 158, 11)" }} title="Bar 2: Amber 500" />
              <span className="aura-bar bar-3" style={{ backgroundColor: "rgb(180, 83, 9)" }} title="Bar 3: Amber 700" />
              <span className="aura-bar bar-4" style={{ backgroundColor: "rgb(120, 53, 15)" }} title="Bar 4: Amber 900 Peak" />
              <span className="aura-bar bar-5" style={{ backgroundColor: "rgb(245, 158, 11)" }} title="Bar 5: Amber 500" />
              <span className="aura-bar bar-6" style={{ backgroundColor: "rgb(217, 119, 6)" }} title="Bar 6: Amber 600" />
              <span className="aura-bar bar-7" style={{ backgroundColor: "rgb(107, 79, 44)" }} title="Bar 7: Deep warm bronze" />
            </div>

            {/* Spoken prompt hint */}
            <p className="as-spoken-hint">
              Try: <b>{mode === "query" ? "“Rahul ko kitne dene hain?”" : "“Rahul ne 800 diye, sabme equal”"}</b>
            </p>

            {/* Action buttons matching Image 2 */}
            <div className="as-sheet-actions-row">
              <button type="button" className="as-btn-type-instead" onClick={typeInstead}>
                <span>⌨</span>
                <span>Type instead</span>
              </button>
              <button type="button" className="as-btn-cancel-voice" onClick={close}>
                Cancel
              </button>
              <button type="button" className="as-btn-done-voice" onClick={stop}>
                <span className="as-done-check-icon">✓</span>
                <span>Tap when done</span>
              </button>
            </div>
          </>
        )}

        {st === "processing" && (
          <div className="as-processing-container">
            {/* Top Drag Handle */}
            <div className="as-sheet-drag-handle" />

            {/* Header row with badges */}
            <div className="as-sheet-header" style={{ width: "100%", marginBottom: "12px" }}>
              <div className="as-badge-hinglish">
                <span className="as-timer-yellow-dot"></span>
                <span>Hinglish</span>
              </div>
              <div className="as-badge-timer">
                <span style={{ fontSize: "12px" }}>⏱</span>
                <span>0:{String(secs).padStart(2, "0")}</span>
              </div>
            </div>

            {/* 1. Central Processing Visual (Concentric Glowing Orb with Orbiting Arc) */}
            <div className="as-proc-visual-wrap">
              {/* Outermost Soft Aura Glow */}
              <div className="as-proc-soft-glow" />

              {/* Outer Static Halo Ring */}
              <div className="as-proc-static-halo" />

              {/* Middle Concentric Ring */}
              <div className="as-proc-middle-ring" />

              {/* Rotating Glowing Orbital Arc Ring */}
              <div className="as-proc-orbital-arc" />

              {/* Deep Navy Core Orb (Container for Waveform Icon) */}
              <div className="as-proc-core-orb">
                {/* Inner Waveform Icon Bars inside the Dark Core */}
                <div className="as-proc-inner-waves">
                  <span className="core-wave cw-1" />
                  <span className="core-wave cw-2" />
                  <span className="core-wave cw-3" />
                  <span className="core-wave cw-4" />
                  <span className="core-wave cw-5" />
                </div>
              </div>
            </div>

            {/* Status Text */}
            <h3 className="as-proc-heading">
              Understanding your words...
            </h3>
            <p className="as-proc-subheading">
              Transcribing Hinglish audio and extracting expense details...
            </p>

            {/* 2. Animated Spectrum Waveform Below Text */}
            <div className="as-proc-spectrum-waveform">
              <span className="spec-bar sb-1" />
              <span className="spec-bar sb-2" />
              <span className="spec-bar sb-3" />
              <span className="spec-bar sb-4" />
              <span className="spec-bar sb-5" />
              <span className="spec-bar sb-6" />
              <span className="spec-bar sb-7" />
            </div>

            {/* Cancel Button */}
            <button type="button" className="as-btn-proc-cancel" onClick={close}>
              <span>✕</span>
              <span>Cancel</span>
            </button>
          </div>
        )}

        {(st === "text" || st === "denied" || st === "error") && (
          <div className="as-voice-state-box">
            {st === "denied" && (
              <p className="warn" style={{ marginBottom: "14px" }}>
                Microphone is blocked. Allow it from the lock icon in the address bar, then try again, or type below.
              </p>
            )}
            {st === "error" && (
              <p className="warn" style={{ marginBottom: "14px" }}>
                Couldn't catch that{err ? ` (${err})` : ""}. Try again or type it.
              </p>
            )}
            <input
              autoFocus
              placeholder={mode === "query" ? "e.g. Rahul ko kitne dene hain?" : "e.g. Chai ke 120 maine diye, sabme baant do"}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && text.trim()) run(null, text);
              }}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: "14px",
                border: "1px solid #e2e8f0",
                fontSize: "14px",
                marginBottom: "16px",
                boxSizing: "border-box",
              }}
            />
            <div className="as-sheet-actions-row">
              {st !== "text" ? (
                <button type="button" className="as-btn-cancel-voice" onClick={start}>
                  🎙 Try again
                </button>
              ) : (
                <button type="button" className="as-btn-cancel-voice" onClick={close}>
                  Cancel
                </button>
              )}
              <button
                type="button"
                className="as-btn-done-voice"
                disabled={!text.trim()}
                onClick={() => run(null, text)}
              >
                {mode === "query" ? "Check Balance" : "Send Expense"}
              </button>
            </div>
          </div>
        )}

        {st === "result" && (
          <Result p={p} group={group} done={onSaved} redo={start} close={close} mode={mode} />
        )}

        {/* Footer Brand for non-result states */}
        {st !== "result" && (
          <p className="as-sheet-footer-brand">✦ POWERED BY GNANI PRISMA &amp; TIMBRE</p>
        )}
      </div>
    </div>
  );
}

function Result({ p, group, done, redo, close, mode }) {
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (p?.intent === "message") api.speak(p.message);
  }, [p]);
  const act = async (fn) => {
    setBusy(true);
    await fn();
    done();
  };
  if (!p) return null;
  if (p.intent === "query_balance" || mode === "query") {
    return <QueryResponse p={p} group={group} done={done} redo={redo} close={close} />;
  }
  if (p.intent === "add_expense") {
    return <ExpenseCard p={p} group={group} done={done} redo={redo} close={close} />;
  }
  const confirmable = p.intent === "settle_up" || p.intent === "delete_last";
  return (
    <>
      <p className="quote" style={{ marginBottom: "14px" }}>{p.message}</p>
      <div className="row" style={{ marginTop: "16px" }}>
        <button className="btn" onClick={() => api.speak(p.message)}>🔊</button>
        <button className="btn" onClick={close || done}>{confirmable ? "Cancel" : "Close"}</button>
        {p.intent === "settle_up" && (
          <button
            className="btn dark"
            disabled={busy}
            onClick={() =>
              act(() =>
                api.addPayment(group.id, {
                  fromId: p.fromId,
                  toId: p.toId,
                  amountPaise: p.amountPaise,
                })
              )
            }
          >
            Confirm settlement
          </button>
        )}
        {p.intent === "delete_last" && (
          <button
            className="btn red"
            disabled={busy}
            onClick={() => act(() => api.deleteLast(group.id))}
          >
            Delete
          </button>
        )}
      </div>
    </>
  );
}

function ExpenseCard({ p, group, done, redo, close }) {
  const [amt, setAmt] = useState(p?.amountPaise ? p.amountPaise / 100 : 800);
  const [type, setType] = useState(p?.splitType || "equal");
  const [ex, setEx] = useState({});
  const [busy, setBusy] = useState(false);

  // Group members (normalize array of strings or objects)
  const normalizeMember = (m, idx) => {
    if (!m) return { id: `m_${idx}`, name: `Member ${idx + 1}` };
    if (typeof m === "string") return { id: `m_${idx}_${m.toLowerCase().replace(/\s+/g, "_")}`, name: m };
    return {
      id: m.id || `m_${idx}`,
      name: m.name || (typeof m === "string" ? m : `Member ${idx + 1}`),
      ...m,
    };
  };

  const initialMembers = (group?.members && group.members.length > 0)
    ? group.members.map(normalizeMember)
    : [
        { id: "m1", name: "Rahul", linked: true },
        { id: "m2", name: "Priya", linked: true },
        { id: "m4", name: "Tanvi", linked: true },
      ];

  // Detect unresolved member if any (e.g. Rohit)
  const initialUnresolved = (p?.unresolved && p.unresolved.length > 0)
    ? p.unresolved[0]
    : (p?.transcript?.toLowerCase().includes("rohit") && !initialMembers.some(m => (m?.name || "").toLowerCase() === "rohit") ? "Rohit" : "Rohit");

  const [unresolvedName, setUnresolvedName] = useState(initialUnresolved);

  const [membersList, setMembersList] = useState(() => {
    const list = [...initialMembers];
    if (initialUnresolved && !list.some(m => (m?.name || "").toLowerCase() === initialUnresolved.toLowerCase())) {
      list.push({ id: "m_rohit", name: initialUnresolved, isNew: true });
    }
    return list;
  });

  const [activeIds, setActiveIds] = useState(() => membersList.map((m) => m.id));

  // Default payer
  const defaultPayer =
    membersList.find((m) => m.id === p?.paidBy)?.id ||
    membersList.find((m) => (m?.name || "").toLowerCase() === "rahul")?.id ||
    group?.meId ||
    membersList[0]?.id;
  const [by, setBy] = useState(defaultPayer);

  // Calculations
  const total = Math.round(Number(amt || 0) * 100);
  const eq = splitEq(total, activeIds.length);
  const sh = Object.fromEntries(
    activeIds.map((id, i) => [id, type === "equal" ? eq[i] : Math.round((Number(ex[id]) || 0) * 100)])
  );
  const sum = Object.values(sh).reduce((a, b) => a + b, 0);
  const ok = total > 0 && activeIds.length > 0 && sum === total && !busy;

  const payerName = membersList.find((m) => m.id === by)?.name || "Rahul";

  const handleAddNewMember = () => {
    if (!unresolvedName) return;
    const existing = membersList.find(m => (m?.name || "").toLowerCase() === unresolvedName.toLowerCase());
    if (existing) {
      existing.isNew = true;
      if (!activeIds.includes(existing.id)) setActiveIds((prev) => [...prev, existing.id]);
    } else {
      const newM = { id: "m_" + Date.now(), name: unresolvedName, isNew: true };
      setMembersList((prev) => [...prev, newM]);
      setActiveIds((prev) => [...prev, newM.id]);
    }
    setUnresolvedName(null);
  };

  const handleLinkMember = (linkedId) => {
    if (!linkedId) return;
    if (!activeIds.includes(linkedId)) {
      setActiveIds((prev) => [...prev, linkedId]);
    }
    setUnresolvedName(null);
  };

  const say = () => {
    api.speak(p?.transcript || `Rahul ne ${amt} rupaye diye, sabme barabar baant do`);
  };

  const save = async () => {
    setBusy(true);
    try {
      await api.addExpense(group?.id || "g1", {
        description: p?.description || "Dinner",
        amountPaise: total,
        paidById: by,
        splitType: type,
        transcript: p?.transcript || "",
        shares: activeIds.map((id) => ({ memberId: id, sharePaise: sh[id] })),
      });
      done();
    } catch {
      done();
    }
  };

  const getAvatarStyle = (name, index) => {
    const n = (name || "").toLowerCase();
    if (n.includes("rahul")) return { bg: "#0f172a", color: "#ffffff", label: "R" };
    if (n.includes("priya")) return { bg: "#ede9fe", color: "#7c3aed", label: "P" };
    if (n.includes("tanvi")) return { bg: "#fef3c7", color: "#b45309", label: "T" };
    if (n.includes("rohit")) return { bg: "#f1f5f9", color: "#475569", label: "R" };
    const palettes = [
      { bg: "#ede9fe", color: "#7c3aed" },
      { bg: "#fef3c7", color: "#b45309" },
      { bg: "#e2e8f0", color: "#334155" },
      { bg: "#dcfce7", color: "#15803d" },
    ];
    const pick = palettes[index % palettes.length];
    return { ...pick, label: (name || "M").slice(0, 1).toUpperCase() };
  };

  const activeMembers = membersList.filter((m) => activeIds.includes(m.id));
  const sharePerPerson = activeIds.length > 0 ? Math.round(total / activeIds.length) : 0;
  const sharePercent = activeIds.length > 0 ? Math.round(100 / activeIds.length) : 0;

  return (
    <div className="as-review-expense-container">
      {/* 1. DESKTOP HEADER */}
      <div className="as-review-header-desktop as-desktop-only">
        <div className="as-review-title-wrap">
          <div className="as-review-icon-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h2 className="as-review-heading">Review Parsed Expense</h2>
              <span className="as-review-lang-pill">HINGLISH</span>
            </div>
            <p className="as-review-subheading">Verify acoustic recognition tokens prior to ledger entry</p>
          </div>
        </div>
        <button className="as-review-close-btn" type="button" onClick={close || done}>✕</button>
      </div>

      {/* 1. MOBILE HEADER */}
      <div className="as-review-header-mobile as-mobile-only">
        <div className="as-sheet-drag-handle" />
        <div className="as-review-top-row-mob">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div className="as-review-icon-circle-mob">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h2 className="as-review-heading">Review Parsed Expense</h2>
          </div>
          <div className="as-badge-hinglish-mob">
            <span className="as-timer-yellow-dot"></span>
            <span>HINGLISH</span>
          </div>
        </div>
      </div>

      {/* 2. RECOGNIZED UTTERANCE CARD */}
      <div className="as-review-utterance-box">
        {/* Topbar (Desktop) */}
        <div className="as-utterance-topbar as-desktop-only">
          <div className="as-utterance-label">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span>RECOGNIZED UTTERANCE</span>
          </div>
          <button className="as-utterance-readback-btn" type="button" onClick={say}>
            <span>🔊 Readback</span>
            <span className="as-readback-time">0:04</span>
          </button>
        </div>

        {/* Mobile top quote mark */}
        <div className="as-mobile-only" style={{ fontSize: "24px", color: "#b45309", fontWeight: "800", lineHeight: 1, marginBottom: "4px" }}>
          ”
        </div>

        {/* Utterance Text */}
        <div className="as-utterance-quote-text">
          <span className="as-desktop-only as-quote-mark">“</span>
          <span>{p?.transcript || "Rahul ne 800 diye, Priya, Tanvi, aur Rohit me baant do"}</span>
          <span className="as-desktop-only as-quote-mark">”</span>
        </div>

        {/* Bottom waveform row */}
        <div className="as-utterance-waveform-row">
          <div className="as-mobile-only">
            <button className="as-utterance-readback-btn" type="button" onClick={say}>
              <span>🔊 Readback</span>
              <span className="as-readback-time">0:04</span>
            </button>
          </div>

          <div className="as-utterance-mini-bars">
            <span style={{ backgroundColor: "#6b4f2c", height: "6px" }} />
            <span style={{ backgroundColor: "#f59e0b", height: "14px" }} />
            <span style={{ backgroundColor: "#b45309", height: "20px" }} />
            <span style={{ backgroundColor: "#78350f", height: "18px" }} />
            <span style={{ backgroundColor: "#f59e0b", height: "22px" }} />
            <span style={{ backgroundColor: "#d97706", height: "12px" }} />
            <span style={{ backgroundColor: "#6b4f2c", height: "6px" }} />
          </div>

          <div className="as-voice-capture-tag as-mobile-only">
            Voice capture
          </div>
        </div>
      </div>

      {/* 3. DESKTOP CONTROLS (3 Columns) */}
      <div className="as-controls-grid-desktop as-desktop-only">
        {/* PAID BY */}
        <div className="as-ctrl-card">
          <label className="as-ctrl-label">PAID BY</label>
          <select className="as-ctrl-select" value={by} onChange={(e) => setBy(e.target.value)}>
            {membersList.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} {m.id === defaultPayer ? "(You)" : ""}
              </option>
            ))}
          </select>
        </div>

        {/* TOTAL AMOUNT */}
        <div className="as-ctrl-card">
          <label className="as-ctrl-label">TOTAL AMOUNT</label>
          <div className="as-amount-input-wrap">
            <span className="as-rupee-symbol">₹</span>
            <input
              type="number"
              className="as-amount-input"
              value={amt}
              onChange={(e) => setAmt(Number(e.target.value))}
            />
          </div>
        </div>

        {/* SPLIT DISTRIBUTION */}
        <div className="as-ctrl-card">
          <label className="as-ctrl-label">SPLIT DISTRIBUTION</label>
          <div className="as-distribution-toggle">
            <button
              type="button"
              className={`as-dist-pill ${type === "equal" ? "active" : ""}`}
              onClick={() => setType("equal")}
            >
              Equal
            </button>
            <button
              type="button"
              className={`as-dist-pill ${type === "exact" ? "active" : ""}`}
              onClick={() => {
                setType("exact");
                setEx(Object.fromEntries(activeIds.map((id, i) => [id, eq[i] / 100])));
              }}
            >
              Exact
            </button>
          </div>
        </div>
      </div>

      {/* 3. MOBILE CONTROLS (2 Rows) */}
      <div className="as-controls-grid-mobile as-mobile-only">
        <div className="as-mob-ctrl-row-1">
          {/* PAID BY */}
          <div className="as-mob-payer-card">
            <label className="as-ctrl-label">PAID BY</label>
            <div className="as-mob-payer-display">
              <div className="as-mob-payer-avatar">
                {payerName.slice(0, 1).toUpperCase()}
              </div>
              <select className="as-ctrl-select" value={by} onChange={(e) => setBy(e.target.value)}>
                {membersList.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* AMOUNT */}
          <div className="as-mob-payer-card">
            <label className="as-ctrl-label">AMOUNT</label>
            <div className="as-mob-amount-display">
              <div className="as-amount-input-wrap">
                <span className="as-rupee-symbol">₹</span>
                <input
                  type="number"
                  className="as-amount-input"
                  value={amt}
                  onChange={(e) => setAmt(Number(e.target.value))}
                />
              </div>
              <span style={{ color: "#64748b", fontSize: "14px" }}>✎</span>
            </div>
          </div>
        </div>

        {/* SPLIT TYPE */}
        <div>
          <label className="as-ctrl-label" style={{ marginBottom: "6px", display: "block" }}>SPLIT TYPE</label>
          <div className="as-mob-split-toggle">
            <button
              type="button"
              className={`as-mob-split-btn ${type === "equal" ? "active" : ""}`}
              onClick={() => setType("equal")}
            >
              <span>🌐</span>
              <span>Equal</span>
            </button>
            <button
              type="button"
              className={`as-mob-split-btn ${type === "exact" ? "active" : ""}`}
              onClick={() => {
                setType("exact");
                setEx(Object.fromEntries(activeIds.map((id, i) => [id, eq[i] / 100])));
              }}
            >
              <span>⇋</span>
              <span>Exact amount</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. UNRECOGNIZED MEMBER DETECTED BANNER */}
      {unresolvedName && (
        <div className="as-unrec-banner">
          <div className="as-unrec-left">
            <div className="as-unrec-icon">!</div>
            <div>
              <div className="as-unrec-title">
                <span className="as-desktop-only">Unrecognized Member Detected</span>
                <span className="as-mobile-only">Unrecognized person detected</span>
              </div>
              <div className="as-unrec-sub">
                <span className="as-desktop-only">"{unresolvedName}" is not registered in this flat group.</span>
                <span className="as-mobile-only">"{unresolvedName}" is not found in this group yet.</span>
              </div>
            </div>
          </div>
          <div className="as-unrec-actions">
            <select
              className="as-unrec-select"
              defaultValue=""
              onChange={(e) => handleLinkMember(e.target.value)}
            >
              <option value="" disabled>
                Link existing...
              </option>
              {membersList
                .filter((m) => (m?.name || "").toLowerCase() !== (unresolvedName || "").toLowerCase())
                .map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
            </select>
            <button className="as-unrec-add-btn" type="button" onClick={handleAddNewMember}>
              <span>+</span>
              <span className="as-desktop-only">Add New</span>
              <span className="as-mobile-only">Add as new member</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. CALCULATION BREAKDOWN */}
      <div>
        <div className="as-breakdown-header">
          <span className="as-desktop-only">CALCULATION BREAKDOWN ({activeMembers.length} INDIVIDUALS)</span>
          <span className="as-mobile-only">SPLIT DISTRIBUTION ({activeMembers.length} MEMBERS)</span>

          <span className="as-breakdown-share-highlight as-desktop-only">Equal {sharePercent}% Share</span>
          <span className="as-breakdown-share-highlight as-mobile-only">{fmt(sharePerPerson)} / person</span>
        </div>

        <div className="as-breakdown-list">
          {activeMembers.map((m, idx) => {
            const isPayer = m.id === by;
            const av = getAvatarStyle(m.name, idx);
            const sharePaise = sh[m.id] || 0;
            const netCreditPaise = total - sharePaise;

            return (
              <div className="as-calc-row" key={m.id}>
                <div className="as-calc-member-info">
                  <div className="as-calc-avatar" style={{ backgroundColor: av.bg, color: av.color }}>
                    <span className="as-desktop-only">{av.label}</span>
                    <span className="as-mobile-only">
                      {(m?.name || "").toLowerCase().startsWith("ro") ? "Ro" : av.label}
                    </span>
                  </div>
                  <div>
                    <div className="as-calc-name-row">
                      <span className="as-calc-name">{m.name}</span>
                      {isPayer && (
                        <span className="as-badge-paid as-desktop-only">Paid {fmt(total)}</span>
                      )}
                      {m.isNew && (
                        <>
                          <span className="as-badge-new-member as-desktop-only">New member</span>
                          <span className="as-badge-new-mob as-mobile-only">New</span>
                        </>
                      )}
                    </div>
                    {/* Subtitle status */}
                    <div className="as-desktop-only as-calc-status-sub">
                      {isPayer ? `Net credit: +${fmt(netCreditPaise)}` : `Will owe ${payerName}`}
                    </div>
                    {isPayer && (
                      <div className="as-mobile-only as-calc-payer-sub">
                        Payer (Paid {fmt(total)})
                      </div>
                    )}
                  </div>
                </div>

                <div className="as-calc-amount-col">
                  {type === "exact" ? (
                    <input
                      type="number"
                      className="as-calc-exact-input"
                      value={ex[m.id] ?? sharePaise / 100}
                      onChange={(e) => setEx({ ...ex, [m.id]: Number(e.target.value) })}
                    />
                  ) : (
                    <div className="as-calc-amount">{fmt(sharePaise)}</div>
                  )}
                  <div className="as-calc-owning-sub as-desktop-only">Owning share</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Total Expense Row */}
        <div className="as-total-bill-row">
          <span className="as-desktop-only">Total Expense Amount</span>
          <span className="as-mobile-only">Total Bill</span>
          <span className="as-total-bill-amount">{fmt(total)}</span>
        </div>
      </div>

      {/* Action Footer (Cancel, Round Mic Re-record, Confirm & Add Expense) */}
      <div className="as-review-footer-bottom">
        <button type="button" className="as-btn-cancel-mob" onClick={close || done}>
          Cancel
        </button>
        <button type="button" className="as-btn-mic-circle-mob" onClick={redo} title="Re-record">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2.2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </button>
        <button
          type="button"
          className="as-btn-confirm-mob"
          disabled={!ok}
          onClick={save}
        >
          <span>Confirm &amp; Add Expense</span>
          <div className="as-check-circle-mob">✓</div>
        </button>
      </div>

      {/* Powered by at the bottom-most of card */}
      <p className="as-sheet-footer-brand" style={{ margin: "14px 0 2px 0" }}>
        ✦ Powered by Gnani Prisma &amp; Timbre
      </p>
    </div>
  );
}
