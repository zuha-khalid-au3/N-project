import { createContext, useContext, useEffect, useState } from 'react';
import * as authService from '../services/authService.js';
import { clearAuthToken, getAuthToken, setAuthToken } from '../services/tokenStorage.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return () => {
        active = false;
      };
    }

    authService
      .getMe()
      .then((response) => {
        if (active) setUser(response.data.user);
      })
      .catch(() => {
        clearAuthToken();
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function login(email, password) {
    const response = await authService.login(email, password);
    if (!response.data?.token) {
      throw new Error('Login did not return a session token. Please retry after the latest deploy.');
    }
    setAuthToken(response.data.token);
    setUser(response.data.user);
    return response.data.user;
  }

  async function logout() {
    try {
      await authService.logout();
    } catch {
      // Ignore network logout failures; local session still clears.
    }
    clearAuthToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: Boolean(user) }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
