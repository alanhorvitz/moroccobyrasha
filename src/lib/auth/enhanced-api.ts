// Enhanced API with improved security features
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { SecurityService } from './security';
import { MFAService } from './mfa';
import { 
  ApiResponse,
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  RegisterResponse,
  UserProfile,
  ChangePasswordRequest,
  AdminDashboardData,
  UserListResponse
} from '@/lib/types/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// Enhanced API client with security features
class EnhancedAPIClient {
  private client: AxiosInstance;
  private refreshPromise: Promise<boolean> | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 second timeout
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - add auth token and CSRF protection
    this.client.interceptors.request.use(
      (config) => {
        // Add authorization token
        const token = localStorage.getItem('accessToken');
        if (token && SecurityService.isValidJWTStructure(token)) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add CSRF token for state-changing operations
        if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase() || '')) {
          const csrfToken = SecurityService.getCSRFToken();
          if (csrfToken) {
            config.headers['X-CSRF-Token'] = csrfToken;
          }
        }

        // Add device fingerprint for additional security (simplified for development)
        config.headers['X-Device-Fingerprint'] = 'dev-fingerprint';

        // Add request timestamp to prevent replay attacks
        config.headers['X-Timestamp'] = Date.now().toString();

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle token refresh and security
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // Handle 401 unauthorized - attempt token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          // Prevent multiple simultaneous refresh attempts
          if (!this.refreshPromise) {
            this.refreshPromise = this.attemptTokenRefresh();
          }
          
          const refreshSuccessful = await this.refreshPromise;
          this.refreshPromise = null;
          
          if (refreshSuccessful) {
            // Update the failed request with new token
            const newToken = localStorage.getItem('accessToken');
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.client(originalRequest);
            }
          } else {
            // Refresh failed, redirect to login
            this.handleAuthFailure();
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  private async attemptTokenRefresh(): Promise<boolean> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return false;

      const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
        refreshToken,
        deviceFingerprint: SecurityService.generateDeviceFingerprint()
      });

      if (response.data.success && response.data.data) {
        localStorage.setItem('accessToken', response.data.data.accessToken);
        localStorage.setItem('refreshToken', response.data.data.refreshToken);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }

  private handleAuthFailure() {
    // Clear auth data
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    // Redirect to login if not already there
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
  }

  async request<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.request<ApiResponse<T>>(config);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as { response?: { data: ApiResponse<T> }; message?: string };
      if (axiosError.response?.data) {
        return axiosError.response.data;
      }
      
      return {
        success: false,
        message: axiosError.message || 'An unexpected error occurred',
      };
    }
  }
}

const apiClient = new EnhancedAPIClient();

// Mock data with enhanced features
const mockUsers = [
  {
    id: '1',
    email: 'admin@morocco.com',
    firstName: 'Admin',
    lastName: 'User',
    phone: '+212600000001',
    role: 'ADMIN',
    status: 'ACTIVE',
    emailVerified: true,
    twoFactorEnabled: false,
    bio: 'Platform administrator',
    loginAttempts: 0,
    lastLoginAt: new Date(),
    preferences: {
      language: 'en',
      notifications: { email: true, sms: false, push: true },
      privacy: { profileVisible: false, showPhone: false, showEmail: false },
    },
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date(),
  },
  {
    id: '2',
    email: 'user@morocco.com',
    firstName: 'Tourist',
    lastName: 'User',
    phone: '+212600000002',
    role: 'TOURIST',
    status: 'ACTIVE',
    emailVerified: true,
    twoFactorEnabled: false,
    bio: 'Traveler exploring Morocco',
    loginAttempts: 0,
    lastLoginAt: new Date(),
    preferences: {
      language: 'en',
      notifications: { email: true, sms: false, push: true },
      privacy: { profileVisible: true, showPhone: false, showEmail: false },
    },
    createdAt: new Date('2023-06-01'),
    updatedAt: new Date(),
  }
];

