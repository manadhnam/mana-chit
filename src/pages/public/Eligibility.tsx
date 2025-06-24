import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, CurrencyDollarIcon, ShieldCheckIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const Eligibility = () => {
  const incomeTiers = [
    { range: '₹8,000 – ₹14,999', plans: '₹2,000 / ₹3,000 / ₹5,000' },
    { range: '₹15,000 – ₹19,999', plans: '₹5,000 / ₹10,000 / ₹15,000' },
    { range: '₹20,000 – ₹24,999', plans: '₹10,000 / ₹15,000 / ₹20,000' },
    { range: '₹25,000 – ₹29,999', plans: '₹15,000 / ₹20,000 / ₹25,000 / ₹30,000' },
    { range: '₹30,000 and above', plans: '₹20,000 / ₹25,000 / ₹30,000 / ₹40,000+' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-gray-50 dark:bg-gray-900"
    >
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
            SmartChit Eligibility Rules
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            Find out if you're eligible to join our chit fund plans.
          </p>
        </div>

        {/* General Eligibility */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
            General Eligibility
          </h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
              <UserCircleIcon className="h-12 w-12 text-primary-500" />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Minimum Age</h3>
              <p className="mt-2 text-3xl font-bold text-gray-800 dark:text-gray-100">22 years</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
              <ShieldCheckIcon className="h-12 w-12 text-primary-500" />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Minimum CIBIL Score</h3>
              <p className="mt-2 text-3xl font-bold text-gray-800 dark:text-gray-100">650</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
              <CurrencyDollarIcon className="h-12 w-12 text-primary-500" />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Minimum Monthly Income</h3>
              <p className="mt-2 text-3xl font-bold text-gray-800 dark:text-gray-100">₹8,000</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
              <CheckCircleIcon className="h-12 w-12 text-primary-500" />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Nominee & Insurance</h3>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">A nominee is mandatory, and insurance coverage is included for all customers.</p>
            </div>
          </div>
        </div>

        {/* Income-based Eligibility */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
            Monthly Income-based Chit Plan Eligibility
          </h2>
          <div className="mt-10 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Monthly Income (₹)
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Eligible Chit Plans (₹)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {incomeTiers.map((tier, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700/50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {tier.range}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {tier.plans}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Nominee and Insurance */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
            Nominee and Insurance Requirements
          </h2>
          <div className="mt-10 max-w-4xl mx-auto space-y-6 text-lg text-gray-700 dark:text-gray-300">
            <p className="flex items-start">
              <ShieldCheckIcon className="h-7 w-7 text-primary-500 mr-3 flex-shrink-0" />
              <span>
                Customers must provide nominee details, including their full name, relationship to the customer, and a valid ID proof.
              </span>
            </p>
            <p className="flex items-start">
              <ShieldCheckIcon className="h-7 w-7 text-primary-500 mr-3 flex-shrink-0" />
              <span>
                All chit plans include mandatory insurance coverage. The insurance policy reference will be stored securely in our database.
              </span>
            </p>
            <p className="flex items-start">
              <ShieldCheckIcon className="h-7 w-7 text-primary-500 mr-3 flex-shrink-0" />
              <span>
                The included insurance will cover outstanding loan liabilities in unforeseen circumstances such as death or permanent disability.
              </span>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Eligibility; 