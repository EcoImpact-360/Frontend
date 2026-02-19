import React from 'react';

const BADGE_STYLES = {
  low: { background: '#E8F5E9', color: '#2E7D32', label: 'Baja', icon: 'i' },
  LOW: { background: '#E8F5E9', color: '#2E7D32', label: 'Baja', icon: 'i' },
  medium: { background: '#FFF8E1', color: '#9A6B00', label: 'Media', icon: '!' },
  MEDIUM: { background: '#FFF8E1', color: '#9A6B00', label: 'Media', icon: '!' },
  high: { background: '#FFEBEE', color: '#D32F2F', label: 'Alta', icon: '!' },
  HIGH: { background: '#FFEBEE', color: '#D32F2F', label: 'Alta', icon: '!' },
  default: { background: '#EDF2F7', color: '#374151', label: 'Normal', icon: '-' },
};

export default function AlertBadge({ severity }) {
  const tone = BADGE_STYLES[severity] || BADGE_STYLES.default;

  return (
    <span className="alert-badge" style={{ backgroundColor: tone.background, color: tone.color }}>
      <span>{tone.icon}</span>
      <span>{tone.label}</span>
    </span>
  );
}
