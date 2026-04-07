import { create } from 'zustand';
import { Client, type IFrame, type IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import api from '../services/api';
import { useAuthStore } from './useAuthStore';
import { useProjectStore } from './useProjectStore';

export type Priority = 'High' | 'Medium' | 'Low';
export type Status = 'todo' | 'in_progress' | 'review' | 'completed';

export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Task {
  id: string;
  projectId?: string;
  title: string;
  status: Status;
  priority: Priority;
  tags: string[];
  assignees: User[];
  metadata: {
    text: string;
    icon: 'history' | 'chat_bubble' | 'calendar_today';
  };
  description?: string;
  startDate?: string;
  dueDate?: string;
  assigneeName?: string;
  archived: boolean;
  createdAt?: string;
  updatedAt?: string;
  isEditing?: boolean;
}

export interface TaskInput {
  title: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  tags?: string[];
  startDate?: string;
  dueDate?: string;
  assigneeName?: string;
  archived?: boolean;
}

interface TaskStore {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  stompClient: Client | null;
  fetchTasks: (projectId?: number) => Promise<void>;
  createTask: (input: TaskInput) => Promise<Task | null>;
  updateTask: (id: string, updates: Partial<TaskInput>) => Promise<Task | null>;
  addTask: (title: string, description: string, priority: Priority) => Promise<void>;
  updateTaskStatus: (id: string, status: Status) => Promise<void>;
  initializeWebSocket: () => void;
  disconnectWebSocket: () => void;
  clearError: () => void;
}

const formatDateLabel = (value?: string) => {
  if (!value) return 'No due date';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'No due date';
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
};

const getTaskMetadata = (task: Record<string, any>, status: Status) => {
  if (status === 'review') {
    return { text: 'Pending review', icon: 'chat_bubble' as const };
  }

  if (task.taskDateDue) {
    return { text: formatDateLabel(task.taskDateDue), icon: 'calendar_today' as const };
  }

  return { text: 'Recently updated', icon: 'history' as const };
};

const mapDbTaskToUI = (dbTask: Record<string, any>): Task => {
  const status = (dbTask.taskStatus as Status) || 'todo';
  const normalizedAssigneeName = typeof dbTask.assigneeName === 'string' ? dbTask.assigneeName.trim() : '';
  const assigneeName = normalizedAssigneeName || 'Unassigned';
  const initials = assigneeName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part: string) => part[0]?.toUpperCase())
    .join('') || 'NA';

  return {
    id: String(dbTask.taskId),
    projectId: dbTask.projectId ? String(dbTask.projectId) : undefined,
    title: dbTask.taskName,
    description: dbTask.taskDescription || '',
    status,
    priority: (dbTask.taskPriority as Priority) || 'Medium',
    tags: dbTask.taskTags ? dbTask.taskTags.split(',').map((tag: string) => tag.trim()).filter(Boolean) : [],
    assigneeName: normalizedAssigneeName,
    assignees: normalizedAssigneeName ? [{ id: `${dbTask.taskId}-assignee`, name: normalizedAssigneeName, avatar: initials }] : [],
    startDate: dbTask.taskStartDate || undefined,
    dueDate: dbTask.taskDateDue || undefined,
    archived: Boolean(dbTask.archived),
    createdAt: dbTask.createdAt || undefined,
    updatedAt: dbTask.updatedAt || undefined,
    isEditing: status === 'in_progress',
    metadata: getTaskMetadata(dbTask, status),
  };
};

const toPayload = (input: Partial<TaskInput>, existing?: Task) => ({
  projectId: existing?.projectId ? Number(existing.projectId) : undefined,
  taskName: input.title ?? existing?.title ?? '',
  taskDescription: input.description ?? existing?.description ?? '',
  taskStatus: input.status ?? existing?.status ?? 'todo',
  taskPriority: input.priority ?? existing?.priority ?? 'Medium',
  taskTags: (input.tags ?? existing?.tags ?? []).join(','),
  taskStartDate: input.startDate || existing?.startDate || null,
  taskDateDue: input.dueDate || existing?.dueDate || null,
  assigneeName: input.assigneeName ?? existing?.assigneeName ?? '',
  archived: input.archived ?? existing?.archived ?? false,
});

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,
  stompClient: null,

  clearError: () => set({ error: null }),

  initializeWebSocket: () => {
    const { email } = useAuthStore.getState();
    if (!email || get().stompClient) return;

    const socket = new SockJS('http://localhost:8080/ws-nexus');
    const stompClient = new Client({
      webSocketFactory: () => socket as never,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        stompClient.subscribe(`/topic/workspace-${email}`, (message: IMessage) => {
          if (message.body === 'UPDATED') {
            const projectId = useProjectStore.getState().currentProject?.projectId;
            void get().fetchTasks(projectId);
          }
        });
      },
      onStompError: (frame: IFrame) => {
        set({ error: frame.headers.message || 'Live update connection failed.' });
      },
    });

    stompClient.activate();
    set({ stompClient });
  },

  disconnectWebSocket: () => {
    const { stompClient } = get();
    if (stompClient) {
      void stompClient.deactivate();
      set({ stompClient: null });
    }
  },

  fetchTasks: async (projectId?: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/api/tasks');
      const tasks = response.data
        .filter((task: Record<string, any>) => !projectId || task.projectId === projectId)
        .map(mapDbTaskToUI);
      set({ tasks, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false, error: error.response?.data?.message || error.message || 'Failed to load tasks.' });
    }
  },

  createTask: async (input) => {
    set({ isLoading: true, error: null });
    const { currentProject } = useProjectStore.getState();
    if (!currentProject) {
      set({ isLoading: false, error: 'No active project selected' });
      return null;
    }

    try {
      const payload = {
        ...toPayload(input),
        projectId: currentProject.projectId,
      };
      
      const response = await api.post('/api/tasks', payload);
      const created = mapDbTaskToUI(response.data);
      set((state) => ({ tasks: [...state.tasks, created], isLoading: false }));
      return created;
    } catch (error: any) {
      set({ isLoading: false, error: error.response?.data?.message || 'Failed to create task.' });
      return null;
    }
  },

  updateTask: async (id, updates) => {
    const existing = get().tasks.find((task) => task.id === id);
    if (!existing) return null;

    try {
      const response = await api.put(`/api/tasks/${id}`, toPayload(updates, existing));
      const updated = mapDbTaskToUI(response.data);
      set((state) => ({ tasks: state.tasks.map((task) => task.id === id ? updated : task) }));
      return updated;
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to update task.' });
      return null;
    }
  },

  addTask: async (title, description, priority) => {
    await get().createTask({ title, description, priority, status: 'todo' });
  },

  updateTaskStatus: async (id, status) => {
    const existing = get().tasks.find((task) => task.id === id);
    if (!existing) return;

    const previousTasks = get().tasks;
    set({
      tasks: previousTasks.map((task) => task.id === id ? { ...task, status, isEditing: status === 'in_progress' } : task),
    });

    const updated = await get().updateTask(id, { status });
    if (!updated) {
      set({ tasks: previousTasks, error: 'Failed to update task status.' });
    }
  },
}));
