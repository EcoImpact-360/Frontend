import { request } from "./apiClient";
export const login = (name, password) => request("/auth/login", { method: "POST", body: { name, password } });
