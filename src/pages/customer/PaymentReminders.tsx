import {BellIcon, ClockIcon} from '@heroicons/react/24/outline';
import { BanknotesIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';



interface Reminder {
  id: string;
  type: 'loan' | 'chit';
  amount: number;
  dueDate: string;
  status: 'upcoming' | 'overdue' | 'paid';
  referenceId: string;
  description: string;
  daysRemaining: number;
}

const PaymentReminders: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    // Mock API call - replace with actual API
    const fetchReminders = async () => {
      setIsLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock reminders
        const mockReminders: Reminder[] = [
          {
            id: 'R001',
            type: 'loan',
            amount: 5000,
            dueDate: '2024-04-15',
            status: 'upcoming',
            referenceId: 'LOAN123',
            description: 'Monthly loan payment',
            daysRemaining: 5,
          },
          {
            id: 'R002',
            type: 'chit',
            amount: 3000,
            dueDate: '2024-04-01',
            status: 'overdue',
            referenceId: 'CHIT456',
            description: 'Chit group contribution',
            daysRemaining: -2,
          },
          {
            id: 'R003',
            type: 'loan',
            amount: 5000,
            dueDate: '2024-03-15',
            status: 'paid',
            referenceId: 'LOAN789',
            description: 'Monthly loan payment',
            daysRemaining: 0,
          },
        ];
        
        setReminders(mockReminders);
      } catch (error) {
        console.error('Failed to fetch reminders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReminders();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: Reminder['status']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    }
  };

  const filteredReminders = reminders.filter(reminder => 
    selectedStatus === 'all' || reminder.status === selectedStatus
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Reminders</h1>
        <p className="text-gray-600 dark:text-gray-400">View and manage your payment reminders</p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center space-x-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="block w-48 pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="overdue">Overdue</option>
            <option value="paid">Paid</option>
          </select>
        </div>
      </div>

      {/* Reminders List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredReminders.map((reminder) => (
              <motion.div
                key={reminder.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {reminder.type === 'loan' ? (
                        <BanknotesIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                      ) : (
                        <BellIcon className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {reminder.description}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Reference: {reminder.referenceId}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(reminder.amount)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Due: {new Date(reminder.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center">
                      {reminder.status === 'upcoming' && (
                        <div className="flex items-center text-blue-600 dark:text-blue-400">
                          <ClockIcon className="h-5 w-5 mr-1" aria-hidden="true" />
                          <span className="text-sm">
                            {reminder.daysRemaining} days remaining
                          </span>
                        </div>
                      )}
                      {reminder.status === 'overdue' && (
                        <div className="flex items-center text-red-600 dark:text-red-400">
                          <ClockIcon className="h-5 w-5 mr-1" aria-hidden="true" />
                          <span className="text-sm">
                            {Math.abs(reminder.daysRemaining)} days overdue
                          </span>
                        </div>
                      )}
                      {reminder.status === 'paid' && (
                        <div className="flex items-center text-green-600 dark:text-green-400">
                          <CheckCircleIcon className="h-5 w-5 mr-1" />
                          <span className="text-sm">Paid</span>
                        </div>
                      )}
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(reminder.status)}`}>
                      {reminder.status.charAt(0).toUpperCase() + reminder.status.slice(1)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentReminders; 