
import { motion } from 'framer-motion';
import {
  BanknotesIcon,
  CreditCardIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
} from '@heroicons/react/24/solid';

interface Account {
  id: string;
  account_type: 'savings' | 'chit_fund' | 'loan';
  account_number: string;
  balance: number;
  status: 'active' | 'inactive' | 'pending' | 'closed';
  created_at: string;
  last_transaction?: {
    type: string;
    amount: number;
    date: string;
  };
}

interface AccountListProps {
  accounts: Account[];
  isLoading?: boolean;
}

export const AccountList: React.FC<AccountListProps> = ({ accounts, isLoading = false }) => {
  const getAccountIcon = (type: Account['account_type']) => {
    switch (type) {
      case 'savings':
        return BanknotesIcon;
      case 'chit_fund':
        return CreditCardIcon;
      case 'loan':
        return DocumentTextIcon;
      default:
        return DocumentTextIcon;
    }
  };

  const getAccountColor = (type: Account['account_type']) => {
    switch (type) {
      case 'savings':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400';
      case 'chit_fund':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400';
      case 'loan':
        return 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-400';
    }
  };

  const getStatusColor = (status: Account['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-400';
      case 'closed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-400';
    }
  };

  const formatAccountType = (type: Account['account_type']) => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow animate-pulse"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="text-center py-12">
        <BanknotesIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No accounts</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Get started by opening your first account.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {accounts.map((account) => {
        const Icon = getAccountIcon(account.account_type);
        const accountColor = getAccountColor(account.account_type);

        return (
          <motion.div
            key={account.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-full ${accountColor}`}>
                <Icon className="h-6 w-6" />
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(account.status)}`}>
                {account.status.charAt(0).toUpperCase() + account.status.slice(1)}
              </span>
            </div>

            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
              {formatAccountType(account.account_type)}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {account.account_number}
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Balance</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  ₹{account.balance.toLocaleString()}
                </span>
              </div>

              {account.last_transaction && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Last Transaction</span>
                  <div className="flex items-center space-x-2">
                    {account.last_transaction.type.includes('deposit') || 
                     account.last_transaction.type.includes('credit') ? (
                      <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-gray-900 dark:text-white">
                      ₹{account.last_transaction.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Opened</span>
                <div className="flex items-center space-x-1">
                  <ClockIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">
                    {new Date(account.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}; 