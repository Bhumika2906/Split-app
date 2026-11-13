import React, { useState } from "react";
import "./CreateGroupModal.css";

export default function CreateGroupModal({ isOpen, onClose, onCreate }) {
  const [name, setName] = useState("Goa Trip 🌴");
  const [currency, setCurrency] = useState("INR (₹)");
  const [category, setCategory] = useState("Trip & Leisure");
  const [members, setMembers] = useState([
    { id: "1", name: "Paloma Rao", avatar: "P" },
    { id: "2", name: "Priya Patel", avatar: "P" },
    { id: "3", name: "Tanvi Shah", avatar: "T" },
    { id: "4", name: "Rohit Verma", avatar: "R" },
  ]);
  const [newMemberText, setNewMemberText] = useState("");
  const [inviteEnabled, setInviteEnabled] = useState(true);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!isOpen) return null;

  const handleAddMember = (e) => {
    if (e) e.preventDefault();
    const trimmed = newMemberText.trim();
    if (!trimmed) return;
    setMembers((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        name: trimmed,
        avatar: trimmed.charAt(0).toUpperCase() || "M",
      },
    ]);
    setNewMemberText("");
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
      console.error("Create group failed:", err);
    } finally {
      setBusy(false);
    }
  };

  const quickIcons = ["🏕️", "🏖️", "🏠"];

  return (
    <div className="as-cgm-overlay" onClick={onClose}>
      <div className="as-cgm-card" onClick={(e) => e.stopPropagation()}>
        {/* Golden Accent Top Line */}
        <div className="as-cgm-accent-line" />

        {/* Close Button */}
        <button
          type="button"
          className="as-cgm-close-btn"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        {/* Top Badges */}
        <div className="as-cgm-badge-row">
          <span className="as-cgm-pill-tag">NEW CIRCLE</span>
          <span className="as-cgm-instant-split-label">+ Instant Split Active</span>
        </div>

        {/* Headings */}
        <h2 className="as-cgm-title">Create New Group</h2>
        <p className="as-cgm-subtitle">
          Start a shared circle for your trip, house, or project
        </p>

        {/* Group Name Field */}
        <div className="as-cgm-field-group">
          <label className="as-cgm-label">Group Name</label>
          <div className="as-cgm-input-wrap">
            <span style={{ fontSize: "17px", marginRight: "6px" }}>🌴</span>
            <input
              type="text"
              className="as-cgm-name-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Goa Trip 🌴"
              autoFocus
            />
            
          </div>
        </div>

        {/* Two-Column Dropdowns: Base Currency & Expense Category */}
        <div className="as-cgm-two-col">
          <div>
            <label className="as-cgm-label">Base Currency</label>
            <div className="as-cgm-select-box">
              <div className="as-cgm-select-left">
                <div className="as-cgm-currency-icon">₹</div>
                <span>{currency}</span>
              </div>
              <span className="as-cgm-caret">⌄</span>
            </div>
          </div>

          <div>
            <label className="as-cgm-label">Expense Category</label>
            <div className="as-cgm-select-box">
              <div className="as-cgm-select-left">
                <span style={{ fontSize: "14px" }}>🛫</span>
                <span>{category}</span>
              </div>
              <span className="as-cgm-caret">⌄</span>
            </div>
          </div>
        </div>

        {/* Add Members Section */}
        <div className="as-cgm-field-group">
          <div className="as-cgm-members-head">
            <label className="as-cgm-label" style={{ margin: 0 }}>Add Members</label>
            <span className="as-cgm-members-count">{members.length + 1} friends added</span>
          </div>

          <form onSubmit={handleAddMember} className="as-cgm-add-input-bar">
            <input
              type="text"
              className="as-cgm-member-input"
              placeholder="Enter name or mobile number..."
              value={newMemberText}
              onChange={(e) => setNewMemberText(e.target.value)}
            />
            <button type="submit" className="as-cgm-btn-add">
              + Add
            </button>
          </form>

          {/* Members Tag Chips */}
          <div className="as-cgm-chips-row">
            {/* User (You) Chip */}
            <div className="as-cgm-chip-you">
              <div className="as-cgm-chip-you-avatar">R</div>
              <span>Rahul (You)</span>
              <span className="as-cgm-chip-lock">🔒</span>
            </div>

            {/* Other Members */}
            {members.map((m) => (
              <div key={m.id} className="as-cgm-chip">
                <div className="as-cgm-chip-avatar">{m.avatar}</div>
                <span>{m.name}</span>
                <button
                  type="button"
                  className="as-cgm-chip-remove"
                  onClick={() => handleRemoveMember(m.id)}
                  title={`Remove ${m.name}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Invite Link Access Box */}
        <div className="as-cgm-invite-card">
          <div className="as-cgm-invite-left">
            <div className="as-cgm-invite-icon">🔗</div>
            <div>
              <div className="as-cgm-invite-title">Invite Link Access</div>
              <div className="as-cgm-invite-url">aurasplit.io/invite/goa-2024</div>
            </div>
          </div>

          <div className="as-cgm-invite-right">
            <button
              type="button"
              className="as-cgm-btn-copy"
              onClick={handleCopyLink}
            >
              <span>⎘</span>
              <span>{copied ? "Copied!" : "Copy Link"}</span>
            </button>

            <button
              type="button"
              className={`as-cgm-toggle ${inviteEnabled ? "" : "off"}`}
              onClick={() => setInviteEnabled(!inviteEnabled)}
              aria-label="Toggle invite link"
            >
              <div className="as-cgm-toggle-knob" />
            </button>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="as-cgm-footer">
          <button
            type="button"
            className="as-cgm-btn-cancel"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="button"
            className="as-cgm-btn-create"
            disabled={busy || !name.trim()}
            onClick={handleSubmit}
          >
            <span>Create Group</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

