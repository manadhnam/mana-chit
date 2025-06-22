import { motion } from 'framer-motion';
import {
  UserGroupIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';

interface StaffAnalytics {
  id: string;
  name: string;
  role: string;
  performance: {
    attendance: number;
    tasks: number;
    customerSatisfaction: number;
    overall: number;
  };
  metrics: {
    totalCustomers: number;
    activeLoans: number;
    collections: number;
    pendingTasks: number;
  };
  trends: {
    attendance: 'up' | 'down';
    performance: 'up' | 'down';
    collections: 'up' | 'down';
  };
}

const StaffAnalytics = () => {
  const [analytics, setAnalytics] = useState<StaffAnalytics[]>([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // TODO: Replace with actual API call
      const mockAnalytics: StaffAnalytics[] = [
        {
          id: '1',
          name: 'John Doe',
          role: 'Field Agent',
          performance: {
            attendance: 95,
            tasks: 88,
            customerSatisfaction: 92,
            overall: 91,
          },
          metrics: {
            totalCustomers: 45,
            activeLoans: 12,
            collections: 85000,
            pendingTasks: 3,
          },
          trends: {
            attendance: 'up',
            performance: 'up',
            collections: 'down',
          },
        },
        {
          id: '2',
          name: 'Jane Smith',
          role: 'Loan Officer',
          performance: {
            attendance: 98,
            tasks: 95,
            customerSatisfaction: 94,
            overall: 96,
          },
          metrics: {
            totalCustomers: 38,
            activeLoans: 15,
            collections: 92000,
            pendingTasks: 1,
          },
          trends: {
            attendance: 'up',
            performance: 'up',
            collections: 'up',
          },
        },
      ];
      setAnalytics(mockAnalytics);
    } catch (error) {
      toast.error('Failed to fetch staff analytics');
    }
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    toast.success('Export functionality to be implemented');
  };

  const getTrendIcon = (trend: 'up' | 'down') => {
    return trend === 'up' ? (
      <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
    ) : (
      <ArrowTrendingDownIcon className="h-5 w-5 text-red-500" />
    );
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 75) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                Staff Analytics
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Monitor staff performance and metrics
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleExport}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {analytics.map((staff) => (
          <div
            key={staff.id}
            className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden"
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <UserGroupIcon className="h-10 w-10 text-gray-400 mr-4" />
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                      {staff.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {staff.role}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getTrendIcon(staff.trends.performance)}
                  <span className={`text-lg font-semibold ${getPerformanceColor(staff.performance.overall)}`}>
                    {staff.performance.overall}%
                  </span>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Attendance</span>
                    {getTrendIcon(staff.trends.attendance)}
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-lg font-semibold">{staff.performance.attendance}%</span>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Tasks</span>
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex items-center">
                    <ChartBarIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-lg font-semibold">{staff.performance.tasks}%</span>
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Total Customers</span>
                  <span className="text-sm font-medium">{staff.metrics.totalCustomers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Active Loans</span>
                  <span className="text-sm font-medium">{staff.metrics.activeLoans}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Collections</span>
                  <div className="flex items-center">
                    {getTrendIcon(staff.trends.collections)}
                    <span className="text-sm font-medium ml-2">₹{staff.metrics.collections.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Pending Tasks</span>
                  <span className="text-sm font-medium">{staff.metrics.pendingTasks}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default StaffAnalytics; 