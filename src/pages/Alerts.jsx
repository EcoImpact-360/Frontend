import React, { useEffect, useRef, useState } from 'react';
import AlertCard from '../components/alerts/AlertCard';
import ResolveAlertModal from '../components/alerts/ResolveAlertModal';
import Toast from '../components/alerts/Toast';
import { getAlerts, resolveAlert } from '../services/alertsApi';

export default function Alerts() {
  const [status, setStatus] = useState('loading');
  const [alerts, setAlerts] = useState([
    {
      "id": "a1",
      "title": "Consumo fuera de rango",
      "message": "El consumo energetico supero el umbral esperado esta manana.",
      "severity": "high",
      "createdAt": "Hoy, 08:45",
      "resolved": false
    },
    {
      "id": "a2",
      "title": "Recordatorio de mantenimiento",
      "message": "Se acerca la fecha de revision preventiva del sistema HVAC.",
      "severity": "medium",
      "createdAt": "Ayer, 17:10",
      "resolved": false
    },
    {
      "id": "a3",
      "title": "Meta semanal cumplida",
      "message": "La sede Norte alcanzo su objetivo de reduccion de emisiones.",
      "severity": "low",
      "createdAt": "Ayer, 13:22",
      "resolved": false
    }
  ]);
  const [errorMessage, setErrorMessage] = useState('');
  const [reloadToken, setReloadToken] = useState(0);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [isResolving, setIsResolving] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimeoutRef = useRef(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = window.setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const handleCloseToast = () => {
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    setToast(null);
  };

  useEffect(() => {
    let isActive = true;
    setStatus('loading');
    setErrorMessage('');

    getAlerts()
      .then((data) => {
        if (!isActive) return;

        if (!data || data.length === 0) {
          setAlerts([]);
          setStatus('empty');
        } else {
          setAlerts(data);
          setStatus('success');
        }
      })
      .catch((err) => {
        if (!isActive) return;
        setStatus('error');
        setErrorMessage(err?.message || 'Error al conectar con el servidor.');
      });

    return () => {
      isActive = false;
    };
  }, [reloadToken]);

  const handleOpenResolve = (alert) => {
    setSelectedAlert(alert);
  };

  const handleConfirmResolve = async () => {
    if (!selectedAlert) return;

    setIsResolving(true);
    try {
      await resolveAlert(selectedAlert.id);

      const data = await getAlerts();
      setAlerts(data || []);
      setStatus(data?.length === 0 ? 'empty' : 'success');

      showToast('success', 'Alerta resuelta correctamente.');
    } catch (err) {
      showToast('error', err?.message || 'No se pudo completar la acción.');
    } finally {
      setIsResolving(false);
      setSelectedAlert(null);
    }
  };

  return (
    <main className="page-shell page-shell--narrow">
      <Toast type={toast?.type} message={toast?.message} onClose={handleCloseToast} />

      <header className="page-header">
        <h1 className="page-title">Panel de Alertas</h1>
        <button className="alerts-btn" onClick={() => setReloadToken((t) => t + 1)}>
          Actualizar
        </button>
      </header>

      {status === 'loading' && <div className="alerts-state">Cargando alertas desde el servidor...</div>}

      {status === 'error' && (
        <div className="alerts-state alerts-state--error">
          <p>{errorMessage}</p>
          <button type="button" className="alerts-btn" onClick={() => setReloadToken((t) => t + 1)}>
            Reintentar conexión
          </button>
        </div>
      )}

      {status === 'empty' && (
        <div className="alerts-state alerts-state--empty">
          <p>No hay alertas pendientes de resolución.</p>
        </div>
      )}

      {status === 'success' && (
        <section className="alerts-list">
          {alerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} disabled={isResolving} onResolve={handleOpenResolve} />
          ))}
        </section>
      )}

      <ResolveAlertModal
        open={Boolean(selectedAlert)}
        alert={selectedAlert}
        loading={isResolving}
        onClose={() => !isResolving && setSelectedAlert(null)}
        onConfirm={handleConfirmResolve}
      />
    </main>
  );
}
