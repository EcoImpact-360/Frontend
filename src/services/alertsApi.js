import { request } from "./apiClient";

function buildQuery(params) {
  if (!params || typeof params !== "object") {
    return "";
  }

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export function getAlerts(params) {
  const qs = buildQuery(params);
  return request(`/api/alerts${qs}`, { method: "GET" });
}

export function resolveAlert(id) {
  return request(`/api/alerts/${id}/resolve`, { method: "PATCH" });
}
