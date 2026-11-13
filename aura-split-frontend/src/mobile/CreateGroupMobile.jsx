import React, { useState } from "react";
import "./CreateGroupMobile.css";

export default function CreateGroupMobile({ isOpen, onClose, onCreate }) {
  const [name, setName] = useState("Goa Trip 🌴");
  const [currency, setCurrency] = useState("INR (₹)");
  const [category, setCategory] = useState("Trip & Leisure");
  const [members, setMembers] = useState([
    { id: "1", name: "Paloma Rao", avatar: "P", color: "peach" },
    { id: "2", name: "Priya Patel", avatar: "P", color: "purple" },
    { id: "3", name: "Tanvi Shah", avatar: "T", color: "blue" },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [inviteEnabled, setInviteEnabled] = useState(true);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!isOpen) return null;

  const handleAddMember = (e) => {
    if (e) e.preventDefault();
    const trimmed = inputVal.trim();
    if (!trimmed) return;
    const colors = ["peach", "purple", "blue", "gray"];
    const randomColor = colors[members.length % colors.length];
    setMembers((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        name: trimmed,
        avatar: trimmed.charAt(0).toUpperCase() || "M",
        color: randomColor,
      },
    ]);
    setInputVal("");
  };

  const handleRemoveMember = (id) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText("aurasplit.io/invite/goa-2024");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setBusy(true);
    try {
      const memberNames = members.map((m) => m.name);
      await onCreate(name, memberNames);
      onClose();
    } catch (err) {
      console.error("Failed to create group:", err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="as-cgm-mob-overlay">
      <div className="as-cgm-mob-container">
        {/* 1. Mobile Top Navigation Bar */}
        <div className="as-cgm-mob-topbar">
          <button
            type="button"
            className="as-cgm-mob-back-btn"
            onClick={onClose}
            aria-label="Back"
          >
            ←
          </button>
          <h2 className="as-cgm-mob-title">Create Group</h2>
          <div className="as-cgm-mob-user-avatar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        </div>

        {/* 2. Header Badges */}
        <div className="as-cgm-mob-badge-row">
          <span className="as-cgm-mob-pool-tag">
            <span>💼</span>
            <span>SHARED POOL</span>
          </span>
          <span className="as-cgm-mob-instant-active-tag">
            + Instant Split Active
          </span>
        </div>

        {/* 3. Group Name Card */}
        <div className="as-cgm-mob-card">
          <div className="as-cgm-mob-name-row">
            <div className="as-cgm-mob-emoji-box">
              🌴
            </div>
            <div className="as-cgm-mob-name-inputs">
              <div className="as-cgm-mob-field-lbl">Group Name</div>
              <input
                type="text"
                className="as-cgm-mob-text-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Goa Trip 🌴"
              />
            </div>
          </div>
        </div>

        {/* 4. Two-Column Dropdowns: Base Currency & Expense Category (as Desktop) */}
        <div className="as-cgm-mob-two-col">
          {/* Base Currency */}
          <div className="as-cgm-mob-card as-cgm-mob-select-card">
            <div className="as-cgm-mob-select-head">
              <div className="as-cgm-mob-select-icon curr">₹</div>
              <span className="as-cgm-mob-caret">⌄</span>
            </div>
            <div className="as-cgm-mob-select-lbl">Base Currency</div>
            <div className="as-cgm-mob-select-val">{currency}</div>
            <select
              className="as-cgm-mob-native-select"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              aria-label="Select base currency"
            >
              <option value="INR (₹)">INR (₹)</option>
              <option value="USD ($)">USD ($)</option>
              <option value="EUR (€)">EUR (€)</option>
              <option value="GBP (£)">GBP (£)</option>
            </select>
          </div>

          {/* Expense Category */}
          <div className="as-cgm-mob-card as-cgm-mob-select-card">
            <div className="as-cgm-mob-select-head">
              <div className="as-cgm-mob-select-icon cat">🛫</div>
              <span className="as-cgm-mob-caret">⌄</span>
            </div>
            <div className="as-cgm-mob-select-lbl">Expense Category</div>
            <div className="as-cgm-mob-select-val">{category}</div>
            <select
              className="as-cgm-mob-native-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Select expense category"
            >
              <option value="Trip & Leisure">Trip & Leisure</option>
              <option value="Home & Rent">Home & Rent</option>
              <option value="Food & Dining">Food & Dining</option>
              <option value="Party & Events">Party & Events</option>
              <option value="Project & Work">Project & Work</option>
            </select>
          </div>
        </div>

        {/* 5. Members Section Card */}
        <div className="as-cgm-mob-card">
          <div className="as-cgm-mob-members-head">
            <div className="as-cgm-mob-members-title-row">
              <h3 className="as-cgm-mob-members-heading">Members</h3>
              <span className="as-cgm-mob-count-badge">{members.length + 1}</span>
            </div>
            <div className="as-cgm-mob-instant-tag">
              <span>⚡</span>
              <span>Instant Split</span>
            </div>
          </div>

          {/* Search/Add Input Bar */}
          <form onSubmit={handleAddMember} className="as-cgm-mob-add-bar">
            <span style={{ fontSize: "16px", color: "#64748b", marginRight: "4px" }}>👤</span>
            <input
              type="text"
              className="as-cgm-mob-add-input"
              placeholder="Type friend's name or UPI..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
            />
            <button type="submit" className="as-cgm-mob-add-btn">
              + Add
            </button>
          </form>

          <div className="as-cgm-mob-active-label">Active in this group</div>

          {/* Active Chips */}
          <div className="as-cgm-mob-chips-wrap">
            {/* You Chip */}
            <div className="as-cgm-mob-chip-you">
              <div className="as-cgm-mob-avatar-circle" style={{ background: "#ffffff", color: "#0f172a" }}>
                R
              </div>
              <span>Rahul (You)</span>
              <span className="as-cgm-mob-chip-you-dot">●</span>
            </div>

            {/* Other Members */}
            {members.map((m) => (
              <div key={m.id} className={`as-cgm-mob-chip-member ${m.color || "peach"}`}>
                <div className="as-cgm-mob-avatar-circle">
                  {m.avatar}
                </div>
                <span className="as-cgm-mob-chip-name">{m.name}</span>
                <button
                  type="button"
                  className="as-cgm-mob-chip-del"
                  onClick={() => handleRemoveMember(m.id)}
                  title={`Remove ${m.name}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Invite Link Access Card (Responsive, no text collision) */}
        <div className="as-cgm-mob-card as-cgm-mob-invite-card">
          <div className="as-cgm-mob-invite-top">
            <div className="as-cgm-mob-invite-left">
              <div className="as-cgm-mob-invite-icon">🔗</div>
              <div>
                <div className="as-cgm-mob-invite-title">Invite Link Access</div>
                <div className="as-cgm-mob-invite-sub">Anyone with this link can join</div>
              </div>
            </div>

            <button
              type="button"
              className={`as-cgm-mob-toggle ${inviteEnabled ? "" : "off"}`}
              onClick={() => setInviteEnabled(!inviteEnabled)}
              aria-label="Toggle invite link"
            >
              <div className="as-cgm-mob-toggle-knob" />
            </button>
          </div>

          <div className="as-cgm-mob-invite-url-row">
            <span className="as-cgm-mob-invite-url">aurasplit.io/invite/goa-2024</span>
            <button
              type="button"
              className="as-cgm-mob-btn-copy"
              onClick={handleCopyLink}
            >
              <span>⎘</span>
              <span>{copied ? "Copied!" : "Copy Link"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 7. Bottom Fixed Action Row */}
      <div className="as-cgm-mob-bottom-actions-wrap">
        <div className="as-cgm-mob-bottom-actions">
          <button
            type="button"
            className="as-cgm-mob-btn-cancel"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="button"
            className="as-cgm-mob-btn-create"
            disabled={busy || !name.trim()}
            onClick={handleSubmit}
          >
            <span>👥+</span>
            <span>Create Group</span>
          </button>
        </div>
      </div>
    </div>
  );
}
