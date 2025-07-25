import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuthStore } from '@/lib/auth/store';
import { EnhancedAuthAPI as AuthAPI } from '@/lib/auth/enhanced-api';
import { PermissionService } from '@/lib/auth/permissions';
import { 
  AuthContextType, 
  LoginRequest, 
  RegisterRequest, 
  ChangePasswordRequest 
} from '@/lib/types/auth';
import { toast } from 'sonner';

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const {
    user,
    tokens,
    isAuthenticated,
    isLoading,
    setUser,
    setTokens,
    setLoading,
    updateUser,
    clearAuth,
    isTokenExpired
  } = useAuthStore();

  // Initialize authentication state on app start
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      
      try {
        // Check if we have valid tokens
        if (tokens && !isTokenExpired()) {
          // User is already authenticated with valid tokens
          setLoading(false);
          return;
        }
        
        // If we have expired tokens, try to refresh
        if (tokens && isTokenExpired()) {
          const refreshResult = await AuthAPI.refreshToken();
          if (refreshResult.success && refreshResult.data) {
            setUser(refreshResult.data.user);
            setTokens(refreshResult.data.tokens);
          } else {
            // Refresh failed, clear auth state
            clearAuth();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    setLoading(true);
    
    try {
      const response = await AuthAPI.login(credentials);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        setTokens(response.data.tokens);
        toast.success('Login successful!');
      } else {
        toast.error(response.message || 'Login failed');
      }
      
      return response;
    } catch (error) {
      const errorMessage = 'Login failed. Please try again.';
      toast.error(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    setLoading(true);
    
    try {
      const response = await AuthAPI.register(data);
      
      if (response.success) {
        toast.success(response.message || 'Registration successful!');
      } else {
        toast.error(response.message || 'Registration failed');
      }
      
      return response;
    } catch (error) {
      const errorMessage = 'Registration failed. Please try again.';
      toast.error(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    
    try {
      await AuthAPI.logout();
      clearAuth();
      toast.success('Logged out successfully');
    } catch (error) {
      // Even if the API call fails, we still want to clear local auth state
      clearAuth();
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await AuthAPI.refreshToken();
      
      if (response.success && response.data) {
        setUser(response.data.user);
        setTokens(response.data.tokens);
        return true;
      } else {
        clearAuth();
        return false;
      }
    } catch (error) {
      clearAuth();
      return false;
    }
  };

  const updateProfile = async (updates: Partial<typeof user>) => {
    if (!user) return;
    
    try {
      const response = await AuthAPI.updateProfile(updates);
      
      if (response.success && response.data) {
        updateUser(response.data);
        toast.success('Profile updated successfully');
      } else {
        toast.error(response.message || 'Profile update failed');
      }
    } catch (error) {
      toast.error('Profile update failed');
    }
  };

  const hasPermission = (resource: string, action: string): boolean => {
    if (!user) return false;
    
    const permission = `${resource}.${action}` as keyof typeof import('@/lib/auth/permissions').PERMISSIONS;
    return PermissionService.hasPermission(user.role, permission);
  };

  const changePassword = async (data: ChangePasswordRequest) => {
    try {
      const response = await AuthAPI.changePassword(data);
      
      if (response.success) {
        toast.success('Password changed successfully');
      } else {
        toast.error(response.message || 'Password change failed');
      }
      
      return response;
    } catch (error) {
      const errorMessage = 'Password change failed';
      toast.error(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      const response = await AuthAPI.requestPasswordReset(email);
      
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message || 'Password reset request failed');
      }
      
      return response;
    } catch (error) {
      const errorMessage = 'Password reset request failed';
      toast.error(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    }
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshToken,
    updateProfile,
    hasPermission,
    changePassword,
    requestPasswordReset
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};