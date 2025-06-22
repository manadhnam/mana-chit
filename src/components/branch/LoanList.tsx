
import { motion } from 'framer-motion';
import {
  BanknotesIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  TrashIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/solid';

interface Loan {
  id: string;
  customer_id: string;
  customer_name: string;
  amount: number;
  interest_rate: number;
  term_months: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'closed' | 'defaulted';
  payment_frequency: 'monthly' | 'weekly' | 'daily';
  next_payment_date: string;
  next_payment_amount: number;
  total_paid: number;
  remaining_amount: number;
  documents: {
    id: string;
    type: string;
    url: string;
    verified: boolean;
    [key: string]: any;
  }[];
  created_at: string;
  updated_at: string;
}

interface LoanListProps {
  loans: Loan[];
  loading?: boolean;
  onEdit?: (loan: Loan) => void;
  onDelete?: (loan: Loan) => void;
  onViewDocuments?: (loan: Loan) => void;
  onViewPayments?: (loan: Loan) => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getStatusColor = (status: Loan['status']) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'closed':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'defaulted':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
};

export const LoanList: React.FC<LoanListProps> = ({
  loans,
  loading,
  onEdit,
  onDelete,
  onViewDocuments,
  onViewPayments,
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="animate-pulse bg-white dark:bg-gray-800 shadow rounded-lg p-4"
          >
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (loans.length === 0) {
    return (
      <div className="text-center py-12">
        <BanknotesIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No loans found</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Get started by creating a new loan.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {loans.map((loan, index) => (
        <motion.div
          key={loan.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-gray-800 shadow rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <BanknotesIcon className="h-12 w-12 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {loan.customer_name}
                </h3>
                <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <BanknotesIcon className="h-4 w-4 mr-1" />
                    {formatCurrency(loan.amount)}
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {loan.term_months} months
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    {loan.payment_frequency}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                  loan.status
                )}`}
              >
                {loan.status === 'active' ? (
                  <CheckCircleIcon className="h-4 w-4 mr-1" />
                ) : loan.status === 'defaulted' ? (
                  <XCircleIcon className="h-4 w-4 mr-1" />
                ) : null}
                {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
              </span>
              {onViewPayments && (
                <button
                  onClick={() => onViewPayments(loan)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  title="View Payments"
                >
                  <DocumentTextIcon className="h-5 w-5" />
                </button>
              )}
              {onViewDocuments && (
                <button
                  onClick={() => onViewDocuments(loan)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  title="View Documents"
                >
                  <DocumentTextIcon className="h-5 w-5" />
                </button>
              )}
              {onEdit && (
                <button
                  onClick={() => onEdit(loan)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  title="Edit Loan"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(loan)}
                  className="text-gray-400 hover:text-red-500 dark:hover:text-red-300"
                  title="Delete Loan"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm text-gray-500 dark:text-gray-400">
            <div>
              <span className="font-medium">Interest Rate:</span> {loan.interest_rate}%
            </div>
            <div>
              <span className="font-medium">Next Payment:</span>{' '}
              {formatDate(loan.next_payment_date)} ({formatCurrency(loan.next_payment_amount)})
            </div>
            <div>
              <span className="font-medium">Total Paid:</span>{' '}
              {formatCurrency(loan.total_paid)}
            </div>
            <div>
              <span className="font-medium">Remaining:</span>{' '}
              {formatCurrency(loan.remaining_amount)}
            </div>
          </div>
          {loan.documents && loan.documents.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Documents
              </h4>
              <div className="flex flex-wrap gap-2">
                {loan.documents.map((doc) => (
                  <span
                    key={doc.type}
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      doc.verified
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}
                  >
                    {doc.type}
                    {doc.verified ? (
                      <CheckCircleIcon className="h-4 w-4 ml-1" />
                    ) : (
                      <XCircleIcon className="h-4 w-4 ml-1" />
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}; 