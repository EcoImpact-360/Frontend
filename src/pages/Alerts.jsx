import React, { useEffect, useRef, useState } from "react";
import AlertCard from "../components/alerts/AlertCard";
import ResolveAlertModal from "../components/alerts/ResolveAlertModal";
import Toast from "../components/alerts/Toast";
import { getAlerts, resolveAlert } from "../services/alertsApi";

const USE_MOCK = true;

const MOCK_ALERTS = [
  {
    id: "a1",
    title: "Consumo fuera de rango",
    message: "El consumo energetico supero el umbral esperado esta manana.",
    severity: "high",
    createdAt: "Hoy, 08:45",
  },
  {
    id: "a2",
    title: "Recordatorio de mantenimiento",
    message: "Se acerca la fecha de revision preventiva del sistema HVAC.",
    severity: "medium",
    createdAt: "Ayer, 17:10",
  },
  {
    id: "a3",
    title: "Meta semanal cumplida",
    message: "La sede Norte alcanzo su objetivo de reduccion de emisiones.",
    severity: "low",
    createdAt: "Ayer, 13:22",
  },
];

export default function Alerts() {
  const [status, setStatus] = useState("loading");
  const [alerts, setAlerts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [scenario, setScenario] = useState("success");
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
      toastTimeoutRef.current = null;
    }, 3500);
  };

  const handleCloseToast = () => {
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = null;
    }
    setToast(null);
  };

  useEffect(() => {
    let isActive = true;
    setStatus("loading");
    setErrorMessage("");

    if (USE_MOCK) {
      const timerId = window.setTimeout(() => {
        if (!isActive) {
          return;
        }

        if (scenario === "error") {
          setAlerts([]);
          setStatus("error");
          setErrorMessage("No fue posible cargar las alertas. Intenta nuevamente.");
          return;
        }

        if (scenario === "empty") {
          setAlerts([]);
          setStatus("empty");
          return;
        }

        setAlerts(MOCK_ALERTS);
        setStatus("success");
      }, 600);

      return () => {
        isActive = false;
        window.clearTimeout(timerId);
      };
    }

    getAlerts()
      .then((data) => {
        if (!isActive) {
          return;
        }

        if (!data || data.length === 0) {
          setAlerts([]);
          setStatus("empty");
          return;
        }

        setAlerts(data);
        setStatus("success");
      })
      .catch((err) => {
        if (!isActive) {
          return;
        }

        setAlerts([]);
        setStatus("error");
        setErrorMessage(err?.message || "No fue posible cargar las alertas.");
      });

    return () => {
      isActive = false;
    };
  }, [scenario, reloadToken]);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const handleOpenResolve = (alert) => {
    setSelectedAlert(alert);
  };

  const handleConfirmResolve = async () => {
    if (!selectedAlert) {
      return;
    }

    setIsResolving(true);

    try {
      if (USE_MOCK) {
        setAlerts((prev) =>
          prev.map((item) =>
            item.id === selectedAlert.id ? { ...item, resolved: true } : item
          )
        );
        showToast("success", "Alerta resuelta correctamente.");
      } else {
        await resolveAlert(selectedAlert.id);
        const data = await getAlerts();

        if (!data || data.length === 0) {
          setAlerts([]);
          setStatus("empty");
        } else {
          setAlerts(data);
          setStatus("success");
        }

        showToast("success", "Alerta resuelta correctamente.");
      }
    } catch (err) {
      showToast("error", err?.message || "No se pudo resolver la alerta.");
    } finally {
      setIsResolving(false);
      setSelectedAlert(null);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "840px", margin: "0 auto" }}>
      <style>{`
        .alerts-btn {
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          border: 1px solid #D1D5DB;
          background: #FFFFFF;
          color: #111827;
          font-weight: 500;
          cursor: pointer;
        }
        .alerts-btn:hover {
          background: #F9FAFB;
        }
        .alerts-btn:focus-visible {
          outline: 3px solid #111827;
          outline-offset: 2px;
        }
        .alerts-btn[disabled] {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
      <Toast type={toast?.type} message={toast?.message} onClose={handleCloseToast} />
      <h1 style={{ marginTop: 0 }}>Alerts</h1>

      {USE_MOCK && (
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            justifyContent: "center",
            marginBottom: "1.5rem",
          }}
        >
          <button type="button" className="alerts-btn" onClick={() => setScenario("success")}>
            Simular exito
          </button>
          <button type="button" className="alerts-btn" onClick={() => setScenario("empty")}>
            Simular vacio
          </button>
          <button type="button" className="alerts-btn" onClick={() => setScenario("error")}>
            Simular error
          </button>
        </div>
      )}

      {status === "loading" && <p>Cargando alertas...</p>}

      {status === "error" && (
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#B91C1C" }}>{errorMessage}</p>
          <button
            type="button"
            className="alerts-btn"
            onClick={() => setReloadToken((value) => value + 1)}
          >
            Reintentar
          </button>
        </div>
      )}

      {status === "empty" && <p>No hay alertas disponibles en este momento.</p>}

      {status === "success" && (
        <div>
          {alerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              resolved={alert.resolved}
              disabled={isResolving}
              onResolve={handleOpenResolve}
            />
          ))}
        </div>
      )}

      <ResolveAlertModal
        open={Boolean(selectedAlert)}
        alertTitle={selectedAlert?.title || "esta alerta"}
        loading={isResolving}
        onClose={() => {
          if (!isResolving) {
            setSelectedAlert(null);
          }
        }}
        onConfirm={handleConfirmResolve}
      />
    </div>
  );
}
