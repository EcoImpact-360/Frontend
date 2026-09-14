import { createContext, useContext, useMemo, useState } from 'react';
import { login as loginRequest } from '../services/authApi';
import { getToken, getSchool, setSession, clearSession } from '../services/authStorage';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getToken());
  const [school, setSchool] = useState(() => getSchool());
  const login = async (name, password) => {
    const response = await loginRequest(name, password);
    setSession(response.token, { id: response.schoolId, name: response.schoolName });
    setToken(response.token);
    setSchool({ id: response.schoolId, name: response.schoolName });
    return response;
  };
  const logout = () => {
    clearSession();
    setToken(null);
    setSchool(null);
  };
  const value = useMemo(
    () => ({ token, school, isAuthenticated: Boolean(token), login, logout }),
    [token, school]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
