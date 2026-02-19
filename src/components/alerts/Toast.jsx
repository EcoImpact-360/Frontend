import React, { useEffect } from "react";

export default function Toast({ type = "success", message, onClose, duration = 5000 }) {
  // Efecto para cerrar el toast automáticamente después de unos segundos
  useEffect(() => {
    if (message && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer); // Limpiar timer si el componente se desmonta
    }
  }, [message, onClose, duration]);

  if (!message) {
    return null;
  }

  // Si el backend envía un objeto de error de apiClient.js, extraemos el string del mensaje
  // Tu apiClient normaliza errores en: { message: "...", code: "..." }
  const displayMessage = typeof message === "object" ? (message.message || "Error inesperado") : message;

  const isError = type === "error";
  const background = isError ? "#FEE2E2" : "#DCFCE7";
  const color = isError ? "#991B1B" : "#166534";
  const border = isError ? "#FCA5A5" : "#86EFAC";
  const icon = isError ? "⚠️" : "✅";

  return (
    <div
      role={isError ? "alert" : "status"}
      aria-live={isError ? "assertive" : "polite"}
      style={{
        position: "fixed",
        top: "1.5rem",
        right: "1.5rem",
        zIndex: 1000, // Z-index muy alto para estar por encima de modales
      }}
    >
      <div
        style={{
          background,
          color,
          border: `1px solid ${border}`,
          borderRadius: "10px",
          padding: "0.75rem 1rem",
          minWidth: "280px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.18)",
          animation: "slideIn 0.3s ease-out", // Asumiendo que tienes esta animación en CSS
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span>{icon}</span>
          <span style={{ fontWeight: 500 }}>{displayMessage}</span>
        </div>
        
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar notificación"
          style={{
            background: "transparent",
            border: "none",
            color,
            fontSize: "1.25rem",
            cursor: "pointer",
            lineHeight: 1,
            padding: "0.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          &times;
        </button>
      </div>
    </div>
  );
}