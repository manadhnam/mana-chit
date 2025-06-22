import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UserGroupIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ChartBarIcon
} from '@heroicons/react/24/solid';
import { useAuthStore } from '@/store/authStore';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import ChitGroupConfig from '@/components/chit/ChitGroupConfig';
import { BranchStats } from '@/components/chit/BranchStats';
import { AccountList } from '@/components/chit/AccountList';
import { TransactionList } from '@/components/chit/TransactionList';
import { useNavigate } from 'react-router-dom';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

const DepartmentHeadDashboard = () => {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

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
          Department overview and management
        </p>
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
              <UserGroupIcon className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Staff</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">45</p>
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
              <CurrencyDollarIcon className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Mandals</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
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
              <CurrencyDollarIcon className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Collection</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">₹1.2Cr</p>
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
              <CurrencyDollarIcon className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Loans</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">₹75L</p>
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
            <button className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600" onClick={() => navigate('/department-head/StaffManagement')}>
              <UserGroupIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Add New Staff
            </button>
            <button className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600" onClick={() => navigate('/department-head/StaffManagement')}>
              <UserGroupIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Staff Directory
            </button>
            <button className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600" onClick={() => navigate('/department-head/Notifications')}>
              <ClockIcon className="h-5 w-5 mr-2" aria-hidden="true" />
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
            <button className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600" onClick={() => navigate('/department-head/PerformanceMetrics')}>
              <CurrencyDollarIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Performance Metrics
            </button>
            <button className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600" onClick={() => navigate('/department-head/FinancialReports')}>
              <CurrencyDollarIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Financial Reports
            </button>
            <button className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600" onClick={() => navigate('/department-head/StaffAnalytics')}>
              <CurrencyDollarIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Staff Analytics
            </button>
          </div>
        </motion.div>
      </div>

      {/* Audit Log Link */}
      <div className="flex justify-end mb-2">
        <a href="/department-head/AuditLogs" className="text-primary-600 hover:underline text-sm">View Audit Logs</a>
      </div>

      {/* Chit Fund Management */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-2">Chit Group Config</h2>
          <ChitGroupConfig onSave={() => {}} onCancel={() => {}} />
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Branch Stats</h2>
          <BranchStats stats={{ totalCustomers: 60, activeLoans: 4, totalCollections: 1200000, onTimePayers: 50, defaulters: 2, availableFund: 200000 }} />
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
    </div>
  );
};

export default DepartmentHeadDashboard; 