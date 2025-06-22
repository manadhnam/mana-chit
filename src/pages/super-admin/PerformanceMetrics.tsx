import {UserGroupIcon, ClockIcon, ArrowLeftIcon, ChartBarIcon, ServerIcon} from '@heroicons/react/24/solid';
import React, { useState } from 'react';



interface Metric {
  id: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

interface PerformanceData {
  systemMetrics: Metric[];
  userMetrics: Metric[];
  responseTime: Metric[];
  resourceUsage: Metric[];
}

const mockData: PerformanceData = {
  systemMetrics: [
    {
      id: 'SM1',
      name: 'System Uptime',
      value: 99.99,
      unit: '%',
      change: 0.01,
      trend: 'up',
    },
    {
      id: 'SM2',
      name: 'Error Rate',
      value: 0.05,
      unit: '%',
      change: -0.02,
      trend: 'down',
    },
    {
      id: 'SM3',
      name: 'API Response Time',
      value: 150,
      unit: 'ms',
      change: -10,
      trend: 'down',
    },
  ],
  userMetrics: [
    {
      id: 'UM1',
      name: 'Active Users',
      value: 1250,
      unit: '',
      change: 150,
      trend: 'up',
    },
    {
      id: 'UM2',
      name: 'New Registrations',
      value: 45,
      unit: '/day',
      change: 5,
      trend: 'up',
    },
    {
      id: 'UM3',
      name: 'User Satisfaction',
      value: 4.8,
      unit: '/5',
      change: 0.2,
      trend: 'up',
    },
  ],
  responseTime: [
    {
      id: 'RT1',
      name: 'Average Response Time',
      value: 200,
      unit: 'ms',
      change: -15,
      trend: 'down',
    },
    {
      id: 'RT2',
      name: '95th Percentile',
      value: 350,
      unit: 'ms',
      change: -25,
      trend: 'down',
    },
    {
      id: 'RT3',
      name: 'Timeout Rate',
      value: 0.1,
      unit: '%',
      change: -0.05,
      trend: 'down',
    },
  ],
  resourceUsage: [
    {
      id: 'RU1',
      name: 'CPU Usage',
      value: 45,
      unit: '%',
      change: -5,
      trend: 'down',
    },
    {
      id: 'RU2',
      name: 'Memory Usage',
      value: 60,
      unit: '%',
      change: 2,
      trend: 'up',
    },
    {
      id: 'RU3',
      name: 'Disk Usage',
      value: 75,
      unit: '%',
      change: 1,
      trend: 'up',
    },
  ],
};

const PerformanceMetrics = () => {
  const [loading, setLoading] = useState(false);
  const [data] = useState<PerformanceData>(mockData);
  const [timeRange, setTimeRange] = useState('24h');

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
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold">Performance Metrics</h1>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
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
          {/* System Metrics */}
          <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-6 flex items-center space-x-4">
              <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                <ServerIcon className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <h2 className="text-xl font-semibold">System Metrics</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {data.systemMetrics.map((metric) => (
                <div
                  key={metric.id}
                  className="rounded-lg border p-4 dark:border-gray-700"
                >
                  <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    {metric.name}
                  </div>
                  <div className="mb-2 text-2xl font-bold">
                    {metric.value}
                    {metric.unit}
                  </div>
                  <div
                    className={`flex items-center text-sm ${getTrendColor(
                      metric.trend
                    )}`}
                  >
                    <span className="mr-1">{getTrendIcon(metric.trend)}</span>
                    {Math.abs(metric.change)}
                    {metric.unit} from last period
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Metrics */}
          <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-6 flex items-center space-x-4">
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                <UserGroupIcon className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <h2 className="text-xl font-semibold">User Metrics</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {data.userMetrics.map((metric) => (
                <div
                  key={metric.id}
                  className="rounded-lg border p-4 dark:border-gray-700"
                >
                  <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    {metric.name}
                  </div>
                  <div className="mb-2 text-2xl font-bold">
                    {metric.value}
                    {metric.unit}
                  </div>
                  <div
                    className={`flex items-center text-sm ${getTrendColor(
                      metric.trend
                    )}`}
                  >
                    <span className="mr-1">{getTrendIcon(metric.trend)}</span>
                    {Math.abs(metric.change)}
                    {metric.unit} from last period
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Response Time */}
          <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-6 flex items-center space-x-4">
              <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900">
                <ClockIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-300" aria-hidden="true" />
              </div>
              <h2 className="text-xl font-semibold">Response Time</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {data.responseTime.map((metric) => (
                <div
                  key={metric.id}
                  className="rounded-lg border p-4 dark:border-gray-700"
                >
                  <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    {metric.name}
                  </div>
                  <div className="mb-2 text-2xl font-bold">
                    {metric.value}
                    {metric.unit}
                  </div>
                  <div
                    className={`flex items-center text-sm ${getTrendColor(
                      metric.trend
                    )}`}
                  >
                    <span className="mr-1">{getTrendIcon(metric.trend)}</span>
                    {Math.abs(metric.change)}
                    {metric.unit} from last period
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resource Usage */}
          <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-6 flex items-center space-x-4">
              <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
                <ChartBarIcon className="h-6 w-6 text-purple-600 dark:text-purple-300" />
              </div>
              <h2 className="text-xl font-semibold">Resource Usage</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {data.resourceUsage.map((metric) => (
                <div
                  key={metric.id}
                  className="rounded-lg border p-4 dark:border-gray-700"
                >
                  <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    {metric.name}
                  </div>
                  <div className="mb-2 text-2xl font-bold">
                    {metric.value}
                    {metric.unit}
                  </div>
                  <div
                    className={`flex items-center text-sm ${getTrendColor(
                      metric.trend
                    )}`}
                  >
                    <span className="mr-1">{getTrendIcon(metric.trend)}</span>
                    {Math.abs(metric.change)}
                    {metric.unit} from last period
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceMetrics; 