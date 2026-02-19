import React from "react";

const BADGE_STYLES = {
  low: { background: "#E8F5E9", color: "#1B5E20", label: "Baja", icon: "ℹ️" },
  medium: { background: "#FFF8E1", color: "#E65100", label: "Media", icon: "🔶" },
  high: { background: "#FFEBEE", color: "#B71C1C", label: "Alta", icon: "⚠️" },
};

export default function AlertBadge({ severity }) {
  const tone = BADGE_STYLES[severity] || BADGE_STYLES.medium;

  return (
    <span
      style={{
        backgroundColor: tone.background,
        color: tone.color,
        borderRadius: "999px",
        fontSize: "0.75rem",
        fontWeight: 600,
        padding: "0.25rem 0.625rem",
      }}
    >
      {tone.icon} {tone.label}
    </span>
  );
}
