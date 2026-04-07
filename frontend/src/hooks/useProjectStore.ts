import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

export interface Project {
  projectId: number;
  projectName: string;
  user: {
    userId: number;
    userName: string;
    userEmail: string;
  };
  members?: Array<{
    userId: number;
    userName: string;
    userEmail: string;
  }>;
}

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;

  fetchProjects: (userId: number) => Promise<void>;
  createProject: (name: string, userId: number) => Promise<Project>;
  setCurrentProject: (project: Project | null) => void;
  addMember: (projectId: number, username: string) => Promise<void>;
  getMembers: (projectId: number) => Promise<any[]>;
  reset: () => void;
  clearError: () => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: [],
      currentProject: null,
      isLoading: false,
      error: null,

      fetchProjects: async (userId) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get(`/api/project/user/${userId}`);
          const projects = response.data;
          set({ 
            projects, 
            isLoading: false,
            // Auto-select first project if none selected
            currentProject: get().currentProject || projects[0] || null 
          });
        } catch (error: any) {
          set({ isLoading: false, error: 'Failed to fetch projects' });
        }
      },

      createProject: async (name, userId) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/api/project', {
            projectName: name,
            user: { userId }
          });
          const newProject = response.data;
          set((state) => ({
            projects: [...state.projects, newProject],
            currentProject: newProject,
            isLoading: false
          }));
          return newProject;
        } catch (error: any) {
          set({ 
            isLoading: false, 
            error: error.response?.data?.message || 'Failed to create project' 
          });
          throw error;
        }
      },

      setCurrentProject: (project) => {
        set({ currentProject: project });
      },

      addMember: async (projectId, username) => {
        set({ isLoading: true, error: null });
        try {
          await api.post(`/api/project/${projectId}/members`, null, {
            params: { username }
          });
          set({ isLoading: false });
        } catch (error: any) {
          set({ isLoading: false, error: error.response?.data?.message || 'Failed to add member' });
          throw error;
        }
      },

      getMembers: async (projectId) => {
        try {
          const response = await api.get(`/api/project/${projectId}/members`);
          return response.data;
        } catch (error) {
          console.error('Failed to get members', error);
          return [];
        }
      },

      reset: () => {
        set({
          projects: [],
          currentProject: null,
          isLoading: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'project-storage',
      partialize: (state) => ({ currentProject: state.currentProject }),
    }
  )
);
