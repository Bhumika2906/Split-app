import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { api, fmt } from "../api";
import VoiceSheet from "../components/VoiceSheet";
import CreateGroupModal from "./CreateGroupModal";
import CreateGroupMobile from "../mobile/CreateGroupMobile";
import "./Dashboard.css";

export default function Dashboard() {
  const outletCtx = useOutletContext();
  const onToggleSidebar = outletCtx?.onToggleSidebar;
  const nav = useNavigate();

  const [groups, setGroups] = useState([]);
  const [activeTab, setActiveTab] = useState("active"); // "active" | "skeleton" | "empty"
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [membersStr, setMembersStr] = useState("");
  const [voiceSheetGroup, setVoiceSheetGroup] = useState(null);
  const [voiceSheetMode, setVoiceSheetMode] = useState("add"); // "add" | "query"
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Mobile specific state
  const [mobSimulationTab, setMobSimulationTab] = useState("empty"); // "empty" | "loading"
  const [isMobOptionsOpen, setIsMobOptionsOpen] = useState(false);

  // Responsive helper for desktop vs mobile modal
  const [isMobileScreen, setIsMobileScreen] = useState(
    typeof window !== "undefined" ? window.innerWidth < 700 : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobileScreen(window.innerWidth < 700);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const load = () => api.groups().then(setGroups);
  useEffect(() => { load(); }, []);

  // Keyboard shortcut: Press Space to dictate (when not focused on input)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space" && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        triggerVoiceDictate();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [groups]);

  // Calculations
  const owe = -groups.reduce((s, g) => s + Math.min(g.net, 0), 0);
  const owed = groups.reduce((s, g) => s + Math.max(g.net, 0), 0);
  const netStanding = owed - owe;

  const handleCreateGroup = async (groupName, memberNames) => {
    await api.createGroup(groupName, memberNames);
    setIsModalOpen(false);
    load();
  };

  const triggerVoiceDictate = () => {
    const target = groups.find((g) => g.isPersonal) || groups[0] || { id: "g0", name: "Personal" };
    setVoiceSheetMode("add");
    setVoiceSheetGroup(target);
  };

  const triggerVoiceQuery = () => {
    const target = groups.find((g) => g.isPersonal) || groups[0] || { id: "g0", name: "Personal" };
    setVoiceSheetMode("query");
    setVoiceSheetGroup(target);
  };

  // Card Icon & Tag Helper matching Picture 1 & Mobile Screenshot
  const getCardStyle = (g) => {
    const n = g.name.toLowerCase();
    if (g.isPersonal || n.includes("personal")) {
      return {
        icon: "R",
        iconClass: "peach",
        tag: "Solo",
        tagClass: "solo",
        pinned: true,
        mobIconType: "user",
        membersSubtitle: "Rahul",
        balanceText: "You get " + fmt(g.net > 0 ? g.net : 60000),
        balanceClass: "get-val",
        mobLbl: "You get",
        mobLblClass: "get",
        mobAmt: "₹600",
        mobAmtClass: "get",
        memberCount: "1 member",
        avatars: [{ label: "R", color: "dark" }]
      };
    }
    if (n.includes("goa")) {
      return {
        icon: "🌴",
        iconClass: "green",
        tag: "Due",
        tagClass: "due",
        pinned: false,
        mobIconType: "plane",
        membersSubtitle: "Rahul, Priya, Paloma, Tanvi, Druid",
        balanceText: "You owe " + fmt(Math.abs(g.net || 185000)),
        balanceClass: "due-val",
        mobLbl: "You owe",
        mobLblClass: "owe",
        mobAmt: "₹1,850",
        mobAmtClass: "owe",
        memberCount: "5 members",
        avatars: [
          { label: "R", color: "dark" },
          { label: "P", color: "orange" },
          { label: "P", color: "purple" },
          { label: "+2", color: "gray" }
        ]
      };
    }
    if (n.includes("flat") || n.includes("hsr")) {
      return {
        icon: "🏢",
        iconClass: "purple",
        tag: "Receivable",
        tagClass: "receivable",
        pinned: false,
        mobIconType: "building",
        membersSubtitle: "Rahul, Tanvi, Druid",
        balanceText: "You're owed " + fmt(g.net || 360000),
        balanceClass: "owed-val",
        mobLbl: "You're owed",
        mobLblClass: "owed",
        mobAmt: "₹3,600",
        mobAmtClass: "owed",
        memberCount: "3 members",
        avatars: [
          { label: "R", color: "dark" },
          { label: "T", color: "orange" },
          { label: "D", color: "blue" }
        ]
      };
    }
    if (n.includes("dinner") || n.includes("weekend")) {
      return {
        icon: "🍽️",
        iconClass: "gray",
        tag: "Settled",
        tagClass: "settled",
        pinned: false,
        mobIconType: "food",
        membersSubtitle: "Rahul, Priya, Paloma",
        balanceText: "Settled up ₹0",
        balanceClass: "settled-val",
        mobLbl: "Settled up",
        mobLblClass: "settled",
        mobAmt: "₹0",
        mobAmtClass: "settled",
        memberCount: "3 members",
        avatars: [
          { label: "R", color: "dark" },
          { label: "P", color: "orange" },
          { label: "P", color: "purple" }
        ]
      };
    }
    return {
      icon: "👥",
      iconClass: "peach",
      tag: g.net > 0 ? "Receivable" : g.net < 0 ? "Due" : "Settled",
      tagClass: g.net > 0 ? "receivable" : g.net < 0 ? "due" : "settled",
      pinned: false,
      mobIconType: "users",
      membersSubtitle: g.members?.join(", ") || "Group members",
      balanceText: g.net > 0 ? "You're owed " + fmt(g.net) : g.net < 0 ? "You owe " + fmt(g.net) : "Settled up ₹0",
      balanceClass: g.net < 0 ? "due-val" : "owed-val",
      mobLbl: g.net > 0 ? "You're owed" : g.net < 0 ? "You owe" : "Settled",
      mobLblClass: g.net > 0 ? "owed" : g.net < 0 ? "owe" : "settled",
      mobAmt: fmt(Math.abs(g.net || 0)),
      mobAmtClass: g.net < 0 ? "owe" : "owed",
      memberCount: `${g.members?.length || 1} members`,
      avatars: [{ label: "R", color: "dark" }]
    };
  };

  const userName = localStorage.getItem("name") || "Rahul";

  return (
    <div className="as-dash-main">
      {/* ===================================================================
          A. DESKTOP VIEW (MATCHING PICTURE 1)
          =================================================================== */}

      {/* 1. TOP BAR */}
      <div className="as-dash-topbar">
        <div className="as-dash-title-wrap">
          {onToggleSidebar && (
            <button
              className="as-sidebar-toggle-btn"
              onClick={onToggleSidebar}
              title="Open Navigation"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </svg>
            </button>
          )}
          <h1 className="as-dash-title">Split Dashboard</h1>
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
              <span className="as-dropdown-name">{userName}</span>
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
                onClick={() => { localStorage.clear(); nav("/"); }}
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. TOP STANDING SUMMARY BANNER */}
      <div className="as-standing-card">
        <div className="as-standing-col-left">
          <p className="as-standing-lbl">YOUR STANDING</p>
          <div className="as-standing-value-row">
            <h2 className="as-standing-amount">
              {netStanding >= 0 ? "+" : ""}{fmt(netStanding || 235000)}
            </h2>
            <span className="as-standing-tag">Net Balance</span>
          </div>
        </div>

        <div className="as-standing-col-mid">
          <div className="as-owe-stat">
            <span className="as-owe-stat-lbl">You owe</span>
            <span className="as-owe-stat-val red">{fmt(owe || 185000)}</span>
          </div>
          <div className="as-owe-stat">
            <span className="as-owe-stat-lbl">You're owed</span>
            <span className="as-owe-stat-val dark">{fmt(owed || 420000)}</span>
          </div>
        </div>

        <button
          className="as-btn-new-group"
          onClick={() => setIsModalOpen(true)}
        >
          + New group
        </button>
      </div>

      {/* 3. TABS / FILTER BAR */}
      <div className="as-dash-tabs-row">
        <div className="as-dash-tabs-left">
          <button
            className={`as-dash-tab ${activeTab === "active" ? "active" : ""}`}
            onClick={() => setActiveTab("active")}
          >
            Active Groups ({groups.length || 4})
          </button>
          <button
            className={`as-dash-tab ${activeTab === "skeleton" ? "active" : ""}`}
            onClick={() => setActiveTab("skeleton")}
          >
            Loading Skeleton
          </button>
          <button
            className={`as-dash-tab ${activeTab === "empty" ? "active" : ""}`}
            onClick={() => setActiveTab("empty")}
          >
            Empty State
          </button>
        </div>
        <p className="as-auto-synced-text">Auto-synced with voice notes</p>
      </div>

      {/* 4. DESKTOP GROUPS GRID */}
      <div className="as-groups-grid">
        {activeTab === "active" && (
          groups.map((g) => {
            const meta = getCardStyle(g);
            return (
              <Link
                key={g.id}
                to={`/app/groups/${g.id}`}
                className="as-group-card-link"
              >
                <div className="as-group-card">
                  <div className="as-group-card-head">
                    <div className="as-group-info-left">
                      <div className={`as-group-icon-circ ${meta.iconClass}`}>
                        {meta.icon}
                      </div>
                      <div className="as-group-text-col">
                        <h3>{g.name}</h3>
                        <p>{meta.membersSubtitle}</p>
                      </div>
                    </div>
                    <span className={`as-card-status-badge ${meta.tagClass}`}>
                      {meta.tag}
                    </span>
                  </div>

                  <div className="as-group-balance-mid">
                    <p className="as-balance-label">Net Balance</p>
                    <h4 className={`as-balance-val ${meta.balanceClass}`}>
                      {meta.balanceText}
                    </h4>
                  </div>

                  <div className="as-group-card-foot">
                    <div className="as-member-stack-dots">
                      {meta.avatars.map((av, idx) => (
                        <div key={idx} className={`as-dot-avatar ${av.color}`}>
                          {av.label}
                        </div>
                      ))}
                    </div>
                    <span className="as-group-member-count">
                      {meta.memberCount}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })
        )}

        {/* Skeleton State */}
        {activeTab === "skeleton" && (
          [1, 2, 3].map((k) => (
            <div key={k} className="as-group-card" style={{ gap: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ display: "flex", gap: 10 }}>
                  <div className="as-skeleton-box" style={{ width: 40, height: 40, borderRadius: "50%" }} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <div className="as-skeleton-box" style={{ width: 120, height: 16 }} />
                    <div className="as-skeleton-box" style={{ width: 80, height: 12 }} />
                  </div>
                </div>
                <div className="as-skeleton-box" style={{ width: 50, height: 20, borderRadius: 9999 }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, margin: "16px 0" }}>
                <div className="as-skeleton-box" style={{ width: 70, height: 10 }} />
                <div className="as-skeleton-box" style={{ width: 140, height: 24 }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #f1f5f9", paddingTop: 12 }}>
                <div className="as-skeleton-box" style={{ width: 60, height: 20, borderRadius: 9999 }} />
                <div className="as-skeleton-box" style={{ width: 50, height: 12 }} />
              </div>
            </div>
          ))
        )}

        {/* Empty State */}
        {activeTab === "empty" && (
          <div className="as-empty-box">
            <div style={{ fontSize: 42, marginBottom: 12 }}>🎙️</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 8px 0" }}>No Groups Yet</h3>
            <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 20px 0" }}>
              Tap the mic below and say “Chai ke 120 maine diye, sab me equal baant do” to auto-create your first group.
            </p>
            <button
              className="as-btn-new-group"
              onClick={() => setIsModalOpen(true)}
            >
              + Create First Group
            </button>
          </div>
        )}
      </div>

      {/* 5. BOTTOM FLOATING DICTATION BAR (Desktop) */}
      <div className="as-dictate-floating-wrapper">
        <div className="as-speech-tip-bubble">
          🎙 Speak in Hinglish (e.g. “Rahul ne 800 diye, Priya ka share 300”)
        </div>
        <button
          className="as-dictate-pill-btn"
          onClick={triggerVoiceDictate}
          title="Press Space or Tap to Dictate"
        >
          <div className="as-dictate-mic-black">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
              <line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
          </div>
          <div className="as-dictate-wave-lines">
            <span className="as-dictate-bar" style={{ height: 10 }} />
            <span className="as-dictate-bar" style={{ height: 16 }} />
            <span className="as-dictate-bar" style={{ height: 12 }} />
          </div>
          <span className="as-dictate-text">Tap or press Space to dictate</span>
        </button>
      </div>

      {/* ===================================================================
          B. MOBILE VIEW (EXACT MATCH TO UPLOADED SCREENSHOT)
          =================================================================== */}
      <div className="mob-dash-wrapper">
        {/* Mobile Top Bar */}
        <div className="mob-dash-topbar">
          <div className="mob-dash-brand">
            <div className="mob-dash-logo-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="5" y="7" width="14" height="3" rx="1.5" fill="#f59e0b" />
                <rect x="5" y="14" width="14" height="3" rx="1.5" fill="#f59e0b" />
              </svg>
            </div>
            <div className="mob-dash-brand-text">
              <span className="mob-dash-app-title">Aura Split</span>
              <span className="mob-dash-app-sub">Home</span>
            </div>
          </div>

          {/* Profile Avatar */}
          <div className="mob-dash-profile-btn" style={{ position: "relative" }}>
            <div
              className="as-user-avatar-btn"
              style={{ width: 34, height: 34, cursor: "pointer" }}
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>

            {isUserMenuOpen && (
              <div className="as-user-dropdown" style={{ right: 0, top: 40, zIndex: 100 }}>
                <span className="as-dropdown-name">{userName}</span>
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
                  onClick={() => { localStorage.clear(); nav("/"); }}
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Total Standing Card */}
        <div className="mob-standing-card">
          <div className="mob-standing-top-row">
            <div className="mob-standing-title-group">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
              <span>Total Standing</span>
            </div>
            <div className="mob-standing-net-badge">
              <span>↗</span>
              <span>+₹2,350 Net positive</span>
            </div>
          </div>

          <div className="mob-standing-stats-grid">
            <div className="mob-stat-box">
              <span className="mob-stat-box-lbl red">
                <span>↗</span> You owe
              </span>
              <h3 className="mob-stat-box-val red">{fmt(owe || 185000)}</h3>
            </div>
            <div className="mob-stat-box">
              <span className="mob-stat-box-lbl olive">
                <span>↓</span> You're owed
              </span>
              <h3 className="mob-stat-box-val dark">{fmt(owed || 420000)}</h3>
            </div>
          </div>
        </div>

        {/* Mobile Hinglish Voice Split Banner */}
        <div className="mob-voice-banner" onClick={triggerVoiceDictate}>
          <div className="mob-voice-banner-left">
            <div className="mob-voice-banner-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
              </svg>
            </div>
            <div className="mob-voice-banner-text">
              <span className="mob-voice-banner-tag">HINGLISH VOICE SPLIT</span>
              <p className="mob-voice-banner-quote">“Chai ke 120 maine diye, sabme baant do”</p>
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M4 10v4M8 6v12M12 3v18M16 8v8M20 10v4" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* Mobile Your Groups Section */}
        <div className="mob-groups-section">
          <div className="mob-groups-header-row">
            <h3 className="mob-groups-title">Your Groups</h3>
            <button
              className="mob-btn-new-group-pill"
              onClick={() => setIsModalOpen(true)}
            >
              + New group
            </button>
          </div>

          <div className="mob-groups-list">
            {groups.map((g) => {
              const meta = getCardStyle(g);
              return (
                <Link
                  key={g.id}
                  to={`/app/groups/${g.id}`}
                  className="mob-group-item-card"
                >
                  <div className="mob-group-item-left">
                    <div className="mob-group-item-icon-wrap">
                      {meta.mobIconType === "user" && (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#0f111a">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                      )}
                      {meta.mobIconType === "plane" && <span>✈️</span>}
                      {meta.mobIconType === "building" && <span>🏢</span>}
                      {meta.mobIconType === "food" && <span>🍽️</span>}
                      {meta.mobIconType === "users" && <span>👥</span>}

                      {meta.pinned && <span className="mob-pin-badge">📌</span>}
                    </div>

                    <div className="mob-group-item-names">
                      <div className="mob-group-item-title-row">
                        <span className="mob-group-item-name">{g.name}</span>
                        {meta.pinned && <span className="mob-pinned-tag">Pinned</span>}
                      </div>
                      <span className="mob-group-item-sub">{meta.membersSubtitle}</span>
                    </div>
                  </div>

                  <div className="mob-group-item-right">
                    <p className={`mob-group-item-lbl ${meta.mobLblClass}`}>{meta.mobLbl}</p>
                    <h4 className={`mob-group-item-amt ${meta.mobAmtClass}`}>{meta.mobAmt}</h4>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Mobile View Simulation Box */}
        <div className="mob-simulation-section">
          <div className="mob-simulation-head">
            <div className="mob-sim-title">
              <span>🧭</span>
              <span>View Simulation</span>
            </div>
            <div className="mob-sim-toggle-pill">
              <button
                className={`mob-sim-btn ${mobSimulationTab === "empty" ? "active" : ""}`}
                onClick={() => setMobSimulationTab("empty")}
              >
                Empty
              </button>
              <button
                className={`mob-sim-btn ${mobSimulationTab === "loading" ? "active" : ""}`}
                onClick={() => setMobSimulationTab("loading")}
              >
                Loading
              </button>
            </div>
          </div>

          <div className="mob-sim-card-body">
            {mobSimulationTab === "empty" ? (
              <>
                <div className="mob-sim-coffee-circle">☕</div>
                <h4 className="mob-sim-empty-title">No expenses logged yet</h4>
                <p className="mob-sim-empty-desc">
                  Tap the mic below and say “Chai ke 120 maine diye, sabme baant do”.
                </p>
              </>
            ) : (
              <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
                <div className="as-skeleton-box" style={{ width: "60%", height: 16, margin: "0 auto" }} />
                <div className="as-skeleton-box" style={{ width: "90%", height: 12, margin: "0 auto" }} />
                <div className="as-skeleton-box" style={{ width: "75%", height: 12, margin: "0 auto" }} />
              </div>
            )}
          </div>
        </div>

        {/* Mobile Powered by Tag */}
        <div className="mob-powered-footer">
          <span>🛡️</span>
          <span>Powered by Gnani Prisma & Timbre</span>
        </div>
      </div>

      {/* ===================================================================
          C. FIXED MOBILE BOTTOM TAB BAR (HOME, VOICE ADD, Options)
          =================================================================== */}
      <nav className="mob-bottom-nav">
        {/* Tab 1: Home */}
        <button
          className="mob-tab-item active"
          onClick={() => { setIsMobOptionsOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/>
            <path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/>
            <circle cx="18" cy="14" r="2"/>
          </svg>
          <span>Home</span>
        </button>

        {/* Center: Voice Add */}
        <button
          className="mob-tab-voice-center"
          onClick={triggerVoiceDictate}
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

        {/* Tab 3: Options (Opens the Desktop Sidebar Options on Mobile!) */}
        <button
          className={`mob-tab-item ${isMobOptionsOpen ? "active" : ""}`}
          onClick={() => setIsMobOptionsOpen(true)}
          title="Open Options & Sidebar Options"
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

      {/* ===================================================================
          D. MOBILE Options SHEET (CONTAINING THE DESKTOP SIDEBAR OPTIONS)
          =================================================================== */}
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

            {/* Desktop Sidebar Options directly embedded here */}
            <ul className="as-sidebar-menu" style={{ marginBottom: 16 }}>
              <li className="as-sidebar-item">
                <button
                  className="as-sidebar-link"
                  onClick={() => { setIsMobOptionsOpen(false); triggerVoiceQuery(); }}
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
                  onClick={() => { setIsMobOptionsOpen(false); }}
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
                  onClick={() => { setIsMobOptionsOpen(false); }}
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
                  onClick={() => { setIsMobOptionsOpen(false); }}
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

            {/* Voice Assist Widget */}
            <button
              className="as-voice-assist-card"
              style={{ marginBottom: 16 }}
              onClick={() => { setIsMobOptionsOpen(false); triggerVoiceDictate(); }}
            >
              <div className="as-va-icon-round">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M4 10v4M8 6v12M12 3v18M16 8v8M20 10v4" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="as-va-text">
                <span className="as-va-title">Voice Assist</span>
                <span className="as-va-sub">Ready for audio input</span>
              </div>
            </button>

            {/* User Account / Logout */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", paddingTop: 14 }}>
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{userName}</p>
                <p style={{ margin: 0, fontSize: 11, color: "#64748b" }}>Signed in</p>
              </div>
              <button
                className="as-dash-tab"
                style={{ color: "#dc2626", borderColor: "#fee2e2" }}
                onClick={() => { localStorage.clear(); nav("/"); }}
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. CREATE GROUP: DESKTOP MODAL & MOBILE SCREEN */}
      {isModalOpen && (
        isMobileScreen ? (
          <CreateGroupMobile
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onCreate={handleCreateGroup}
          />
        ) : (
          <CreateGroupModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onCreate={handleCreateGroup}
          />
        )
      )}

      {/* 7. VOICE SHEET COMPONENT */}
      {voiceSheetGroup && (
        <VoiceSheet
          group={voiceSheetGroup}
          mode={voiceSheetMode}
          onClose={() => setVoiceSheetGroup(null)}
          onSaved={() => { setVoiceSheetGroup(null); load(); }}
        />
      )}
    </div>
  );
}
