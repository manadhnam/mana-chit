import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Notification } from '@/types';

interface NotificationState {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  fetchNotifications: (userId: string) => Promise<void>;
  createNotification: (data: Partial<Notification>) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],
      isLoading: false,
      error: null,

      fetchNotifications: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          // Mock API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          // Mock data
          const mockNotifications: Notification[] = [
            {
              id: '1',
              userId,
              type: 'info',
              title: 'New Loan Application',
              message: 'A new loan application has been submitted for review.',
              read: false,
              status: 'unread',
              createdAt: '2024-03-10T10:00:00Z',
              updatedAt: '2024-03-10T10:00:00Z',
            },
            {
              id: '2',
              userId,
              type: 'success',
              title: 'Payment Successful',
              message: 'Your monthly payment has been processed successfully.',
              read: true,
              status: 'read',
              createdAt: '2024-03-09T15:30:00Z',
              updatedAt: '2024-03-09T15:30:00Z',
            },
            {
              id: '3',
              userId,
              type: 'warning',
              title: 'Upcoming Meeting',
              message: 'You have a meeting scheduled for tomorrow at 2:00 PM.',
              read: false,
              status: 'unread',
              createdAt: '2024-03-08T09:15:00Z',
              updatedAt: '2024-03-08T09:15:00Z',
            },
          ];

          set({
            notifications: mockNotifications,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false,
          });
        }
      },

      createNotification: async (data: Partial<Notification>) => {
        set({ isLoading: true, error: null });
        try {
          // Mock API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          const newNotification: Notification = {
            id: String(Date.now()),
            userId: data.userId || '',
            type: data.type || 'info',
            title: data.title || '',
            message: data.message || '',
            read: false,
            status: 'unread',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          set((state) => ({
            notifications: [newNotification, ...state.notifications],
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false,
          });
        }
      },

      markAsRead: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          // Mock API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          set((state) => ({
            notifications: state.notifications.map((notification) =>
              notification.id === id
                ? {
                    ...notification,
                    read: true,
                    status: 'read',
                    updatedAt: new Date().toISOString(),
                  }
                : notification
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false,
          });
        }
      },

      markAllAsRead: async () => {
        set({ isLoading: true, error: null });
        try {
          // Mock API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          set((state) => ({
            notifications: state.notifications.map((notification) => ({
              ...notification,
              read: true,
              status: 'read',
              updatedAt: new Date().toISOString(),
            })),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false,
          });
        }
      },

      deleteNotification: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          // Mock API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          set((state) => ({
            notifications: state.notifications.filter(
              (notification) => notification.id !== id
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false,
          });
        }
      },

      clearAllNotifications: async () => {
        set({ isLoading: true, error: null });
        try {
          // Mock API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          set({
            notifications: [],
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'notification-storage'
    }
  )
); 