import { request } from "../services/apiClient";

export const dashboardApi = {

  getMetrics: () => request("/dashboard/global", { method: "GET" }),


  getAulasData: async () => {
    const data = await request("/ranking", { method: "GET" });

    return data.map(item => ({
      name: item.classroomName,
      reciclables: item.totalWeight,
      puntos: item.totalPoints
    }));
  }
};