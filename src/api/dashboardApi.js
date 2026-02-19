import { request } from "../services/apiClient";

export const dashboardApi = {
  // Obtiene CO2, Agua, Energía, etc. desde el DashboardController.java
  getMetrics: () => request("/dashboard/global", { method: "GET" }),

  // Obtiene los datos para las gráficas de barras (Ranking de aulas)
  getAulasData: async () => {
    const data = await request("/ranking", { method: "GET" });
    // Mapeamos para que coincida con los nombres que usan tus gráficas actuales
    return data.map(item => ({
      name: item.classroomName,
      reciclables: item.totalWeight,
      puntos: item.totalPoints
    }));
  }
};