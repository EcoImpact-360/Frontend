import React, { useEffect, useRef } from "react";

export default function ResolveAlertModal({
  open,
  alert, // Recibimos el objeto alerta completo para tener acceso al id y title
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

  if (!open || !alert) {
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
        zIndex: 100, // Elevamos el z-index para asegurar que esté sobre todo
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Confirmar resolución de alerta"
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
        <h2 style={{ marginTop: 0, fontSize: "1.25rem" }}>Confirmar resolución</h2>
        <p style={{ color: "#374151", lineHeight: "1.5" }}>
          ¿Estás seguro de que deseas marcar la alerta <strong>"{alert.title}"</strong> como resuelta?
        </p>
        
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "1.5rem" }}>
          <button
            type="button"
            className="alerts-btn-secondary" // Usamos una clase secundaria si la tienes
            onClick={onClose}
            disabled={loading}
            ref={cancelRef}
            style={{ 
              padding: "0.5rem 1rem", 
              cursor: loading ? "not-allowed" : "pointer",
              borderRadius: "6px",
              border: "1px solid #D1D5DB",
              background: "white"
            }}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="alerts-btn"
            onClick={() => onConfirm(alert.id)} // Pasamos el ID directamente al confirmar
            disabled={loading}
            ref={confirmRef}
            style={{ 
              padding: "0.5rem 1rem", 
              cursor: loading ? "not-allowed" : "pointer",
              borderRadius: "6px",
              border: "none",
              background: "#10B981", // Un verde de éxito
              color: "white"
            }}
          >
            {loading ? "Resolviendo..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}