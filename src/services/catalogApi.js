import { request } from "./apiClient";
export const getClassrooms = () => request("/classrooms", { method: "GET" });
export const createClassroom = (payload) => request("/classrooms", { method: "POST", body: payload });
export const getWasteTypes = () => request("/waste-types", { method: "GET" });
