import { ArrowLeftIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
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
    question: 'How do I manage mandal staff?',
    answer: 'You can manage mandal staff through the Staff Management section. Here you can add new staff members, assign roles, and monitor their performance.',
    category: 'mandal',
  },
  {
    id: 2,
    question: 'How do I track mandal budget?',
    answer: 'The Budget Management section provides detailed insights into your mandal\'s financial status, including income, expenses, and budget allocation.',
    category: 'budget',
  },
  {
    id: 3,
    question: 'How do I generate mandal reports?',
    answer: 'You can generate various reports from the Reports section, including performance metrics, financial reports, and staff activity reports.',
    category: 'reports',
  },
];

const Help = () => {
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
                onClick={() => setSelectedCategory('mandal')}
                className={`rounded-full px-4 py-2 text-sm ${
                  selectedCategory === 'mandal'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Mandal
              </button>
              <button
                onClick={() => setSelectedCategory('budget')}
                className={`rounded-full px-4 py-2 text-sm ${
                  selectedCategory === 'budget'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Budget
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
                <div className="h-6 w-6 text-green-600 dark:text-green-300">
                  {/* Replace with actual phone icon */}
                </div>
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
                <div className="h-6 w-6 text-purple-600 dark:text-purple-300">
                  {/* Replace with actual email icon */}
                </div>
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
    </div>
  );
};

export default Help; 