export class EnhancedAuthAPI {
  // Enhanced login with security features
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      // Check rate limiting
      const rateLimitCheck = SecurityService.checkRateLimit(credentials.email);
      if (!rateLimitCheck.allowed) {
        const resetTime = rateLimitCheck.resetTime 
          ? new Date(rateLimitCheck.resetTime).toLocaleTimeString()
          : 'unknown';
        return {
          success: false,
          message: `Too many login attempts. Please try again after ${resetTime}`,
        };
      }

      // Make real API call to backend
      const response = await apiClient.request<{ user: any; tokens: any }>({
        method: 'POST',
        url: '/api/auth/login',
        data: credentials,
      });

      if (response.success && response.data) {
        // Store tokens in localStorage
        localStorage.setItem('accessToken', response.data.tokens.accessToken);
        localStorage.setItem('refreshToken', response.data.tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Reset rate limit on successful login
        SecurityService.resetRateLimit(credentials.email);
      }

      return response as LoginResponse;

    } catch (error) {
      console.error('Enhanced login error:', error);
      return {
        success: false,
        message: 'An error occurred during login. Please try again.',
      };
    }
  }

  // Complete MFA login
  static async completeMFALogin(mfaSessionId: string, verification: { method: string; code: string }): Promise<LoginResponse> {
    try {
      const session = MFAService.validateMFASession(mfaSessionId);
      if (!session.valid || !session.userId) {
        return {
          success: false,
          message: 'Invalid or expired MFA session',
        };
      }

      const mfaValid = await MFAService.verifyMFA(session.userId, verification);
      if (!mfaValid) {
        return {
          success: false,
          message: 'Invalid verification code',
        };
      }

      const user = mockUsers.find(u => u.id === session.userId);
      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      MFAService.completeMFASession(mfaSessionId);

      const tokens = {
        accessToken: `enhanced_jwt_${user.id}_${Date.now()}`,
        refreshToken: `refresh_${user.id}_${SecurityService.generateSecureRandom()}`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      };

      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      return {
        success: true,
        message: 'Login successful',
        data: { user, tokens },
      };

    } catch (error) {
      return {
        success: false,
        message: 'MFA verification failed',
      };
    }
  }

  // Enhanced registration
  static async register(data: RegisterRequest): Promise<RegisterResponse> {
    try {
      // Make real API call to backend
      const response = await apiClient.request<{ user: any; requiresVerification: boolean }>({
        method: 'POST',
        url: '/api/auth/register',
        data: data,
      });

      return response as RegisterResponse;

    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'An error occurred during registration. Please try again.',
      };
    }
  }

  // Admin API methods
  static async getAdminDashboard(): Promise<ApiResponse<AdminDashboardData>> {
    try {
      const dashboardData: AdminDashboardData = {
        totalUsers: mockUsers.length,
        activeUsers: mockUsers.filter(u => u.status === 'ACTIVE').length,
        newRegistrations: mockUsers.filter(u => 
          new Date(u.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
        ).length,
        usersByRole: {
          tourist: mockUsers.filter(u => u.role === 'TOURIST').length,
          guide: mockUsers.filter(u => u.role === 'GUIDE').length,
          admin: mockUsers.filter(u => u.role === 'ADMIN').length,
          super_admin: mockUsers.filter(u => u.role === 'SUPER_ADMIN').length,
        },
        loginActivity: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
          count: Math.floor(Math.random() * 50) + 10,
        })).reverse(),
        topRegions: [
          { region: 'Marrakech', userCount: 45 },
          { region: 'Casablanca', userCount: 38 },
          { region: 'Fes', userCount: 29 },
          { region: 'Rabat', userCount: 22 },
        ],
        recentActivity: [
          {
            id: '1',
            user: 'John Doe',
            action: 'Registered new account',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          },
          {
            id: '2',
            user: 'Sarah Smith',
            action: 'Updated profile information',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          },
        ],
      };

      return {
        success: true,
        data: dashboardData,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to load dashboard data',
      };
    }
  }

  static async getUsers(params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
  }): Promise<ApiResponse<UserListResponse>> {
    try {
      let filteredUsers = [...mockUsers];

      // Apply filters
      if (params.search) {
        const search = params.search.toLowerCase();
        filteredUsers = filteredUsers.filter(user =>
          user.firstName.toLowerCase().includes(search) ||
          user.lastName.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search)
        );
      }

      if (params.role) {
        filteredUsers = filteredUsers.filter(user => user.role === params.role);
      }

      if (params.status) {
        filteredUsers = filteredUsers.filter(user => user.status === params.status);
      }

      // Pagination
      const page = params.page || 1;
      const limit = params.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

      const response: UserListResponse = {
        users: paginatedUsers,
        pagination: {
          total: filteredUsers.length,
          page,
          limit,
          totalPages: Math.ceil(filteredUsers.length / limit),
        },
        filters: {
          roles: ['TOURIST', 'GUIDE', 'ADMIN', 'SUPER_ADMIN'],
          statuses: ['ACTIVE', 'PENDING', 'SUSPENDED', 'BANNED'],
        },
      };

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to load users',
      };
    }
  }

  static async updateUserStatus(userId: string, status: string): Promise<ApiResponse<null>> {
    try {
      const userIndex = mockUsers.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      mockUsers[userIndex] = {
        ...mockUsers[userIndex],
        status: status as 'pending' | 'active' | 'suspended' | 'banned',
        updatedAt: new Date(),
      };

      return {
        success: true,
        message: 'User status updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update user status',
      };
    }
  }

  static async deleteUser(userId: string): Promise<ApiResponse<null>> {
    try {
      const userIndex = mockUsers.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      mockUsers.splice(userIndex, 1);

      return {
        success: true,
        message: 'User deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete user',
      };
    }
  }

  // Other existing methods
  static async logout(): Promise<ApiResponse<null>> {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    return { success: true, message: 'Logged out successfully' };
  }

  static async getCurrentUser(): Promise<ApiResponse<UserProfile>> {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      return { success: false, message: 'User not found' };
    }
    
    return { success: true, data: JSON.parse(userJson) };
  }

  static async refreshToken(): Promise<ApiResponse<{ user: UserProfile; tokens: { accessToken: string; refreshToken: string; expiresAt: Date } }>> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return { success: false, message: 'No refresh token' };
    }

    // Mock refresh logic
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson);
      const tokens = {
        accessToken: `refreshed_jwt_${user.id}_${Date.now()}`,
        refreshToken: `refresh_${user.id}_${SecurityService.generateSecureRandom()}`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      };

      return { success: true, data: { user, tokens } };
    }

    return { success: false, message: 'Failed to refresh token' };
  }

  static async updateProfile(updates: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      return { success: false, message: 'User not found' };
    }

    const currentUser = JSON.parse(userJson);
    const updatedUser = { ...currentUser, ...updates, updatedAt: new Date() };
    localStorage.setItem('user', JSON.stringify(updatedUser));

    return { success: true, data: updatedUser };
  }

  static async changePassword(data: ChangePasswordRequest): Promise<ApiResponse<null>> {
    // Mock implementation
    return { success: true, message: 'Password changed successfully' };
  }

  static async requestPasswordReset(email: string): Promise<ApiResponse<null>> {
    return { success: true, message: 'Password reset email sent' };
  }

  static async verifyEmail(token: string): Promise<ApiResponse<null>> {
    return { success: true, message: 'Email verified successfully' };
  }

  // Region CRUD operations
  static async getRegions(): Promise<ApiResponse<any[]>> {
    try {
      // Get regions from localStorage (mock database)
      const regions = JSON.parse(localStorage.getItem('mockRegions') || '[]');
      
      // If no regions exist, create some default ones
      if (regions.length === 0) {
        const defaultRegions = [
          {
            id: 'region_1',
            name_en: 'Marrakech',
            name_ar: 'مراكش',
            name_fr: 'Marrakech',
            name_it: 'Marrakech',
            name_es: 'Marrakech',
            description_en: 'The Red City, known for its vibrant souks and historic medina',
            description_ar: 'المدينة الحمراء، معروفة بأسواقها النابضة بالحياة والمدينة القديمة',
            description_fr: 'La Ville Rouge, connue pour ses souks animés et sa médina historique',
            capital: 'Marrakech',
            population: '928,850',
            latitude: 31.6295,
            longitude: -7.9811,
            climate_en: 'Semi-arid climate with hot summers',
            bestTimeToVisit_en: 'March to May and September to November',
            keyFacts_en: 'UNESCO World Heritage site, famous for Jemaa el-Fnaa square',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 'region_2',
            name_en: 'Fes',
            name_ar: 'فاس',
            name_fr: 'Fès',
            name_it: 'Fez',
            name_es: 'Fez',
            description_en: 'The cultural and spiritual capital of Morocco',
            description_ar: 'العاصمة الثقافية والروحية للمغرب',
            description_fr: 'La capitale culturelle et spirituelle du Maroc',
            capital: 'Fes',
            population: '1,112,072',
            latitude: 34.0181,
            longitude: -5.0078,
            climate_en: 'Mediterranean climate with mild winters',
            bestTimeToVisit_en: 'April to June and September to November',
            keyFacts_en: 'Home to the world\'s oldest university, Al Quaraouiyine',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 'region_3',
            name_en: 'Casablanca',
            name_ar: 'الدار البيضاء',
            name_fr: 'Casablanca',
            name_it: 'Casablanca',
            name_es: 'Casablanca',
            description_en: 'Morocco\'s largest city and economic hub',
            description_ar: 'أكبر مدينة في المغرب والمركز الاقتصادي',
            description_fr: 'La plus grande ville du Maroc et centre économique',
            capital: 'Casablanca',
            population: '3,359,818',
            latitude: 33.5731,
            longitude: -7.5898,
            climate_en: 'Mediterranean climate with moderate temperatures',
            bestTimeToVisit_en: 'March to May and September to November',
            keyFacts_en: 'Home to the Hassan II Mosque, the largest mosque in Africa',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ];
        
        localStorage.setItem('mockRegions', JSON.stringify(defaultRegions));
        return {
          success: true,
          data: defaultRegions
        };
      }
      
      return {
        success: true,
        data: regions
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch regions',
        data: []
      };
    }
  }

  static async createRegion(regionData: any): Promise<ApiResponse<any>> {
    try {
      // Mock implementation - simulate database creation
      const newRegion = {
        id: `region_${Date.now()}`,
        ...regionData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Store in localStorage for persistence (mock database)
      const existingRegions = JSON.parse(localStorage.getItem('mockRegions') || '[]');
      existingRegions.push(newRegion);
      localStorage.setItem('mockRegions', JSON.stringify(existingRegions));
      
      return {
        success: true,
        message: 'Region created successfully',
        data: newRegion
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create region',
      };
    }
  }

  static async updateRegion(id: string, regionData: any): Promise<ApiResponse<any>> {
    try {
      // Get existing regions
      const regions = JSON.parse(localStorage.getItem('mockRegions') || '[]');
      const regionIndex = regions.findIndex((r: any) => r.id === id);
      
      if (regionIndex === -1) {
        return {
          success: false,
          message: 'Region not found',
        };
      }
      
      // Update the region
      const updatedRegion = {
        ...regions[regionIndex],
        ...regionData,
        id, // Ensure ID doesn't change
        updatedAt: new Date()
      };
      
      regions[regionIndex] = updatedRegion;
      localStorage.setItem('mockRegions', JSON.stringify(regions));
      
      return {
        success: true,
        message: 'Region updated successfully',
        data: updatedRegion
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update region',
      };
    }
  }

  static async deleteRegion(id: string): Promise<ApiResponse<null>> {
    try {
      // Get existing regions
      const regions = JSON.parse(localStorage.getItem('mockRegions') || '[]');
      const regionIndex = regions.findIndex((r: any) => r.id === id);
      
      if (regionIndex === -1) {
        return {
          success: false,
          message: 'Region not found',
        };
      }
      
      // Remove the region
      regions.splice(regionIndex, 1);
      localStorage.setItem('mockRegions', JSON.stringify(regions));
      
      return {
        success: true,
        message: 'Region deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete region',
      };
    }
  }
}