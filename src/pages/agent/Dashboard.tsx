import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  UserGroupIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowPathIcon,
  ClipboardDocumentListIcon,
  UserPlusIcon
} from '@heroicons/react/24/solid';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { AttendancePunch } from '@/components/chit/AttendancePunch';
import { ManualPaymentForm } from '@/components/chit/ManualPaymentForm';
import { PaymentForm } from '@/components/chit/PaymentForm';
import { ChitGroupForm } from '@/components/chit/ChitGroupForm';
import { AccountList } from '@/components/chit/AccountList';
import { TransactionList } from '@/components/chit/TransactionList';
import { CustomerDetails } from '@/components/chit/CustomerDetails';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

interface UpcomingPayment {
    customer_name: string;
    due_date: string;
    amount: number;
    payment_type: string;
}

interface CollectionTrend {
    collection_date: string;
    total_amount: number;
}

const AgentDashboard = () => {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    total_customers: 0,
    active_loans: 0,
    todays_collection: 0,
    pending_payments: 0,
  });
  const [upcomingPayments, setUpcomingPayments] = useState<UpcomingPayment[]>([]);
  const [collectionTrends, setCollectionTrends] = useState<CollectionTrend[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return;

      setIsLoading(true);
      try {
        const [metricsRes, paymentsRes, trendsRes] = await Promise.all([
            supabase.rpc('get_agent_dashboard_metrics', { p_agent_id: user.id }).single(),
            supabase.rpc('get_agent_upcoming_payments', { p_agent_id: user.id }),
            supabase.rpc('get_agent_collection_trends', { p_agent_id: user.id })
        ]);

        if (metricsRes.error) throw metricsRes.error;
        if (paymentsRes.error) throw paymentsRes.error;
        if (trendsRes.error) throw trendsRes.error;
        
        setMetrics(metricsRes.data as { total_customers: number; active_loans: number; todays_collection: number; pending_payments: number; });
        setUpcomingPayments(paymentsRes.data || []);
        setCollectionTrends(trendsRes.data || []);

      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to load dashboard data.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user]);

  // Chart data
  const collectionData = {
    labels: collectionTrends.map(t => new Date(t.collection_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })),
    datasets: [
      {
        label: 'Daily Collection (Last 30 Days)',
        data: collectionTrends.map(t => t.total_amount),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.3,
      },
    ],
  };

  const customerDistributionData = {
    labels: [],
    datasets: [],
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
      {/* Welcome header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome, {user?.name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Here's your summary for today.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Link
          to="/agent/customers/new"
          className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <UserPlusIcon className="h-5 w-5 mr-2" />
          Add Customer
        </Link>
        <Link
          to="/agent/collections/new"
          className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary-600 hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500"
        >
          <CurrencyDollarIcon className="h-5 w-5 mr-2" />
          Log Collection
        </Link>
        <Link
          to="/agent/audit-log"
          className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <ClipboardDocumentListIcon className="h-5 w-5 mr-2" />
          View My Log
        </Link>
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
              <UserGroupIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.total_customers}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link 
              to="/agent/customers" 
              className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
            >
              View customers →
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Loans</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.active_loans}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link 
              to="/agent/loans" 
              className="text-xs text-secondary-600 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300 font-medium"
            >
              View loans →
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today's Collection</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(metrics.todays_collection)}
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
              <CurrencyDollarIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Payments</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.pending_payments}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link 
              to="/agent/payments" 
              className="text-xs text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
            >
              View payments →
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Collection Chart */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Collection Trends</h2>
            </div>
            <div className="p-6">
              <div className="h-64">
                {collectionTrends.length > 0 ? <Line data={collectionData} /> : <p className="text-sm text-gray-500">No collection data for the last 30 days.</p>}
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  to="/agent/customers/new"
                  className="flex items-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30"
                >
                  <UserGroupIcon className="h-6 w-6 text-primary-600 dark:text-primary-400 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Add New Customer</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Register a new customer</p>
                  </div>
                </Link>
                
                <Link
                  to="/agent/loans/new"
                  className="flex items-center p-4 bg-secondary-50 dark:bg-secondary-900/20 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-900/30"
                >
                  <CurrencyDollarIcon className="h-6 w-6 text-secondary-600 dark:text-secondary-400 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">New Loan Application</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Process a new loan</p>
                  </div>
                </Link>
                
                <Link
                  to="/agent/payments/collect"
                  className="flex items-center p-4 bg-accent-50 dark:bg-accent-900/20 rounded-lg hover:bg-accent-100 dark:hover:bg-accent-900/30"
                >
                  <CurrencyDollarIcon className="h-6 w-6 text-accent-600 dark:text-accent-400 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Collect Payment</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Record a new payment</p>
                  </div>
                </Link>
                
                <Link
                  to="/agent/reports"
                  className="flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30"
                >
                  <CurrencyDollarIcon className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">View Reports</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Generate performance reports</p>
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right column */}
        <div className="space-y-8">
          {/* Customer Distribution */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          >
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Customer Distribution</h2>
            </div>
            <div className="p-6">
              <div className="h-64 flex items-center justify-center">
                <Doughnut 
                  data={customerDistributionData} 
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

          {/* Upcoming Payments */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.8 }}
          >
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Payments</h2>
            </div>
            <div className="p-6">
              {upcomingPayments.length > 0 ? (
                <ul className="space-y-4">
                  {upcomingPayments.map((payment, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-sm">{payment.customer_name}</p>
                        <p className="text-xs text-gray-500">Due: {new Date(payment.due_date).toLocaleDateString()}</p>
                      </div>
                      <p className="font-bold text-sm text-green-600">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(payment.amount)}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-sm text-gray-500">No upcoming payments found.</p>}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Chit Fund Management */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-2">Attendance Punch</h2>
          <AttendancePunch agentId="agent-1" onSubmit={() => {}} />
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Manual Payment Form</h2>
          <ManualPaymentForm agentId="agent-1" groupId="group-1" onSubmit={() => {}} />
        </div>
      </div>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-2">Payment Form</h2>
          <PaymentForm branchId="branch-1" onSuccess={() => {}} />
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Chit Group Form</h2>
          <ChitGroupForm branchId="branch-1" onSuccess={() => {}} />
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
      <div className="mt-12">
        <h2 className="text-lg font-semibold mb-2">Customer Details</h2>
        <CustomerDetails customer={{ id: 'cust-1', name: 'Sample Customer', email: 'sample@email.com', phone: '1234567890', address: '123 Main St', village_id: 1, aadhar_number: '1234-5678-9012', pan_number: 'ABCDE1234F', date_of_birth: '1990-01-01', gender: 'male', occupation: 'Engineer', monthly_income: 50000, status: 'active', documents: [] }} isLoading={false} />
      </div>
    </div>
  );
};

export default AgentDashboard; 