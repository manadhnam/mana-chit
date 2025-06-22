import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';


interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
}

const mockSettings: NotificationSettings = {
  email: true,
  sms: false,
  push: true,
};

const NotificationSettings = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<NotificationSettings>(mockSettings);

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSettings(mockSettings);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleToggle = (key: keyof NotificationSettings) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleSave = () => {
    setIsLoading(true);
    // Simulate API call to save settings
    setTimeout(() => {
      console.log('Settings saved:', settings);
      setIsLoading(false);
      navigate(-1);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Back
      </button>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Notification Settings</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <div className="mt-2 text-gray-600 dark:text-gray-400">Loading settings...</div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label className="flex items-center text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={settings.email}
                  onChange={() => handleToggle('email')}
                  className="mr-2"
                />
                Email Notifications
              </label>
            </div>
            <div className="mb-4">
              <label className="flex items-center text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={settings.sms}
                  onChange={() => handleToggle('sms')}
                  className="mr-2"
                />
                SMS Notifications
              </label>
            </div>
            <div className="mb-4">
              <label className="flex items-center text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={settings.push}
                  onChange={() => handleToggle('push')}
                  className="mr-2"
                />
                Push Notifications
              </label>
            </div>
            <button
              onClick={handleSave}
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Settings'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationSettings; 