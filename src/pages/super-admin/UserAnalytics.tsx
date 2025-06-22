import {UserGroupIcon, ClockIcon, ChartBarIcon, GlobeAltIcon} from '@heroicons/react/24/solid';
import React, { useState } from 'react';

interface UserMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

interface UserActivity {
  id: string;
  type: 'login' | 'registration' | 'transaction' | 'support';
  count: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

interface UserDemographic {
  id: string;
  category: string;
  value: number;
  percentage: number;
}

const mockMetrics: UserMetric[] = [
  {
    id: 'UM1',
    name: 'Total Users',
    value: 15000,
    change: 1500,
    trend: 'up',
  },
  {
    id: 'UM2',
    name: 'Active Users',
    value: 8500,
    change: 500,
    trend: 'up',
  },
  {
    id: 'UM3',
    name: 'New Registrations',
    value: 450,
    change: 50,
    trend: 'up',
  },
  {
    id: 'UM4',
    name: 'User Retention',
    value: 85,
    change: 2,
    trend: 'up',
  },
];

const mockActivities: UserActivity[] = [
  {
    id: 'UA1',
    type: 'login',
    count: 25000,
    change: 2000,
    trend: 'up',
  },
  {
    id: 'UA2',
    type: 'registration',
    count: 450,
    change: 50,
    trend: 'up',
  },
  {
    id: 'UA3',
    type: 'transaction',
    count: 15000,
    change: 1500,
    trend: 'up',
  },
  {
    id: 'UA4',
    type: 'support',
    count: 250,
    change: -50,
    trend: 'down',
  },
];

const mockDemographics: UserDemographic[] = [
  {
    id: 'UD1',
    category: 'Age Groups',
    value: 100,
    percentage: 100,
  },
  {
    id: 'UD2',
    category: 'Gender',
    value: 100,
    percentage: 100,
  },
  {
    id: 'UD3',
    category: 'Location',
    value: 100,
    percentage: 100,
  },
  {
    id: 'UD4',
    category: 'Device Type',
    value: 100,
    percentage: 100,
  },
];

const UserAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const [metrics] = useState<UserMetric[]>(mockMetrics);
  const [activities] = useState<UserActivity[]>(mockActivities);
  const [demographics] = useState<UserDemographic[]>(mockDemographics);
  const [timeRange, setTimeRange] = useState('30d');

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      default:
        return '→';
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
            <ClockIcon className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold">User Analytics</h1>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            Export Report
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* User Metrics */}
          <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-6 flex items-center space-x-4">
              <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                <UserGroupIcon className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <h2 className="text-xl font-semibold">User Metrics</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              {metrics.map((metric) => (
                <div
                  key={metric.id}
                  className="rounded-lg border p-4 dark:border-gray-700"
                >
                  <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    {metric.name}
                  </div>
                  <div className="mb-2 text-2xl font-bold">
                    {metric.value.toLocaleString()}
                    {metric.name === 'User Retention' && '%'}
                  </div>
                  <div
                    className={`flex items-center text-sm ${getTrendColor(
                      metric.trend
                    )}`}
                  >
                    <span className="mr-1">{getTrendIcon(metric.trend)}</span>
                    {Math.abs(metric.change).toLocaleString()}
                    {metric.name === 'User Retention' ? '%' : ''} from last period
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Activity */}
          <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-6 flex items-center space-x-4">
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                <ChartBarIcon className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <h2 className="text-xl font-semibold">User Activity</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="rounded-lg border p-4 dark:border-gray-700"
                >
                  <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                  </div>
                  <div className="mb-2 text-2xl font-bold">
                    {activity.count.toLocaleString()}
                  </div>
                  <div
                    className={`flex items-center text-sm ${getTrendColor(
                      activity.trend
                    )}`}
                  >
                    <span className="mr-1">{getTrendIcon(activity.trend)}</span>
                    {Math.abs(activity.change).toLocaleString()} from last period
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Demographics */}
          <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-6 flex items-center space-x-4">
              <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
                <GlobeAltIcon className="h-6 w-6 text-purple-600 dark:text-purple-300" />
              </div>
              <h2 className="text-xl font-semibold">User Demographics</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              {demographics.map((demo) => (
                <div
                  key={demo.id}
                  className="rounded-lg border p-4 dark:border-gray-700"
                >
                  <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    {demo.category}
                  </div>
                  <div className="mb-2 text-2xl font-bold">
                    {demo.value.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {demo.percentage}% of total users
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Engagement */}
          <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-6 flex items-center space-x-4">
              <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900">
                <ClockIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-300" aria-hidden="true" />
              </div>
              <h2 className="text-xl font-semibold">User Engagement</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Average Session Duration
                </label>
                <div className="text-2xl font-bold">15 minutes</div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Pages per Session
                </label>
                <div className="text-2xl font-bold">4.5 pages</div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Bounce Rate
                </label>
                <div className="text-2xl font-bold">35%</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAnalytics; 