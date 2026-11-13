import React, { useEffect } from "react";
import "./DeleteGroupModal.css";

export default function DeleteGroupModal({
  isOpen,
  group,
  isDeleting = false,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !isDeleting) {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isDeleting, onCancel]);

  if (!isOpen || !group) return null;

  const expenseCount = group.expenses?.length || 0;
  const memberCount = group.members?.length || 0;

  return (
    <div
      className="as-del-grp-overlay"
      onClick={() => {
        if (!isDeleting) onCancel();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="as-del-grp-title"
    >
      <div
        className="as-del-grp-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="as-del-grp-top">
          <div className="as-del-grp-icon-circle">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </div>

          <button
            type="button"
            className="as-del-grp-close-btn"
            onClick={onCancel}
            disabled={isDeleting}
            aria-label="Close dialog"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="as-del-grp-text-block">
          <h3 id="as-del-grp-title" className="as-del-grp-title">
            Delete Group?
          </h3>
          <p className="as-del-grp-desc">
            Are you sure you want to delete <b>{group.name}</b>? All expenses, payments, and member ledgers in this circle will be permanently erased.
          </p>
        </div>

        {/* Group Preview Box */}
        <div className="as-del-grp-preview-box">
          <div>
            <div className="as-del-grp-preview-name">{group.name}</div>
            <div className="as-del-grp-preview-sub">
              {memberCount} {memberCount === 1 ? "member" : "members"} • {expenseCount} {expenseCount === 1 ? "expense" : "expenses"}
            </div>
          </div>
          <span className="as-del-grp-preview-badge">Permanent</span>
        </div>

        {/* Warning Callout */}
        <div className="as-del-grp-warning-banner">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <span>This action cannot be reversed. Everyone will lose access to this group.</span>
        </div>

        {/* Actions */}
        <div className="as-del-grp-actions">
          <button
            type="button"
            className="as-del-grp-btn-cancel"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="as-del-grp-btn-confirm"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <span>Deleting...</span>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                <span>Delete Group</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

