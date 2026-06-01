import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { startupHealth } from '../data/dashboard';
import { Task } from '../types';

const STORAGE_KEY = '@foundrly/tasks';

interface DashboardStore {
  tasks: Task[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  toggleTask: (id: string) => void;
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  tasks: startupHealth.dailyTasks,
  hydrated: false,

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        set({ tasks: JSON.parse(raw) as Task[], hydrated: true });
      } else {
        set({ hydrated: true });
      }
    } catch {
      set({ hydrated: true });
    }
  },

  toggleTask: (id) => {
    const tasks = get().tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    set({ tasks });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)).catch(() => {});
  },
}));

// Hydrate immediately on module load so any screen that mounts gets fresh data.
useDashboardStore.getState().hydrate();
