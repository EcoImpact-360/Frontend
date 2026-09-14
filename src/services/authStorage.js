const TOKEN_KEY = "ecoimpact_token";
const SCHOOL_KEY = "ecoimpact_school";
export const SESSION_CLEARED_EVENT = "ecoimpact:session-cleared";
export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}
export function getSchool() {
  try {
    const raw = localStorage.getItem(SCHOOL_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
export function setSession(token, school) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(SCHOOL_KEY, JSON.stringify(school));
  } catch {
    /* localStorage no disponible */
  }
}
export function clearSession() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SCHOOL_KEY);
  } catch {
    /* localStorage no disponible */
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(SESSION_CLEARED_EVENT));
  }
}
