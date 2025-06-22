import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  isInitialized: boolean;
  isOnline: boolean;
  lastSyncTime: string | null;
  appVersion: string;
  initializeApp: () => Promise<void>;
  setOnlineStatus: (isOnline: boolean) => void;
  updateLastSyncTime: () => void;
  checkForUpdates: () => Promise<boolean>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isInitialized: false,
      isOnline: navigator.onLine,
      lastSyncTime: null,
      appVersion: '1.0.0',

      initializeApp: async () => {
        try {
          // Mock API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          // Initialize app state
          set({
            isInitialized: true,
            isOnline: navigator.onLine,
            lastSyncTime: new Date().toISOString(),
          });

          // Add online/offline event listeners
          window.addEventListener('online', () => set({ isOnline: true }));
          window.addEventListener('offline', () => set({ isOnline: false }));
        } catch (error) {
          console.error('Failed to initialize app:', error);
          set({ isInitialized: false });
        }
      },

      setOnlineStatus: (isOnline) => {
        set({ isOnline });
      },

      updateLastSyncTime: () => {
        set({ lastSyncTime: new Date().toISOString() });
      },

      checkForUpdates: async () => {
        try {
          // Mock API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          // Mock update check
          const hasUpdate = false; // This would be determined by comparing with server version
          return hasUpdate;
        } catch (error) {
          console.error('Failed to check for updates:', error);
          return false;
        }
      },
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        appVersion: state.appVersion,
        lastSyncTime: state.lastSyncTime,
      }),
    }
  )
); 