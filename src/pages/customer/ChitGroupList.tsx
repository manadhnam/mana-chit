import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useChitStore } from '@/store/chitStore';
import { ChitGroup as BaseChitGroup } from '@/types/index';
import {UserGroupIcon} from '@heroicons/react/24/outline';
import {CurrencyDollarIcon, ClockIcon, CheckCircleIcon, XCircleIcon, ArrowRightIcon} from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

interface ChitGroup extends BaseChitGroup {
  currentCycle: number;
  totalCollection: number;
  nextPayment?: {
    amount: number;
    dueDate: string;
  };
}

const MyChitGroups = () => {
  const { user } = useAuthStore();
  const { userChitGroups, fetchUserChitGroups, isLoading } = useChitStore();
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    const loadChitGroups = async () => {
      if (user?.id) {
        try {
          await fetchUserChitGroups(user.id);
        } catch (error) {
          toast.error('Failed to load chit groups');
        }
      }
    };

    loadChitGroups();
  }, [user?.id, fetchUserChitGroups]);

  const filteredGroups = userChitGroups.filter(group => {
    if (activeTab === 'all') return true;
    return group.status === activeTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
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
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">My Chit Groups</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            View and manage your chit group memberships
          </p>
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

      {/* Chit Groups Grid */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredGroups.map((group) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {group.name}
                </h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(group.status)}`}>
                  {group.status}
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <UserGroupIcon className="h-5 w-5 mr-2" />
                  <span>{group.members.length} members</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <ClockIcon className="h-5 w-5 mr-2" />
                  <span>Duration: {group.duration} months</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium">Amount: ₹{group.amount.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to={`/customer/chit-groups/${group.id}`}
                  className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  View Details
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredGroups.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No chit groups found</p>
        </div>
      )}
    </div>
  );
};

export default MyChitGroups; 