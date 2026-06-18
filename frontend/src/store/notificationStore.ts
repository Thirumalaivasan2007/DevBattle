import { create } from 'zustand';
import api from '../lib/axios';

export interface INotification {
  _id: string;
  title: string;
  message: string;
  type: 'CONTEST' | 'BATTLE' | 'COMMUNITY' | 'ACHIEVEMENT' | 'RATING' | 'SYSTEM' | 'MENTION' | 'REWARD';
  link?: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: INotification[];
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addNotification: (notification: INotification) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,

  fetchNotifications: async () => {
    try {
      const response = await api.get('/notifications');
      const notifications = response.data;
      const unreadCount = notifications.filter((n: INotification) => !n.isRead).length;
      set({ notifications, unreadCount });
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  },

  markAsRead: async (id: string) => {
    try {
      await api.post(`/notifications/read/${id}`);
      const updated = get().notifications.map((n) =>
        n._id === id ? { ...n, isRead: true } : n
      );
      const unreadCount = updated.filter((n) => !n.isRead).length;
      set({ notifications: updated, unreadCount });
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  },

  markAllAsRead: async () => {
    try {
      await api.post('/notifications/read-all');
      const updated = get().notifications.map((n) => ({ ...n, isRead: true }));
      set({ notifications: updated, unreadCount: 0 });
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  },

  addNotification: (notification: INotification) => {
    const updated = [notification, ...get().notifications];
    const unreadCount = updated.filter((n) => !n.isRead).length;
    set({ notifications: updated, unreadCount });
  },
}));
