import axios from 'axios';
import { 
  ApiResponse,
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  RegisterResponse,
  UserProfile,
  ChangePasswordRequest
} from '@/lib/types/auth';

// Replace with your actual API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token expiration and refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Refresh token logic
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          // No refresh token, logout user
          AuthAPI.logout();
          return Promise.reject(error);
        }
        
        const response = await axios.post(`${API_BASE_URL}/api/auth/refresh-token`, {
          refreshToken,
        });
        
        if (response.data.success) {
          // Store new tokens
          localStorage.setItem('accessToken', response.data.data.accessToken);
          localStorage.setItem('refreshToken', response.data.data.refreshToken);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${response.data.data.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Failed to refresh token, logout user
        AuthAPI.logout();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export class AuthAPI {
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await api.post('/api/auth/login', credentials);
      
      if (response.data.success && response.data.data) {
        // Store tokens if successful
        localStorage.setItem('accessToken', response.data.data.tokens.accessToken);
        localStorage.setItem('refreshToken', response.data.data.tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Login failed. Please try again.',
      };
    }
  }
  
  static async register(data: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await api.post('/api/auth/register', data);
      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Registration failed. Please try again.',
      };
    }
  }
  
  static async logout(): Promise<ApiResponse<null>> {
    try {
      // Call logout endpoint
      await api.post('/api/auth/logout');
      
      // Clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      return {
        success: true,
        message: 'Logged out successfully',
        data: null,
      };
    } catch (error: any) {
      console.error('Logout error:', error);
      // Even if the API call fails, we still want to clear local auth state
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      return {
        success: false,
        message: 'An error occurred during logout.',
      };
    }
  }
  
  static async getCurrentUser(): Promise<ApiResponse<UserProfile>> {
    try {
      const response = await api.get('/api/auth/profile');
      return response.data;
    } catch (error: any) {
      console.error('Get user error:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'An error occurred while fetching user data.',
      };
    }
  }
  
  static async updateProfile(updates: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    try {
      const response = await api.put('/api/auth/profile', updates);
      return response.data;
    } catch (error: any) {
      console.error('Update profile error:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'An error occurred while updating your profile.',
      };
    }
  }
  
  static async changePassword(data: ChangePasswordRequest): Promise<ApiResponse<null>> {
    try {
      const response = await api.post('/api/auth/change-password', data);
      return response.data;
    } catch (error: any) {
      console.error('Change password error:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'An error occurred while changing your password.',
      };
    }
  }
  
  static async requestPasswordReset(email: string): Promise<ApiResponse<null>> {
    try {
      const response = await api.post('/api/auth/forgot-password', { email });
      return response.data;
    } catch (error: any) {
      console.error('Password reset request error:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'An error occurred while processing your request.',
      };
    }
  }
  
  static async resetPassword(token: string, newPassword: string): Promise<ApiResponse<null>> {
    try {
      const response = await api.post('/api/auth/reset-password', { token, newPassword });
      return response.data;
    } catch (error: any) {
      console.error('Reset password error:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'An error occurred while resetting your password.',
      };
    }
  }
  
  static async verifyEmail(token: string): Promise<ApiResponse<null>> {
    try {
      const response = await api.post('/api/auth/verify-email', { token });
      return response.data;
    } catch (error: any) {
      console.error('Email verification error:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'An error occurred while verifying your email.',
      };
    }
  }
  
  static async refreshToken(): Promise<ApiResponse<{ accessToken: string; refreshToken: string; expiresAt: Date }>> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        return {
          success: false,
          message: 'No refresh token available',
        };
      }
      
      const response = await axios.post(`${API_BASE_URL}/api/auth/refresh-token`, {
        refreshToken,
      });
      
      if (response.data.success && response.data.data) {
        // Store new tokens
        localStorage.setItem('accessToken', response.data.data.accessToken);
        localStorage.setItem('refreshToken', response.data.data.refreshToken);
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Token refresh error:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to refresh token',
      };
    }
  }
}