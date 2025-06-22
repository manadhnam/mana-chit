import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'in_app';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
  metadata?: Record<string, any>;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  // Actions
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useNotificationStore = create<NotificationState>()(
  devtools(
    persist(
      (set, get) => ({
        notifications: [],
        unreadCount: 0,
        isLoading: false,
        error: null,

        addNotification: (notification) => {
          const newNotification: Notification = {
            ...notification,
            id: crypto.randomUUID(),
            read: false,
            createdAt: new Date().toISOString(),
          };
          set((state) => ({
            notifications: [newNotification, ...state.notifications],
            unreadCount: state.unreadCount + 1,
          }));
        },

        markAsRead: (id) => {
          set((state) => ({
            notifications: state.notifications.map((notification) =>
              notification.id === id
                ? { ...notification, read: true }
                : notification
            ),
            unreadCount: Math.max(0, state.unreadCount - 1),
          }));
        },

        markAllAsRead: () => {
          set((state) => ({
            notifications: state.notifications.map((notification) => ({
              ...notification,
              read: true,
            })),
            unreadCount: 0,
          }));
        },

        deleteNotification: (id) => {
          set((state) => ({
            notifications: state.notifications.filter(
              (notification) => notification.id !== id
            ),
            unreadCount: state.notifications.find((n) => n.id === id)?.read
              ? state.unreadCount
              : Math.max(0, state.unreadCount - 1),
          }));
        },

        clearAllNotifications: () => {
          set({
            notifications: [],
            unreadCount: 0,
          });
        },

        setLoading: (isLoading) => set({ isLoading }),
        
        setError: (error) => set({ error }),
      }),
      {
        name: 'notification-storage',
      }
    )
  )
); 