import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import { useAuthStore } from '@/store/authStore';

interface ChitGroup {
  id: string;
  name: string;
  amount: number;
  duration: number;
  members: number;
  startDate: string;
  status: 'open' | 'full' | 'in_progress' | 'completed';
}

const JoinChitGroup = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<ChitGroup | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Mock data - replace with API call
  const availableGroups: ChitGroup[] = [
    {
      id: '1',
      name: 'Monthly Savings Group A',
      amount: 10000,
      duration: 12,
      members: 8,
      startDate: '2024-04-01',
      status: 'open',
    },
    {
      id: '2',
      name: 'Quarterly Investment Group B',
      amount: 50000,
      duration: 24,
      members: 12,
      startDate: '2024-05-01',
      status: 'open',
    },
  ];

  const handleJoinGroup = async (group: ChitGroup) => {
    setSelectedGroup(group);
    setShowConfirmation(true);
  };

  const confirmJoin = async () => {
    if (!selectedGroup) return;

    setIsLoading(true);
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Successfully joined the chit group!');
      navigate('/user/chit-groups');
    } catch (error) {
      toast.error('Failed to join the group. Please try again.');
    } finally {
      setIsLoading(false);
      setShowConfirmation(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Join a Chit Group
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Browse and join available chit groups
        </p>
      </div>

      {/* Available Groups */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableGroups.map((group) => (
          <motion.div
            key={group.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {group.name}
              </h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                group.status === 'open' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
              }`}>
                {group.status === 'open' ? 'Open' : 'Full'}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <CreditCardIcon className="h-5 w-5 mr-2" />
                <span>Amount: ₹{group.amount.toLocaleString()}</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <DocumentTextIcon className="h-5 w-5 mr-2" />
                <span>Duration: {group.duration} months</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <UserIcon className="h-5 w-5 mr-2" />
                <span>Members: {group.members}/12</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <HomeIcon className="h-5 w-5 mr-2" />
                <span>Start Date: {new Date(group.startDate).toLocaleDateString()}</span>
              </div>
            </div>

            <button
              onClick={() => handleJoinGroup(group)}
              disabled={group.status !== 'open' || isLoading}
              className={`mt-4 w-full px-4 py-2 text-sm font-medium rounded-md ${
                group.status === 'open'
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? 'Joining...' : 'Join Group'}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && selectedGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Confirm Joining
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to join {selectedGroup.name}? You will be required to pay ₹{selectedGroup.amount.toLocaleString()} monthly.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmJoin}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50"
              >
                {isLoading ? 'Joining...' : 'Confirm'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default JoinChitGroup; 