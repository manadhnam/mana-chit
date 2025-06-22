import { MagnifyingGlassIcon, ChevronDownIcon, ChevronUpIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';


interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

const FAQs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'How do I apply for a loan?',
      answer: 'To apply for a loan, log in to your account and navigate to the Loans section. Click on "Apply for Loan" and fill out the application form with your personal and financial details. Submit the required documents and wait for approval.',
      category: 'loans',
      tags: ['loan', 'application', 'process'],
    },
    {
      id: '2',
      question: 'What documents are required for loan approval?',
      answer: 'Required documents include: 1) Identity proof (Aadhaar Card/PAN Card), 2) Address proof, 3) Income proof (salary slips/bank statements), 4) Employment proof, and 5) Recent photographs.',
      category: 'loans',
      tags: ['documents', 'loan', 'requirements'],
    },
    {
      id: '3',
      question: 'How do chit groups work?',
      answer: 'A chit group is a rotating savings and credit system. Members contribute a fixed amount monthly, and each month one member receives the total collection. The process continues until all members receive their turn.',
      category: 'chit',
      tags: ['chit', 'savings', 'group'],
    },
    {
      id: '4',
      question: 'What are the benefits of joining a chit group?',
      answer: 'Benefits include: 1) Regular savings habit, 2) Access to funds when needed, 3) No interest on your own contribution, 4) Flexible usage of funds, and 5) Building credit history.',
      category: 'chit',
      tags: ['benefits', 'chit', 'savings'],
    },
    {
      id: '5',
      question: 'How can I make a payment?',
      answer: 'You can make payments through: 1) Online banking, 2) UPI, 3) Debit/Credit card, 4) Cash deposit at our branches, or 5) NEFT/RTGS transfer.',
      category: 'payments',
      tags: ['payment', 'methods', 'online'],
    },
    {
      id: '6',
      question: 'What happens if I miss a payment?',
      answer: 'Missing a payment may result in: 1) Late payment charges, 2) Negative impact on credit score, 3) Possible legal action. We recommend contacting your relationship manager immediately if you anticipate payment issues.',
      category: 'payments',
      tags: ['late', 'payment', 'charges'],
    },
  ];

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'loans', name: 'Loans' },
    { id: 'chit', name: 'Chit Groups' },
    { id: 'payments', name: 'Payments' },
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Frequently Asked Questions</h1>
        <p className="text-gray-600 dark:text-gray-400">Find answers to common questions about our services</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
            </div>
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* FAQs List */}
      <div className="space-y-4">
        {filteredFaqs.map((faq) => (
          <div
            key={faq.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
          >
            <button
              onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
              className="w-full px-6 py-4 text-left focus:outline-none"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <QuestionMarkCircleIcon className="h-5 w-5 text-primary-600 mr-3" />
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {faq.question}
                  </h3>
                </div>
                {expandedFaq === faq.id ? (
                  <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                )}
              </div>
              {expandedFaq === faq.id && (
                <div
                  className="mt-4 text-sm text-gray-500 dark:text-gray-400"
                >
                  <p className="whitespace-pre-line">{faq.answer}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {faq.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredFaqs.length === 0 && (
        <div className="text-center py-12">
          <QuestionMarkCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No questions found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
};

export default FAQs; 