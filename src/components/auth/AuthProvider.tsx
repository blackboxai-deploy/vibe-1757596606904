'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthUser, AuthState, LoginCredentials, RegisterData } from '@/types';
import { 
  AuthService, 
  getStoredToken, 
  getStoredRefreshToken, 
  setStoredTokens, 
  removeStoredTokens, 
  isTokenExpired 
} from '@/lib/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  const setError = (error: string | null) => {
    setState(prev => ({ ...prev, error, isLoading: false }));
  };

  const setLoading = (isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  };

  const setUser = (user: AuthUser | null) => {
    setState(prev => ({
      ...prev,
      user,
      isAuthenticated: !!user,
      isLoading: false,
      error: null,
    }));
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);

      const result = await AuthService.login(credentials);
      if (!result) {
        throw new Error('Login failed');
      }

      const { user, token, refreshToken } = result;
      
      setStoredTokens(token, refreshToken);
      setUser(user);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      setError(message);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      setError(null);

      const result = await AuthService.register(data);
      const { user, token, refreshToken } = result;
      
      setStoredTokens(token, refreshToken);
      setUser(user);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      setError(message);
      throw error;
    }
  };

  const logout = () => {
    removeStoredTokens();
    setUser(null);
  };

  const refreshAuth = async () => {
    try {
      const refreshToken = getStoredRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const result = await AuthService.refreshToken(refreshToken);
      if (!result) {
        throw new Error('Token refresh failed');
      }

      setStoredTokens(result.token, result.refreshToken);
      
      // Get updated user info
      const token = AuthService.verifyToken(result.token);
      if (token) {
        const user = await AuthService.getUserById(token.userId);
        if (user) {
          setUser(user);
          return;
        }
      }
      
      throw new Error('Failed to get user info after refresh');
    } catch (error) {
      console.error('Auth refresh failed:', error);
      logout();
    }
  };

  const initializeAuth = async () => {
    try {
      const token = getStoredToken();
      const refreshToken = getStoredRefreshToken();

      if (!token || !refreshToken) {
        setLoading(false);
        return;
      }

      if (isTokenExpired(token)) {
        // Try to refresh the token
        if (!isTokenExpired(refreshToken)) {
          await refreshAuth();
          return;
        } else {
          // Both tokens expired, logout
          logout();
          return;
        }
      }

      // Token is valid, get user info
      const tokenPayload = AuthService.verifyToken(token);
      if (tokenPayload) {
        const user = await AuthService.getUserById(tokenPayload.userId);
        if (user) {
          setUser(user);
          return;
        }
      }

      // If we get here, something went wrong
      logout();
    } catch (error) {
      console.error('Auth initialization failed:', error);
      logout();
    }
  };

  useEffect(() => {
    initializeAuth();
  }, []);

  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;