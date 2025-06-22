import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  UserGroupIcon,
} from '@heroicons/react/24/solid';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface StaffMetrics {
  department_id: string;
  total_staff: number;
  active_staff: number;
  average_attendance: number;
  average_performance: number;
  performance_trend: {
    date: string;
    score: number;
  }[];
  attendance_distribution: {
    status: string;
    count: number;
  }[];
  performance_categories: {
    category: string;
    count: number;
  }[];
  staff_performance: {
    staff_id: string;
    name: string;
    role: string;
    attendance_rate: number;
    performance_score: number;
    tasks_completed: number;
    customer_satisfaction: number;
  }[];
}

const StaffAnalytics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<StaffMetrics | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    fetchStaffMetrics();
  }, [timeRange]);

  const fetchStaffMetrics = async () => {
    try {
      // TODO: Replace with actual API calls
      const mockMetrics: StaffMetrics = {
        department_id: '1',
        total_staff: 50,
        active_staff: 45,
        average_attendance: 92,
        average_performance: 85,
        performance_trend: [
          {
            date: '2024-01',
            score: 82,
          },
          {
            date: '2024-02',
            score: 85,
          },
        ],
        attendance_distribution: [
          {
            status: 'Present',
            count: 40,
          },
          {
            status: 'Absent',
            count: 5,
          },
          {
            status: 'Late',
            count: 5,
          },
        ],
        performance_categories: [
          {
            category: 'Excellent',
            count: 15,
          },
          {
            category: 'Good',
            count: 20,
          },
          {
            category: 'Average',
            count: 10,
          },
          {
            category: 'Needs Improvement',
            count: 5,
          },
        ],
        staff_performance: [
          {
            staff_id: '1',
            name: 'John Doe',
            role: 'Field Agent',
            attendance_rate: 95,
            performance_score: 90,
            tasks_completed: 45,
            customer_satisfaction: 92,
          },
          {
            staff_id: '2',
            name: 'Jane Smith',
            role: 'Field Agent',
            attendance_rate: 88,
            performance_score: 85,
            tasks_completed: 38,
            customer_satisfaction: 88,
          },
        ],
      };
      setMetrics(mockMetrics);
    } catch (error) {
      toast.error('Failed to load staff metrics');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !metrics) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const performanceTrendData = {
    labels: metrics.performance_trend.map((point) => point.date),
    datasets: [
      {
        label: 'Performance Score',
        data: metrics.performance_trend.map((point) => point.score),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
      },
    ],
  };

  const attendanceDistributionData = {
    labels: metrics.attendance_distribution.map((item) => item.status),
    datasets: [
      {
        data: metrics.attendance_distribution.map((item) => item.count),
        backgroundColor: [
          'rgba(16, 185, 129, 0.5)',
          'rgba(239, 68, 68, 0.5)',
          'rgba(245, 158, 11, 0.5)',
        ],
      },
    ],
  };

  const performanceCategoriesData = {
    labels: metrics.performance_categories.map((category) => category.category),
    datasets: [
      {
        data: metrics.performance_categories.map((category) => category.count),
        backgroundColor: [
          'rgba(16, 185, 129, 0.5)',
          'rgba(59, 130, 246, 0.5)',
          'rgba(245, 158, 11, 0.5)',
          'rgba(239, 68, 68, 0.5)',
        ],
      },
    ],
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Staff Analytics
          </h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Track and analyze staff performance
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as 'week' | 'month' | 'year')}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Staff
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {metrics.total_staff}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Active Staff
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {metrics.active_staff}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Average Attendance
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {metrics.average_attendance}%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-6 w-6 text-purple-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Average Performance
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {metrics.average_performance}%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Performance Trend
          </h3>
          <div className="h-80">
            <Line
              data={performanceTrendData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                  },
                },
              }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Attendance Distribution
          </h3>
          <div className="h-80">
            <Doughnut
              data={attendanceDistributionData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Performance Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8"
      >
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Performance Categories
        </h3>
        <div className="h-80">
          <Doughnut
            data={performanceCategoriesData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        </div>
      </motion.div>

      {/* Staff Performance Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden"
      >
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Staff Performance Details
          </h3>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Staff
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Attendance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tasks Completed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Customer Satisfaction
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {metrics.staff_performance.map((staff) => (
                <tr key={staff.staff_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {staff.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {staff.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {staff.attendance_rate}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {staff.performance_score}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {staff.tasks_completed}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {staff.customer_satisfaction}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default StaffAnalytics; 