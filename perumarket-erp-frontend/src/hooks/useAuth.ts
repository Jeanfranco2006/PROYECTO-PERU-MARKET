// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { authService, type AuthData } from '../services/authService';

export const useAuth = () => {
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = authService.getAuthData();
    setAuthData(data);
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const result = await authService.login({ username, password });
      setAuthData(result);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setAuthData(null);
  };

  return {
    authData,
    loading,
    login,
    logout,
    isAuthenticated: authService.isAuthenticated()
  };
};