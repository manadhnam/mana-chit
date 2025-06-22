import { ArrowLeftIcon, QuestionMarkCircleIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { PhoneIcon, BookOpenIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';


interface FAQ {
  question: string;
  answer: string;
  category: string;
}

interface SupportContact {
  name: string;
  role: string;
  email: string;
  phone: string;
}

const mockFAQs: FAQ[] = [
  {
    question: 'How do I manage branch staff?',
    answer: 'You can manage branch staff through the Staff Management section. Here you can add new staff members, assign roles, and track their performance.',
    category: 'Staff Management',
  },
  {
    question: 'How do I view branch performance metrics?',
    answer: 'Branch performance metrics can be accessed through the Performance Metrics section. This includes key performance indicators, staff productivity, and financial metrics.',
    category: 'Performance',
  },
  {
    question: 'How do I manage branch budget?',
    answer: 'The Budget Management section allows you to view and manage your branch budget, track expenses, and generate financial reports.',
    category: 'Budget',
  },
  {
    question: 'How do I generate reports?',
    answer: 'Reports can be generated from the Reports section. You can create custom reports, schedule automated reports, and export data in various formats.',
    category: 'Reports',
  },
];

const mockSupportContacts: SupportContact[] = [
  {
    name: 'John Smith',
    role: 'Regional Manager',
    email: 'john.smith@company.com',
    phone: '+1 (555) 123-4567',
  },
  {
    name: 'Sarah Johnson',
    role: 'Technical Support',
    email: 'sarah.johnson@company.com',
    phone: '+1 (555) 987-6543',
  },
];

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredFAQs = mockFAQs.filter((faq) => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(mockFAQs.map((faq) => faq.category)));

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

      <div className="grid gap-6 md:grid-cols-2">
        {/* Search and Categories */}
        <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-6 flex items-center space-x-4">
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
              <QuestionMarkCircleIcon className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border px-4 py-2 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>

          <div className="mb-6">
            <h3 className="mb-2 text-sm font-medium">Categories</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`rounded-full px-3 py-1 text-sm ${
                  !selectedCategory
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-3 py-1 text-sm ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <div key={index} className="rounded-lg border p-4 dark:border-gray-700">
                <h3 className="mb-2 font-medium">{faq.question}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Support Contacts */}
        <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-6 flex items-center space-x-4">
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
            <h2 className="text-xl font-semibold">Support Contacts</h2>
          </div>

          <div className="space-y-4">
            {mockSupportContacts.map((contact, index) => (
              <div key={index} className="rounded-lg border p-4 dark:border-gray-700">
                <h3 className="mb-1 font-medium">{contact.name}</h3>
                <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">{contact.role}</p>
                <div className="flex items-center space-x-2 text-sm">
                  <PhoneIcon className="h-5 w-5 text-gray-400" />
                  <span>{contact.phone}</span>
                </div>
                <div className="mt-1 flex items-center space-x-2 text-sm">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{contact.email}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="mb-4 text-lg font-medium">Documentation</h3>
            <div className="space-y-4">
              <a
                href="#"
                className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <BookOpenIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <div>
                  <h4 className="font-medium">Branch Manager Guide</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Complete guide for branch managers
                  </p>
                </div>
              </a>
              <a
                href="#"
                className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <BookOpenIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <div>
                  <h4 className="font-medium">Staff Management Guide</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Guide for managing branch staff
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help; 