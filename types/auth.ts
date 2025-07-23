import { SafeUser } from '@/lib/auth'

export interface AuthState {
  user: SafeUser | null
  token: string | null
  sessionId: string | null
  isLoading: boolean
  error: string | null
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

export interface RegisterData {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  phoneNumber?: string
  language?: 'en' | 'ar'
  dateOfBirth?: string
  nationality?: string
  address?: string
  city?: string
  country?: string
  interests?: string[]
} 