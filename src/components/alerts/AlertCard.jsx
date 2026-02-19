import React from "react";
import AlertBadge from "./AlertBadge";

export default function AlertCard({ alert }) {
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
        <AlertBadge severity={alert.severity} />
      </header>

      <p style={{ color: "#374151", margin: "0 0 0.5rem 0" }}>{alert.message}</p>

      <small style={{ color: "#6B7280" }}>{alert.createdAt}</small>
    </article>
  );
}
