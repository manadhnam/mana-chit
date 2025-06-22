import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlusIcon } from '@heroicons/react/24/solid';

// This is a placeholder. In a real app, you'd fetch this data.
const mockCustomers = [
  { id: '1', name: 'Ramesh Kumar', status: 'active' },
  { id: '2', name: 'Sunita Devi', status: 'pending' },
  { id: '3', name: 'Amit Singh', status: 'rejected' },
];

const CustomerList = () => {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Customers</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            View and manage customers assigned to you.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/agent/customers/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            <UserPlusIcon className="h-5 w-5 mr-2" />
            Add New Customer
          </Link>
        </div>
      </div>
      {/* Customer Table */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Name</th>
                  <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                  <th className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">View</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                {mockCustomers.map(customer => (
                  <tr key={customer.id}>
                    <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">{customer.name}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        customer.status === 'active' ? 'bg-green-100 text-green-800' :
                        customer.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                      </span>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <Link to={`/agent/customers/${customer.id}`} className="text-primary-600 hover:text-primary-900">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerList; 