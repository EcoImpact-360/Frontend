import React from "react";
import AlertBadge from "./AlertBadge";

export default function AlertCard({ alert, onResolve, disabled, resolved }) {
  const isResolved = Boolean(resolved ?? alert.resolved);
  const statusLabel = isResolved ? "Resuelta" : "Pendiente";

  return (
    <article
      style={{
        background: "#fff",
        border: "1px solid #E5E7EB",
        borderRadius: "12px",
        marginBottom: "1rem",
        padding: "1rem",
      }}
    >
      <header
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "0.5rem",
        }}
      >
        <h2 style={{ fontSize: "1rem", margin: 0 }}>{alert.title}</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>
            {statusLabel}
          </span>
          <AlertBadge severity={alert.severity} />
        </div>
      </header>

      <p style={{ color: "#374151", margin: "0 0 0.5rem 0" }}>{alert.message}</p>

      <small style={{ color: "#6B7280" }}>{alert.createdAt}</small>

      {!isResolved && (
        <div style={{ marginTop: "0.75rem" }}>
          <button
            type="button"
            className="alerts-btn"
            onClick={() => onResolve && onResolve(alert)}
            disabled={disabled}
          >
            Resolver
          </button>
        </div>
      )}
    </article>
  );
}
