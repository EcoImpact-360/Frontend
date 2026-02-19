import { request } from "./apiClient";
export const getRanking = () => request("/ranking", { method: "GET" });