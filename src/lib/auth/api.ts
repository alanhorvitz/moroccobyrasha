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
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.morocco-platform.com';

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
        
        const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
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

// For development and demo purposes, simulate API responses
const simulateApiCall = <T>(data: T, success = true, delay = 800): Promise<ApiResponse<T>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success,
        data,
        message: success ? 'Success' : 'Error',
      });
    }, delay);
  });
};

// Mock user data for development
const mockUsers = [
  {
    id: '1',
    email: 'tourist@example.com',
    firstName: 'Sarah',
    lastName: 'Traveler',
    phone: '+212612345678',
    role: 'tourist',
    status: 'active',
    emailVerified: true,
    twoFactorEnabled: false,
    bio: 'Passionate traveler exploring Morocco',
    preferences: {
      language: 'en',
      notifications: {
        email: true,
        sms: false,
        push: true,
      },
      privacy: {
        profileVisible: true,
        showPhone: false,
        showEmail: false,
      },
    },
    createdAt: new Date('2023-11-15'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '2',
    email: 'guide@example.com',
    firstName: 'Ahmed',
    lastName: 'Marrakchi',
    phone: '+212698765432',
    role: 'guide',
    status: 'active',
    emailVerified: true,
    twoFactorEnabled: false,
    bio: 'Professional tour guide with 10+ years experience in Marrakech',
    preferences: {
      language: 'en',
      notifications: {
        email: true,
        sms: true,
        push: true,
      },
      privacy: {
        profileVisible: true,
        showPhone: true,
        showEmail: false,
      },
    },
    createdAt: new Date('2023-10-05'),
    updatedAt: new Date('2024-02-10'),
  },
  {
    id: '3',
    email: 'admin@example.com',
    firstName: 'Fatima',
    lastName: 'Administrator',
    phone: '+212655443322',
    role: 'admin',
    status: 'active',
    emailVerified: true,
    twoFactorEnabled: false,
    bio: 'Platform administrator',
    preferences: {
      language: 'en',
      notifications: {
        email: true,
        sms: false,
        push: true,
      },
      privacy: {
        profileVisible: false,
        showPhone: false,
        showEmail: false,
      },
    },
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date('2024-03-15'),
  },
];

export class AuthAPI {
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      // For demo, simulate API call
      const mockUser = mockUsers.find(user => user.email === credentials.email);
      
      if (!mockUser) {
        return simulateApiCall(null, false) as Promise<LoginResponse>;
      }
      
      // Simulate successful login
      const result = await simulateApiCall({
        user: mockUser,
        tokens: {
          accessToken: `mock_access_token_${mockUser.id}`,
          refreshToken: `mock_refresh_token_${mockUser.id}`,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        },
      }) as LoginResponse;
      
      // Store tokens if successful
      if (result.success && result.data) {
        localStorage.setItem('accessToken', result.data.tokens.accessToken);
        localStorage.setItem('refreshToken', result.data.tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(result.data.user));
      }
      
      return result;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'An error occurred during login. Please try again.',
      };
    }
  }
  
  static async register(data: RegisterRequest): Promise<RegisterResponse> {
    try {
      // For demo, simulate API call
      const existingUser = mockUsers.find(user => user.email === data.email);
      
      if (existingUser) {
        return {
          success: false,
          message: 'A user with this email already exists.',
        };
      }
      
      // Simulate user creation
      const newUser = {
        id: (mockUsers.length + 1).toString(),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: data.role,
        status: 'pending',
        emailVerified: false,
        twoFactorEnabled: false,
        bio: '',
        preferences: {
          language: 'en',
          notifications: {
            email: true,
            sms: false,
            push: true,
          },
          privacy: {
            profileVisible: true,
            showPhone: false,
            showEmail: false,
          },
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      // In a real app, we would add the user to the database
      mockUsers.push(newUser as UserProfile);
      
      return simulateApiCall({
        user: newUser,
        requiresVerification: true,
      }) as Promise<RegisterResponse>;
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'An error occurred during registration. Please try again.',
      };
    }
  }
  
  static async logout(): Promise<ApiResponse<null>> {
    try {
      // Clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      return simulateApiCall(null);
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        message: 'An error occurred during logout.',
      };
    }
  }
  
  static async getCurrentUser(): Promise<ApiResponse<UserProfile>> {
    try {
      // Get user from localStorage
      const userJson = localStorage.getItem('user');
      if (!userJson) {
        return {
          success: false,
          message: 'User not found.',
        };
      }
      
      const user = JSON.parse(userJson);
      return simulateApiCall(user);
    } catch (error) {
      console.error('Get user error:', error);
      return {
        success: false,
        message: 'An error occurred while fetching user data.',
      };
    }
  }
  
  static async updateProfile(updates: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    try {
      // Get current user from localStorage
      const userJson = localStorage.getItem('user');
      if (!userJson) {
        return {
          success: false,
          message: 'User not found.',
        };
      }
      
      const currentUser = JSON.parse(userJson);
      
      // Update user
      const updatedUser = {
        ...currentUser,
        ...updates,
        updatedAt: new Date(),
      };
      
      // Save updated user to localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return simulateApiCall(updatedUser);
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        message: 'An error occurred while updating your profile.',
      };
    }
  }
  
  static async changePassword(data: ChangePasswordRequest): Promise<ApiResponse<null>> {
    try {
      // In a real app, we would validate the current password against the stored one
      // and then update with the new password
      
      return simulateApiCall<null>(null);
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        message: 'An error occurred while changing your password.',
      };
    }
  }
  
  static async requestPasswordReset(email: string): Promise<ApiResponse<null>> {
    try {
      // Check if user exists
      const userExists = mockUsers.some(user => user.email === email);
      
      if (!userExists) {
        // For security, don't reveal if the email exists or not
        return simulateApiCall<null>(null);
      }
      
      // In a real app, generate a reset token and send email
      return simulateApiCall<null>(null);
    } catch (error) {
      console.error('Password reset request error:', error);
      return {
        success: false,
        message: 'An error occurred while processing your request.',
      };
    }
  }
  
  static async verifyEmail(token: string): Promise<ApiResponse<null>> {
    try {
      // In a real app, verify the token and update user's email verification status
      
      // Get current user from localStorage
      const userJson = localStorage.getItem('user');
      if (userJson) {
        const currentUser = JSON.parse(userJson);
        
        // Update verification status
        currentUser.emailVerified = true;
        
        // Save updated user to localStorage
        localStorage.setItem('user', JSON.stringify(currentUser));
      }
      
      return simulateApiCall<null>(null);
    } catch (error) {
      console.error('Email verification error:', error);
      return {
        success: false,
        message: 'An error occurred while verifying your email.',
      };
    }
  }
}