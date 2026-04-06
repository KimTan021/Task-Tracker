import { create } from 'zustand';

export type Priority = 'High' | 'Medium' | 'Low';
export type Status = 'todo' | 'in_progress' | 'review' | 'completed';

export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Task {
  id: string;
  title: string;
  status: Status;
  priority: Priority;
  tags: string[];
  assignees: User[];
  metadata: {
    text: string;
    icon: 'history' | 'chat_bubble' | 'calendar_today';
  };
  isEditing?: boolean;
  editingBy?: string;
  description?: string;
}

interface TaskStore {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  updateTaskStatus: (id: string, status: Status) => void;
}

export const MOCK_USERS: Record<string, User> = {
  user1: { id: 'u1', name: 'Alex Chen', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-JQr3P9LmlPkf-Hiv-HUHWZUSXAoDg22FIT52xmGwUP9sjSg9WLbqCkQdjUmUksB_4jCbAa2fcdW-s9q2bdW0QmX9fVxdLjvdXNSKJlUF9ayXJo0bIeGUoAzZj5PBnna114blk8dr4Xdhbx0BZNfszdqs61HO3vnz-ZyFDpZaw5UwTywpmYoQGmf39-Rkuyd5Y0gpW1rvScQJV_bzINmygzEt_wSu5aFooNpHSc9b8M0i1YULRasE_0wk7-uCa0zkegDvxuA2SBo' },
  user2: { id: 'u2', name: 'Sarah Jenkins', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWEgOXZNSxhPhiqemyqF6zaHQQiWi2zG4b8dXELlEQxXDhgbZPpxizTYUY7n73pljB29F0NWsGmwiOeegwRbimzQk2DE98UB-3B-XhjBatOkJPNP5hnBCXTw44kemNLT5SWC9iuc8uNpKB_Ji8-5UD7pvJEdBSiUrbndqsgwj6Ps8N2gmhAAJqyhhHYc9T6eBwmnS9V-5JW-aa5qoKcW9u2IgYqb4l7YBjinmoVOMNKrrf0Axb2OQJKIsc5kpxUveFCAEnIsmwbUQ' },
  user3: { id: 'u3', name: 'David Lee', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2CPEx0bcpagFtZkRDnhri1vBcKPc84fDwdJtLdrXoRutAc-XzXVZsNMQBcBMJZCFfobYwELFcpEgTRm1BKhHbrKUm558M8infBege3SAYj0Mk0kIR-Xiht28BFq0A57RuxRvGJIcvlep6knRe8AqTtds9yNq_pD_qLDxFPNIk0Yvk9kCUKpkZI2TEZurDKKUzLwhKYcxaAIkn8_OjAhHlyOshAg13K_nHhu9fxWYVa-WLF2HdplrAO8Qg3Yvibytr0-9DJVJrgaM' },
  user4: { id: 'u4', name: 'Michael Scott', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaZwVZjpceRYDNog2xeOzh8SdFokpIAkTUTjtJ9Q3ofuo8y1Brpsl9fL040vc4m3y3MH5ZURHhovM7CB4wllHXR7iLK7EdmckrxeeiLQU5GWay-MTC13FrAzteGGQhENsguPjvsTHh5cu3VKVSVEAPE_Idw1AtnA7mUEI6UpqP8k5uKpEKqRJ0gu2y7C5bV3T7OwBXisAryoHAqhvwCLk1ADxFlfvx_2wBSGY1ZJ-qvXMVLO6Y7uJOxqIqbjfMfcXXFWBnZBZZUcE' },
  user5: { id: 'u5', name: 'Emily Clark', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBM_IWuRhNfabpWZZ8HbUw9F-_pnPX-rdJx7nQMznzI8xYeBTVsQYbdURp6WdcCQLIIA64rAMwTjn1nO-oi4cpVO_5mHb7UJMLvN8IXyOfGLQgwvfuXDTu6NIB3giglCIhIz_wKqjnre0GFx6PzDq7bze-Q9I7roS3ubLRfODG96oHDl8fzT4y-eHnzLhhtT7W0Ba-hyA-7MyefXww1LHFa6l7oQZFP5qijVBA_NEm-kWb9ciZgqSWCR_o3LSAI-_2eylK8_aNgw2Y' },
  user6: { id: 'u6', name: 'John Doe', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCN0j3vwM6Hjm2BtzA3-JHLmRBf2qeH06gAhcJ9rjm5nWYGV8FchPsMH1spEi4t6weYEXt3bo4dtve11GE7K_k5kKz0UI1nki9GnVEP4mGn1FnkVTENE6Jyj3V37X9i1gNlc00j0L1ERn4L6RuU4h8_0r-ZLJKgUa_XfXjxrbh5yNU7jwDO3ADHy2k6u7U45Pte4t17VA2st14t8mFEPZEp4kfKSNC173Qua3eUCz2hyIs8at1P7nzEritvVHYFwXUMBoEaC30QrZM' },
  user7: { id: 'u7', name: 'Lisa Ann', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZtBYdKd6_GwD9RenAp2b4F0OshbypIUMGuMuflGmz4Wvb-Ljrv7S4wD8mhD49a0YRiYIW6kKR-OT3KZw0sz51IgFsZfY7_CAPmchEqwxT_s9QTPgXw1OooUC5IfDh9Gbf3HwUzsAnW1MLENC4YFOitsPG3R2IqAP-sf_a3yM4mb82ZucrWaQofJhSoE5ugLkpD9X0On6TdG2DuLbaF55SffHhJqzfA1sP6EjPaMwe9Y5Vt884-zSrq31_jSq7hALOM7dujfgOtuE' },
  user8: { id: 'u8', name: 'Tom Hardy', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBe-TH2IE4SmRx-Ysj7ZRcttnMRNJp5z62EvteuNMkYfQh_bgUiEevyfk7N-gK8m7B-fmFlCq1NGG3CHkTFm5NtSVQnXKXegWR1i4pEXYrvRBmH0Rf72BAJcSzSVQGd2flxNoRuEYSV-IgI4QwshIuxQhOMWEVUDNRe5K2RP9D82rFCZtVfExBYHszTjYQ0Zc8TargQiX1-AzTY0lVoVwvqnX7A69M9HsLGP51jUuDybAaz4CeRfN6RueQRtc3W47CSoIUvG0AEKXc' }
};

const INITIAL_TASKS: Task[] = [
  {
    id: 't1', title: 'Revise structural framework for Monolith v2', status: 'todo', priority: 'High',
    tags: ['Architecture', 'Drafting'], assignees: [MOCK_USERS.user1, MOCK_USERS.user2],
    metadata: { text: '2h ago', icon: 'history' }
  },
  {
    id: 't2', title: 'Competitor analysis report: Q3 Studio Trends', status: 'todo', priority: 'Medium',
    tags: ['Research'], assignees: [MOCK_USERS.user3],
    metadata: { text: '5h ago', icon: 'history' }
  },
  {
    id: 't3', title: 'Material selection for North Wing facade', status: 'in_progress', priority: 'High',
    tags: ['Materials', 'Sourcing'], assignees: [MOCK_USERS.user4],
    metadata: { text: 'Editing now', icon: 'history' },
    isEditing: true, editingBy: 'Alex Chen', description: 'Currently being edited by Alex Chen. Reviewing slate and glass samples.'
  },
  {
    id: 't4', title: 'Weekly team sync preparation', status: 'in_progress', priority: 'Low',
    tags: [], assignees: [MOCK_USERS.user5, MOCK_USERS.user6],
    metadata: { text: '15m ago', icon: 'history' }
  },
  {
    id: 't5', title: 'Client presentation deck for Urban Oasis Project', status: 'review', priority: 'Medium',
    tags: ['Presentation', 'Client'], assignees: [MOCK_USERS.user7],
    metadata: { text: '3 comments', icon: 'chat_bubble' }
  },
  {
    id: 't6', title: 'Site survey: West Boulevard Plot', status: 'completed', priority: 'High',
    tags: [], assignees: [MOCK_USERS.user8],
    metadata: { text: 'Yesterday', icon: 'calendar_today' }
  }
];

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: INITIAL_TASKS,
  setTasks: (tasks) => set({ tasks }),
  updateTaskStatus: (id, status) => set((state) => ({
    tasks: state.tasks.map(task => task.id === id ? { ...task, status } : task)
  }))
}));
