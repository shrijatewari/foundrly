import { create } from 'zustand';
import { Task } from '../types';
import { startupHealth } from '../data/dashboard';

interface DashboardStore {
  tasks: Task[];
  toggleTask: (id: string) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  tasks: startupHealth.dailyTasks,
  toggleTask: (id) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      ),
    })),
}));
