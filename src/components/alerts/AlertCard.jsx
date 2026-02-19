import React, { useState } from 'react';
import AlertBadge from './AlertBadge';

export default function AlertCard({ alert, onResolve, disabled }) {
  const isResolved = Boolean(alert.resolved);
  const statusLabel = isResolved ? 'Resuelta' : 'Pendiente';
  const [isResolving, setIsResolving] = useState(false);

  const handleResolveClick = async () => {
    if (!onResolve) return;

    setIsResolving(true);
    try {
      await onResolve(alert);
    } catch (error) {
      console.error('Error en la interfaz al resolver:', error);
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <article className={`alert-card${isResolved ? ' alert-card--resolved' : ''}`}>
      <header className="alert-card__header">
        <h2 className="alert-card__title">{alert.title}</h2>
        <div className="alert-card__meta">
          <span className="alert-card__status">{statusLabel}</span>
          <AlertBadge severity={alert.severity} />
        </div>
      </header>

      <p className="alert-card__message">{alert.message}</p>

      <small className="alert-card__date">
        {alert.createdAt ? new Date(alert.createdAt).toLocaleString() : 'Fecha no disponible'}
      </small>

      {!isResolved && (
        <div className="alert-card__action">
          <button
            type="button"
            className="alerts-btn"
            onClick={handleResolveClick}
            disabled={disabled || isResolving || !alert.id}
          >
            {isResolving ? 'Procesando...' : 'Resolver'}
          </button>
        </div>
      )}
    </article>
  );
}
