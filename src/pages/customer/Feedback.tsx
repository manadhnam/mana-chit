import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {ArrowLeftIcon, ChatBubbleLeftIcon, StarIcon, } from '@heroicons/react/24/outline';

interface Feedback {
  id: string;
  message: string;
  rating: number;
  date: string;
}

const mockFeedback: Feedback[] = [
  { id: 'F1', message: 'Great service!', rating: 5, date: '2024-06-01' },
  { id: 'F2', message: 'Could improve response time.', rating: 3, date: '2024-06-02' },
  { id: 'F3', message: 'Very satisfied with the support.', rating: 5, date: '2024-06-03' },
];

const Feedback = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [newFeedback, setNewFeedback] = useState({ message: '', rating: 5 });

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setFeedback(mockFeedback);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call to submit feedback
    const newFeedbackItem: Feedback = {
      id: `F${feedback.length + 1}`,
      message: newFeedback.message,
      rating: newFeedback.rating,
      date: new Date().toISOString().split('T')[0],
    };
    setFeedback([...feedback, newFeedbackItem]);
    setNewFeedback({ message: '', rating: 5 });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Back
      </button>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Feedback</h1>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Message</label>
          <textarea
            value={newFeedback.message}
            onChange={(e) => setNewFeedback({ ...newFeedback, message: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Rating</label>
          <select
            value={newFeedback.rating}
            onChange={(e) => setNewFeedback({ ...newFeedback, rating: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            {[1, 2, 3, 4, 5].map((rating) => (
              <option key={rating} value={rating}>{rating} Stars</option>
            ))}
          </select>
        </div>
        <button type="submit" className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">Submit Feedback</button>
      </form>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <div className="mt-2 text-gray-600 dark:text-gray-400">Loading feedback...</div>
          </div>
        ) : feedback.length === 0 ? (
          <div className="text-center py-8 text-gray-600 dark:text-gray-400">No feedback found.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Message</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {feedback.map((f) => (
                <tr key={f.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{f.message}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white flex items-center">
                    {Array.from({ length: f.rating }).map((_, i) => (
                      <StarIcon key={i} className="h-5 w-5 text-yellow-500" />
                    ))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Date(f.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Feedback; 