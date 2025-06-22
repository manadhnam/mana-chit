import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CurrencyDollarIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/solid';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

interface BudgetCategory {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  remaining: number;
}

const BranchBudgetManagement = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Mock data loading
  useEffect(() => {
    const mockCategories: BudgetCategory[] = [
      {
        id: '1',
        name: 'Operations',
        allocated: 500000,
        spent: 350000,
        remaining: 150000,
      },
      {
        id: '2',
        name: 'Marketing',
        allocated: 200000,
        spent: 120000,
        remaining: 80000,
      },
      {
        id: '3',
        name: 'Staff Training',
        allocated: 150000,
        spent: 75000,
        remaining: 75000,
      },
      {
        id: '4',
        name: 'Infrastructure',
        allocated: 300000,
        spent: 250000,
        remaining: 50000,
      },
    ];

    setTimeout(() => {
      setBudgetCategories(mockCategories);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Chart data
  const budgetAllocationData = {
    labels: budgetCategories.map(category => category.name),
    datasets: [
      {
        data: budgetCategories.map(category => category.allocated),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)', // primary blue
          'rgba(20, 184, 166, 0.8)', // secondary teal
          'rgba(249, 115, 22, 0.8)', // accent orange
          'rgba(139, 92, 246, 0.8)', // purple
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(20, 184, 166, 1)',
          'rgba(249, 115, 22, 1)',
          'rgba(139, 92, 246, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const spendingTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Actual Spending',
        data: [80000, 95000, 110000, 105000, 120000, 115000],
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.3,
      },
      {
        label: 'Budgeted Amount',
        data: [100000, 100000, 100000, 100000, 100000, 100000],
        borderColor: 'rgba(20, 184, 166, 1)',
        backgroundColor: 'rgba(20, 184, 166, 0.2)',
        tension: 0.3,
        borderDash: [5, 5],
      },
    ],
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Branch Budget Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Track and manage your branch's budget allocation
        </p>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 mr-4">
              <CurrencyDollarIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{(budgetCategories.reduce((sum, cat) => sum + cat.allocated, 0) / 100000).toFixed(1)}L
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-secondary-100 dark:bg-secondary-900/20 text-secondary-600 dark:text-secondary-400 mr-4">
              <ChartBarIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{(budgetCategories.reduce((sum, cat) => sum + cat.spent, 0) / 100000).toFixed(1)}L
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-accent-100 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400 mr-4">
              <ClockIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Budget Utilization</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round((budgetCategories.reduce((sum, cat) => sum + cat.spent, 0) / 
                  budgetCategories.reduce((sum, cat) => sum + cat.allocated, 0)) * 100)}%
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 mr-4">
              <XCircleIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Remaining Budget</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{(budgetCategories.reduce((sum, cat) => sum + cat.remaining, 0) / 100000).toFixed(1)}L
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Budget Categories */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Budget Categories</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {budgetCategories.map((category) => (
                  <div
                    key={category.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedCategory === category.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {category.name}
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {Math.round((category.spent / category.allocated) * 100)}% spent
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${(category.spent / category.allocated) * 100}%` }}
                      ></div>
                    </div>
                    <div className="mt-2 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>₹{category.spent.toLocaleString()} spent</span>
                      <span>₹{category.remaining.toLocaleString()} remaining</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Spending Trend */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Spending Trend</h2>
            </div>
            <div className="p-6">
              <div className="h-64">
                <Line 
                  data={spendingTrendData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: 'rgba(0, 0, 0, 0.05)',
                        },
                      },
                      x: {
                        grid: {
                          display: false,
                        },
                      },
                    },
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                    },
                  }}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right column */}
        <div className="space-y-8">
          {/* Budget Allocation */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          >
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Budget Allocation</h2>
            </div>
            <div className="p-6">
              <div className="h-64 flex items-center justify-center">
                <Doughnut 
                  data={budgetAllocationData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          padding: 20,
                          usePointStyle: true,
                        },
                      },
                    },
                    cutout: '70%',
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* Budget Actions */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.8 }}
          >
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Budget Actions</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <button
                  type="button"
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Request Budget Increase
                </button>
                <button
                  type="button"
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-secondary-600 hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500"
                >
                  Add New Category
                </button>
                <button
                  type="button"
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
                >
                  Generate Report
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BranchBudgetManagement; 