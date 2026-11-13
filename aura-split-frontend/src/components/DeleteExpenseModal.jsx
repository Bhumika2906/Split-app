import React, { useEffect } from "react";
import { fmt } from "../api";
import "./DeleteExpenseModal.css";

export default function DeleteExpenseModal({
  isOpen,
  expense,
  payerName = "You",
  isDeleting = false,
  onConfirm,
  onCancel,
}) {
  // Close on Escape key
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

  if (!isOpen || !expense) return null;

  return (
    <div
      className="as-del-modal-overlay"
      onClick={() => {
        if (!isDeleting) onCancel();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="as-del-title"
    >
      <div
        className="as-del-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="as-del-modal-top">
          <div className="as-del-icon-circle">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </div>

          <button
            type="button"
            className="as-del-close-btn"
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

        <div className="as-del-text-block">
          <h3 id="as-del-title" className="as-del-title">
            Delete Expense?
          </h3>
          <p className="as-del-desc">
            Are you sure you want to delete this expense? This will recalculate everyone's balances and cannot be undone.
          </p>
        </div>

        {/* Expense Info Preview Box */}
        <div className="as-del-preview-box">
          <div className="as-del-preview-left">
            <span className="as-del-preview-name">{expense.description}</span>
            <span className="as-del-preview-sub">Paid by {payerName}</span>
          </div>
          <span className="as-del-preview-amount">{fmt(expense.amountPaise)}</span>
        </div>

        {/* Modal Buttons */}
        <div className="as-del-actions-row">
          <button
            type="button"
            className="as-del-btn-cancel"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="as-del-btn-confirm"
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
                <span>Delete Expense</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

