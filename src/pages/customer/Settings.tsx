import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';


interface UserSettings {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  theme: 'light' | 'dark' | 'system';
  language: string;
}

const mockSettings: UserSettings = {
  id: 'U1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1234567890',
  address: '123 Main St, City, Country',
  notifications: {
    email: true,
    sms: false,
    push: true,
  },
  theme: 'system',
  language: 'en',
};

const Settings = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<UserSettings | null>(null);

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSettings(mockSettings);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleNotificationChange = (type: keyof UserSettings['notifications']) => {
    if (settings) {
      setSettings({
        ...settings,
        notifications: {
          ...settings.notifications,
          [type]: !settings.notifications[type],
        },
      });
    }
  };

  const handleThemeChange = (theme: UserSettings['theme']) => {
    if (settings) {
      setSettings({ ...settings, theme });
    }
  };

  const handleLanguageChange = (language: string) => {
    if (settings) {
      setSettings({ ...settings, language });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Back
      </button>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <div className="mt-2 text-gray-600 dark:text-gray-400">Loading settings...</div>
          </div>
        ) : settings ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                  <input type="text" value={settings.name} readOnly className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <input type="email" value={settings.email} readOnly className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                  <input type="tel" value={settings.phone} readOnly className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                  <input type="text" value={settings.address} readOnly className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white" />
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notifications</h2>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" checked={settings.notifications.email} onChange={() => handleNotificationChange('email')} className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Email Notifications</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" checked={settings.notifications.sms} onChange={() => handleNotificationChange('sms')} className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">SMS Notifications</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" checked={settings.notifications.push} onChange={() => handleNotificationChange('push')} className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Push Notifications</span>
                </label>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preferences</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Theme</label>
                  <select value={settings.theme} onChange={(e) => handleThemeChange(e.target.value as UserSettings['theme'])} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white">
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Language</label>
                  <select value={settings.language} onChange={(e) => handleLanguageChange(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white">
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-600 dark:text-gray-400">No settings found.</div>
        )}
      </div>
    </div>
  );
};

export default Settings; 