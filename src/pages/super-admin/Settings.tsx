import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cog6ToothIcon, ShieldCheckIcon, BellIcon, GlobeAltIcon, CurrencyDollarIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-hot-toast';

interface SettingSection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  fields: {
    id: string;
    label: string;
    type: 'text' | 'number' | 'select' | 'switch' | 'textarea';
    value: string | number | boolean;
    options?: { label: string; value: string }[];
  }[];
}

const Settings = () => {
  const [settings, setSettings] = useState<SettingSection[]>([
    {
      id: 'security',
      title: 'Security Settings',
      description: 'Configure system security and access control settings',
      icon: ShieldCheckIcon,
      fields: [
        {
          id: 'session_timeout',
          label: 'Session Timeout (minutes)',
          type: 'number',
          value: 30
        },
        {
          id: 'password_expiry',
          label: 'Password Expiry (days)',
          type: 'number',
          value: 90
        },
        {
          id: 'two_factor',
          label: 'Enable Two-Factor Authentication',
          type: 'switch',
          value: true
        },
        {
          id: 'login_attempts',
          label: 'Max Login Attempts',
          type: 'number',
          value: 5
        }
      ]
    },
    {
      id: 'notifications',
      title: 'Notification Settings',
      description: 'Configure system-wide notification preferences',
      icon: BellIcon,
      fields: [
        {
          id: 'email_notifications',
          label: 'Enable Email Notifications',
          type: 'switch',
          value: true
        },
        {
          id: 'sms_notifications',
          label: 'Enable SMS Notifications',
          type: 'switch',
          value: false
        },
        {
          id: 'notification_frequency',
          label: 'Notification Frequency',
          type: 'select',
          value: 'realtime',
          options: [
            { label: 'Real-time', value: 'realtime' },
            { label: 'Daily Digest', value: 'daily' },
            { label: 'Weekly Summary', value: 'weekly' }
          ]
        }
      ]
    },
    {
      id: 'system',
      title: 'System Settings',
      description: 'Configure general system settings and preferences',
      icon: Cog6ToothIcon,
      fields: [
        {
          id: 'system_name',
          label: 'System Name',
          type: 'text',
          value: 'Mana Chit'
        },
        {
          id: 'timezone',
          label: 'Default Timezone',
          type: 'select',
          value: 'UTC',
          options: [
            { label: 'UTC', value: 'UTC' },
            { label: 'IST', value: 'IST' },
            { label: 'EST', value: 'EST' }
          ]
        },
        {
          id: 'maintenance_mode',
          label: 'Maintenance Mode',
          type: 'switch',
          value: false
        }
      ]
    },
    {
      id: 'localization',
      title: 'Localization',
      description: 'Configure language and regional settings',
      icon: GlobeAltIcon,
      fields: [
        {
          id: 'default_language',
          label: 'Default Language',
          type: 'select',
          value: 'en',
          options: [
            { label: 'English', value: 'en' },
            { label: 'Hindi', value: 'hi' },
            { label: 'Telugu', value: 'te' }
          ]
        },
        {
          id: 'date_format',
          label: 'Date Format',
          type: 'select',
          value: 'DD/MM/YYYY',
          options: [
            { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
            { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
            { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' }
          ]
        }
      ]
    },
    {
      id: 'financial',
      title: 'Financial Settings',
      description: 'Configure financial and currency settings',
      icon: CurrencyDollarIcon,
      fields: [
        {
          id: 'currency',
          label: 'Default Currency',
          type: 'select',
          value: 'INR',
          options: [
            { label: 'Indian Rupee (₹)', value: 'INR' },
            { label: 'US Dollar ($)', value: 'USD' },
            { label: 'Euro (€)', value: 'EUR' }
          ]
        },
        {
          id: 'tax_rate',
          label: 'Default Tax Rate (%)',
          type: 'number',
          value: 18
        },
        {
          id: 'interest_rate',
          label: 'Default Interest Rate (%)',
          type: 'number',
          value: 12
        }
      ]
    }
  ]);

  const handleFieldChange = (sectionId: string, fieldId: string, value: string | number | boolean) => {
    setSettings(prevSettings =>
      prevSettings.map(section =>
        section.id === sectionId
          ? {
              ...section,
              fields: section.fields.map(field =>
                field.id === fieldId ? { ...field, value } : field
              )
            }
          : section
      )
    );
  };

  const handleSave = async (sectionId: string) => {
    try {
      // TODO: Implement API call to save settings
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
            System Settings
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Configure system-wide settings and preferences
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {settings.map((section) => (
          <div
            key={section.id}
            className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden"
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <section.icon className="h-6 w-6 text-gray-400 mr-3" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {section.title}
                </h3>
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {section.description}
              </p>

              <div className="mt-6 space-y-6">
                {section.fields.map((field) => (
                  <div key={field.id} className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label
                        htmlFor={field.id}
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        {field.label}
                      </label>
                      <div className="mt-1">
                        {field.type === 'text' && (
                          <input
                            type="text"
                            id={field.id}
                            value={field.value as string}
                            onChange={(e) => handleFieldChange(section.id, field.id, e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        )}
                        {field.type === 'number' && (
                          <input
                            type="number"
                            id={field.id}
                            value={field.value as number}
                            onChange={(e) => handleFieldChange(section.id, field.id, Number(e.target.value))}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        )}
                        {field.type === 'select' && (
                          <select
                            id={field.id}
                            value={field.value as string}
                            onChange={(e) => handleFieldChange(section.id, field.id, e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          >
                            {field.options?.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        )}
                        {field.type === 'switch' && (
                          <button
                            type="button"
                            role="switch"
                            aria-checked={field.value as boolean}
                            onClick={() => handleFieldChange(section.id, field.id, !field.value)}
                            className={`${
                              field.value ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                            } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
                          >
                            <span
                              className={`${
                                field.value ? 'translate-x-5' : 'translate-x-0'
                              } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                            />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => handleSave(section.id)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Settings; 