import React, { useEffect } from 'react';

export default function Toast({ type = 'success', message, onClose, duration = 5000 }) {
  useEffect(() => {
    if (message && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, onClose, duration]);

  if (!message) {
    return null;
  }

  const displayMessage = typeof message === 'object' ? (message.message || 'Error inesperado') : message;
  const isError = type === 'error';

  return (
    <div role={isError ? 'alert' : 'status'} aria-live={isError ? 'assertive' : 'polite'} className="toast-wrapper">
      <div className={`toast ${isError ? 'toast--error' : 'toast--success'}`}>
        <div className="toast__content">
          <span>{isError ? '!' : 'OK'}</span>
          <span style={{ fontWeight: 500 }}>{displayMessage}</span>
        </div>

        <button type="button" onClick={onClose} aria-label="Cerrar notificacion" className="toast__close">
          &times;
        </button>
      </div>
    </div>
  );
}
