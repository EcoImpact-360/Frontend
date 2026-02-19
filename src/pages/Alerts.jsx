import React, { useEffect, useState } from "react";
import AlertCard from "../components/alerts/AlertCard";

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

  useEffect(() => {
    setStatus("loading");
    setErrorMessage("");

    const timerId = window.setTimeout(() => {
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

    return () => window.clearTimeout(timerId);
  }, [scenario, reloadToken]);

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
      <h1 style={{ marginTop: 0 }}>Alerts</h1>

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
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      )}
    </div>
  );
}
