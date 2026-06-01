import { create } from 'zustand';

export interface Notification {
  id: string;
  type: 'mentor' | 'community' | 'event' | 'ai' | 'funding';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

interface NotificationState {
  today: Notification[];
  earlier: Notification[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
}

const INITIAL_TODAY: Notification[] = [
  { id: '1', type: 'mentor',    title: 'Mentor Reply',    message: 'Sarah Johnson replied to your pitch deck question',    time: '2m ago',  isRead: false },
  { id: '2', type: 'community', title: 'New Like',         message: 'Your post got 12 new likes in the last hour',         time: '15m ago', isRead: false },
  { id: '3', type: 'ai',        title: 'AI Insight',       message: 'New startup insight available based on your progress', time: '1h ago',  isRead: false },
  { id: '4', type: 'event',     title: 'Event Reminder',   message: 'Startup Bootcamp 2026 starts in 2 days. Are you ready?', time: '2h ago', isRead: true  },
];

const INITIAL_EARLIER: Notification[] = [
  { id: '5', type: 'funding',   title: 'Grant Opportunity', message: 'New startup grant available — deadline in 5 days',           time: '1d ago', isRead: true },
  { id: '6', type: 'mentor',    title: 'New Mentor Match',  message: 'You have a new mentor match — David Kim from Google',        time: '2d ago', isRead: true },
  { id: '7', type: 'community', title: 'Trending Post',     message: 'Your post about validation is trending in the community',    time: '3d ago', isRead: true },
  { id: '8', type: 'event',     title: 'Workshop Available', message: 'Free pitch workshop available this weekend',                time: '4d ago', isRead: true },
];

function countUnread(today: Notification[], earlier: Notification[]): number {
  return [...today, ...earlier].filter((n) => !n.isRead).length;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  today: INITIAL_TODAY,
  earlier: INITIAL_EARLIER,
  unreadCount: countUnread(INITIAL_TODAY, INITIAL_EARLIER),

  markRead: (id) => {
    const update = (list: Notification[]) =>
      list.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    const today   = update(get().today);
    const earlier = update(get().earlier);
    set({ today, earlier, unreadCount: countUnread(today, earlier) });
  },

  markAllRead: () => {
    const readAll = (list: Notification[]) => list.map((n) => ({ ...n, isRead: true }));
    const today   = readAll(get().today);
    const earlier = readAll(get().earlier);
    set({ today, earlier, unreadCount: 0 });
  },
}));
