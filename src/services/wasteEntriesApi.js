import { request } from "./apiClient";
export const createWasteEntry = (payload) => request("/waste-entries", { method: "POST", body: payload });
