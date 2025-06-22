import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { CheckCircleIcon, XCircleIcon, ClockIcon, BanknotesIcon } from '@heroicons/react/24/solid';
import { ArrowLeftIcon, CalendarIcon } from '@heroicons/react/24/outline';



interface Repayment {
  id: string;
  dueDate: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  paidDate?: string;
  receiptId?: string;
}

const mockRepayments: Repayment[] = [
  {
    id: '1',
    dueDate: '2024-06-01',
    amount: 5000,
    status: 'paid',
    paidDate: '2024-06-01',
    receiptId: 'RCPT001',
  },
  {
    id: '2',
    dueDate: '2024-07-01',
    amount: 5000,
    status: 'paid',
    paidDate: '2024-07-01',
    receiptId: 'RCPT002',
  },
  {
    id: '3',
    dueDate: '2024-08-01',
    amount: 5000,
    status: 'pending',
  },
  {
    id: '4',
    dueDate: '2024-09-01',
    amount: 5000,
    status: 'pending',
  },
];

const LoanRepaymentSchedule = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [repayments, setRepayments] = useState<Repayment[]>([]);

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setRepayments(mockRepayments);
      setIsLoading(false);
    }, 1000);
  }, []);

  const totalAmount = repayments.reduce((sum, r) => sum + r.amount, 0);
  const paidAmount = repayments.filter(r => r.status === 'paid').reduce((sum, r) => sum + r.amount, 0);
  const pendingAmount = repayments.filter(r => r.status !== 'paid').reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Back
      </button>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Loan Repayment Schedule</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">View your upcoming and completed loan repayments.</p>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center">
          <BanknotesIcon />
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Amount</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">₹{totalAmount.toLocaleString()}</div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center">
          <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400 mr-3" />
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Paid</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">₹{paidAmount.toLocaleString()}</div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center">
          <ClockIcon />
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Pending</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">₹{pendingAmount.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Due Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Paid Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Receipt</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  <div className="mt-2 text-gray-600 dark:text-gray-400">Loading schedule...</div>
                </td>
              </tr>
            ) : repayments.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-600 dark:text-gray-400">No repayment schedule found.</td>
              </tr>
            ) : (
              repayments.map((r, idx) => (
                <tr key={r.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{idx + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-2 text-primary-500" />
                    {new Date(r.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">₹{r.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {r.status === 'paid' ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        <CheckCircleIcon className="h-4 w-4 mr-1" /> Paid
                      </span>
                    ) : r.status === 'pending' ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                        <ClockIcon />
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                        <XCircleIcon className="h-4 w-4 mr-1" /> Overdue
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {r.paidDate ? new Date(r.paidDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {r.receiptId ? (
                      <button
                        onClick={() => toast.success('Open receipt preview!')}
                        className="text-primary-600 hover:underline dark:text-primary-400"
                      >
                        View
                      </button>
                    ) : '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoanRepaymentSchedule; 