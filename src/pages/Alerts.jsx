import React, { useEffect, useRef, useState } from "react";
import AlertCard from "../components/alerts/AlertCard";
import ResolveAlertModal from "../components/alerts/ResolveAlertModal";
import Toast from "../components/alerts/Toast";
import { getAlerts, resolveAlert } from "../services/alertsApi";

// Forzamos el uso de la API real
const USE_MOCK = false; 

export default function Alerts() {
  const [status, setStatus] = useState("loading");
  const [alerts, setAlerts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [reloadToken, setReloadToken] = useState(0);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [isResolving, setIsResolving] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimeoutRef = useRef(null);

  // Gestión de notificaciones (Toast)
  const showToast = (type, message) => {
    setToast({ type, message });
    if (toastTimeoutRef.current) window.clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = window.setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const handleCloseToast = () => {
    if (toastTimeoutRef.current) window.clearTimeout(toastTimeoutRef.current);
    setToast(null);
  };

  // Carga de datos desde el Backend
  useEffect(() => {
    let isActive = true;
    setStatus("loading");
    setErrorMessage("");

    getAlerts()
      .then((data) => {
        if (!isActive) return;
        if (!data || data.length === 0) {
          setAlerts([]);
          setStatus("empty");
        } else {
          setAlerts(data);
          setStatus("success");
        }
      })
      .catch((err) => {
        if (!isActive) return;
        setStatus("error");
        setErrorMessage(err?.message || "Error al conectar con el servidor.");
      });

    return () => { isActive = false; };
  }, [reloadToken]);

  const handleOpenResolve = (alert) => {
    setSelectedAlert(alert);
  };

  const handleConfirmResolve = async () => {
    if (!selectedAlert) return;
    setIsResolving(true);

    try {
      // 1. Llamada PATCH al backend
      await resolveAlert(selectedAlert.id);
      
      // 2. Refrescar la lista de alertas después de resolver
      const data = await getAlerts();
      setAlerts(data || []);
      setStatus(data?.length === 0 ? "empty" : "success");
      
      showToast("success", "Alerta resuelta correctamente.");
    } catch (err) {
      showToast("error", err?.message || "No se pudo completar la acción.");
    } finally {
      setIsResolving(false);
      setSelectedAlert(null);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "840px", margin: "0 auto" }}>
      <style>{`
        .alerts-btn { padding: 0.5rem 0.75rem; border-radius: 8px; border: 1px solid #D1D5DB; background: #FFFFFF; color: #111827; font-weight: 500; cursor: pointer; }
        .alerts-btn:hover { background: #F9FAFB; }
        .alerts-btn[disabled] { opacity: 0.6; cursor: not-allowed; }
      `}</style>

      <Toast type={toast?.type} message={toast?.message} onClose={handleCloseToast} />
      
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>Panel de Alertas</h1>
        <button className="alerts-btn" onClick={() => setReloadToken(t => t + 1)}>
          🔄 Actualizar
        </button>
      </header>

      {status === "loading" && <p>Cargando alertas desde el servidor...</p>}

      {status === "error" && (
        <div style={{ textAlign: "center", padding: "2rem", background: "#FEF2F2", borderRadius: "12px" }}>
          <p style={{ color: "#B91C1C" }}>{errorMessage}</p>
          <button type="button" className="alerts-btn" onClick={() => setReloadToken(t => t + 1)}>
            Reintentar conexión
          </button>
        </div>
      )}

      {status === "empty" && (
        <div style={{ textAlign: "center", padding: "3rem", color: "#6B7280" }}>
          <p>✅ No hay alertas pendientes de resolución.</p>
        </div>
      )}

      {status === "success" && (
        <div>
          {alerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              disabled={isResolving}
              onResolve={handleOpenResolve}
            />
          ))}
        </div>
      )}

      <ResolveAlertModal
        open={Boolean(selectedAlert)}
        alert={selectedAlert} // Pasamos el objeto completo para que el modal use el ID
        loading={isResolving}
        onClose={() => !isResolving && setSelectedAlert(null)}
        onConfirm={handleConfirmResolve}
      />
    </div>
  );
}