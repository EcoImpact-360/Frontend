import React from "react";

const BADGE_STYLES = {

  low: { background: "#E8F5E9", color: "#1B5E20", label: "Baja", icon: "ℹ️" },
  LOW: { background: "#E8F5E9", color: "#1B5E20", label: "Baja", icon: "ℹ️" },
  
  medium: { background: "#FFF8E1", color: "#E65100", label: "Media", icon: "🔶" },
  MEDIUM: { background: "#FFF8E1", color: "#E65100", label: "Media", icon: "🔶" },
  
  high: { background: "#FFEBEE", color: "#B71C1C", label: "Alta", icon: "⚠️" },
  HIGH: { background: "#FFEBEE", color: "#B71C1C", label: "Alta", icon: "⚠️" },
  

  default: { background: "#F3F4F6", color: "#374151", label: "Normal", icon: "🔔" }
};

export default function AlertBadge({ severity }) {

  const tone = BADGE_STYLES[severity] || BADGE_STYLES.default;

  return (
    <span
      style={{
        backgroundColor: tone.background,
        color: tone.color,
        borderRadius: "999px",
        fontSize: "0.75rem",
        fontWeight: 600,
        padding: "0.25rem 0.625rem",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.25rem"
      }}
    >
      <span>{tone.icon}</span>
      <span>{tone.label}</span>
    </span>
  );
}