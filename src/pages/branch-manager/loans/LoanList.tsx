import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  BanknotesIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  PaperAirplaneIcon,
  CurrencyRupeeIcon,
  PlusIcon,
} from '@heroicons/react/24/solid';

const mockLoans = [
  {
    id: '1',
    customer: 'Srinivas',
    amount: 50000,
    interest_rate: 12,
    term_months: 12,
    status: 'pending' as LoanStatus,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: '2',
    customer: 'Lakshmi',
    amount: 25000,
    interest_rate: 10,
    term_months: 6,
    status: 'approved' as LoanStatus,
    created_at: '2024-02-01',
    updated_at: '2024-02-01',
  },
  {
    id: '3',
    customer: 'Venkatesh',
    amount: 100000,
    interest_rate: 14,
    term_months: 24,
    status: 'disbursed' as LoanStatus,
    created_at: '2023-12-01',
    updated_at: '2024-01-15',
  },
  {
    id: '4',
    customer: 'Padma',
    amount: 40000,
    interest_rate: 11,
    term_months: 9,
    status: 'completed' as LoanStatus,
    created_at: '2023-06-01',
    updated_at: '2024-03-01',
  },
  {
    id: '5',
    customer: 'Ravi',
    amount: 30000,
    interest_rate: 13,
    term_months: 12,
    status: 'rejected' as LoanStatus,
    created_at: '2024-01-10',
    updated_at: '2024-01-12',
  },
];

type LoanStatus = 'pending' | 'approved' | 'rejected' | 'disbursed' | 'completed';

const statusColors: Record<LoanStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  approved: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  disbursed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  completed: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const LoanList = () => {
  const [loans, setLoans] = useState<typeof mockLoans>(mockLoans);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const updateLoanStatus = async (id: string, status: LoanStatus) => {
    setLoans(loans.map(l => (l.id === id ? { ...l, status } : l)));
    await fetch('/api/audit-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: `loan_${status}`,
        details: { loanId: id },
      }),
    });
    toast.success(`Loan status updated to ${status}`);
  };

  const filtered = loans.filter(l =>
    l.customer.toLowerCase().includes(search.toLowerCase()) ||
    l.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Loan Management</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Manage all loans for your branch.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/branch-manager/loans/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            New Loan
          </Link>
        </div>
      </div>
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="text-gray-500 dark:text-gray-400 text-sm">Total Loans</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{loans.length}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="text-gray-500 dark:text-gray-400 text-sm">Pending</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{loans.filter(l => l.status === 'pending').length}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="text-gray-500 dark:text-gray-400 text-sm">Approved</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{loans.filter(l => l.status === 'approved').length}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="text-gray-500 dark:text-gray-400 text-sm">Disbursed</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{loans.filter(l => l.status === 'disbursed').length}</div>
        </div>
      </div>
      {/* Search */}
      <div className="mb-4">
        <input
          className="block w-full sm:w-64 border rounded-md px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-primary-500 focus:border-primary-500"
          placeholder="Search by customer or loan ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            {loading ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">No loans found.</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Customer</th>
                    <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Amount</th>
                    <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Interest</th>
                    <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Term</th>
                    <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                  {filtered.map(l => (
                    <tr key={l.id}>
                      <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">{l.customer}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 dark:text-gray-300">₹{l.amount.toLocaleString()}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 dark:text-gray-300">{l.interest_rate}%</td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 dark:text-gray-300">{l.term_months} mo</td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[l.status]}`}>{l.status.charAt(0).toUpperCase() + l.status.slice(1)}</span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex items-center justify-end space-x-2">
                          {l.status === 'pending' && (
                            <>
                              <button onClick={() => updateLoanStatus(l.id, 'approved')} className="text-blue-600 hover:text-blue-900" title="Approve"><CheckCircleIcon className="h-5 w-5" /></button>
                              <button onClick={() => updateLoanStatus(l.id, 'rejected')} className="text-red-600 hover:text-red-900" title="Reject"><XCircleIcon className="h-5 w-5" /></button>
                            </>
                          )}
                          {l.status === 'approved' && (
                            <button onClick={() => updateLoanStatus(l.id, 'disbursed')} className="text-green-600 hover:text-green-900" title="Disburse"><BanknotesIcon className="h-5 w-5" /></button>
                          )}
                          {l.status === 'disbursed' && (
                            <button onClick={() => updateLoanStatus(l.id, 'completed')} className="text-gray-600 hover:text-gray-900" title="Mark as Completed"><ClockIcon className="h-5 w-5" /></button>
                          )}
                          <Link to={`/branch-manager/loans/${l.id}`} className="text-primary-600 hover:text-primary-900" title="View Details"><EyeIcon className="h-5 w-5" /></Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanList; 