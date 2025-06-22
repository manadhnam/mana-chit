import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useLoanStore } from '@/store/loanStore';
import {
  CreditCardIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

interface Loan {
  id: string;
  amount: number;
  interestRate: number;
  duration: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  startDate: string;
  endDate: string;
  remainingAmount: number;
  nextPayment?: {
    amount: number;
    dueDate: string;
  };
}

const MyLoans = () => {
  const { user } = useAuthStore();
  const { loans, fetchLoans, isLoading } = useLoanStore();
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    const loadLoans = async () => {
      if (user?.id) {
        try {
          await fetchLoans(user.id);
        } catch (error) {
          toast.error('Failed to load loans');
        }
      }
    };

    loadLoans();
  }, [user?.id, fetchLoans]);

  const filteredLoans = loans.filter(loan => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return loan.status === 'approved';
    if (activeTab === 'completed') return loan.status === 'completed';
    return false;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
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
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">My Loans</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            View and manage your loan accounts
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/customer/apply-loan"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Apply for Loan
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {['all', 'active', 'completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as 'all' | 'active' | 'completed')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }
              `}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Loans Grid */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredLoans.map((loan) => (
          <motion.div
            key={loan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Loan #{loan.id}
                </h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(loan.status)}`}>
                  {loan.status}
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                  <span>Amount: ₹{loan.amount.toLocaleString()}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <DocumentTextIcon className="h-5 w-5 mr-2" />
                  <span>Duration: {loan.duration} months</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <ClockIcon className="h-5 w-5 mr-2" />
                  <span>Interest: {loan.interestRate}%</span>
                </div>
              </div>

              {loan.nextPayment && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Next Payment: ₹{loan.nextPayment.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Due: {new Date(loan.nextPayment.dueDate).toLocaleDateString('en-IN')}
                  </p>
                </div>
              )}

              <div className="mt-6">
                <Link
                  to={`/customer/loans/${loan.id}`}
                  className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  View Details
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredLoans.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No loans found</p>
          {activeTab === 'all' && (
            <div className="mt-4">
              <Link
                to="/customer/apply-loan"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                Apply for a Loan
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyLoans; 