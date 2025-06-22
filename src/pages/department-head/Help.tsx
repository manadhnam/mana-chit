import { ArrowLeftIcon, QuestionMarkCircleIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';


interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'department' | 'staff' | 'budget' | 'general';
}

const mockFAQs: FAQ[] = [
  {
    id: 'FAQ001',
    question: 'How do I manage department staff?',
    answer: 'You can manage department staff through the Staff Management section. Navigate to the Staff page to view, add, or modify staff members.',
    category: 'staff',
  },
  {
    id: 'FAQ002',
    question: 'How do I track department budget?',
    answer: 'The Budget Management section provides tools to track and manage department finances. You can view reports and set budget limits.',
    category: 'budget',
  },
  {
    id: 'FAQ003',
    question: 'How do I generate department reports?',
    answer: 'Department reports can be generated from the Reports section. You can customize the report parameters and export them in various formats.',
    category: 'general',
  },
];

const Help = () => {
  const [loading, setLoading] = useState(false);
  const [faqs] = useState<FAQ[]>(mockFAQs);
  const [selectedCategory, setSelectedCategory] = useState<FAQ['category'] | 'all'>('all');

  const filteredFAQs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center space-x-4">
        <button
          onClick={() => window.history.back()}
          className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold">Department Help & Support</h1>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {/* FAQs */}
          <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-6 flex items-center space-x-4">
              <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                <QuestionMarkCircleIcon className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
            </div>

            <div className="mb-4 flex space-x-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`rounded-lg px-3 py-1 text-sm ${
                  selectedCategory === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedCategory('department')}
                className={`rounded-lg px-3 py-1 text-sm ${
                  selectedCategory === 'department'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Department
              </button>
              <button
                onClick={() => setSelectedCategory('staff')}
                className={`rounded-lg px-3 py-1 text-sm ${
                  selectedCategory === 'staff'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Staff
              </button>
              <button
                onClick={() => setSelectedCategory('budget')}
                className={`rounded-lg px-3 py-1 text-sm ${
                  selectedCategory === 'budget'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Budget
              </button>
            </div>

            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <div key={faq.id} className="rounded-lg border p-4 dark:border-gray-700">
                  <h3 className="mb-2 font-semibold">{faq.question}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Support */}
          <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-6 flex items-center space-x-4">
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <h2 className="text-xl font-semibold">Contact Support</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <PhoneIcon className="h-5 w-5 text-gray-500" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-gray-500" />
                <span>support@department.com</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Help;