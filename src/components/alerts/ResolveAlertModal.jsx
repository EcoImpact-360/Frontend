import React, { useEffect, useRef } from "react";

export default function ResolveAlertModal({
  open,
  alertTitle,
  onConfirm,
  onClose,
  loading,
}) {
  const cancelRef = useRef(null);
  const confirmRef = useRef(null);

  useEffect(() => {
    if (open && confirmRef.current) {
      confirmRef.current.focus();
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      onClose();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const cancelEl = cancelRef.current;
    const confirmEl = confirmRef.current;

    if (!cancelEl || !confirmEl) {
      return;
    }

    if (event.shiftKey) {
      if (document.activeElement === confirmEl) {
        event.preventDefault();
        cancelEl.focus();
      } else if (document.activeElement === cancelEl) {
        event.preventDefault();
        confirmEl.focus();
      }
      return;
    }

    if (document.activeElement === cancelEl) {
      event.preventDefault();
      confirmEl.focus();
    } else if (document.activeElement === confirmEl) {
      event.preventDefault();
      cancelEl.focus();
    }
  };

  return (
    <div
      onClick={onClose}
      role="presentation"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        zIndex: 50,
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Resolver alerta"
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        onClick={(event) => event.stopPropagation()}
        style={{
          background: "#FFFFFF",
          borderRadius: "12px",
          padding: "1.5rem",
          maxWidth: "420px",
          width: "100%",
          boxShadow: "0 16px 40px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Confirmar resolucion</h2>
        <p style={{ color: "#374151" }}>
          Resolver la alerta "{alertTitle}"?
        </p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <button
            type="button"
            className="alerts-btn"
            onClick={onClose}
            disabled={loading}
            ref={cancelRef}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="alerts-btn"
            onClick={onConfirm}
            disabled={loading}
            ref={confirmRef}
          >
            {loading ? "Resolviendo..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}
