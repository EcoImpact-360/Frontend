import React, { useEffect, useRef } from 'react';

export default function ResolveAlertModal({
  open,
  alert,
  onConfirm,
  onClose,
  loading,
}) {
  const cancelRef = useRef(null);
  const confirmRef = useRef(null);

  useEffect(() => {
    if (open && confirmRef.current) {
      confirmRef.current.focus();
    }
  }, [open]);

  if (!open || !alert) {
    return null;
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      onClose();
      return;
    }

    if (event.key !== 'Tab') {
      return;
    }

    const cancelEl = cancelRef.current;
    const confirmEl = confirmRef.current;

    if (!cancelEl || !confirmEl) {
      return;
    }

    if (event.shiftKey) {
      if (document.activeElement === confirmEl) {
        event.preventDefault();
        cancelEl.focus();
      } else if (document.activeElement === cancelEl) {
        event.preventDefault();
        confirmEl.focus();
      }
      return;
    }

    if (document.activeElement === cancelEl) {
      event.preventDefault();
      confirmEl.focus();
    } else if (document.activeElement === confirmEl) {
      event.preventDefault();
      cancelEl.focus();
    }
  };

  return (
    <div onClick={onClose} role="presentation" className="modal-overlay">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Confirmar resolucion de alerta"
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        onClick={(event) => event.stopPropagation()}
        className="surface-card modal-card"
      >
        <h2 className="modal-title">Confirmar resolucion</h2>
        <p className="modal-copy">
          Estas seguro de que deseas marcar la alerta <strong>"{alert.title}"</strong> como resuelta?
        </p>

        <div className="modal-actions">
          <button
            type="button"
            className="alerts-btn-secondary"
            onClick={onClose}
            disabled={loading}
            ref={cancelRef}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="alerts-btn"
            onClick={() => onConfirm(alert.id)}
            disabled={loading}
            ref={confirmRef}
          >
            {loading ? 'Resolviendo...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}
