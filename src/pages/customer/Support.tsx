import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  QuestionMarkCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/solid';
import ChatSupport from '@/components/chat/ChatSupport';
import { useAuthStore } from '@/store/authStore';

interface FAQ {
  question: string;
  answer: string;
}

interface SupportTicket {
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

const faqs: FAQ[] = [
  {
    question: 'How do I apply for a loan?',
    answer:
      'You can apply for a loan by logging into your account and navigating to the "Loans" section. Click on "Apply for Loan" and follow the step-by-step process. Make sure to have all required documents ready before starting the application.',
  },
  {
    question: 'What documents are required for loan approval?',
    answer:
      'The required documents include proof of identity (Aadhaar/PAN), proof of address, income proof (salary slips/bank statements), and employment details. Additional documents may be required based on the loan type and amount.',
  },
  {
    question: 'How long does it take to process a loan application?',
    answer:
      'Typically, loan applications are processed within 3-5 business days. The exact time may vary depending on the loan type, amount, and completeness of submitted documents.',
  },
  {
    question: 'What are the interest rates for different loan types?',
    answer:
      'Interest rates vary based on the loan type, amount, and tenure. You can check the current rates in the "Loans" section or contact our support team for detailed information.',
  },
  {
    question: 'How can I make loan payments?',
    answer:
      'You can make loan payments through various methods including online banking, UPI, debit card, or by visiting our branch. Set up automatic payments to avoid missing due dates.',
  },
];

const Support = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [ticket, setTicket] = useState<SupportTicket>({
    subject: '',
    description: '',
    priority: 'medium',
    category: 'general',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const user = useAuthStore((state) => state.user);

  const handleFaqToggle = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Support ticket submitted successfully');
      setTicket({
        subject: '',
        description: '',
        priority: 'medium',
        category: 'general',
      });
    } catch (error) {
      toast.error('Failed to submit support ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ChatSupport
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        userId={user?.id || ''}
        userRole={user?.role || ''}
        userName={user?.name || ''}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto p-6"
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Support & Help
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Get assistance with your account and services
          </p>
        </div>

        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <PhoneIcon className="w-6 h-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Call Us
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  24/7 Customer Support
                </p>
                <p className="mt-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                  +1 (555) 123-4567
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <EnvelopeIcon className="w-6 h-6 text-green-600 dark:text-green-300" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Email Us
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Response within 24 hours
                </p>
                <p className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                  support@example.com
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-purple-600 dark:text-purple-300" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Live Chat
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Available 9 AM - 6 PM
                </p>
                <button
                  className="mt-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                  onClick={() => setChatOpen(true)}
                >
                  Start Chat
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {faqs.map((faq, index) => (
              <div key={index} className="p-6">
                <button
                  onClick={() => handleFaqToggle(index)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {faq.question}
                  </span>
                  {expandedFaq === index ? (
                    <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedFaq === index && (
                  <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Support Ticket Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Raise a Support Ticket
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Fill out the form below and we'll get back to you as soon as possible
            </p>
          </div>
          <form onSubmit={handleTicketSubmit} className="p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={ticket.subject}
                  onChange={(e) =>
                    setTicket({ ...ticket, subject: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Category
                </label>
                <select
                  required
                  value={ticket.category}
                  onChange={(e) =>
                    setTicket({ ...ticket, category: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="general">General Inquiry</option>
                  <option value="technical">Technical Issue</option>
                  <option value="billing">Billing Question</option>
                  <option value="loan">Loan Related</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Priority
                </label>
                <select
                  required
                  value={ticket.priority}
                  onChange={(e) =>
                    setTicket({
                      ...ticket,
                      priority: e.target.value as SupportTicket['priority'],
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  required
                  rows={4}
                  value={ticket.description}
                  onChange={(e) =>
                    setTicket({ ...ticket, description: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <PaperAirplaneIcon className="w-4 h-4 mr-2" />
                      Submit Ticket
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </>
  );
};

export default Support; 