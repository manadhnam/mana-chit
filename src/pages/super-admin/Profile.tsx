import React, { useState } from 'react';
import { ShieldCheckIcon, BellIcon, ArrowLeftIcon, UserIcon, CheckIcon } from '@heroicons/react/24/outline';
import { GlobeAltIcon as GlobeIcon } from '@heroicons/react/24/solid';

interface SuperAdminProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin: string;
  permissions: string[];
  systemAccess: {
    userManagement: boolean;
    roleManagement: boolean;
    systemSettings: boolean;
    reports: boolean;
  };
}

const mockProfile: SuperAdminProfile = {
  id: 'SA001',
  name: 'System Administrator',
  email: 'admin@smartchit.com',
  role: 'Super Admin',
  lastLogin: '2024-03-15 10:30 AM',
  permissions: [
    'Full System Access',
    'User Management',
    'Role Management',
    'System Configuration',
    'Report Generation',
  ],
  systemAccess: {
    userManagement: true,
    roleManagement: true,
    systemSettings: true,
    reports: true,
  },
};

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [profile] = useState<SuperAdminProfile>(mockProfile);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center space-x-4">
        <button
          onClick={() => window.history.back()}
          className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold">System Administrator Profile</h1>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Information */}
          <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-6 flex items-center space-x-4">
              <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                <UserIcon className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{profile.name}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">{profile.email}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Role</h3>
                <p className="text-sm">{profile.role}</p>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Last Login</h3>
                <p className="text-sm">{profile.lastLogin}</p>
              </div>
            </div>
          </div>

          {/* System Access */}
          <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-6 flex items-center space-x-4">
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                <ShieldCheckIcon className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <h2 className="text-xl font-semibold">System Access</h2>
            </div>
            <div className="space-y-4">
              {Object.entries(profile.systemAccess).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      value
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}
                  >
                    {value ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Permissions */}
          <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-6 flex items-center space-x-4">
              <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
                <BellIcon className="h-6 w-6 text-purple-600 dark:text-purple-300" />
              </div>
              <h2 className="text-xl font-semibold">Permissions</h2>
            </div>
            <div className="space-y-2">
              {profile.permissions.map((permission) => (
                <div
                  key={permission}
                  className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                  <span>{permission}</span>
                </div>
              ))}
            </div>
          </div>

          {/* System Settings */}
          <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-6 flex items-center space-x-4">
              <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900">
                <GlobeIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
              </div>
              <h2 className="text-xl font-semibold">System Settings</h2>
            </div>
            <div className="space-y-4">
              <button className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                Manage System Settings
              </button>
              <button className="w-full rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                View System Logs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile; 