import { request } from "./apiClient";

export function getAlerts() {
  // Ahora llamamos a /pending para que coincida con tu @GetMapping("/pending")
  return request("/api/v1/alerts/pending", { 
    method: "GET" 
  });
}

export function resolveAlert(id) {
  // Ahora usamos la ruta /{id}/resolve de tu @PatchMapping
  return request(`/api/v1/alerts/${id}/resolve`, { 
    method: "PATCH" 
  });
}