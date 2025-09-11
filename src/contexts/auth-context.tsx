'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthUser, LoginCredentials, RegisterData } from '@/types';
import { AuthService, getStoredToken, getStoredRefreshToken, setStoredTokens, removeStoredTokens, isTokenExpired } from '@/lib/auth';
import { toast } from 'sonner';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType {
  authState: AuthState;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Initialize authentication state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const token = getStoredToken();
      const refreshToken = getStoredRefreshToken();

      if (!token) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      // Check if token is expired
      if (isTokenExpired(token)) {
        if (refreshToken && !isTokenExpired(refreshToken)) {
          // Try to refresh token
          await handleTokenRefresh(refreshToken);
        } else {
          // Both tokens expired, logout
          handleLogout();
        }
        return;
      }

      // Token is valid, decode and get user info
      const payload = AuthService.verifyToken(token);
      if (payload) {
        const user = await AuthService.getUserById(payload.userId);
        if (user) {
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return;
        }
      }

      // If we get here, something went wrong
      handleLogout();
    } catch (error) {
      console.error('Auth initialization error:', error);
      handleLogout();
    }
  };

  const handleTokenRefresh = async (refreshToken: string) => {
    try {
      const result = await AuthService.refreshToken(refreshToken);
      if (result) {
        const { token: newToken, refreshToken: newRefreshToken } = result;
        setStoredTokens(newToken, newRefreshToken);
        
        // Get user info with new token
        const payload = AuthService.verifyToken(newToken);
        if (payload) {
          const user = await AuthService.getUserById(payload.userId);
          if (user) {
            setAuthState({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return;
          }
        }
      }
      
      // Refresh failed
      handleLogout();
    } catch (error) {
      console.error('Token refresh error:', error);
      handleLogout();
    }
  };

  const handleLogout = () => {
    removeStoredTokens();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      const result = await AuthService.login(credentials);
      
      if (result) {
        const { user, token, refreshToken } = result;
        
        // Store tokens
        setStoredTokens(token, refreshToken);
        
        // Update state
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        toast.success(`Welcome back, ${user.name}!`);
        return true;
      }

      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'Invalid email or password' 
      }));
      toast.error('Invalid email or password');
      return false;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }));
      toast.error(errorMessage);
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      // Validate passwords match
      if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const result = await AuthService.register(data);
      
      if (result) {
        const { user, token, refreshToken } = result;
        
        // Store tokens
        setStoredTokens(token, refreshToken);
        
        // Update state
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        toast.success(`Welcome, ${user.name}! Your account has been created.`);
        return true;
      }

      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'Registration failed' 
      }));
      toast.error('Registration failed');
      return false;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }));
      toast.error(errorMessage);
      return false;
    }
  };

  const logout = () => {
    handleLogout();
    toast.success('Logged out successfully');
  };

  const refreshAuth = async () => {
    const refreshToken = getStoredRefreshToken();
    if (refreshToken && !isTokenExpired(refreshToken)) {
      await handleTokenRefresh(refreshToken);
    } else {
      handleLogout();
    }
  };

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  const value: AuthContextType = {
    authState,
    login,
    register,
    logout,
    refreshAuth,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
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

// Helper hook for checking permissions
export const usePermissions = () => {
  const { authState } = useAuth();
  
  const hasRole = (requiredRole: string): boolean => {
    if (!authState.user) return false;
    return AuthService.hasPermission(authState.user.role, requiredRole);
  };

  const canAccess = (requiredRoles: string[]): boolean => {
    if (!authState.user) return false;
    return requiredRoles.some(role => hasRole(role));
  };

  const isAdmin = (): boolean => hasRole('admin');
  const isManager = (): boolean => hasRole('manager');
  const canManageData = (): boolean => canAccess(['admin', 'manager']);
  const canImportData = (): boolean => canAccess(['admin', 'manager', 'data-entry']);
  const canViewData = (): boolean => canAccess(['admin', 'manager', 'data-entry', 'viewer']);

  return {
    hasRole,
    canAccess,
    isAdmin,
    isManager,
    canManageData,
    canImportData,
    canViewData,
    userRole: authState.user?.role,
  };
};