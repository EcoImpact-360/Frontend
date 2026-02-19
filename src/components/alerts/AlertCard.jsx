import React, { useState } from "react";
import AlertBadge from "./AlertBadge";

export default function AlertCard({ alert, onResolve, disabled }) {
  // El backend usa el campo 'resolved' (boolean)
  const isResolved = Boolean(alert.resolved);
  const statusLabel = isResolved ? "Resuelta" : "Pendiente";
  
  // Estado local para mostrar feedback mientras se llama a la API
  const [isResolving, setIsResolving] = useState(false);

  const handleResolveClick = async () => {
    if (!onResolve) return;
    
    setIsResolving(true);
    try {
      // Pasamos el ID al padre para que ejecute alertsApi.resolveAlert(id)
      await onResolve(alert.id);
    } catch (error) {
      console.error("Error en la interfaz al resolver:", error);
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <article
      style={{
        background: "#fff",
        border: "1px solid #E5E7EB",
        borderRadius: "12px",
        marginBottom: "1rem",
        padding: "1rem",
        opacity: isResolved ? 0.7 : 1, // Visualmente más claro si está resuelta
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

      {/* El backend suele enviar 'createdAt' en formato ISO o string */}
      <small style={{ color: "#6B7280" }}>
        {alert.createdAt ? new Date(alert.createdAt).toLocaleString() : "Fecha no disponible"}
      </small>

      {!isResolved && (
        <div style={{ marginTop: "0.75rem" }}>
          <button
            type="button"
            className="alerts-btn"
            onClick={handleResolveClick}
            // Se deshabilita si ya se está resolviendo, si viene deshabilitado por prop, o si no hay ID
            disabled={disabled || isResolving || !alert.id}
          >
            {isResolving ? "Procesando..." : "Resolver"}
          </button>
        </div>
      )}
    </article>
  );
}