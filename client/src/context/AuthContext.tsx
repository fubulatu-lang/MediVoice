import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, AuthTokens, LoginCredentials, RegisterData } from '../types';
import { authService } from '../services/api/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const tokens = localStorage.getItem('auth_tokens');
      if (tokens) {
        const parsedTokens: AuthTokens = JSON.parse(tokens);
        const userData = await authService.getCurrentUser(parsedTokens.accessToken);
        setUser(userData);
      }
    } catch (error) {
      localStorage.removeItem('auth_tokens');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (credentials: LoginCredentials) => {
    const tokens = await authService.login(credentials);
    localStorage.setItem('auth_tokens', JSON.stringify(tokens));
    const userData = await authService.getCurrentUser(tokens.accessToken);
    setUser(userData);
  };

  const register = async (data: RegisterData) => {
    const userData = await authService.register(data);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('auth_tokens');
    setUser(null);
  };

  const refreshAuth = async () => {
    await checkAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
