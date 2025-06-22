
import { motion } from 'framer-motion';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowPathIcon,
  BanknotesIcon,
  CreditCardIcon,
  DocumentTextIcon,
  CalendarIcon,
} from '@heroicons/react/24/solid';

interface Transaction {
  id: string;
  transaction_type: 'deposit' | 'withdrawal' | 'transfer' | 'interest' | 'fee' | 'loan_disbursement' | 'loan_repayment' | 'chit_contribution' | 'chit_payout';
  amount: number;
  balance_before: number;
  balance_after: number;
  reference_id: string;
  description: string;
  created_at: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, isLoading = false }) => {
  const getTransactionIcon = (type: Transaction['transaction_type']) => {
    switch (type) {
      case 'deposit':
      case 'interest':
      case 'loan_disbursement':
      case 'chit_payout':
        return ArrowDownIcon;
      case 'withdrawal':
      case 'transfer':
      case 'fee':
      case 'loan_repayment':
      case 'chit_contribution':
        return ArrowUpIcon;
      default:
        return DocumentTextIcon;
    }
  };

  const getTransactionColor = (type: Transaction['transaction_type']) => {
    switch (type) {
      case 'deposit':
      case 'interest':
      case 'loan_disbursement':
      case 'chit_payout':
        return 'text-green-600 dark:text-green-400';
      case 'withdrawal':
      case 'transfer':
      case 'fee':
      case 'loan_repayment':
      case 'chit_contribution':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const formatTransactionType = (type: Transaction['transaction_type']) => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No transactions</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Get started by making your first transaction.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => {
        const Icon = getTransactionIcon(transaction.transaction_type);
        const color = getTransactionColor(transaction.transaction_type);

        return (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${color.replace('text', 'bg').replace('-600', '-100').replace('-400', '-900')}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatTransactionType(transaction.transaction_type)}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    <CalendarIcon className="h-3 w-3" />
                    <span>{new Date(transaction.created_at).toLocaleDateString()}</span>
                    {transaction.reference_id && (
                      <>
                        <span>•</span>
                        <span>Ref: {transaction.reference_id}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${color}`}>
                  {transaction.transaction_type.includes('deposit') || 
                   transaction.transaction_type.includes('interest') || 
                   transaction.transaction_type.includes('disbursement') || 
                   transaction.transaction_type.includes('payout') ? '+' : '-'}
                  ₹{transaction.amount.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Balance: ₹{transaction.balance_after.toLocaleString()}
                </p>
              </div>
            </div>
            {transaction.description && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {transaction.description}
              </p>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}; 