import { request } from "./apiClient";
export const getGlobalStats = () => request("/dashboard/global", { method: "GET" });
export const getClassroomStats = (id) => request(`/dashboard/classroom/${id}`, { method: "GET" });