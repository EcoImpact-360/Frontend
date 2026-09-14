import { request } from "./apiClient";
export const getSchools = () => request("/schools", { method: "GET" });
export const createSchool = (payload) => request("/schools", { method: "POST", body: payload });
