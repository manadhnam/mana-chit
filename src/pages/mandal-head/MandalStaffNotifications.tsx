import {UserGroupIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { ChartBarIcon, BanknotesIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';
import { ExclamationCircleIcon, XCircleIcon, InformationCircleIcon } from '@heroicons/react/24/solid';



interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  category: 'staff' | 'performance' | 'financial' | 'system';
  priority: 'low' | 'medium' | 'high';
  action?: {
    label: string;
    onClick: () => void;
  };
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'New Staff Member Added',
    message: 'John Doe has been added to the North Branch team.',
    timestamp: '2024-03-15T10:30:00',
    read: false,
    category: 'staff',
    priority: 'medium',
    action: {
      label: 'View Profile',
      onClick: () => console.log('View profile'),
    },
  },
  {
    id: '2',
    type: 'warning',
    title: 'Performance Alert',
    message: 'South Branch performance metrics are below target for this month.',
    timestamp: '2024-03-15T09:15:00',
    read: true,
    category: 'performance',
    priority: 'high',
    action: {
      label: 'View Metrics',
      onClick: () => console.log('View metrics'),
    },
  },
  {
    id: '3',
    type: 'info',
    title: 'Monthly Report Available',
    message: 'The monthly financial report for March 2024 is now available.',
    timestamp: '2024-03-14T16:45:00',
    read: false,
    category: 'financial',
    priority: 'low',
    action: {
      label: 'View Report',
      onClick: () => console.log('View report'),
    },
  },
  {
    id: '4',
    type: 'error',
    title: 'System Maintenance',
    message: 'Scheduled maintenance will occur tonight from 11 PM to 2 AM.',
    timestamp: '2024-03-14T14:20:00',
    read: false,
    category: 'system',
    priority: 'high',
  },
];

const MandalStaffNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      case 'warning':
        return <ExclamationCircleIcon className="h-6 w-6 text-yellow-500" />;
      case 'error':
        return <XCircleIcon className="h-6 w-6 text-red-500" />;
      default:
        return <InformationCircleIcon className="h-6 w-6 text-blue-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'staff':
        return <UserGroupIcon className="h-5 w-5 text-gray-400" />;
      case 'performance':
        return <ChartBarIcon className="h-5 w-5 text-gray-400" />;
      case 'financial':
        return <BanknotesIcon />
        return <DocumentTextIcon className="h-5 w-5 text-gray-400" />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesCategory = selectedCategory === 'all' || notification.category === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || notification.priority === selectedPriority;
    return matchesCategory && matchesPriority;
  });

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Staff Notifications</h1>
        <p className="text-gray-600">Stay updated with important notifications from your mandal</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="staff">Staff</option>
            <option value="performance">Performance</option>
            <option value="financial">Financial</option>
            <option value="system">System</option>
          </select>
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-white rounded-lg shadow-sm p-4 ${
              !notification.read ? 'border-l-4 border-blue-500' : ''
            }`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-gray-900">{notification.title}</h3>
                    <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(notification.priority)}`}>
                      {notification.priority}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      {new Date(notification.timestamp).toLocaleString()}
                    </span>
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Mark as read
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="mt-1 text-gray-600">{notification.message}</p>
                {notification.action && (
                  <button
                    onClick={notification.action.onClick}
                    className="mt-2 text-blue-600 hover:text-blue-800"
                  >
                    {notification.action.label}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MandalStaffNotifications; 