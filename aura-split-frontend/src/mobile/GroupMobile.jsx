import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, fmt } from "../api";
import VoiceSheet from "../components/VoiceSheet";
import DeleteExpenseModal from "../components/DeleteExpenseModal";
import DeleteGroupModal from "../components/DeleteGroupModal";
import "./GroupMobile.css";

export default function GroupMobile({ group, load }) {
  const [tab, setTab] = useState("Expenses"); // "Expenses" | "Balances" | "Members"
  const [mic, setMic] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [busy, setBusy] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [isDeletingExpense, setIsDeletingExpense] = useState(false);
  const [isDeleteGroupModalOpen, setIsDeleteGroupModalOpen] = useState(false);
  const [isDeletingGroup, setIsDeletingGroup] = useState(false);
  const nav = useNavigate();
  const userName = localStorage.getItem("name") || "Rahul";

  if (!group) return null;

  const { balances, members, expenses, payments, meId } = group;
  const { transfers = [], direct = [], allSettled = false } = balances || {};

  const getMemberName = (id) => members.find((m) => m.id === id)?.name || "?";
  const getMemberInitials = (name) => {
    const parts = name.split(" ");
    if (parts.length >= 2) return parts[0][0] + parts[1][0];
    return name.slice(0, 2).toUpperCase();
  };

  const handleDeleteGroup = async () => {
    setIsDeletingGroup(true);
    try {
      await api.deleteGroup(group.id);
      setIsDeleteGroupModalOpen(false);
      nav("/app");
    } catch (err) {
      console.error("Failed to delete group:", err);
    } finally {
      setIsDeletingGroup(false);
    }
  };

  const handleDeleteExpense = async () => {
    if (!expenseToDelete) return;
    setIsDeletingExpense(true);
    try {
      await api.deleteExpense(group.id, expenseToDelete.id);
      setExpenseToDelete(null);
      load();
    } catch (err) {
      console.error("Failed to delete expense:", err);
    } finally {
      setIsDeletingExpense(false);
    }
  };

  const handleSettle = async (d) => {
    setBusy(true);
    try {
      const from = d.amountPaise > 0 ? d.memberId : meId;
      const to = d.amountPaise > 0 ? meId : d.memberId;
      await api.addPayment(group.id, {
        fromId: from,
        toId: to,
        amountPaise: Math.abs(d.amountPaise),
      });
      load();
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  const handleAddMember = async (e) => {
    if (e) e.preventDefault();
    if (!newMemberName.trim()) return;
    await api.addMember(group.id, newMemberName.trim());
    setNewMemberName("");
    load();
  };

  const handleReadAloud = () => {
    if (allSettled || transfers.length === 0) {
      api.speak("Sab settle hai, koi bhed-bhaav nahi!");
    } else {
      const speech = transfers
        .map((t) => `${getMemberName(t.from)} ko ${getMemberName(t.to)} ko ${fmt(t.amountPaise)} dene hain`)
        .join(". ");
      api.speak(speech);
    }
  };

  return (
    <div className="as-grp-mob-wrap">
      <div className="as-grp-mob-container">
        {/* 1. Mobile Top Navigation Bar */}
        <div className="as-grp-mob-topbar">
          <div className="as-grp-mob-top-left">
            <Link to="/app" className="as-grp-mob-back-btn" aria-label="Back">
              ←
            </Link>
            <div>
              <h2 className="as-grp-mob-heading">{group.name}</h2>
              <p className="as-grp-mob-subheading">{members.length} members</p>
            </div>
          </div>

          <div className="as-grp-mob-user-avatar" style={{ position: "relative" }}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              style={{ background: "none", border: "none", padding: 0, color: "inherit", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}
              title="User menu"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
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

        {/* 2. Tabs Row */}
        <div className="as-grp-mob-tabs-row">
          <button
            type="button"
            className={`as-grp-mob-tab-btn ${tab === "Expenses" ? "active" : ""}`}
            onClick={() => setTab("Expenses")}
          >
            <span>Expenses</span>
            {tab === "Expenses" && <span className="as-grp-mob-tab-dot" />}
          </button>

          <button
            type="button"
            className={`as-grp-mob-tab-btn ${tab === "Balances" ? "active" : ""}`}
            onClick={() => setTab("Balances")}
          >
            <span>Balances</span>
            {tab === "Balances" && <span className="as-grp-mob-tab-dot" />}
          </button>

          <button
            type="button"
            className={`as-grp-mob-tab-btn ${tab === "Members" ? "active" : ""}`}
            onClick={() => setTab("Members")}
          >
            <span>Members</span>
          </button>
        </div>

        {/* ==================================================================
            TAB 1: EXPENSES (Matches Picture 2)
            ================================================================== */}
        {tab === "Expenses" && (
          <>
            {/* Voice Shortcut Hint Card */}
            <div className="as-grp-mob-hint-card">
              <div className="as-grp-mob-hint-icon">
                💡
              </div>
              <div>
                <div className="as-grp-mob-hint-title">VOICE SHORTCUT HINT</div>
                <div className="as-grp-mob-hint-text">
                  When adding new spends, just tap the mic and say: <i>“Chai ke ₹120 maine diye, sabme baant do”</i>
                </div>
              </div>
            </div>

            {/* Section Header */}
            <div className="as-grp-mob-section-head">
              <span className="as-grp-mob-section-title">RECENT ACTIVITY</span>
              <span className="as-grp-mob-section-sub">
                {expenses.length} expenses, {payments.length} settlement
              </span>
            </div>

            {/* Activity Cards List */}
            <div className="as-grp-mob-activity-list">
              {expenses.map((e) => {
                const myShare = e.shares?.[meId] || 0;
                const isPaidByMe = e.paidBy === meId;
                const netImpact = isPaidByMe ? e.amountPaise - myShare : -myShare;
                const initials = getMemberInitials(e.description);

                return (
                  <div key={e.id} className="as-grp-mob-expense-card">
                    <div className="as-grp-mob-exp-left">
                      <div className="as-grp-mob-initials-badge">
                        {initials}
                      </div>
                      <div className="as-grp-mob-exp-info">
                        <div className="as-grp-mob-exp-title-row">
                          <span className="as-grp-mob-exp-title">{e.description}</span>
                          {e.voice && (
                            <span className="as-grp-mob-voice-tag">
                              <span>🎙</span>
                              <span>Voice</span>
                            </span>
                          )}
                        </div>
                        <div className="as-grp-mob-exp-payer">
                          Paid by {getMemberName(e.paidBy)}
                        </div>
                      </div>
                    </div>

                    <div className="as-grp-mob-exp-right-wrap">
                      <div className="as-grp-mob-exp-right">
                        <div className="as-grp-mob-exp-amt">{fmt(e.amountPaise)}</div>
                        {netImpact > 0 ? (
                          <div className="as-grp-mob-exp-share-get">+ {fmt(netImpact)} you get</div>
                        ) : netImpact < 0 ? (
                          <div className="as-grp-mob-exp-share-owe">You owe {fmt(Math.abs(netImpact))}</div>
                        ) : (
                          <div style={{ fontSize: "11px", color: "#64748b" }}>Settled</div>
                        )}
                      </div>

                      <button
                        type="button"
                        className="as-grp-mob-expense-delete-btn"
                        title="Delete expense"
                        aria-label={`Delete ${e.description}`}
                        onClick={() => setExpenseToDelete(e)}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Settled payments */}
              {payments.map((p) => (
                <div key={p.id} className="as-grp-mob-settled-card">
                  <div className="as-grp-mob-settled-left">
                    <div className="as-grp-mob-settled-check">✓</div>
                    <div>
                      <div className="as-grp-mob-settled-name">
                        {getMemberName(p.from)} paid {getMemberName(p.to)} {fmt(p.amountPaise)}
                      </div>
                      <div className="as-grp-mob-settled-sub">
                        Settlement • {p.date || "Yesterday"}
                      </div>
                    </div>
                  </div>
                  <span className="as-grp-mob-settled-badge">
                    Settled
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ==================================================================
            TAB 2: BALANCES (Matches Picture 4)
            ================================================================== */}
        {tab === "Balances" && (
          <>
            {/* Hinglish Summary Banner */}
            <div className="as-grp-mob-hinglish-banner">
              <div className="as-grp-mob-hinglish-left">
                <div className="as-grp-mob-speaker-circle">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                </div>
                <div>
                  <div className="as-grp-mob-hinglish-tag">HINGLISH SUMMARY</div>
                  <div className="as-grp-mob-hinglish-title">Audio Balance Overview</div>
                </div>
              </div>

              <button
                type="button"
                className="as-grp-mob-btn-read-aloud"
                onClick={handleReadAloud}
              >
                <span className="as-grp-mob-play-icon">▶</span>
                <span>Read aloud</span>
              </button>
            </div>

            {/* Section 1: WHO OWES WHOM */}
            <div>
              <div className="as-grp-mob-section-head" style={{ marginBottom: "8px" }}>
                <span className="as-grp-mob-section-title">WHO OWES WHOM</span>
                <span className="as-grp-mob-section-sub">{transfers.length} direct payments</span>
              </div>

              <div className="as-grp-mob-card-block">
                {transfers.length === 0 ? (
                  <p style={{ textAlign: "center", color: "#64748b", margin: "10px 0", fontSize: "12.5px" }}>
                    Sab settle hai 🎉 Koi payment bacha nahi!
                  </p>
                ) : (
                  transfers.map((t, idx) => (
                    <div key={idx} className="as-grp-mob-transfer-item">
                      <div className="as-grp-mob-transfer-names">
                        <span>{getMemberName(t.from)}</span>
                        <span className="as-grp-mob-trans-arrow">→</span>
                        <span>{getMemberName(t.to)}</span>
                      </div>
                      <div className="as-grp-mob-transfer-price">
                        {fmt(t.amountPaise)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Section 2: YOUR BALANCES */}
            <div>
              <div className="as-grp-mob-section-head" style={{ marginBottom: "8px" }}>
                <span className="as-grp-mob-section-title">YOUR BALANCES</span>
              </div>

              <div className="as-grp-mob-your-list">
                {direct.map((d) => {
                  const owesMe = d.amountPaise > 0;
                  const iOwe = d.amountPaise < 0;
                  const isSettled = d.amountPaise === 0;

                  return (
                    <div key={d.memberId} className="as-grp-mob-your-card">
                      <div>
                        <div className="as-grp-mob-your-name">{d.name}</div>
                        {owesMe && (
                          <div className="as-grp-mob-your-status green">
                            {d.name} owes you {fmt(d.amountPaise)}
                          </div>
                        )}
                        {iOwe && (
                          <div className="as-grp-mob-your-status red">
                            You owe {d.name} {fmt(Math.abs(d.amountPaise))}
                          </div>
                        )}
                        {isSettled && (
                          <div className="as-grp-mob-your-status gray">
                            All settled with {d.name} (₹0)
                          </div>
                        )}
                      </div>

                      <div>
                        {owesMe ? (
                          <button
                            type="button"
                            className="as-grp-mob-btn-settle-peach"
                            disabled={busy}
                            onClick={() => handleSettle(d)}
                          >
                            Settle up
                          </button>
                        ) : iOwe ? (
                          <button
                            type="button"
                            className="as-grp-mob-btn-settle-dark"
                            disabled={busy}
                            onClick={() => handleSettle(d)}
                          >
                            Settle up
                          </button>
                        ) : (
                          <span className="as-grp-mob-settled-chip">
                            <span>✓</span>
                            <span>Settled</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* User Condition: when all payments are settle up then only show (sab settle hai , all balances are fully cleared ) */}
            {allSettled && (
              <div className="as-grp-mob-all-settled-box">
                Sab settle hai ✨ , all balances are fully cleared
              </div>
            )}
          </>
        )}

        {/* ==================================================================
            TAB 3: MEMBERS
            ================================================================== */}
        {tab === "Members" && (
          <div className="as-grp-mob-card-block" style={{ padding: "16px" }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "15px", fontWeight: "800" }}>Group Members</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
              {members.map((m) => (
                <div
                  key={m.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 12px",
                    background: "#f8fafc",
                    borderRadius: "12px",
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: "13.5px" }}>{m.name}</span>
                  <span style={{ fontSize: "11.5px", color: "#16a34a", fontWeight: 700 }}>
                    {m.linked ? "Linked" : "Invited"}
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddMember} style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="Add member name..."
                style={{
                  flex: 1,
                  padding: "10px 12px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "10px",
                  fontSize: "13px",
                  outline: "none",
                }}
              />
              <button
                type="submit"
                disabled={!newMemberName.trim()}
                style={{
                  background: "#191632",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "10px",
                  padding: "10px 16px",
                  fontWeight: 700,
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                Add
              </button>
            </form>

            {/* Danger Zone: Delete Group */}
            <div className="as-grp-mob-danger-zone">
              <div className="as-grp-mob-danger-info">
                <span className="as-grp-mob-danger-title">Delete Group</span>
                <span className="as-grp-mob-danger-desc">
                  Permanently delete this circle and all recorded expenses.
                </span>
              </div>
              <button
                type="button"
                className="as-grp-mob-btn-delete-group"
                onClick={() => setIsDeleteGroupModalOpen(true)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                <span>Delete Group</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating Circular Mic Button (Bottom Right) */}
      <button
        type="button"
        className="as-grp-mob-floating-mic"
        onClick={() => setMic(true)}
        aria-label="Speak an expense"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
          <line x1="12" y1="19" x2="12" y2="23"/>
          <line x1="8" y1="23" x2="16" y2="23"/>
        </svg>
      </button>

      {/* Voice Assistant Sheet */}
      {mic && (
        <VoiceSheet
          group={group}
          mode="add"
          onClose={() => setMic(false)}
          onSaved={() => {
            setMic(false);
            load();
          }}
        />
      )}

      {/* Delete Expense Confirmation Modal */}
      <DeleteExpenseModal
        isOpen={!!expenseToDelete}
        expense={expenseToDelete}
        payerName={expenseToDelete ? getMemberName(expenseToDelete.paidBy) : ""}
        isDeleting={isDeletingExpense}
        onConfirm={handleDeleteExpense}
        onCancel={() => {
          if (!isDeletingExpense) setExpenseToDelete(null);
        }}
      />

      {/* Delete Group Confirmation Modal */}
      <DeleteGroupModal
        isOpen={isDeleteGroupModalOpen}
        group={group}
        isDeleting={isDeletingGroup}
        onConfirm={handleDeleteGroup}
        onCancel={() => {
          if (!isDeletingGroup) setIsDeleteGroupModalOpen(false);
        }}
      />
    </div>
  );
}

