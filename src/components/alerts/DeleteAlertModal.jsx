import React, { useEffect, useRef } from 'react';
export default function DeleteAlertModal({ open, alert, onConfirm, onClose, loading }) {
  const cancelRef = useRef(null);
  const confirmRef = useRef(null);
  useEffect(() => {
    if (open && cancelRef.current) {
      cancelRef.current.focus();
    }
  }, [open]);
  if (!open || !alert) {
    return null;
  }
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };
  return (
    <div onClick={loading ? undefined : onClose} role="presentation" className="modal-overlay">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Confirmar eliminacion de alerta"
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        onClick={(event) => event.stopPropagation()}
        className="surface-card modal-card"
      >
        <h2 className="modal-title">Eliminar alerta</h2>
        <p className="modal-copy">
          Estas seguro de que deseas eliminar la alerta <strong>"{alert.title}"</strong>? Esta accion no se puede deshacer.
        </p>
        <div className="modal-actions">
          <button type="button" className="alerts-btn-secondary" onClick={onClose} disabled={loading} ref={cancelRef}>
            Cancelar
          </button>
          <button
            type="button"
            className="alerts-btn alerts-btn--danger"
            onClick={() => onConfirm(alert.id)}
            disabled={loading}
            ref={confirmRef}
          >
            {loading ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}
