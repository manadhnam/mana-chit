import { create } from 'zustand';

interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  contributionReminders: boolean;
  paymentDueReminders: boolean;
  groupUpdates: boolean;
  loanUpdates: boolean;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  biometricAuth: boolean;
  sessionTimeout: number;
  loginNotifications: boolean;
}

interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'contacts';
  showBalance: boolean;
  showTransactions: boolean;
  showGroups: boolean;
}

interface UserSettings {
  id: string;
  userId: string;
  language: string;
  theme: 'light' | 'dark' | 'system';
  currency: string;
  timezone: string;
  notifications: NotificationSettings;
  security: SecuritySettings;
  privacy: PrivacySettings;
  lastUpdated: string;
}

interface SettingsState {
  userSettings: UserSettings | null;
  isLoading: boolean;
  fetchSettings: (userId: string) => Promise<void>;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => Promise<void>;
  updateSecuritySettings: (settings: Partial<SecuritySettings>) => Promise<void>;
  updatePrivacySettings: (settings: Partial<PrivacySettings>) => Promise<void>;
}

// Mock settings data for testing
const mockSettings: UserSettings = {
  id: '1',
  userId: '1',
  language: 'en',
  theme: 'light',
  currency: 'INR',
  timezone: 'Asia/Kolkata',
  notifications: {
    email: true,
    sms: true,
    push: true,
    contributionReminders: true,
    paymentDueReminders: true,
    groupUpdates: true,
    loanUpdates: true
  },
  security: {
    twoFactorAuth: false,
    biometricAuth: false,
    sessionTimeout: 30,
    loginNotifications: true
  },
  privacy: {
    profileVisibility: 'private',
    showBalance: true,
    showTransactions: false,
    showGroups: true
  },
  lastUpdated: '2024-02-01'
};

export const useSettingsStore = create<SettingsState>((set) => ({
  userSettings: null,
  isLoading: false,

  fetchSettings: async (userId: string) => {
    try {
      set({ isLoading: true });
      // Mock API call - in real app, this would fetch from backend
      set({ userSettings: mockSettings, isLoading: false });
    } catch (error) {
      console.error('Error fetching settings:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  updateSettings: async (settings: Partial<UserSettings>) => {
    try {
      set({ isLoading: true });
      // Mock API call - in real app, this would send to backend
      const updatedSettings = {
        ...mockSettings,
        ...settings,
        lastUpdated: new Date().toISOString()
      };
      set({ userSettings: updatedSettings, isLoading: false });
    } catch (error) {
      console.error('Error updating settings:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  updateNotificationSettings: async (settings: Partial<NotificationSettings>) => {
    try {
      set({ isLoading: true });
      // Mock API call - in real app, this would send to backend
      const updatedSettings = {
        ...mockSettings,
        notifications: {
          ...mockSettings.notifications,
          ...settings
        },
        lastUpdated: new Date().toISOString()
      };
      set({ userSettings: updatedSettings, isLoading: false });
    } catch (error) {
      console.error('Error updating notification settings:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  updateSecuritySettings: async (settings: Partial<SecuritySettings>) => {
    try {
      set({ isLoading: true });
      // Mock API call - in real app, this would send to backend
      const updatedSettings = {
        ...mockSettings,
        security: {
          ...mockSettings.security,
          ...settings
        },
        lastUpdated: new Date().toISOString()
      };
      set({ userSettings: updatedSettings, isLoading: false });
    } catch (error) {
      console.error('Error updating security settings:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  updatePrivacySettings: async (settings: Partial<PrivacySettings>) => {
    try {
      set({ isLoading: true });
      // Mock API call - in real app, this would send to backend
      const updatedSettings = {
        ...mockSettings,
        privacy: {
          ...mockSettings.privacy,
          ...settings
        },
        lastUpdated: new Date().toISOString()
      };
      set({ userSettings: updatedSettings, isLoading: false });
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      set({ isLoading: false });
      throw error;
    }
  }
})); 