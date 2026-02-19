import React from "react";

export default function Toast({ type = "success", message, onClose }) {
  if (!message) {
    return null;
  }

  const isError = type === "error";
  const background = isError ? "#FEE2E2" : "#DCFCE7";
  const color = isError ? "#991B1B" : "#166534";
  const border = isError ? "#FCA5A5" : "#86EFAC";

  return (
    <div
      role={isError ? "alert" : "status"}
      aria-live={isError ? "assertive" : "polite"}
      style={{
        position: "fixed",
        top: "1.5rem",
        right: "1.5rem",
        zIndex: 60,
      }}
    >
      <div
        style={{
          background,
          color,
          border: `1px solid ${border}`,
          borderRadius: "10px",
          padding: "0.75rem 1rem",
          minWidth: "240px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.18)",
        }}
      >
        <span>{message}</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar notificacion"
          style={{
            background: "transparent",
            border: "none",
            color,
            fontSize: "1.25rem",
            cursor: "pointer",
            lineHeight: 1,
          }}
        >
          x
        </button>
      </div>
    </div>
  );
}
