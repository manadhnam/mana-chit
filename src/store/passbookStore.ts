import { create } from 'zustand';

interface PassbookEntry {
  id: string;
  date: string;
  description: string;
  type: 'credit' | 'debit';
  amount: number;
  balance: number;
  category: 'contribution' | 'withdrawal' | 'interest' | 'refund' | 'other';
  status: 'completed' | 'pending' | 'failed';
  reference: string;
}

interface Passbook {
  id: string;
  userId: string;
  entries: PassbookEntry[];
  currentBalance: number;
  lastUpdated: string;
}

interface PassbookState {
  userPassbook: Passbook | null;
  isLoading: boolean;
  fetchPassbook: (userId: string) => Promise<void>;
  addEntry: (entry: Omit<PassbookEntry, 'id' | 'date' | 'balance' | 'status'>) => Promise<void>;
  getBalance: () => number;
}

// Mock passbook data for testing
const mockPassbook: Passbook = {
  id: '1',
  userId: '1',
  entries: [
    {
      id: '1',
      date: '2024-01-01',
      description: 'Initial deposit',
      type: 'credit',
      amount: 10000,
      balance: 10000,
      category: 'contribution',
      status: 'completed',
      reference: 'INIT-001'
    },
    {
      id: '2',
      date: '2024-01-15',
      description: 'Monthly contribution',
      type: 'debit',
      amount: 5000,
      balance: 5000,
      category: 'contribution',
      status: 'completed',
      reference: 'CONT-001'
    },
    {
      id: '3',
      date: '2024-02-01',
      description: 'Interest earned',
      type: 'credit',
      amount: 1000,
      balance: 6000,
      category: 'interest',
      status: 'completed',
      reference: 'INT-001'
    }
  ],
  currentBalance: 6000,
  lastUpdated: '2024-02-01'
};

export const usePassbookStore = create<PassbookState>((set, get) => ({
  userPassbook: null,
  isLoading: false,

  fetchPassbook: async (userId: string) => {
    try {
      set({ isLoading: true });
      // Mock API call - in real app, this would fetch from backend
      set({ userPassbook: mockPassbook, isLoading: false });
    } catch (error) {
      console.error('Error fetching passbook:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  addEntry: async (entry: Omit<PassbookEntry, 'id' | 'date' | 'balance' | 'status'>) => {
    try {
      set({ isLoading: true });
      // Mock API call - in real app, this would send to backend
      const currentBalance = get().getBalance();
      const newBalance = entry.type === 'credit' 
        ? currentBalance + entry.amount 
        : currentBalance - entry.amount;

      const newEntry: PassbookEntry = {
        id: (mockPassbook.entries.length + 1).toString(),
        ...entry,
        date: new Date().toISOString(),
        balance: newBalance,
        status: 'completed'
      };

      const updatedPassbook = {
        ...mockPassbook,
        entries: [...mockPassbook.entries, newEntry],
        currentBalance: newBalance,
        lastUpdated: new Date().toISOString()
      };

      set({ userPassbook: updatedPassbook, isLoading: false });
    } catch (error) {
      console.error('Error adding passbook entry:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  getBalance: () => {
    const state = get();
    return state.userPassbook?.currentBalance || 0;
  }
})); 