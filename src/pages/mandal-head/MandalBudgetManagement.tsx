import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, BarElement } from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import toast from 'react-hot-toast';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, BarElement);

interface Budget {
  id: string;
  category: string;
  allocated: number;
  spent: number;
  remaining: number;
  status: 'under' | 'over' | 'on-track';
}

interface BudgetMetrics {
  totalBudget: number;
  totalSpent: number;
  totalRemaining: number;
  utilizationRate: number;
  monthlyTrend: {
    month: string;
    allocated: number;
    spent: number;
  }[];
  categoryBreakdown: Budget[];
}

const MandalBudgetManagement = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<BudgetMetrics>({
    totalBudget: 0,
    totalSpent: 0,
    totalRemaining: 0,
    utilizationRate: 0,
    monthlyTrend: [],
    categoryBreakdown: [],
  });

  const [showAddBudget, setShowAddBudget] = useState(false);
  const [newBudget, setNewBudget] = useState({
    category: '',
    allocated: 0,
  });

  useEffect(() => {
    // Simulate loading budget metrics
    const loadMetrics = async () => {
      setIsLoading(true);
      try {
        // Mock data - replace with actual API calls
        const mockMetrics: BudgetMetrics = {
          totalBudget: 5000000,
          totalSpent: 3200000,
          totalRemaining: 1800000,
          utilizationRate: 64,
          monthlyTrend: [
            { month: 'Jan', allocated: 800000, spent: 750000 },
            { month: 'Feb', allocated: 800000, spent: 780000 },
            { month: 'Mar', allocated: 800000, spent: 820000 },
            { month: 'Apr', allocated: 800000, spent: 850000 },
            { month: 'May', allocated: 800000, spent: 0 },
            { month: 'Jun', allocated: 800000, spent: 0 },
          ],
          categoryBreakdown: [
            {
              id: '1',
              category: 'Operations',
              allocated: 2000000,
              spent: 1200000,
              remaining: 800000,
              status: 'on-track',
            },
            {
              id: '2',
              category: 'Staff Salaries',
              allocated: 1500000,
              spent: 1000000,
              remaining: 500000,
              status: 'on-track',
            },
            {
              id: '3',
              category: 'Marketing',
              allocated: 500000,
              spent: 400000,
              remaining: 100000,
              status: 'over',
            },
            {
              id: '4',
              category: 'Infrastructure',
              allocated: 1000000,
              spent: 600000,
              remaining: 400000,
              status: 'under',
            },
          ],
        };
        setMetrics(mockMetrics);
      } finally {
        setIsLoading(false);
      }
    };

    loadMetrics();
  }, []);

  // Chart data
  const monthlyTrendData = {
    labels: metrics.monthlyTrend.map(item => item.month),
    datasets: [
      {
        label: 'Allocated',
        data: metrics.monthlyTrend.map(item => item.allocated),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.3,
      },
      {
        label: 'Spent',
        data: metrics.monthlyTrend.map(item => item.spent),
        borderColor: 'rgba(20, 184, 166, 1)',
        backgroundColor: 'rgba(20, 184, 166, 0.2)',
        tension: 0.3,
      },
    ],
  };

  const categoryBreakdownData = {
    labels: metrics.categoryBreakdown.map(item => item.category),
    datasets: [
      {
        label: 'Allocated',
        data: metrics.categoryBreakdown.map(item => item.allocated),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
      {
        label: 'Spent',
        data: metrics.categoryBreakdown.map(item => item.spent),
        backgroundColor: 'rgba(20, 184, 166, 0.8)',
        borderColor: 'rgba(20, 184, 166, 1)',
        borderWidth: 1,
      },
    ],
  };

  const handleAddBudget = (e: React.FormEvent) => {
    e.preventDefault();
    // Add validation and API call here
    toast.success('Budget category added successfully!');
    setShowAddBudget(false);
    setNewBudget({ category: '', allocated: 0 });
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Budget Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Track and manage mandal budget allocations
            </p>
          </div>
          <button
            onClick={() => setShowAddBudget(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
          >
            <User className="h-4 w-4 mr-2" />
            Add Budget Category
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 mr-4">
              <User className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{(metrics.totalBudget / 100000).toFixed(1)}L
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
              <User className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{(metrics.totalSpent / 100000).toFixed(1)}L
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
              <User className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Remaining</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{(metrics.totalRemaining / 100000).toFixed(1)}L
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
            <div className="p-3 rounded-full bg-warning-100 dark:bg-warning-900/20 text-warning-600 dark:text-warning-400 mr-4">
              <User className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Utilization Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.utilizationRate}%</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Monthly Trend */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Budget Trend</h2>
          </div>
          <div className="p-6">
            <div className="h-64">
              <Line 
                data={monthlyTrendData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                      },
                      ticks: {
                        callback: (value) => `₹${Number(value) / 1000}k`,
                      },
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Category Breakdown</h2>
          </div>
          <div className="p-6">
            <div className="h-64">
              <Bar 
                data={categoryBreakdownData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                      },
                      ticks: {
                        callback: (value) => `₹${Number(value) / 1000}k`,
                      },
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Budget Categories */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.7 }}
      >
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Budget Categories</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {metrics.categoryBreakdown.map((category) => (
              <div
                key={category.id}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {category.category}
                  </h3>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    category.status === 'over'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      : category.status === 'under'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                      : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  }`}>
                    {category.status === 'over' ? 'Over Budget' : category.status === 'under' ? 'Under Budget' : 'On Track'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Allocated</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      ₹{(category.allocated / 1000).toFixed(1)}k
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Spent</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      ₹{(category.spent / 1000).toFixed(1)}k
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Remaining</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      ₹{(category.remaining / 1000).toFixed(1)}k
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      category.status === 'over'
                        ? 'bg-red-500'
                        : category.status === 'under'
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${(category.spent / category.allocated) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Add Budget Modal */}
      {showAddBudget && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Add New Budget Category
              </h3>
              
              <form onSubmit={handleAddBudget} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={newBudget.category}
                    onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter category name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Allocated Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={newBudget.allocated}
                    onChange={(e) => setNewBudget({ ...newBudget, allocated: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter allocated amount"
                    required
                    min="0"
                  />
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddBudget(false)}
                    className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  >
                    Add Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MandalBudgetManagement; 