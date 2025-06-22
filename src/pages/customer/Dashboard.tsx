import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowPathIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  BookOpenIcon,
  PlusCircleIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/solid';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';
import { Passbook } from '@/components/chit/Passbook';
import { TransactionList } from '@/components/chit/TransactionList';
import type { Loan, ChitGroup as DBChitGroup, Transaction as DBTransaction } from '@/types/database';
import toast from 'react-hot-toast';
import { formatCurrency } from '@/utils/formatters';

// Local interfaces to match component props
interface Transaction {
  id: string;
  transaction_type: string;
  amount: number;
  description: string;
  created_at: string;
}

interface UpcomingPayment {
  id: string;
  name: string;
  amount: number;
  due_date: string;
  payment_type: string;
}

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

const CustomerDashboard = () => {
  const { user } = useAuthStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<{
      wallet_balance: number;
      chit_count: number;
      loan_count: number;
      recent_transactions: Transaction[];
      upcoming_payments: UpcomingPayment[];
  } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .rpc('get_customer_dashboard_metrics', { p_user_id: user.id })
          .single();

        if (error) throw error;
        
        setDashboardData(data as {
            wallet_balance: number;
            chit_count: number;
            loan_count: number;
            recent_transactions: Transaction[];
            upcoming_payments: UpcomingPayment[];
        });

      } catch (error: any) {
        toast.error("Failed to load dashboard data: " + error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [user]);

  if (isLoading || !dashboardData) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const { wallet_balance, chit_count, loan_count, recent_transactions, upcoming_payments } = dashboardData;

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome, {user?.name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Your financial overview and tools.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Link
          to="/customer/loans/apply"
          className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
        >
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          Apply for Loan
        </Link>
        <Link
          to="/customer/passbook"
          className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary-600 hover:bg-secondary-700"
        >
          <BookOpenIcon className="h-5 w-5 mr-2" />
          View Passbook
        </Link>
        <Link
          to="/customer/audit-log"
          className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          <ClipboardDocumentListIcon className="h-5 w-5 mr-2" />
          My Activity
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 mr-4">
              <UserGroupIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">My Chits</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{chit_count}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/customer/chits" className="text-xs text-primary-600 hover:text-primary-700 font-medium">
              View my chits →
            </Link>
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
              <CurrencyDollarIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">My Loans</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{loan_count}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/customer/loans" className="text-xs text-secondary-600 hover:text-secondary-700 font-medium">
              View my loans →
            </Link>
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
              <CurrencyDollarIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Wallet Balance</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(wallet_balance)}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/customer/wallet" className="text-xs text-accent-600 hover:text-accent-700 font-medium">
                Manage Wallet →
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Transactions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
          {recent_transactions && recent_transactions.length > 0 ? (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {recent_transactions.map((tx) => (
                <li key={tx.id} className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{tx.description || tx.transaction_type.replace(/_/g, ' ')}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(tx.created_at).toLocaleString()}</p>
                    </div>
                    <p className={`text-sm font-bold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(tx.amount)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No recent transactions found.</p>
          )}
        </div>
        
        {/* Upcoming Payments */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-lg mb-4">Upcoming Payments</h3>
            {upcoming_payments && upcoming_payments.length > 0 ? (
                 <ul className="space-y-4">
                    {upcoming_payments.map((payment) => (
                        <li key={payment.id} className="flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-sm">{payment.name}</p>
                                <p className="text-xs text-gray-500">Due: {new Date(payment.due_date).toLocaleDateString()}</p>
                            </div>
                            <p className="font-bold text-sm text-green-600">
                                {formatCurrency(payment.amount)}
                            </p>
                        </li>
                    ))}
                </ul>
            ) : <p className="text-sm text-gray-500">No upcoming payments found.</p>}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;