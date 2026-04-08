import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';
import { getApiErrorMessage } from '../utils/apiError';

interface AuthState {
  token: string | null;
  userId: number | null;
  userName: string | null;
  email: string | null;
  username: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  login: (username: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userId: null,
      userName: null,
      email: null,
      username: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (username, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/api/auth/login', {
            userName: username,
            userPassword: password,
          });
          
          const { token, userId, userName, userEmail } = response.data;
          set({
            token,
            userId,
            userName,
            email: userEmail,
            username,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: getApiErrorMessage(error, 'Login failed. Please check your credentials.'),
          });
          throw error;
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          await api.post('/api/auth/register', {
            userName: name,
            userEmail: email,
            userPassword: password,
          });
          set({ isLoading: false, error: null });
        } catch (error: any) {
          set({
            isLoading: false,
            error: getApiErrorMessage(error, 'Registration failed. Please review the form fields and try again.'),
          });
          throw error;
        }
      },

      logout: () => {
        set({
          token: null,
          userId: null,
          userName: null,
          email: null,
          username: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        token: state.token, 
        username: state.username, 
        email: state.email,
        isAuthenticated: state.isAuthenticated,
        userId: state.userId,
        userName: state.userName
      }),
    }
  )
);
