import { request } from "./apiClient";
export const createSchool = (payload) => request("/schools", { method: "POST", body: payload });
