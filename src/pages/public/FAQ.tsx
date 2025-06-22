import { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FAQCategory {
  title: string;
  questions: {
    question: string;
    answer: string;
  }[];
}

const FAQ = () => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  const faqCategories: FAQCategory[] = [
    {
      title: 'Getting Started',
      questions: [
        {
          question: 'What is a chit fund?',
          answer: 'A chit fund is a financial scheme where a group of people contribute a fixed amount periodically, and each member gets a chance to receive the collected sum through an auction or lottery system.',
        },
        {
          question: 'How do I join Mana Chit?',
          answer: 'To join Mana Chit, simply register on our platform, complete your profile, and start exploring available chit groups. You can join multiple groups based on your financial goals.',
        },
        {
          question: 'What are the eligibility criteria?',
          answer: 'You must be at least 18 years old, have a valid government ID, and maintain a good credit history. Additional criteria may apply based on the specific chit group.',
        },
      ],
    },
    {
      title: 'Chit Groups',
      questions: [
        {
          question: 'How are chit groups formed?',
          answer: 'Chit groups are formed based on the total amount, duration, and number of members. Each group has specific terms and conditions that all members must agree to.',
        },
        {
          question: 'What is the minimum contribution amount?',
          answer: 'The minimum contribution amount varies by group, typically ranging from ₹1,000 to ₹50,000 per month. You can choose a group that matches your financial capacity.',
        },
        {
          question: 'How long does a chit group last?',
          answer: 'Chit group durations typically range from 12 to 60 months, depending on the group size and contribution amount. The duration is fixed when the group is formed.',
        },
      ],
    },
    {
      title: 'Payments and Transactions',
      questions: [
        {
          question: 'What payment methods are accepted?',
          answer: 'We accept various payment methods including bank transfers, UPI, credit/debit cards, and digital wallets. All transactions are secure and encrypted.',
        },
        {
          question: 'What happens if I miss a payment?',
          answer: 'Missing a payment may result in late fees and could affect your standing in the group. We recommend contacting your group administrator immediately to discuss payment options.',
        },
        {
          question: 'How do I track my payments?',
          answer: 'You can track all your payments and transactions in the Passbook section of your dashboard. Detailed statements are available for download.',
        },
      ],
    },
    {
      title: 'Auctions and Payouts',
      questions: [
        {
          question: 'How do auctions work?',
          answer: 'Auctions are conducted monthly where members bid the lowest amount they\'re willing to accept. The member with the lowest bid wins and receives the chit amount minus their bid.',
        },
        {
          question: 'When will I receive my payout?',
          answer: 'Payouts are typically processed within 2-3 business days after the auction. The amount is transferred directly to your registered bank account.',
        },
        {
          question: 'Can I participate in multiple auctions?',
          answer: 'Yes, you can participate in multiple auctions across different groups. However, you can only win one auction per group.',
        },
      ],
    },
    {
      title: 'Security and Privacy',
      questions: [
        {
          question: 'How secure is my data?',
          answer: 'We use industry-standard encryption and security measures to protect your data. All transactions are monitored for fraud, and we regularly update our security protocols.',
        },
        {
          question: 'Who can see my information?',
          answer: 'Your personal information is only visible to you and authorized administrators. Limited information is shared with other group members as required for group operations.',
        },
        {
          question: 'How do I report suspicious activity?',
          answer: 'You can report suspicious activity through the Help & Support section or by contacting our customer support team directly.',
        },
      ],
    },
  ];

  const toggleCategory = (categoryTitle: string) => {
    setExpandedCategory(expandedCategory === categoryTitle ? null : categoryTitle);
  };

  const toggleQuestion = (questionId: string) => {
    const newExpandedQuestions = new Set(expandedQuestions);
    if (newExpandedQuestions.has(questionId)) {
      newExpandedQuestions.delete(questionId);
    } else {
      newExpandedQuestions.add(questionId);
    }
    setExpandedQuestions(newExpandedQuestions);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/"
        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-8"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h1>

      <div className="space-y-6">
        {faqCategories.map((category) => (
          <div key={category.title} className="bg-white rounded-lg shadow-sm border">
            <button
              onClick={() => toggleCategory(category.title)}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <h2 className="text-lg font-semibold text-gray-900">{category.title}</h2>
              {expandedCategory === category.title ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>

            {expandedCategory === category.title && (
              <div className="px-6 pb-4">
                <div className="space-y-4">
                  {category.questions.map((faq, index) => {
                    const questionId = `${category.title}-${index}`;
                    return (
                      <div key={index} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                        <button
                          onClick={() => toggleQuestion(questionId)}
                          className="flex items-center justify-between w-full text-left"
                        >
                          <span className="text-sm font-medium text-gray-900">{faq.question}</span>
                          {expandedQuestions.has(questionId) ? (
                            <ChevronUp className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          )}
                        </button>
                        {expandedQuestions.has(questionId) && (
                          <p className="mt-2 text-sm text-gray-600">{faq.answer}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Still have questions?</h2>
        <p className="text-sm text-gray-600 mb-4">
          If you couldn't find the answer you're looking for, please contact our support team.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="mailto:support@manachit.com"
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            Email Support
          </a>
          <a
            href="tel:+18001234567"
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            Call Support
          </a>
          <Link
            to="/help"
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            Visit Help Center
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQ; 