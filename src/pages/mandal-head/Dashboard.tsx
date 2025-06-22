import { ChartBarIcon, BanknotesIcon, ExclamationCircleIcon, UserPlusIcon } from '@heroicons/react/24/solid';
import { UserIcon, BellIcon, DocumentTextIcon, HomeIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/store/authStore';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import ChitGroupConfig from '@/components/chit/ChitGroupConfig';
import { BranchStats } from '@/components/chit/BranchStats';
import { AccountList } from '@/components/chit/AccountList';
import { TransactionList } from '@/components/chit/TransactionList';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

interface MandalMetrics {
  totalMembers: number;
  activeGroups: number;
  totalCollection: number;
  pendingPayments: number;
  performanceScore: number;
}

const MandalHeadDashboard = () => {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<MandalMetrics>({
    totalMembers: 0,
    activeGroups: 0,
    totalCollection: 0,
    pendingPayments: 0,
    performanceScore: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Simulate loading mandal metrics
    const loadMetrics = async () => {
      setIsLoading(true);
      try {
        // Mock data - replace with actual API calls
        const mockMetrics: MandalMetrics = {
          totalMembers: 150,
          activeGroups: 12,
          totalCollection: 2500000,
          pendingPayments: 5,
          performanceScore: 85,
        };
        setMetrics(mockMetrics);
      } finally {
        setIsLoading(false);
      }
    };

    loadMetrics();
  }, []);

  // Chart data
  const performanceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Collection Performance',
        data: [75, 78, 82, 80, 85, 88],
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.3,
      },
    ],
  };

  const distributionData = {
    labels: ['Active Groups', 'Pending Payments', 'Completed Groups'],
    datasets: [
      {
        data: [12, 5, 8],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(20, 184, 166, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(249, 115, 22, 1)',
          'rgba(20, 184, 166, 1)',
        ],
        borderWidth: 1,
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
          Welcome, {user?.name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Mandal overview and management
        </p>
      </div>

      {/* Audit Log Link */}
      <div className="flex justify-end mb-2">
        <a href="/mandal-head/AuditLogs" className="text-primary-600 hover:underline text-sm">View Audit Logs</a>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 mr-4">
              <UserIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Staff</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">25</p>
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
              <HomeIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Branches</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
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
              <CreditCardIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Collection</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">₹75L</p>
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
              <BanknotesIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Loans</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">₹45L</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Staff Management</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600" onClick={() => navigate('/mandal-head/MandalStaffManagement')}>
              <UserPlusIcon className="h-5 w-5 mr-2" />
              Add New Staff
            </button>
            <button className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600" onClick={() => navigate('/mandal-head/MandalStaffManagement')}>
              <UserIcon className="h-5 w-5 mr-2" />
              Staff Directory
            </button>
            <button className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600" onClick={() => navigate('/mandal-head/MandalStaffNotifications')}>
              <BellIcon className="h-5 w-5 mr-2" />
              Staff Notifications
            </button>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Reports & Analytics</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600" onClick={() => navigate('/mandal-head/PerformanceMetrics')}>
              <ChartBarIcon className="h-5 w-5 mr-2" />
              Performance Metrics
            </button>
            <button className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600" onClick={() => navigate('/mandal-head/MandalFinancialReports')}>
              <DocumentTextIcon className="h-5 w-5 mr-2" />
              Financial Reports
            </button>
            <button className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600" onClick={() => navigate('/mandal-head/MandalPerformanceMetrics')}>
              <UserIcon className="h-5 w-5 mr-2" />
              Staff Analytics
            </button>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Mandal Settings</h2>
          <div className="space-y-3">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm font-medium text-green-800 dark:text-green-400">Mandal Status: Active</p>
              <p className="text-xs text-green-600 dark:text-green-500 mt-1">All systems operational</p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <button className="w-full flex items-center px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-700 rounded-md hover:bg-blue-200 dark:hover:bg-blue-600" onClick={() => navigate('/mandal-head/Settings')}>
                <ExclamationCircleIcon className="h-5 w-5 mr-2" />
                Mandal Settings
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Chit Fund Management */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-2">Chit Group Config</h2>
          <ChitGroupConfig onSave={() => {}} onCancel={() => {}} />
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Branch Stats</h2>
          <BranchStats stats={{ totalCustomers: 30, activeLoans: 2, totalCollections: 600000, onTimePayers: 25, defaulters: 1, availableFund: 100000 }} />
        </div>
      </div>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-2">Accounts</h2>
          <AccountList accounts={[]} isLoading={false} />
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Transactions</h2>
          <TransactionList transactions={[]} isLoading={false} />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Chart */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.8 }}
        >
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Trends</h2>
          </div>
          <div className="p-6">
            <div className="h-64">
              <Line 
                data={performanceData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
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
                      display: false,
                    },
                  },
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Distribution Chart */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.9 }}
        >
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Group Distribution</h2>
          </div>
          <div className="p-6">
            <div className="h-64 flex items-center justify-center">
              <Doughnut 
                data={distributionData} 
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
      </div>

      {/* Recent Activity */}
      <motion.div
        className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 1 }}
      >
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              {
                id: 1,
                type: 'payment',
                description: 'Monthly collection completed for Gold Group',
                amount: 50000,
                date: '2024-03-15',
              },
              {
                id: 2,
                type: 'new_member',
                description: 'New member joined Silver Group',
                amount: null,
                date: '2024-03-14',
              },
              {
                id: 3,
                type: 'grab',
                description: 'Priya Sharma grabbed amount from Platinum Group',
                amount: 100000,
                date: '2024-03-13',
              },
            ].map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center">
                  <div className={`p-2 rounded-full mr-4 ${
                    activity.type === 'payment'
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                      : activity.type === 'new_member'
                      ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                  }`}>
                    <UserIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(activity.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                {activity.amount && (
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    ₹{activity.amount.toLocaleString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MandalHeadDashboard; 