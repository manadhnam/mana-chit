import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';
import { Transaction, TransactionType } from '@/types/database';
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  BanknotesIcon,
  CreditCardIcon,
  GiftIcon,
  ArrowsRightLeftIcon,
} from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/formatters';

const ITEMS_PER_PAGE = 10;

const MyTransactions = () => {
  const { user } = useAuthStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeType, setActiveType] = useState<TransactionType | 'all'>('all');
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year' | 'all'>('month');
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  
  const transactionTypes: (TransactionType | 'all')[] = ['all', 'wallet_deposit', 'wallet_withdrawal', 'chit_contribution', 'loan_repayment', 'loan_disbursement', 'chit_payout', 'referral_bonus'];

  useEffect(() => {
    const loadTransactions = async () => {
      if (!user?.id) return;
      setIsLoading(true);

      const from = page * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      let query = supabase
        .from('transactions')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id);

      if (activeType !== 'all') {
        query = query.eq('type', activeType);
      }

      if (dateRange !== 'all') {
        const now = new Date();
        const startDate = new Date();
        if (dateRange === 'week') startDate.setDate(now.getDate() - 7);
        if (dateRange === 'month') startDate.setMonth(now.getMonth() - 1);
        if (dateRange === 'year') startDate.setFullYear(now.getFullYear() - 1);
        query = query.gte('created_at', startDate.toISOString());
      }
      
      query = query.range(from, to).order('created_at', { ascending: false });

      try {
        const { data, error, count } = await query;
        if (error) throw error;
        
        setTransactions(data || []);
        setTotalCount(count || 0);
      } catch (error: any) {
        toast.error('Failed to load transactions: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, [user?.id, page, activeType, dateRange]);

  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case 'wallet_deposit': return <ArrowDownTrayIcon className="h-5 w-5 text-green-500" />;
      case 'chit_contribution': return <BanknotesIcon className="h-5 w-5 text-blue-500" />;
      case 'loan_repayment': return <ArrowsRightLeftIcon className="h-5 w-5 text-purple-500" />;
      case 'wallet_withdrawal': return <ArrowUpTrayIcon className="h-5 w-5 text-red-500" />;
      case 'loan_disbursement': return <CreditCardIcon className="h-5 w-5 text-orange-500" />;
      case 'chit_payout': return <CreditCardIcon className="h-5 w-5 text-yellow-500" />;
      case 'referral_bonus': return <GiftIcon className="h-5 w-5 text-pink-500" />;
      default: return <BanknotesIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const pageCount = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">My Transactions</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            View your transaction history
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 space-y-4">
        <div className="flex flex-wrap gap-2">
          {transactionTypes.map((type) => (
            <button
              key={type}
              onClick={() => { setActiveType(type); setPage(0); }}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-full ${
                activeType === type
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          {['month', 'year', 'all'].map((range) => (
            <Button
              key={range}
              variant={dateRange === range ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => { setDateRange(range as 'month' | 'year' | 'all'); setPage(0); }}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Transactions List */}
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">
                      Transaction
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Amount
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Date
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Reference
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                  {transactions.map((transaction) => (
                    <motion.tr
                      key={transaction.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                            {getTransactionIcon(transaction.type)}
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900 dark:text-white capitalize">
                              {transaction.type.replace(/_/g, ' ')}
                            </div>
                            <div className="text-gray-500 dark:text-gray-400">
                                {new Date(transaction.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`font-medium ${
                          transaction.amount < 0
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-green-600 dark:text-green-400'
                        }`}>
                          {transaction.amount < 0 ? '' : '+'}
                          {formatCurrency(transaction.amount)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                         {new Date(transaction.created_at).toLocaleTimeString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {transaction.reference_id}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      {isLoading && (
         <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
         </div>
      )}

      {!isLoading && transactions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No transactions found for the selected filters.</p>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
          <span className="text-sm text-gray-700 dark:text-gray-400">
              Page {page + 1} of {pageCount}
          </span>
          <div className="flex items-center space-x-2">
              <Button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>
                  Previous
              </Button>
              <Button onClick={() => setPage(p => Math.min(pageCount - 1, p + 1))} disabled={page >= pageCount - 1}>
                  Next
              </Button>
          </div>
      </div>
    </div>
  );
};

export default MyTransactions; 