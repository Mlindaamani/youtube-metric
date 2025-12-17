import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 5000, // 5 second timeout to prevent hanging
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth endpoints
export const authApi = {
  checkStatus: () => api.get('/auth/status'),
  getGoogleAuthUrl: () => `${API_BASE_URL}/auth/google`,
  logout: () => api.post('/auth/logout'),
};

// Channel endpoints
export const channelApi = {
  getInfo: () => api.get('/channel/info'),
  updateCustomName: (customName: string) => api.patch('/channel/custom-name', { customName }),
};

// Report endpoints
export const reportApi = {
  generate: (params: { period: string; startDate?: string; endDate?: string }) => 
    api.post('/report/generate', params),
  list: () => api.get('/report'),
  download: (id: string) => `${API_BASE_URL}/report/${id}/download`,
};

// Response interceptor for handling 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
