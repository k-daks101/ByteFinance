import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { getMe } from "../api/auth";

const AuthContext = createContext(null);

const TOKEN_KEY = "bytefinance_token";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async (jwt) => {
    if (!jwt) {
      setUser(null);
      return;
    }

    try {
      const data = await getMe();
      setUser(data);
    } catch (error) {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchMe(token).finally(() => setLoading(false));
  }, [token, fetchMe]);

  const login = useCallback((jwt) => {
    localStorage.setItem(TOKEN_KEY, jwt);
    setToken(jwt);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      login,
      logout,
      refreshUser: () => fetchMe(token),
    }),
    [token, user, loading, login, logout, fetchMe]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
