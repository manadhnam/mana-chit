import React, { useState } from 'react';
import {ShieldCheckIcon as ShieldCheckIcon, BellIcon as BellIcon, ArrowLeftIcon as ArrowLeftIcon, UserIcon as UserIcon, CheckIcon as CheckIcon} from '@heroicons/react/24/outline';
import { GlobeAltIcon as GlobeIcon } from '@heroicons/react/24/solid';

interface BranchManagerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  branch: string;
  role: string;
  joinDate: string;
  status: 'active' | 'inactive';
  lastLogin: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  security: {
    twoFactor: boolean;
    lastPasswordChange: string;
  };
  preferences: {
    language: string;
    timezone: string;
  };
}

const mockProfile: BranchManagerProfile = {
  id: 'BM001',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+91 9876543210',
  branch: 'Main Branch',
  role: 'Branch Manager',
  joinDate: '2024-01-15',
  status: 'active',
  lastLogin: '2024-03-15 10:30 AM',
  notifications: {
    email: true,
    sms: false,
    push: true,
  },
  security: {
    twoFactor: true,
    lastPasswordChange: '2024-02-01',
  },
  preferences: {
    language: 'English',
    timezone: 'Asia/Kolkata',
  },
};

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [profile] = useState<BranchManagerProfile>(mockProfile);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center space-x-4">
        <button
          onClick={() => window.history.back()}
          className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Personal Information */}
          <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-6 flex items-center space-x-4">
              <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                <UserIcon className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <h2 className="text-xl font-semibold">Personal Information</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Name</label>
                <p className="font-medium">{profile.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Email</label>
                <p className="font-medium">{profile.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Phone</label>
                <p className="font-medium">{profile.phone}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Branch</label>
                <p className="font-medium">{profile.branch}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Role</label>
                <p className="font-medium">{profile.role}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Join Date</label>
                <p className="font-medium">{profile.joinDate}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Status</label>
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                    profile.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                  }`}
                >
                  {profile.status}
                </span>
              </div>
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
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Two-Factor Authentication</label>
                <p className="font-medium">{profile.security.twoFactor ? 'Enabled' : 'Disabled'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Last Password Change</label>
                <p className="font-medium">{profile.security.lastPasswordChange}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Last Login</label>
                <p className="font-medium">{profile.lastLogin}</p>
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-6 flex items-center space-x-4">
              <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900">
                <BellIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
              </div>
              <h2 className="text-xl font-semibold">Notification Preferences</h2>
            </div>
            <div className="space-y-4">
              {Object.entries(profile.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{key}</span>
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      value
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                    }`}
                  >
                    {value ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Preferences */}
          <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-6 flex items-center space-x-4">
              <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
                <GlobeAltIcon className="h-6 w-6 text-purple-600 dark:text-purple-300" />
              </div>
              <h2 className="text-xl font-semibold">Preferences</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Language</label>
                <p className="font-medium">{profile.preferences.language}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Timezone</label>
                <p className="font-medium">{profile.preferences.timezone}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile; 