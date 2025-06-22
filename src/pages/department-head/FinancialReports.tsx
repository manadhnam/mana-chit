import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BanknotesIcon, 
  CreditCardIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/solid';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { toast } from 'react-hot-toast';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface FinancialMetrics {
  department_id: string;
  total_revenue: number;
  total_expenses: number;
  net_profit: number;
  revenue_trend: {
    date: string;
    amount: number;
  }[];
  expense_categories: {
    category: string;
    amount: number;
  }[];
  revenue_sources: {
    source: string;
    amount: number;
  }[];
  monthly_comparison: {
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
  }[];
}

const FinancialReports = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<FinancialMetrics>({
    department_id: 'DEPT001',
    total_revenue: 1500000,
    total_expenses: 800000,
    net_profit: 700000,
    revenue_trend: [
      { date: '2024-01', amount: 1200000 },
      { date: '2024-02', amount: 1300000 },
      { date: '2024-03', amount: 1500000 },
    ],
    expense_categories: [
      { category: 'Salaries', amount: 400000 },
      { category: 'Operations', amount: 200000 },
      { category: 'Marketing', amount: 100000 },
      { category: 'Other', amount: 100000 },
    ],
    revenue_sources: [
      { source: 'Loans', amount: 800000 },
      { source: 'Investments', amount: 400000 },
      { source: 'Services', amount: 300000 },
    ],
    monthly_comparison: [
      {
        month: 'January',
        revenue: 1200000,
        expenses: 700000,
        profit: 500000,
      },
      {
        month: 'February',
        revenue: 1300000,
        expenses: 750000,
        profit: 550000,
      },
      {
        month: 'March',
        revenue: 1500000,
        expenses: 800000,
        profit: 700000,
      },
    ],
  });

  useEffect(() => {
    fetchFinancialMetrics();
  }, []);

  const fetchFinancialMetrics = async () => {
    try {
      setLoading(true);
      // TODO: Implement API call to fetch financial metrics
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      // setMetrics(response.data);
    } catch (error) {
      toast.error('Failed to fetch financial metrics');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      // TODO: Implement export functionality
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      toast.success('Financial report exported successfully');
    } catch (error) {
      toast.error('Failed to export financial report');
    } finally {
      setLoading(false);
    }
  };

  // Chart data
  const revenueTrendData = {
    labels: metrics.revenue_trend.map(item => item.date),
    datasets: [
      {
        label: 'Revenue',
        data: metrics.revenue_trend.map(item => item.amount),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
    ],
  };

  const monthlyComparisonData = {
    labels: metrics.monthly_comparison.map(item => item.month),
    datasets: [
      {
        label: 'Revenue',
        data: metrics.monthly_comparison.map(item => item.revenue),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
      {
        label: 'Expenses',
        data: metrics.monthly_comparison.map(item => item.expenses),
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
      },
    ],
  };

  const expenseCategoriesData = {
    labels: metrics.expense_categories.map(item => item.category),
    datasets: [
      {
        data: metrics.expense_categories.map(item => item.amount),
        backgroundColor: [
          'rgba(59, 130, 246, 0.5)',
          'rgba(239, 68, 68, 0.5)',
          'rgba(16, 185, 129, 0.5)',
          'rgba(245, 158, 11, 0.5)',
        ],
      },
    ],
  };

  const revenueSourcesData = {
    labels: metrics.revenue_sources.map(item => item.source),
    datasets: [
      {
        data: metrics.revenue_sources.map(item => item.amount),
        backgroundColor: [
          'rgba(59, 130, 246, 0.5)',
          'rgba(16, 185, 129, 0.5)',
          'rgba(245, 158, 11, 0.5)',
        ],
      },
    ],
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
                Financial Reports
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                View and analyze department financial data
              </p>
            </div>
            <button
              onClick={handleExport}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BanknotesIcon className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Revenue
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                      ₹{metrics.total_revenue.toLocaleString()}
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <ArrowTrendingUpIcon className="h-5 w-5 flex-shrink-0 self-center" />
                      <span className="sr-only">Increased by</span>
                      12%
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
                <BanknotesIcon className="h-6 w-6 text-red-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Expenses
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                      ₹{metrics.total_expenses.toLocaleString()}
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-red-600">
                      <ArrowTrendingDownIcon className="h-5 w-5 flex-shrink-0 self-center" />
                      <span className="sr-only">Decreased by</span>
                      8%
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
                <CreditCardIcon className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Net Profit
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                      ₹{metrics.net_profit.toLocaleString()}
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <ArrowTrendingUpIcon className="h-5 w-5 flex-shrink-0 self-center" />
                      <span className="sr-only">Increased by</span>
                      15%
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
            Revenue Trend
          </h3>
          <div className="h-80">
            <Line
              data={revenueTrendData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => `₹${value.toLocaleString()}`,
                    },
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
            Monthly Comparison
          </h3>
          <div className="h-80">
            <Bar
              data={monthlyComparisonData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => `₹${value.toLocaleString()}`,
                    },
                  },
                },
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Expense Categories
          </h3>
          <div className="h-80">
            <Doughnut
              data={expenseCategoriesData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Revenue Sources
          </h3>
          <div className="h-80">
            <Doughnut
              data={revenueSourcesData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Monthly Comparison Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden"
      >
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Monthly Financial Summary
          </h3>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Month
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Expenses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Profit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Profit Margin
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {metrics.monthly_comparison.map((month) => (
                <tr key={month.month}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {month.month}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    ₹{month.revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    ₹{month.expenses.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    ₹{month.profit.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {((month.profit / month.revenue) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FinancialReports; 