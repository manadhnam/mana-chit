import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

import { useAuthStore } from '@/store/authStore';
import { ClockIcon, PhoneIcon } from '@heroicons/react/24/solid';

interface IVRSettings {
  enabled: boolean;
  welcomeMessage: string;
  workingHours: {
    start: string;
    end: string;
  };
  menuOptions: {
    id: string;
    key: string;
    description: string;
    action: string;
  }[];
  voiceSettings: {
    language: string;
    voiceType: string;
    speed: number;
    volume: number;
  };
}

const IVRSettings = () => {
  const [loading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<IVRSettings>({
    enabled: true,
    welcomeMessage: 'Welcome to SmartChit. Please press 1 for new chit group, 2 for existing chit group, 3 for loan application, 4 for customer support.',
    workingHours: {
      start: '09:00',
      end: '18:00',
    },
    menuOptions: [
      {
        id: '1',
        key: '1',
        description: 'New Chit Group',
        action: 'transfer_to_agent',
      },
      {
        id: '2',
        key: '2',
        description: 'Existing Chit Group',
        action: 'check_balance',
      },
      {
        id: '3',
        key: '3',
        description: 'Loan Application',
        action: 'transfer_to_agent',
      },
      {
        id: '4',
        key: '4',
        description: 'Customer Support',
        action: 'transfer_to_support',
      },
    ],
    voiceSettings: {
      language: 'en-US',
      voiceType: 'female',
      speed: 1,
      volume: 0.8,
    },
  });

  useEffect(() => {
    // Mock API call - replace with actual API
    const fetchSettings = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Settings are already initialized with mock data
      } catch (error) {
        console.error('Failed to fetch IVR settings:', error);
        toast.error('Failed to load IVR settings');
      }
    };

    fetchSettings();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isNested = name.includes('.');
    
    if (isNested) {
      const [parent, child] = name.split('.');
      setSettings(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof IVRSettings] as object),
          [child]: type === 'number' ? parseFloat(value) : value,
        },
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
      }));
    }
  };

  const handleMenuOptionChange = (id: string, field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      menuOptions: prev.menuOptions.map(option =>
        option.id === id ? { ...option, [field]: value } : option
      ),
    }));
  };

  const handleAddMenuOption = () => {
    const newId = (settings.menuOptions.length + 1).toString();
    setSettings(prev => ({
      ...prev,
      menuOptions: [
        ...prev.menuOptions,
        {
          id: newId,
          key: newId,
          description: '',
          action: 'transfer_to_agent',
        },
      ],
    }));
  };

  const handleRemoveMenuOption = (id: string) => {
    setSettings(prev => ({
      ...prev,
      menuOptions: prev.menuOptions.filter(option => option.id !== id),
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('IVR settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save IVR settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestCall = async () => {
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Test call initiated. You will receive a call shortly.');
    } catch (error) {
      toast.error('Failed to initiate test call. Please try again.');
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              IVR Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Configure your Interactive Voice Response system
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleTestCall}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 flex items-center"
            >
              <PhoneIcon />
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50 flex items-center"
            >
              {/* <CogIcon className="h-5 w-5 mr-2" /> */}
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading settings...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Basic Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Basic Settings
            </h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enabled"
                  name="enabled"
                  checked={settings.enabled}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="enabled" className="ml-2 block text-sm text-gray-900 dark:text-white">
                  Enable IVR System
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Welcome Message
                </label>
                <textarea
                  name="welcomeMessage"
                  value={settings.welcomeMessage}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Working Hours Start
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <ClockIcon />
                    </div>
                    <input
                      type="time"
                      name="workingHours.start"
                      value={settings.workingHours.start}
                      onChange={handleInputChange}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Working Hours End
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <ClockIcon />
                    </div>
                    <input
                      type="time"
                      name="workingHours.end"
                      value={settings.workingHours.end}
                      onChange={handleInputChange}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Options */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Menu Options
              </h2>
              <button
                onClick={handleAddMenuOption}
                className="px-3 py-1 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Add Option
              </button>
            </div>
            <div className="space-y-4">
              {settings.menuOptions.map((option) => (
                <div key={option.id} className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Key
                    </label>
                    <input
                      type="text"
                      value={option.key}
                      onChange={(e) => handleMenuOptionChange(option.id, 'key', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="col-span-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      value={option.description}
                      onChange={(e) => handleMenuOptionChange(option.id, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="col-span-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Action
                    </label>
                    <select
                      value={option.action}
                      onChange={(e) => handleMenuOptionChange(option.id, 'action', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="transfer_to_agent">Transfer to Agent</option>
                      <option value="check_balance">Check Balance</option>
                      <option value="transfer_to_support">Transfer to Support</option>
                      <option value="play_message">Play Message</option>
                    </select>
                  </div>
                  <div className="col-span-2 flex items-end">
                    <button
                      onClick={() => handleRemoveMenuOption(option.id)}
                      className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Voice Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Voice Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Language
                </label>
                <select
                  name="voiceSettings.language"
                  value={settings.voiceSettings.language}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="en-US">English (US)</option>
                  <option value="hi-IN">Hindi</option>
                  <option value="te-IN">Telugu</option>
                  <option value="ta-IN">Tamil</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Voice Type
                </label>
                <select
                  name="voiceSettings.voiceType"
                  value={settings.voiceSettings.voiceType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Speech Speed
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    name="voiceSettings.speed"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={settings.voiceSettings.speed}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {settings.voiceSettings.speed}x
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Volume
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    name="voiceSettings.volume"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.voiceSettings.volume}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {Math.round(settings.voiceSettings.volume * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IVRSettings; 