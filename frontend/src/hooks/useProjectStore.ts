import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';
import { getApiErrorMessage } from '../utils/apiError';

export interface Project {
  projectId: number;
  projectName: string;
  projectDescription?: string;
  user: {
    userId: number;
    userName: string;
    userEmail: string;
  };
  members?: Array<{
    userId: number;
    userName: string;
    userEmail: string;
    role?: string;
  }>;
}

export interface ProjectInvitation {
  invitationId: number;
  projectId: number;
  projectName: string;
  projectDescription?: string;
  invitedUserId: number;
  invitedUserName: string;
  invitedByUserId: number;
  invitedByUserName: string;
  status: string;
  createdAt: string;
}

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;

  fetchProjects: (userId: number) => Promise<void>;
  createProject: (name: string, description: string, userId: number) => Promise<Project>;
  setCurrentProject: (project: Project | null) => void;
  deleteProject: (projectId: number) => Promise<void>;
  addMember: (projectId: number, username: string) => Promise<ProjectInvitation>;
  getMembers: (projectId: number) => Promise<any[]>;
  removeMember: (projectId: number, userId: number) => Promise<void>;
  promoteMember: (projectId: number, userId: number) => Promise<void>;
  getPendingInvitations: (userId: number) => Promise<ProjectInvitation[]>;
  getPendingInvitationsForProject: (projectId: number) => Promise<ProjectInvitation[]>;
  acceptInvitation: (invitationId: number) => Promise<void>;
  rejectInvitation: (invitationId: number) => Promise<void>;
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

      createProject: async (name, description, userId) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/api/project', {
            projectName: name,
            projectDescription: description,
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
            error: getApiErrorMessage(error, 'Failed to create project.') 
          });
          throw error;
        }
      },

      setCurrentProject: (project) => {
        set({ currentProject: project });
      },

      deleteProject: async (projectId) => {
        set({ isLoading: true, error: null });
        try {
          await api.delete(`/api/project/${projectId}`);
          set((state) => {
            const projects = state.projects.filter((project) => project.projectId !== projectId);
            const currentProject = state.currentProject?.projectId === projectId
              ? projects[0] || null
              : state.currentProject;
            return {
              projects,
              currentProject,
              isLoading: false,
            };
          });
        } catch (error: any) {
          set({ isLoading: false, error: getApiErrorMessage(error, 'Failed to delete project.') });
          throw error;
        }
      },

      addMember: async (projectId, username) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post(`/api/project/${projectId}/members`, null, {
            params: { username }
          });
          set({ isLoading: false });
          return response.data;
        } catch (error: any) {
          set({ isLoading: false, error: getApiErrorMessage(error, 'Failed to invite member.') });
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

      removeMember: async (projectId, userId) => {
        set({ isLoading: true, error: null });
        try {
          await api.delete(`/api/project/${projectId}/members/${userId}`);
          set({ isLoading: false });
        } catch (error: any) {
          set({ isLoading: false, error: getApiErrorMessage(error, 'Failed to remove member.') });
          throw error;
        }
      },

      promoteMember: async (projectId, userId) => {
        set({ isLoading: true, error: null });
        try {
          await api.post(`/api/project/${projectId}/members/${userId}/promote`);
          set({ isLoading: false });
        } catch (error: any) {
          set({ isLoading: false, error: getApiErrorMessage(error, 'Failed to promote collaborator.') });
          throw error;
        }
      },

      getPendingInvitations: async (userId) => {
        try {
          const response = await api.get(`/api/project/invitations/user/${userId}`);
          return response.data;
        } catch (error) {
          console.error('Failed to get pending invitations', error);
          return [];
        }
      },

      getPendingInvitationsForProject: async (projectId) => {
        try {
          const response = await api.get(`/api/project/${projectId}/invitations`);
          return response.data;
        } catch (error) {
          console.error('Failed to get project invitations', error);
          return [];
        }
      },

      acceptInvitation: async (invitationId) => {
        set({ isLoading: true, error: null });
        try {
          await api.post(`/api/project/invitations/${invitationId}/accept`);
          set({ isLoading: false });
        } catch (error: any) {
          set({ isLoading: false, error: getApiErrorMessage(error, 'Failed to accept invitation.') });
          throw error;
        }
      },

      rejectInvitation: async (invitationId) => {
        set({ isLoading: true, error: null });
        try {
          await api.post(`/api/project/invitations/${invitationId}/reject`);
          set({ isLoading: false });
        } catch (error: any) {
          set({ isLoading: false, error: getApiErrorMessage(error, 'Failed to reject invitation.') });
          throw error;
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
