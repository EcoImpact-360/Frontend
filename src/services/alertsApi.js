import { request } from "./apiClient";
const ALERT_TYPE_META = {
  THRESHOLD_EXCEEDED: {
    title: "Umbral de residuos superado",
    severity: "high",
  },
  HIGH_CO2: {
    title: "Impacto de CO2 elevado",
    severity: "high",
  },
  NO_DATA_REGISTERED: {
    title: "Sin datos registrados",
    severity: "medium",
  },
};
function toUiAlert(raw) {
  const meta = ALERT_TYPE_META[raw.alertType] || { title: "Alerta", severity: "medium" };
  const kgLabel = typeof raw.totalKg === "number" ? `${raw.totalKg} kg` : null;
  return {
    id: raw.id,
    title: raw.title || meta.title,
    message: raw.message || [raw.wasteTypeName, kgLabel].filter(Boolean).join(" — ") || meta.title,
    severity: meta.severity,
    category: raw.wasteTypeName || null,
    location: raw.classroomName || null,
    assignedTo: null,
    createdAt: raw.createdAt,
    resolved: Boolean(raw.resolved),
    classroomId: raw.classroomId,
    wasteTypeId: raw.wasteTypeId,
    alertType: raw.alertType,
    totalKg: raw.totalKg,
  };
}
export async function getAlerts() {
  const data = await request("/alerts/history", { method: "GET" });
  return Array.isArray(data) ? data.map(toUiAlert) : [];
}
export async function resolveAlert(id) {
  await request(`/alerts/${id}/resolve`, { method: "PATCH" });
  return { id, resolved: true };
}
export async function createAlert(payload) {
  const data = await request("/alerts", { method: "POST", body: payload });
  return toUiAlert(data);
}
export async function updateAlert(id, payload) {
  const data = await request(`/alerts/${id}`, { method: "PUT", body: payload });
  return toUiAlert(data);
}
export async function deleteAlert(id) {
  await request(`/alerts/${id}`, { method: "DELETE" });
  return { id };
}
