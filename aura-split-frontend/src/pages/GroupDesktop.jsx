import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, fmt } from "../api";
import VoiceSheet from "../components/VoiceSheet";
import DeleteExpenseModal from "../components/DeleteExpenseModal";
import DeleteGroupModal from "../components/DeleteGroupModal";
import "./Group.css";

export default function GroupDesktop({ group, load, onOpenVoice, onToggleSidebar }) {
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
    <div className="as-grp-desktop-layout">
      {/* 1. Top Navigation Bar (Matches Dashboard & Screenshot media_1794500465509_6f989b5c.png) */}
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
            <h1 className="as-dash-title">{group.name}</h1>
            <span className="as-grp-subtitle">{members?.length || 0} members</span>
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

      {/* 2. Main Container */}
      <main className="as-grp-main-wrap">

        {/* Sub-Tabs Row */}
        <div className="as-grp-subtabs-row">
          <div className="as-grp-subtabs-left">
            <button
              type="button"
              className={`as-grp-subtab-btn ${tab === "Expenses" ? "active" : ""}`}
              onClick={() => setTab("Expenses")}
            >
              <span>Expenses</span>
              <span className="as-grp-tab-counter">{expenses.length}</span>
            </button>

            <button
              type="button"
              className={`as-grp-subtab-btn ${tab === "Balances" ? "active" : ""}`}
              onClick={() => setTab("Balances")}
            >
              <span>Balances</span>
              <span className="as-grp-tab-counter">Optimal</span>
            </button>

            <button
              type="button"
              className={`as-grp-subtab-btn ${tab === "Members" ? "active" : ""}`}
              onClick={() => setTab("Members")}
            >
              <span>Members</span>
              <span className="as-grp-tab-counter">{members.length}</span>
            </button>
          </div>

          <div className="as-grp-voice-sync-badge">
            <span className="as-grp-yellow-dot" />
            <span>Voice sync active</span>
          </div>
        </div>

        {/* ==================================================================
            TAB 1: EXPENSES (Matches Picture 1)
            ================================================================== */}
        {tab === "Expenses" && (
          <div className="as-grp-expenses-list">
            {expenses.map((e, idx) => {
              const myShare = e.shares?.[meId] || 0;
              const isPaidByMe = e.paidBy === meId;
              const netImpact = isPaidByMe ? e.amountPaise - myShare : -myShare;
              const isDarkIcon = idx % 2 === 0;

              return (
                <div key={e.id} className="as-grp-expense-card">
                  <div className="as-grp-expense-left">
                    <div className={`as-grp-expense-icon-square ${isDarkIcon ? "dark" : "light"}`}>
                      {e.description.toLowerCase().includes("dinner") || e.description.toLowerCase().includes("food") ? "🍽" :
                       e.description.toLowerCase().includes("fuel") || e.description.toLowerCase().includes("scooter") ? "🛵" : "🛍"}
                    </div>
                    <div>
                      <div className="as-grp-expense-title-row">
                        <span className="as-grp-expense-title">{e.description}</span>
                        {e.voice && (
                          <span className="as-grp-voice-tag">
                            <span>✨</span>
                            <span>Added by voice</span>
                          </span>
                        )}
                      </div>
                      <div className="as-grp-expense-sub">
                        Paid by {getMemberName(e.paidBy)}
                      </div>
                    </div>
                  </div>

                  <div className="as-grp-expense-right-wrap">
                    <div className="as-grp-expense-right">
                      <div className="as-grp-expense-amount">{fmt(e.amountPaise)}</div>
                      {netImpact > 0 ? (
                        <div className="as-grp-expense-share-get">You get {fmt(netImpact)}</div>
                      ) : netImpact < 0 ? (
                        <div className="as-grp-expense-share-owe">You owe {fmt(Math.abs(netImpact))}</div>
                      ) : (
                        <div className="as-grp-expense-sub">Settled</div>
                      )}
                    </div>

                    <button
                      type="button"
                      className="as-grp-expense-delete-btn"
                      title="Delete expense"
                      aria-label={`Delete ${e.description}`}
                      onClick={() => setExpenseToDelete(e)}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Settled Payment rows */}
            {payments.map((p) => (
              <div key={p.id} className="as-grp-settled-card">
                <div className="as-grp-settled-left">
                  <div className="as-grp-settled-check-icon">✓</div>
                  <div>
                    <span className="as-grp-settled-text">
                      {getMemberName(p.from)} paid {getMemberName(p.to)} {fmt(p.amountPaise)}
                    </span>
                    <span className="as-grp-settled-pill" style={{ marginLeft: "10px" }}>
                      Settled payment
                    </span>
                  </div>
                </div>
                <div className="as-grp-settled-time">
                  {p.date || "Just now"}
                </div>
              </div>
            ))}

            {/* Natural Voice Hint Banner (Picture 1) */}
            <div className="as-grp-voice-hint-card">
              <div className="as-grp-hint-left">
                <div className="as-grp-hint-sound-circle">
                  🎙
                </div>
                <div>
                  <div className="as-grp-hint-tag">NATURAL VOICE HINT</div>
                  <div className="as-grp-hint-desc">
                    No expenses yet, tap the mic and say "Chai ke 120 maine diye, sabme baant do"
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="as-grp-btn-try-prompt"
                onClick={() => setMic(true)}
              >
                <span>🎙</span>
                <span>Try Prompt</span>
              </button>
            </div>
          </div>
        )}

        {/* ==================================================================
            TAB 2: BALANCES (Matches Picture 3)
            ================================================================== */}
        {tab === "Balances" && (
          <div>
            {/* Top Balances Overview Banner */}
            <div className="as-grp-balances-banner">
              <div>
                <div className="as-grp-bal-title-row">
                  <h3 className="as-grp-bal-banner-title">Group Balances</h3>
                  <span className="as-grp-bal-minimized-pill">
                    ⚡ Minimized settlements
                  </span>
                </div>
                <p className="as-grp-bal-banner-sub">
                  Simplified peer repayments calculated using optimal transfers
                </p>
              </div>

              <div className="as-grp-bal-banner-right">
                <div className="as-grp-voice-sync-badge">
                  <span className="as-grp-yellow-dot" />
                  <span>Voice sync active</span>
                </div>

                <button
                  type="button"
                  className="as-grp-btn-read-aloud"
                  onClick={handleReadAloud}
                >
                  <span>🔊</span>
                  <span>Read aloud</span>
                  <span className="as-grp-read-aloud-sub">(Listen to voice breakdown)</span>
                </button>
              </div>
            </div>

            {/* Two Column Grid */}
            <div className="as-grp-bal-columns">
              {/* Column 1: Who Owes Whom */}
              <div className="as-grp-bal-col">
                <div className="as-grp-col-header-row">
                  <div className="as-grp-col-heading">
                    <span className="as-grp-col-dot">●</span>
                    <span>Who owes whom</span>
                  </div>
                  <span className="as-grp-col-badge">
                    {transfers.length} optimal transfers
                  </span>
                </div>

                <div className="as-grp-card-block">
                  {transfers.length === 0 ? (
                    <p style={{ textAlign: "center", color: "#64748b", margin: "16px 0", fontSize: "13px" }}>
                      Sab settle hai 🎉 Koi transfer bacha nahi!
                    </p>
                  ) : (
                    transfers.map((t, idx) => {
                      const fromName = getMemberName(t.from);
                      const toName = getMemberName(t.to);
                      return (
                        <div key={idx} className="as-grp-transfer-row">
                          <div className="as-grp-transfer-left">
                            <div className="as-grp-avatar-pill-pair">
                              <span className="as-grp-member-badge">
                                {getMemberInitials(fromName)}
                              </span>
                              <span>{fromName}</span>
                              <span className="as-grp-arrow">→</span>
                              <span className="as-grp-member-badge dark">
                                {getMemberInitials(toName)}
                              </span>
                              <span>{toName}</span>
                            </div>
                          </div>
                          <div className="as-grp-transfer-amount">
                            {fmt(t.amountPaise)}
                          </div>
                        </div>
                      );
                    })
                  )}

                  <p className="as-grp-consolidated-note">
                    Consolidated algorithms reduce cross-transactions down to {transfers.length} simple repayments.
                  </p>
                </div>
              </div>

              {/* Column 2: Your Balances */}
              <div className="as-grp-bal-col">
                <div className="as-grp-col-header-row">
                  <div className="as-grp-col-heading">
                    <span className="as-grp-col-dot">●</span>
                    <span>Your balances</span>
                  </div>
                  <span className="as-grp-ledger-label">
                    Rahul Sharma's Ledger
                  </span>
                </div>

                <div className="as-grp-card-block">
                  {direct.length === 0 ? (
                    <p style={{ textAlign: "center", color: "#64748b", margin: "16px 0", fontSize: "13px" }}>
                      No direct member balances yet.
                    </p>
                  ) : (
                    direct.map((d) => {
                      const owesMe = d.amountPaise > 0;
                      const iOwe = d.amountPaise < 0;
                      const isSettled = d.amountPaise === 0;

                      return (
                        <div key={d.memberId} className="as-grp-your-balance-row">
                          <div className="as-grp-your-bal-left">
                            <span className="as-grp-member-badge dark">
                              {getMemberInitials(d.name)}
                            </span>
                            <div>
                              <div className="as-grp-your-name">{d.name}</div>
                              {owesMe && (
                                <div className="as-grp-your-sub green">
                                  {d.name} owes you {fmt(d.amountPaise)}
                                </div>
                              )}
                              {iOwe && (
                                <div className="as-grp-your-sub red">
                                  You owe {d.name} {fmt(Math.abs(d.amountPaise))}
                                </div>
                              )}
                              {isSettled && (
                                <div className="as-grp-your-sub gray">
                                  All settled with {d.name}
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            {!isSettled ? (
                              <button
                                type="button"
                                className="as-grp-btn-settle-pill"
                                disabled={busy}
                                onClick={() => handleSettle(d)}
                              >
                                Settle up
                              </button>
                            ) : (
                              <span className="as-grp-settled-check-pill">
                                <span>✓</span>
                                <span>Settled</span>
                                
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Condition from user: When ALL payments are settle up, only then show (sab settle hai, all balances are fully cleared) */}
            {allSettled && (
              <div className="as-grp-all-cleared-banner">
                <span>✓</span>
                <span className="sparkle">Sab settle hai ✨</span>
                <span>— all balances are fully cleared</span>
              </div>
            )}
          </div>
        )}

        {/* ==================================================================
            TAB 3: MEMBERS
            ================================================================== */}
        {tab === "Members" && (
          <div className="as-grp-card-block" style={{ padding: "20px 24px" }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "800" }}>Group Members</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
              {members.map((m) => (
                <div
                  key={m.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    background: "#f8fafc",
                    borderRadius: "12px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span className="as-grp-member-badge dark">{getMemberInitials(m.name)}</span>
                    <span style={{ fontWeight: 700, fontSize: "14px" }}>{m.name}</span>
                  </div>
                  <span style={{ fontSize: "12px", color: "#16a34a", fontWeight: 700 }}>
                    {m.linked ? "Linked member" : "Invited"}
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddMember} style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="Add member by name (e.g. Kabir)"
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "10px",
                  fontSize: "14px",
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
                  padding: "10px 20px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Add Member
              </button>
            </form>

            {/* Danger Zone: Delete Group Option */}
            <div className="as-grp-danger-zone">
              <div className="as-grp-danger-info">
                <span className="as-grp-danger-title">Delete Circle</span>
                <span className="as-grp-danger-desc">
                  Permanently delete this group and clear all related balances and expenses.
                </span>
              </div>
              <button
                type="button"
                className="as-grp-btn-delete-group"
                onClick={() => setIsDeleteGroupModalOpen(true)}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
                <span>Delete Group</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Floating Core Mic Button (Bottom Right) */}
      <button
        type="button"
        className="as-grp-floating-mic"
        onClick={() => setMic(true)}
        aria-label="Voice dictate expense"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
          <line x1="12" y1="19" x2="12" y2="23"/>
          <line x1="8" y1="23" x2="16" y2="23"/>
        </svg>
      </button>

      {/* Voice Sheet Modal */}
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

