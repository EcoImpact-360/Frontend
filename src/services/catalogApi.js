import { request } from "./apiClient";
export const getClassrooms = () => request("/classrooms", { method: "GET" });
export const getWasteTypes = () => request("/waste-types", { method: "GET" });
