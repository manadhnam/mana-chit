import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import toast from 'react-hot-toast';

interface SystemSetting {
  id: string;
  category: string;
  name: string;
  value: string | number | boolean;
  type: 'text' | 'number' | 'boolean' | 'select';
  description: string;
  options?: string[];
}

const SystemSettings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [activeCategory, setActiveCategory] = useState('general');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Simulate loading system settings
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        // Mock data - replace with actual API calls
        const mockSettings: SystemSetting[] = [
          // General Settings
          {
            id: '1',
            category: 'general',
            name: 'Company Name',
            value: 'Mana Chit',
            type: 'text',
            description: 'The name of your organization',
          },
          {
            id: '2',
            category: 'general',
            name: 'System Timezone',
            value: 'Asia/Kolkata',
            type: 'select',
            description: 'Default timezone for the system',
            options: ['Asia/Kolkata', 'UTC', 'America/New_York', 'Europe/London'],
          },
          {
            id: '3',
            category: 'general',
            name: 'Maintenance Mode',
            value: false,
            type: 'boolean',
            description: 'Enable maintenance mode to restrict access',
          },

          // Database Settings
          {
            id: '4',
            category: 'database',
            name: 'Backup Frequency',
            value: 'daily',
            type: 'select',
            description: 'How often to backup the database',
            options: ['hourly', 'daily', 'weekly', 'monthly'],
          },
          {
            id: '5',
            category: 'database',
            name: 'Retention Period',
            value: 30,
            type: 'number',
            description: 'Number of days to keep backups',
          },

          // Email Settings
          {
            id: '6',
            category: 'email',
            name: 'SMTP Server',
            value: 'smtp.gmail.com',
            type: 'text',
            description: 'SMTP server for sending emails',
          },
          {
            id: '7',
            category: 'email',
            name: 'SMTP Port',
            value: 587,
            type: 'number',
            description: 'SMTP server port',
          },
          {
            id: '8',
            category: 'email',
            name: 'Enable Email Notifications',
            value: true,
            type: 'boolean',
            description: 'Send email notifications for important events',
          },

          // Security Settings
          {
            id: '9',
            category: 'security',
            name: 'Password Expiry',
            value: 90,
            type: 'number',
            description: 'Days until password expires',
          },
          {
            id: '10',
            category: 'security',
            name: 'Two-Factor Authentication',
            value: true,
            type: 'boolean',
            description: 'Require 2FA for admin users',
          },
          {
            id: '11',
            category: 'security',
            name: 'Session Timeout',
            value: 30,
            type: 'number',
            description: 'Minutes until session expires',
          },
        ];

        setSettings(mockSettings);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSettingChange = (id: string, value: string | number | boolean) => {
    setSettings(prev =>
      prev.map(setting =>
        setting.id === id ? { ...setting, value } : setting
      )
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const categories = [
    { id: 'general', name: 'General', icon: User },
    { id: 'database', name: 'Database', icon: User },
    { id: 'email', name: 'Email', icon: User },
    { id: 'security', name: 'Security', icon: User },
  ];

  const filteredSettings = settings.filter(
    setting => setting.category === activeCategory
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Configure system-wide settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Categories
              </h2>
              <nav className="space-y-1">
                {categories.map(category => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        activeCategory === category.id
                          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                          : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {category.name}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Settings Form */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <form className="space-y-6">
                {filteredSettings.map(setting => (
                  <div key={setting.id}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {setting.name}
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {setting.description}
                    </p>
                    {setting.type === 'text' && (
                      <input
                        type="text"
                        value={setting.value as string}
                        onChange={e => handleSettingChange(setting.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      />
                    )}
                    {setting.type === 'number' && (
                      <input
                        type="number"
                        value={setting.value as number}
                        onChange={e => handleSettingChange(setting.id, Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      />
                    )}
                    {setting.type === 'boolean' && (
                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={() => handleSettingChange(setting.id, !setting.value)}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                            setting.value ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              setting.value ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                        <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
                          {setting.value ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    )}
                    {setting.type === 'select' && setting.options && (
                      <select
                        value={setting.value as string}
                        onChange={e => handleSettingChange(setting.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      >
                        {setting.options.map(option => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}

                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    <User className="h-4 w-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings; 