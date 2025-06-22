
import { motion } from 'framer-motion';
import {
  UserGroupIcon,
  BanknotesIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  WalletIcon,
} from '@heroicons/react/24/solid';
import { Branch } from '@/services/branchService';

interface BranchStatsProps {
  stats: Branch['stats'];
  loading?: boolean;
}

const stats = [
  {
    name: 'Total Customers',
    icon: UserGroupIcon,
    color: 'bg-blue-500',
  },
  {
    name: 'Active Loans',
    icon: BanknotesIcon,
    color: 'bg-green-500',
  },
  {
    name: 'Total Collections',
    icon: CurrencyDollarIcon,
    color: 'bg-purple-500',
  },
  {
    name: 'On-time Payers',
    icon: CheckCircleIcon,
    color: 'bg-emerald-500',
  },
  {
    name: 'Defaulters',
    icon: ExclamationCircleIcon,
    color: 'bg-red-500',
  },
  {
    name: 'Available Fund',
    icon: WalletIcon,
    color: 'bg-amber-500',
  },
];

export const BranchStats: React.FC<BranchStatsProps> = ({ stats: branchStats, loading }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-IN').format(value);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 py-5 shadow sm:px-6 sm:py-6"
          >
            <div className="animate-pulse">
              <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="mt-4 h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="mt-2 h-8 w-32 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, index) => {
        const value = branchStats[stat.name.toLowerCase().replace(/\s+/g, '') as keyof Branch['stats']];
        const formattedValue = stat.name.includes('Fund') || stat.name.includes('Collections')
          ? formatCurrency(value)
          : formatNumber(value);

        return (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 py-5 shadow sm:px-6 sm:py-6"
          >
            <dt>
              <div className={`absolute rounded-md p-3 ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                {stat.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {formattedValue}
              </p>
            </dd>
          </motion.div>
        );
      })}
    </div>
  );
}; 