
import { motion } from 'framer-motion';
import {
  UserGroupIcon,
  BanknotesIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  WalletIcon,
} from '@heroicons/react/24/solid';
import { BranchStats as BranchStatsType } from '@/types/chit';

interface BranchStatsProps {
  stats: BranchStatsType;
  isLoading?: boolean;
}

export const BranchStats: React.FC<BranchStatsProps> = ({ stats, isLoading = false }) => {
  const statCards = [
    {
      name: 'Total Customers',
      value: stats.totalCustomers,
      icon: UserGroupIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Active Loans',
      value: stats.activeLoans,
      icon: BanknotesIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Total Collections',
      value: `₹${stats.totalCollections.toLocaleString()}`,
      icon: CurrencyDollarIcon,
      color: 'bg-yellow-500',
    },
    {
      name: 'On-Time Payers',
      value: stats.onTimePayers,
      icon: CheckCircleIcon,
      color: 'bg-emerald-500',
    },
    {
      name: 'Defaulters',
      value: stats.defaulters,
      icon: ExclamationCircleIcon,
      color: 'bg-red-500',
    },
    {
      name: 'Available Fund',
      value: `₹${stats.availableFund.toLocaleString()}`,
      icon: WalletIcon,
      color: 'bg-purple-500',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg animate-pulse"
          >
            <div className="p-5">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    {stat.name}
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900 dark:text-white">
                    {stat.value}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}; 