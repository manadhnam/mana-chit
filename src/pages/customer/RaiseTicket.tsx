import {DocumentTextIcon, TicketIcon, PaperClipIcon, XMarkIcon} from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import { motion } from 'framer-motion';


interface Ticket {
  id: string;
  subject: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  attachments: File[];
  status: 'open' | 'in-progress' | 'resolved';
  createdAt: string;
}

const RaiseTicket: React.FC = () => {
  const [ticket, setTicket] = useState<Partial<Ticket>>({
    subject: '',
    description: '',
    category: '',
    priority: 'medium',
    attachments: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const categories = [
    { id: 'account', name: 'Account Issues' },
    { id: 'payment', name: 'Payment Problems' },
    { id: 'loan', name: 'Loan Related' },
    { id: 'chit', name: 'Chit Group Issues' },
    { id: 'technical', name: 'Technical Support' },
    { id: 'other', name: 'Other' },
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setTicket(prev => ({
        ...prev,
        attachments: [...(prev.attachments || []), ...newFiles],
      }));
    }
  };

  const removeAttachment = (index: number) => {
    setTicket(prev => ({
      ...prev,
      attachments: prev.attachments?.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate form
    if (!ticket.subject?.trim()) {
      setError('Please enter a subject');
      return;
    }
    if (!ticket.description?.trim()) {
      setError('Please enter a description');
      return;
    }
    if (!ticket.category) {
      setError('Please select a category');
      return;
    }

    setIsSubmitting(true);
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful submission
      setSuccess('Ticket submitted successfully! We will get back to you soon.');
      setTicket({
        subject: '',
        description: '',
        category: '',
        priority: 'medium',
        attachments: [],
      });
    } catch (error) {
      setError('Failed to submit ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Raise a Support Ticket</h1>
        <p className="text-gray-600 dark:text-gray-400">Submit your issue and we'll help you resolve it</p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                value={ticket.subject}
                onChange={(e) => setTicket(prev => ({ ...prev, subject: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Brief description of your issue"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category
              </label>
              <select
                id="category"
                value={ticket.category}
                onChange={(e) => setTicket(prev => ({ ...prev, category: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Priority
              </label>
              <select
                id="priority"
                value={ticket.priority}
                onChange={(e) => setTicket(prev => ({ ...prev, priority: e.target.value as Ticket['priority'] }))}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                id="description"
                value={ticket.description}
                onChange={(e) => setTicket(prev => ({ ...prev, description: e.target.value }))}
                rows={6}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Please provide detailed information about your issue"
              />
            </div>

            {/* Attachments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Attachments
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 dark:text-gray-400">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                    >
                      <span>Upload files</span>
                      <input
                        id="file-upload"
                        type="file"
                        multiple
                        className="sr-only"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, PDF up to 10MB
                  </p>
                </div>
              </div>
            </div>

            {/* Attached Files */}
            {ticket.attachments && ticket.attachments.length > 0 && (
              <div className="space-y-2">
                {ticket.attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-md"
                  >
                    <div className="flex items-center">
                      <PaperClipIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {file.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <XMarkIcon className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-400">
                      {error}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <TicketIcon className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800 dark:text-green-400">
                      {success}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <TicketIcon className="h-5 w-5 mr-2" />
                    Submit Ticket
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RaiseTicket; 