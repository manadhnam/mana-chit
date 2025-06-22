import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  ChatBubbleLeftIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  ClockIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/solid';
import { useAuthStore } from '@/store/authStore';

interface Feedback {
  id: string;
  type: 'suggestion' | 'bug' | 'complaint' | 'praise';
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  submittedBy: string;
  submittedAt: string;
}

const mockFeedback: Feedback[] = [
  {
    id: 'FB001',
    type: 'suggestion',
    title: 'Improve Staff Management Interface',
    description: 'The staff management interface could be more intuitive and user-friendly.',
    status: 'pending',
    priority: 'medium',
    submittedBy: 'John Doe',
    submittedAt: '2024-03-15',
  },
  {
    id: 'FB002',
    type: 'bug',
    title: 'Budget Report Generation Error',
    description: 'Budget reports are not generating correctly for the current quarter.',
    status: 'in-progress',
    priority: 'high',
    submittedBy: 'Jane Smith',
    submittedAt: '2024-03-14',
  },
  {
    id: 'FB003',
    type: 'praise',
    title: 'Great Performance Metrics',
    description: 'The new performance metrics dashboard is very helpful for tracking department progress.',
    status: 'resolved',
    priority: 'low',
    submittedBy: 'Mike Johnson',
    submittedAt: '2024-03-13',
  },
];

const Feedback = () => {
  const [loading, setLoading] = useState(false);
  const [feedback] = useState<Feedback[]>(mockFeedback);
  const [selectedType, setSelectedType] = useState<Feedback['type'] | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<Feedback['status'] | 'all'>('all');

  const filteredFeedback = feedback.filter(
    (item) =>
      (selectedType === 'all' || item.type === selectedType) &&
      (selectedStatus === 'all' || item.status === selectedStatus)
  );

  const getTypeIcon = (type: Feedback['type']) => {
    switch (type) {
      case 'suggestion':
        return <ChatBubbleLeftIcon className="h-5 w-5 text-blue-500" />;
      case 'bug':
        return <HandThumbDownIcon className="h-5 w-5 text-red-500" />;
      case 'praise':
        return <HandThumbUpIcon className="h-5 w-5 text-green-500" />;
      case 'complaint':
        return <HandThumbDownIcon className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: Feedback['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
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
        <h1 className="text-2xl font-bold">Department Feedback</h1>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="mb-2 block text-sm">Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as Feedback['type'] | 'all')}
                className="rounded-lg border px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="all">All Types</option>
                <option value="suggestion">Suggestions</option>
                <option value="bug">Bugs</option>
                <option value="complaint">Complaints</option>
                <option value="praise">Praise</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as Feedback['status'] | 'all')}
                className="rounded-lg border px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>

          {/* Feedback List */}
          <div className="space-y-4">
            {filteredFeedback.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getTypeIcon(item.type)}
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="mb-4 text-gray-600 dark:text-gray-300">{item.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-4">
                    <span>Submitted by: {item.submittedBy}</span>
                    <span className="flex items-center space-x-1">
                      <ClockIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
                      <span>{item.submittedAt}</span>
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="rounded-lg bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600">
                      View Details
                    </button>
                    <button className="rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-600 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800">
                      Respond
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedback; 