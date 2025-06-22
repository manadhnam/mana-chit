import {DocumentTextIcon, ArrowLeftIcon} from '@heroicons/react/24/outline';
import React, { useState } from 'react';


interface FeedbackItem {
  id: string;
  type: 'suggestion' | 'complaint' | 'praise';
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

const mockFeedback: FeedbackItem[] = [
  {
    id: '1',
    type: 'suggestion',
    title: 'Improve Staff Training Program',
    description: 'The current training program could be enhanced with more practical exercises and real-world scenarios.',
    status: 'pending',
    priority: 'medium',
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z',
  },
  {
    id: '2',
    type: 'complaint',
    title: 'System Performance Issues',
    description: 'The system is running slow during peak hours, affecting staff productivity.',
    status: 'in-progress',
    priority: 'high',
    createdAt: '2024-03-14T15:30:00Z',
    updatedAt: '2024-03-15T09:00:00Z',
  },
  {
    id: '3',
    type: 'praise',
    title: 'Excellent Customer Service',
    description: 'The new customer service protocol has significantly improved customer satisfaction.',
    status: 'resolved',
    priority: 'low',
    createdAt: '2024-03-13T11:20:00Z',
    updatedAt: '2024-03-14T16:45:00Z',
  },
];

const Feedback = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);

  const filteredFeedback = mockFeedback.filter((item) => {
    const matchesType = !selectedType || item.type === selectedType;
    const matchesStatus = !selectedStatus || item.status === selectedStatus;
    const matchesPriority = !selectedPriority || item.priority === selectedPriority;
    return matchesType && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center space-x-4">
        <button
          onClick={() => window.history.back()}
          className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold">Feedback Management</h1>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {/* Type Filter */}
        <div className="rounded-lg border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-2 text-sm font-medium">Type</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedType(null)}
              className={`rounded-full px-3 py-1 text-sm ${
                !selectedType
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedType('suggestion')}
              className={`rounded-full px-3 py-1 text-sm ${
                selectedType === 'suggestion'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              Suggestions
            </button>
            <button
              onClick={() => setSelectedType('complaint')}
              className={`rounded-full px-3 py-1 text-sm ${
                selectedType === 'complaint'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              Complaints
            </button>
            <button
              onClick={() => setSelectedType('praise')}
              className={`rounded-full px-3 py-1 text-sm ${
                selectedType === 'praise'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              Praise
            </button>
          </div>
        </div>

        {/* Status Filter */}
        <div className="rounded-lg border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-2 text-sm font-medium">Status</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedStatus(null)}
              className={`rounded-full px-3 py-1 text-sm ${
                !selectedStatus
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedStatus('pending')}
              className={`rounded-full px-3 py-1 text-sm ${
                selectedStatus === 'pending'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setSelectedStatus('in-progress')}
              className={`rounded-full px-3 py-1 text-sm ${
                selectedStatus === 'in-progress'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setSelectedStatus('resolved')}
              className={`rounded-full px-3 py-1 text-sm ${
                selectedStatus === 'resolved'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              Resolved
            </button>
          </div>
        </div>

        {/* Priority Filter */}
        <div className="rounded-lg border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-2 text-sm font-medium">Priority</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedPriority(null)}
              className={`rounded-full px-3 py-1 text-sm ${
                !selectedPriority
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedPriority('high')}
              className={`rounded-full px-3 py-1 text-sm ${
                selectedPriority === 'high'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              High
            </button>
            <button
              onClick={() => setSelectedPriority('medium')}
              className={`rounded-full px-3 py-1 text-sm ${
                selectedPriority === 'medium'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              Medium
            </button>
            <button
              onClick={() => setSelectedPriority('low')}
              className={`rounded-full px-3 py-1 text-sm ${
                selectedPriority === 'low'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              Low
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredFeedback.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium">{item.title}</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
              </div>
              <div className="flex space-x-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                    item.status
                  )}`}
                >
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${getPriorityColor(
                    item.priority
                  )}`}
                >
                  {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-4">
                <span>Created: {new Date(item.createdAt).toLocaleDateString()}</span>
                <span>Updated: {new Date(item.updatedAt).toLocaleDateString()}</span>
              </div>
              <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feedback; 