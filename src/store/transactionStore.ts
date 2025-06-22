import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction, TransactionType } from '@/types';

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
}

interface TransactionStore extends TransactionState {
  fetchTransactions: (userId: string) => Promise<void>;
  addTransaction: (data: Partial<Transaction>) => Promise<void>;
  updateTransaction: (id: string, data: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  getTransactionSummary: (userId: string) => Promise<any>;
}

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set) => ({
      transactions: [
        {
          id: '1',
          userId: 'user1',
          type: 'contribution',
          amount: 5000,
          status: 'completed',
          description: 'Monthly contribution payment',
          createdAt: '2024-03-10T10:00:00Z',
          updatedAt: '2024-03-10T10:00:00Z',
        },
        {
          id: '2',
          userId: 'user1',
          type: 'withdrawal',
          amount: 2000,
          status: 'completed',
          description: 'Emergency withdrawal',
          createdAt: '2024-03-09T15:30:00Z',
          updatedAt: '2024-03-09T15:30:00Z',
        },
        {
          id: '3',
          userId: 'user1',
          type: 'loan',
          amount: 10000,
          status: 'completed',
          description: 'Loan disbursement',
          createdAt: '2024-03-08T09:15:00Z',
          updatedAt: '2024-03-08T09:15:00Z',
        },
      ],
      isLoading: false,
      error: null,

      fetchTransactions: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          // Mock API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false, error: 'Failed to fetch transactions' });
        }
      },

      addTransaction: async (data: Partial<Transaction>) => {
        set({ isLoading: true, error: null });
        try {
          const newTransaction: Transaction = {
            id: Date.now().toString(),
            userId: data.userId || '',
            type: data.type || 'contribution',
            amount: data.amount || 0,
            status: 'pending',
            description: data.description || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          set((state) => ({
            transactions: [newTransaction, ...state.transactions],
            isLoading: false,
          }));
        } catch (error) {
          set({ isLoading: false, error: 'Failed to add transaction' });
        }
      },

      updateTransaction: async (id: string, data: Partial<Transaction>) => {
        set({ isLoading: true, error: null });
        try {
          set((state) => ({
            transactions: state.transactions.map((transaction) =>
              transaction.id === id
                ? { ...transaction, ...data, updatedAt: new Date().toISOString() }
                : transaction
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ isLoading: false, error: 'Failed to update transaction' });
        }
      },

      deleteTransaction: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          set((state) => ({
            transactions: state.transactions.filter((transaction) => transaction.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          set({ isLoading: false, error: 'Failed to delete transaction' });
        }
      },

      getTransactionSummary: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          // Mock API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const summary = {
            totalContributions: 50000,
            totalWithdrawals: 20000,
            totalLoans: 30000,
            balance: 0,
          };
          
          set({ isLoading: false });
          return summary;
        } catch (error) {
          set({ isLoading: false, error: 'Failed to get transaction summary' });
          return null;
        }
      },
    }),
    {
      name: 'transaction-storage'
    }
  )
); 