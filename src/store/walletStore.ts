import { create } from 'zustand';

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  date: string;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  category: 'contribution' | 'withdrawal' | 'interest' | 'refund' | 'other';
}

interface Wallet {
  id: string;
  userId: string;
  balance: number;
  transactions: Transaction[];
  lastUpdated: string;
}

interface WalletState {
  userWallet: Wallet | null;
  isLoading: boolean;
  fetchWallet: (userId: string) => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date' | 'status'>) => Promise<void>;
  updateBalance: (amount: number, type: 'credit' | 'debit') => Promise<void>;
}

// Mock wallet data for testing
const mockWallet: Wallet = {
  id: '1',
  userId: '1',
  balance: 50000,
  transactions: [
    {
      id: '1',
      type: 'credit',
      amount: 10000,
      date: '2024-01-01',
      description: 'Initial deposit',
      status: 'completed',
      category: 'contribution'
    },
    {
      id: '2',
      type: 'debit',
      amount: 5000,
      date: '2024-01-15',
      description: 'Monthly contribution',
      status: 'completed',
      category: 'contribution'
    },
    {
      id: '3',
      type: 'credit',
      amount: 1000,
      date: '2024-02-01',
      description: 'Interest earned',
      status: 'completed',
      category: 'interest'
    }
  ],
  lastUpdated: '2024-02-01'
};

export const useWalletStore = create<WalletState>((set) => ({
  userWallet: null,
  isLoading: false,

  fetchWallet: async (userId: string) => {
    try {
      set({ isLoading: true });
      // Mock API call - in real app, this would fetch from backend
      set({ userWallet: mockWallet, isLoading: false });
    } catch (error) {
      console.error('Error fetching wallet:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  addTransaction: async (transaction: Omit<Transaction, 'id' | 'date' | 'status'>) => {
    try {
      set({ isLoading: true });
      // Mock API call - in real app, this would send to backend
      const newTransaction: Transaction = {
        id: (mockWallet.transactions.length + 1).toString(),
        ...transaction,
        date: new Date().toISOString(),
        status: 'completed'
      };
      const updatedWallet = {
        ...mockWallet,
        transactions: [...mockWallet.transactions, newTransaction],
        lastUpdated: new Date().toISOString()
      };
      set({ userWallet: updatedWallet, isLoading: false });
    } catch (error) {
      console.error('Error adding transaction:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  updateBalance: async (amount: number, type: 'credit' | 'debit') => {
    try {
      set({ isLoading: true });
      // Mock API call - in real app, this would send to backend
      const updatedWallet = {
        ...mockWallet,
        balance: type === 'credit' 
          ? mockWallet.balance + amount 
          : mockWallet.balance - amount,
        lastUpdated: new Date().toISOString()
      };
      set({ userWallet: updatedWallet, isLoading: false });
    } catch (error) {
      console.error('Error updating balance:', error);
      set({ isLoading: false });
      throw error;
    }
  }
})); 