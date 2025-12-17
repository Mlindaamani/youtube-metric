import api from './index';
import { ApiResponse, AuthState } from '../types';

export const authAPI = {
  // Get authentication status
  getStatus: async (): Promise<AuthState> => {
    const response = await api.get('/auth/status');
    // Backend returns auth status directly, not wrapped in ApiResponse
    return response.data || { isAuthenticated: false, user: null, loading: false };
  },

  // Initiate Google OAuth login
  loginWithGoogle: (): void => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/google`;
  },

  // Logout user
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
  },
};