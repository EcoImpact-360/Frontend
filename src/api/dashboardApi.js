import { request } from "../services/apiClient";
export const dashboardApi = {
  getMetrics: () => request("/dashboard/global", { method: "GET" }),
  getCo2Ranking: async () => {
    const data = await request("/ranking", { method: "GET" });
    return Array.isArray(data)
      ? data.map(item => ({
          name: item.classroomName,
          co2: item.totalCo2,
          agua: item.totalWaterSaved,
          registros: item.totalEntries,
        }))
      : [];
  }
};
