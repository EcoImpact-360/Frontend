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
      <h1 style={{ marginTop: 0 }}>Alerts</h1>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        <button type="button" onClick={() => setScenario("success")}>
          Simular exito
        </button>
        <button type="button" onClick={() => setScenario("empty")}>
          Simular vacio
        </button>
        <button type="button" onClick={() => setScenario("error")}>
          Simular error
        </button>
      </div>

      {status === "loading" && <p>Cargando alertas...</p>}

      {status === "error" && (
        <div>
          <p style={{ color: "#B91C1C" }}>{errorMessage}</p>
          <button type="button" onClick={() => setReloadToken((value) => value + 1)}>
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