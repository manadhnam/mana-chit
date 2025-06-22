import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {ChartBarIcon, CurrencyDollarIcon, ClockIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon} from '@heroicons/react/24/solid';
import {UserGroupIcon} from '@heroicons/react/24/outline';
import { Customer, Transaction } from '@/types/database';
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
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ActivityMetrics {
  total_transactions: number;
  total_deposits: number;
  total_withdrawals: number;
  average_transaction_amount: number;
  most_active_day: string;
  most_active_time: string;
  preferred_payment_method: string;
  preferred_payment_location: string;
}

interface ActivityTrend {
  date: string;
  transactions: number;
  deposits: number;
  withdrawals: number;
}

const CustomerActivity = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [metrics, setMetrics] = useState<ActivityMetrics | null>(null);
  const [trends, setTrends] = useState<ActivityTrend[]>([]);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  useEffect(() => {
    fetchCustomers();
    fetchTransactions();
    fetchMetrics();
    fetchTrends();
  }, [timeRange]);

  const fetchCustomers = async () => {
    try {
      // TODO: Replace with actual API calls
      const mockCustomers: Customer[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          mobile: '+91 9876543210',
          code: 'CUST001',
          status: 'active',
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
        },
      ];
      setCustomers(mockCustomers);
    } catch (error) {
      toast.error('Failed to load customers');
    }
  };

  const fetchTransactions = async () => {
    try {
      // TODO: Replace with actual API calls
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          user_id: '1',
          amount: 10000,
          type: 'deposit',
          status: 'completed',
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
        },
      ];
      setTransactions(mockTransactions);
    } catch (error) {
      toast.error('Failed to load transactions');
    }
  };

  const fetchMetrics = async () => {
    try {
      // TODO: Replace with actual API calls
      const mockMetrics: ActivityMetrics = {
        total_transactions: 100,
        total_deposits: 60,
        total_withdrawals: 40,
        average_transaction_amount: 5000,
        most_active_day: 'Monday',
        most_active_time: '10:00 AM - 12:00 PM',
        preferred_payment_method: 'cash',
        preferred_payment_location: 'branch',
      };
      setMetrics(mockMetrics);
    } catch (error) {
      toast.error('Failed to load metrics');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTrends = async () => {
    try {
      // TODO: Replace with actual API calls
      const mockTrends: ActivityTrend[] = [
        {
          date: '2024-01-01',
          transactions: 10,
          deposits: 6,
          withdrawals: 4,
        },
      ];
      setTrends(mockTrends);
    } catch (error) {
      toast.error('Failed to load trends');
    }
  };

  const getTransactionTrendData = () => {
    return {
      labels: trends.map((t) => new Date(t.date).toLocaleDateString()),
      datasets: [
        {
          label: 'Total Transactions',
          data: trends.map((t) => t.transactions),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
        },
        {
          label: 'Deposits',
          data: trends.map((t) => t.deposits),
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.5)',
        },
        {
          label: 'Withdrawals',
          data: trends.map((t) => t.withdrawals),
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.5)',
        },
      ],
    };
  };

  const getPaymentMethodData = () => {
    const methods = transactions.reduce((acc, t) => {
      acc[t.type] = (acc[t.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      labels: Object.keys(methods),
      datasets: [
        {
          label: 'Payment Methods',
          data: Object.values(methods),
          backgroundColor: [
            'rgba(59, 130, 246, 0.5)',
            'rgba(34, 197, 94, 0.5)',
            'rgba(239, 68, 68, 0.5)',
          ],
        },
      ],
    };
  };

  if (isLoading || !metrics) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Customer Activity
          </h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Track and analyze customer behavior
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Transactions
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {metrics.total_transactions}
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
                <CurrencyDollarIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Average Transaction
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                      ₹{metrics.average_transaction_amount.toLocaleString()}
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
                <ClockIcon />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Most Active Time
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {metrics.most_active_time}
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
                <UserGroupIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Active Customers
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {customers.length}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Activity Trends */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mb-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Transaction Trends
            </h3>
            <div className="h-80">
              <Line
                data={getTransactionTrendData()}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Payment Methods
            </h3>
            <div className="h-80">
              <Bar
                data={getPaymentMethodData()}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Activity Insights */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Activity Insights
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center">
                <ArrowTrendingUpIcon className="h-6 w-6 text-green-500 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Deposits
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {metrics.total_deposits}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center">
                <ArrowTrendingDownIcon className="h-6 w-6 text-red-500 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Withdrawals
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {metrics.total_withdrawals}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center">
                <ClockIcon />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Most Active Day
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {metrics.most_active_day}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center">
                <CurrencyDollarIcon className="h-6 w-6 text-purple-500 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Preferred Payment Method
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {metrics.preferred_payment_method}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center">
                <UserGroupIcon className="h-6 w-6 text-yellow-500 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Preferred Location
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {metrics.preferred_payment_location}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerActivity; 