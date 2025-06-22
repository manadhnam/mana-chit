import React, { useState } from 'react';
import {ArrowLeftIcon as ArrowLeftIcon} from '@heroicons/react/24/outline'
import { ArrowDownTrayIcon as ArrowDownTrayIcon, ChartBarIcon as ChartBarIcon, DocumentChartBarIcon } from '@heroicons/react/24/solid';

interface Report {
  id: string;
  name: string;
  type: string;
  description: string;
  lastGenerated: string;
  status: 'available' | 'generating' | 'error';
  size: string;
}

const mockReports: Report[] = [
  {
    id: 'R001',
    name: 'System Health Report',
    type: 'System',
    description: 'Comprehensive system health and performance metrics',
    lastGenerated: '2024-03-15 10:30 AM',
    status: 'available',
    size: '2.5 MB',
  },
  {
    id: 'R002',
    name: 'User Activity Report',
    type: 'User',
    description: 'Detailed user activity and access logs',
    lastGenerated: '2024-03-15 09:15 AM',
    status: 'available',
    size: '1.8 MB',
  },
  {
    id: 'R003',
    name: 'Security Audit Report',
    type: 'Security',
    description: 'Security audit and compliance report',
    lastGenerated: '2024-03-14 03:45 PM',
    status: 'generating',
    size: '3.2 MB',
  },
];

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [reports] = useState<Report[]>(mockReports);
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredReports = selectedType === 'all'
    ? reports
    : reports.filter(report => report.type === selectedType);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'generating':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center space-x-4">
        <button
          onClick={() => window.history.back()}
          className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold">System Reports</h1>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Report Generation */}
          <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-6 flex items-center space-x-4">
              <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                <ChartBarIcon className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <h2 className="text-xl font-semibold">Generate New Report</h2>
            </div>
            <form className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Report Type
                </label>
                <select className="w-full rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700">
                  <option value="system">System Health Report</option>
                  <option value="user">User Activity Report</option>
                  <option value="security">Security Audit Report</option>
                  <option value="performance">Performance Report</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date Range
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    className="rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <input
                    type="date"
                    className="rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700"
                  />
                </div>
              </div>
              <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                Generate Report
              </button>
            </form>
          </div>

          {/* Report List */}
          <div className="rounded-lg border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="border-b p-4 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Available Reports</h2>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700"
                >
                  <option value="all">All Types</option>
                  <option value="System">System</option>
                  <option value="User">User</option>
                  <option value="Security">Security</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Report
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Last Generated
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-gray-700">
                  {filteredReports.map((report) => (
                    <tr key={report.id}>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium">{report.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {report.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{report.type}</td>
                      <td className="px-6 py-4">{report.lastGenerated}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(
                            report.status
                          )}`}
                        >
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">{report.size}</td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button className="rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700">
                            View
                          </button>
                          <button className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                            <ArrowDownTrayIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Report Templates */}
          <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-6 flex items-center space-x-4">
              <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
                <ChartBarIcon className="h-6 w-6 text-purple-600 dark:text-purple-300" />
              </div>
              <h2 className="text-xl font-semibold">Report Templates</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border p-4 dark:border-gray-700">
                <h3 className="mb-2 font-medium">System Health Template</h3>
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                  Pre-configured template for system health reports
                </p>
                <button className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700">
                  Use Template
                </button>
              </div>
              <div className="rounded-lg border p-4 dark:border-gray-700">
                <h3 className="mb-2 font-medium">Security Audit Template</h3>
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                  Pre-configured template for security audit reports
                </p>
                <button className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700">
                  Use Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports; 