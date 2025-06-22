import {ShieldCheckIcon, CheckIcon, BellIcon, ArrowLeftIcon, Cog6ToothIcon} from '@heroicons/react/24/outline';
import { GlobeAltIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';


interface DepartmentSettings {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  security: {
    twoFactor: boolean;
    sessionTimeout: number;
    passwordExpiry: number;
  };
  department: {
    autoApprove: boolean;
    notifications: boolean;
    reporting: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    language: string;
  };
}

const mockSettings: DepartmentSettings = {
  notifications: {
    email: true,
    sms: false,
    push: true,
  },
  security: {
    twoFactor: true,
    sessionTimeout: 30,
    passwordExpiry: 90,
  },
  department: {
    autoApprove: false,
    notifications: true,
    reporting: true,
  },
  appearance: {
    theme: 'system',
    language: 'English',
  },
};

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<DepartmentSettings>(mockSettings);

  const handleToggle = (category: keyof DepartmentSettings, setting: string) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting as keyof typeof prev[typeof category]],
      },
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // TODO: Implement API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => window.history.back()}
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold">Department Settings</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          {loading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <>
              <CheckIcon className="h-5 w-5 mr-2" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Notification Settings */}
          <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-6 flex items-center space-x-4">
              <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                <BellIcon className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <h2 className="text-xl font-semibold">Notification Settings</h2>
            </div>
            <div className="space-y-4">
              {Object.entries(settings.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{key}</span>
                  <button
                    onClick={() => handleToggle('notifications', key)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      value ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        value ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Security Settings */}
          <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-6 flex items-center space-x-4">
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                <ShieldCheckIcon className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <h2 className="text-xl font-semibold">Security Settings</h2>
            </div>
            <div className="space-y-4">
              {Object.entries(settings.security).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  {typeof value === 'boolean' ? (
                    <button
                      onClick={() => handleToggle('security', key)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                        value ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  ) : (
                    <input
                      type="number"
                      value={value}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          security: { ...prev.security, [key]: parseInt(e.target.value) },
                        }))
                      }
                      className="w-20 rounded-lg border px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-700"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Department Settings */}
          <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-6 flex items-center space-x-4">
              <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900">
                <Cog6ToothIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
              </div>
              <h2 className="text-xl font-semibold">Department Settings</h2>
            </div>
            <div className="space-y-4">
              {Object.entries(settings.department).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <button
                    onClick={() => handleToggle('department', key)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      value ? 'bg-yellow-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        value ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Appearance Settings */}
          <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-6 flex items-center space-x-4">
              <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
                <GlobeAltIcon className="h-6 w-6 text-purple-600 dark:text-purple-300" />
              </div>
              <h2 className="text-xl font-semibold">Appearance Settings</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm">Theme</label>
                <select
                  value={settings.appearance.theme}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      appearance: { ...prev.appearance, theme: e.target.value as 'light' | 'dark' | 'system' },
                    }))
                  }
                  className="w-full rounded-lg border px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm">Language</label>
                <select
                  value={settings.appearance.language}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      appearance: { ...prev.appearance, language: e.target.value },
                    }))
                  }
                  className="w-full rounded-lg border px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings; 