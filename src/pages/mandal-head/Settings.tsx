import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UserCircleIcon,
  BellIcon,
  ShieldCheckIcon,
  LanguageIcon,
  MoonIcon,
  SunIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/solid';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user, logout } = useAuthStore();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
  });
  const [language, setLanguage] = useState('en');

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const handleNotificationChange = (type: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
    toast.success(`Notifications ${notifications[type] ? 'disabled' : 'enabled'}`);
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    toast.success('Language updated successfully');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // TODO: Implement dark mode toggle
    toast.success(`Dark mode ${darkMode ? 'disabled' : 'enabled'}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Profile Settings */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center space-x-4">
            <UserCircleIcon className="h-16 w-16 text-gray-400" />
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {user?.name || 'Mandal Head'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user?.email || 'mandal.head@example.com'}
              </p>
            </div>
      </div>
        </div>
      </div>

          {/* Notification Settings */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Notification Settings
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BellIcon className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Email Notifications</span>
              </div>
                  <button
                onClick={() => handleNotificationChange('email')}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  notifications.email ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    notifications.email ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BellIcon className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Push Notifications</span>
              </div>
                    <button
                onClick={() => handleNotificationChange('push')}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  notifications.push ? 'bg-primary-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    notifications.push ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BellIcon className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-sm text-gray-700 dark:text-gray-300">SMS Notifications</span>
              </div>
                    <button
                onClick={() => handleNotificationChange('sms')}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  notifications.sms ? 'bg-primary-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    notifications.sms ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
            </div>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Security Settings
          </h3>
          <div className="space-y-4">
            <button
              onClick={() => toast.success('Change password functionality to be implemented')}
              className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
            >
              <div className="flex items-center">
                <ShieldCheckIcon className="h-5 w-5 text-gray-400 mr-3" />
                <span>Change Password</span>
              </div>
            </button>
            <button
              onClick={() => toast.success('Two-factor authentication to be implemented')}
              className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
            >
              <div className="flex items-center">
                <ShieldCheckIcon className="h-5 w-5 text-gray-400 mr-3" />
                <span>Two-Factor Authentication</span>
              </div>
            </button>
          </div>
            </div>
          </div>

          {/* Appearance Settings */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Appearance
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {darkMode ? (
                  <MoonIcon className="h-5 w-5 text-gray-400 mr-3" />
                ) : (
                  <SunIcon className="h-5 w-5 text-gray-400 mr-3" />
                )}
                <span className="text-sm text-gray-700 dark:text-gray-300">Dark Mode</span>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  darkMode ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    darkMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <LanguageIcon className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Language</span>
                </div>
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="block w-32 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="te">Telugu</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
            Logout
          </button>
        </div>
    </div>
    </motion.div>
  );
};

export default Settings; 