// User role types
export type UserRole = 'tourist' | 'guide' | 'admin' | 'super_admin';
export type UserStatus = 'pending' | 'active' | 'suspended' | 'banned';

// Auth tokens interface
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

// User related types
export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  bio?: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  preferences: {
    language: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    privacy: {
      profileVisible: boolean;
      showPhone: boolean;
      showEmail: boolean;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

// Auth request/response types
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse extends ApiResponse {
  data?: {
    user: UserProfile;
    tokens: AuthTokens;
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  agreeToTerms: boolean;
}

export interface RegisterResponse extends ApiResponse {
  data?: {
    user: UserProfile;
    requiresVerification: boolean;
  };
}

export interface PasswordResetRequest {
  email: string;
}

export type PasswordResetResponse = ApiResponse<null>;

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// Generic API response
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

// Admin dashboard data
export interface AdminDashboardData {
  totalUsers: number;
  activeUsers: number;
  newRegistrations: number;
  usersByRole: {
    tourist: number;
    guide: number;
    admin: number;
    super_admin: number;
  };
  loginActivity: Array<{
    date: string;
    count: number;
  }>;
  topRegions: Array<{
    region: string;
    userCount: number;
  }>;
  recentActivity: Array<{
    id: string;
    user: string;
    action: string;
    timestamp: Date;
  }>;
}

// User list response
export interface UserListResponse {
  users: UserProfile[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  filters: {
    roles: string[];
    statuses: string[];
  };
}

// Auth context types
export interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<LoginResponse>;
  register: (data: RegisterRequest) => Promise<RegisterResponse>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  changePassword: (data: ChangePasswordRequest) => Promise<ApiResponse>;
  requestPasswordReset: (email: string) => Promise<ApiResponse>;
  hasPermission: (resource: string, action: string) => boolean;
}

// Protected Route Props
export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredPermission?: {
    resource: string;
    action: string;
  };
  fallback?: React.ReactNode;
}

// Validation
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface PasswordStrengthResult extends ValidationResult {
  strength: 'weak' | 'fair' | 'good' | 'strong';
  score: number;
}