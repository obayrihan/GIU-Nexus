/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { authService } from "../services/api";

const AuthContext = createContext(null);

function getStoredSession() {
  const storedToken = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  if (!storedToken || !storedUser) {
    return { token: null, user: null };
  }

  try {
    return { token: storedToken, user: JSON.parse(storedUser) };
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return { token: null, user: null };
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(getStoredSession);

  const saveSession = useCallback((data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setSession({ token: data.token, user: data.user });
  }, []);

  const login = useCallback(async (credentials) => {
    const { data } = await authService.login(credentials);
    saveSession(data);
    return data;
  }, [saveSession]);

  const register = useCallback(async (userData) => {
    const { data } = await authService.register(userData);
    saveSession(data);
    return data;
  }, [saveSession]);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setSession({ token: null, user: null });
  }, []);

  const value = useMemo(
    () => ({
      user: session.user,
      token: session.token,
      loading: false,
      login,
      register,
      logout,
      saveSession,
      isAuthenticated: Boolean(session.token && session.user),
    }),
    [session, login, register, logout, saveSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
