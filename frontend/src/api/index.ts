import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  withCredentials: true, // Important for session cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add any auth tokens if needed
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error);
    
    // Handle different error types
    if (error.response?.status === 401) {
      // Only redirect to login if it's an auth endpoint failure
      // For other endpoints, just reject and let the caller handle it
      if (error.config?.url?.includes('/auth/status')) {
        localStorage.removeItem('token');
        // Don't redirect immediately, let the store handle it
      }
    } else if (error.response?.status === 403) {
      toast.error('Access forbidden');
    } else if (error.response?.status === 404) {
      toast.error('Resource not found');
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else if (error.request) {
      toast.error('Network error. Please check your connection.');
    } else {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
    
    return Promise.reject(error);
  }
);

export default api;