import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserProfile, AuthTokens } from '@/lib/types/auth';

interface AuthStore {
  // State
  user: UserProfile | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setUser: (user: UserProfile) => void;
  setTokens: (tokens: AuthTokens) => void;
  setLoading: (loading: boolean) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  clearAuth: () => void;
  
  // Computed
  hasRole: (role: string) => boolean;
  isTokenExpired: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      
      // Actions
      setUser: (user: UserProfile) => {
        set({ 
          user, 
          isAuthenticated: true,
          isLoading: false 
        });
      },
      
      setTokens: (tokens: AuthTokens) => {
        set({ tokens });
      },
      
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
      
      updateUser: (updates: Partial<UserProfile>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              ...updates,
              updatedAt: new Date()
            }
          });
        }
      },
      
      clearAuth: () => {
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          isLoading: false
        });
      },
      
      // Computed properties
      hasRole: (role: string) => {
        const user = get().user;
        return user?.role === role;
      },
      
      isTokenExpired: () => {
        const tokens = get().tokens;
        if (!tokens) return true;
        return new Date() >= new Date(tokens.expiresAt);
      }
    }),
    {
      name: 'morocco-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

// Hook for accessing auth state
export const useAuth = () => {
  const store = useAuthStore();
  
  return {
    ...store,
    isAdmin: store.user?.role === 'admin' || store.user?.role === 'super_admin',
    isSuperAdmin: store.user?.role === 'super_admin',
    isGuide: store.user?.role === 'guide',
    isTourist: store.user?.role === 'tourist',
  };
};