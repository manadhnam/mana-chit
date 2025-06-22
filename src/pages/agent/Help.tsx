import { useState } from 'react';
import { QuestionMarkCircleIcon, ChatBubbleLeftRightIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { PhoneIcon, EnvelopeIcon, BookOpenIcon } from '@heroicons/react/24/solid';
import ChatSupport from '@/components/chat/ChatSupport';
import { useAuthStore } from '@/store/authStore';

interface FAQ {
  question: string;
  answer: string;
  category: 'general' | 'payments' | 'customers' | 'technical';
}

const AgentHelp = () => {
  const [activeTab, setActiveTab] = useState('faq');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const user = useAuthStore((state) => state.user);

  const faqs: FAQ[] = [
    {
      question: 'How do I add a new customer?',
      answer: 'To add a new customer, go to the Customers section and click on "Add New Customer". Fill in the required information and submit the form.',
      category: 'customers',
    },
    {
      question: 'How do I process a payment?',
      answer: 'Navigate to the Payments section, select the customer, enter the payment amount and details, then click "Process Payment".',
      category: 'payments',
    },
    {
      question: 'What are the commission rates?',
      answer: 'Commission rates vary based on the type of transaction and customer category. You can view the complete commission structure in the Settings section.',
      category: 'general',
    },
    {
      question: 'How do I generate reports?',
      answer: 'Go to the Reports section, select the type of report you need, set the date range, and click "Generate Report".',
      category: 'general',
    },
    {
      question: 'What should I do if the app is not working?',
      answer: 'First, try clearing your browser cache and refreshing the page. If the issue persists, contact technical support.',
      category: 'technical',
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      (selectedCategory === 'all' || faq.category === selectedCategory) &&
      (faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      <ChatSupport
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        userId={user?.id || ''}
        userRole={user?.role || ''}
        userName={user?.name || ''}
      />
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Help & Support
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Find answers to your questions and get support
          </p>
        </div>

        {/* Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-4">
            <button
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                activeTab === 'faq'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
              onClick={() => setActiveTab('faq')}
            >
              <QuestionMarkCircleIcon className="h-5 w-5" />
              <span>FAQ</span>
            </button>
            <button
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                activeTab === 'documentation'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
              onClick={() => setActiveTab('documentation')}
            >
              <BookOpenIcon className="h-5 w-5" />
              <span>Documentation</span>
            </button>
            <button
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                activeTab === 'contact'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
              onClick={() => setActiveTab('contact')}
            >
              <PhoneIcon className="h-5 w-5" />
              <span>Contact Support</span>
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          {activeTab === 'faq' && (
            <div className="space-y-6">
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search FAQs..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <select
                  className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="general">General</option>
                  <option value="payments">Payments</option>
                  <option value="customers">Customers</option>
                  <option value="technical">Technical</option>
                </select>
              </div>

              {/* FAQ List */}
              <div className="space-y-4">
                {filteredFaqs.map((faq, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'documentation' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Documentation
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <DocumentTextIcon className="h-8 w-8 text-primary-600 mb-2" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Getting Started Guide
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Learn the basics of using the agent portal
                  </p>
                  <button className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                    Read Guide →
                  </button>
                </div>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <BookOpenIcon className="h-8 w-8 text-primary-600 mb-2" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    User Manual
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Comprehensive guide to all features
                  </p>
                  <button className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                    Read Manual →
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Contact Support
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <PhoneIcon className="h-5 w-5" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Phone Support
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Available 24/7 for urgent issues
                  </p>
                  <a
                    href="tel:+1234567890"
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    +1 (234) 567-890
                  </a>
                </div>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <EnvelopeIcon className="h-5 w-5" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Email Support
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Get a response within 24 hours
                  </p>
                  <a
                    href="mailto:support@example.com"
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    support@example.com
                  </a>
                </div>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <ChatBubbleLeftRightIcon className="h-8 w-8 text-primary-600 mb-2" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Live Chat
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Chat with our support team
                  </p>
                  <button
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    onClick={() => setChatOpen(true)}
                  >
                    Start Chat →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AgentHelp; 