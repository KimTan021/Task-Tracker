import axios from 'axios';
import { useAuthStore } from '../hooks/useAuthStore';

// Create an Axios instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach token if it exists
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401s auto-logout
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 403 || error.response?.status === 401) {
      // Final Fix: Don't logout on the login attempt itself to avoid loops
      if (error.config?.url?.includes('/api/auth/login')) {
         return Promise.reject(error);
      }

      const authStatus = error.response?.headers?.['x-auth-status'];
      if (authStatus === 'Invalid_Token' || authStatus === 'Malformed_Bearer') {
        const { logout } = useAuthStore.getState();
        console.warn("Auth failure detected in API. Resetting state.", error.response.status, authStatus);
        logout();
      }
    }
    return Promise.reject(error);
  }
);

export default api;
