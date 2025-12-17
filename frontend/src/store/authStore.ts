/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import { authAPI } from '../api/auth';
import { User } from '../types';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  lastCheckTime: number;
}

interface AuthActions {
  checkAuth: () => Promise<void>;
  loginWithGoogle: () => void;
  logout: () => Promise<void>;
  setAuthenticated: (value: boolean, user?: User | null) => void;
  clearAuth: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      user: null,
      loading: false,
      lastCheckTime: 0,

      // Actions
      checkAuth: async () => {
        const state = get();
        const now = Date.now();
        
        // Prevent duplicate calls within 5 seconds
        if (state.loading || (now - state.lastCheckTime) < 5000) {
          return;
        }
        
        try {
          set({ loading: true, lastCheckTime: now });
          const authStatus = await authAPI.getStatus();
          
          // Only log on status change to prevent spam
          if (!state.isAuthenticated && authStatus.isAuthenticated) {
            console.log('Authentication successful');
          }
          
          set({ 
            isAuthenticated: authStatus.isAuthenticated,
            user: authStatus.user,
            loading: false 
          });
        } catch (error: any) {
          console.error('Auth check failed:', error);
          set({ 
            isAuthenticated: false, 
            user: null, 
            loading: false 
          });
        }
      },

      loginWithGoogle: () => {
        authAPI.loginWithGoogle();
      },

      logout: async () => {
        try {
          await authAPI.logout();
          set({ 
            isAuthenticated: false, 
            user: null,
            loading: false,
            lastCheckTime: 0
          });
          toast.success('Logged out successfully');
        } catch (error: any) {
          toast.error('Logout failed');
          console.error('Logout error:', error);
        }
      },

      setAuthenticated: (value: boolean, user: User | null = null) => {
        set({ 
          isAuthenticated: value, 
          user,
          lastCheckTime: Date.now()
        });
      },

      clearAuth: () => {
        set({ 
          isAuthenticated: false, 
          user: null, 
          loading: false,
          lastCheckTime: 0
        });
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);