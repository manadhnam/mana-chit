import { ArrowLeftIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';


interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const mockFAQs: FAQ[] = [
  {
    id: 1,
    question: 'How do I manage system users?',
    answer: 'You can manage system users through the User Management section. Here you can add new users, assign roles, and monitor their activities.',
    category: 'system',
  },
  {
    id: 2,
    question: 'How do I configure system security?',
    answer: 'The Security Settings section provides comprehensive options for configuring system security, including two-factor authentication, session management, and access controls.',
    category: 'security',
  },
  {
    id: 3,
    question: 'How do I generate system reports?',
    answer: 'You can generate various system reports from the Reports section, including user activity, security logs, and system performance metrics.',
    category: 'reports',
  },
];

const Help = () => {
  const [loading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [faqs] = useState<FAQ[]>(mockFAQs);

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
        <h1 className="text-2xl font-bold">Help & Support</h1>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {/* FAQs */}
          <div className="md:col-span-2">
            <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-6 flex items-center space-x-4">
                <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                  <QuestionMarkCircleIcon className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                </div>
                <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
              </div>

              <div className="mb-6 flex space-x-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`rounded-full px-4 py-2 text-sm ${
                    selectedCategory === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedCategory('system')}
                  className={`rounded-full px-4 py-2 text-sm ${
                    selectedCategory === 'system'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  System
                </button>
                <button
                  onClick={() => setSelectedCategory('security')}
                  className={`rounded-full px-4 py-2 text-sm ${
                    selectedCategory === 'security'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Security
                </button>
                <button
                  onClick={() => setSelectedCategory('reports')}
                  className={`rounded-full px-4 py-2 text-sm ${
                    selectedCategory === 'reports'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Reports
                </button>
              </div>

              <div className="space-y-4">
                {filteredFAQs.map((faq) => (
                  <div
                    key={faq.id}
                    className="rounded-lg border bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
                  >
                    <h3 className="mb-2 font-medium">{faq.question}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div className="space-y-6">
            <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-6 flex items-center space-x-4">
                <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                  <PhoneIcon className="h-6 w-6 text-green-600 dark:text-green-300" aria-hidden="true" />
                </div>
                <h2 className="text-xl font-semibold">Contact Support</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Phone</h3>
                  <p className="text-sm">+1 (555) 123-4567</p>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Email</h3>
                  <p className="text-sm">support@smartchit.com</p>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Hours</h3>
                  <p className="text-sm">Monday - Friday: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-6 flex items-center space-x-4">
                <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
                  <EnvelopeIcon className="h-6 w-6 text-purple-600 dark:text-purple-300" aria-hidden="true" />
                </div>
                <h2 className="text-xl font-semibold">Submit a Request</h2>
              </div>
              <form className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Subject
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700"
                    placeholder="Enter subject"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Message
                  </label>
                  <textarea
                    className="w-full rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700"
                    rows={4}
                    placeholder="Enter your message"
                  />
                </div>
                <button className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                  Submit Request
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Help; 