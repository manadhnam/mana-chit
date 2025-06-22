import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Loan, Repayment } from '@/types';

interface LoanState {
  loans: Loan[];
  isLoading: boolean;
  error: string | null;
}

interface LoanStore extends LoanState {
  fetchLoans: (userId?: string) => Promise<void>;
  addLoan: (data: Partial<Loan>) => Promise<void>;
  updateLoan: (id: string, data: Partial<Loan>) => Promise<void>;
  deleteLoan: (id: string) => Promise<void>;
  approveLoan: (id: string) => Promise<void>;
  rejectLoan: (id: string) => Promise<void>;
  disburseLoan: (id: string) => Promise<void>;
  addRepayment: (loanId: string, amount: number) => Promise<void>;
}

export const useLoanStore = create<LoanStore>()(
  persist(
    (set, get) => ({
      loans: [
        {
          id: '1',
          userId: 'user1',
          amount: 50000,
          status: 'pending',
          interestRate: 12,
          term: 12,
          createdAt: '2024-03-01T10:00:00Z',
          updatedAt: '2024-03-01T10:00:00Z',
        },
        {
          id: '2',
          userId: 'user2',
          amount: 75000,
          status: 'approved',
          interestRate: 10,
          term: 24,
          createdAt: '2024-03-02T11:00:00Z',
          updatedAt: '2024-03-02T11:00:00Z',
        },
      ],
      isLoading: false,
      error: null,

      fetchLoans: async (userId?: string) => {
        set({ isLoading: true, error: null });
        try {
          // Mock API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false, error: 'Failed to fetch loans' });
        }
      },

      addLoan: async (data: Partial<Loan>) => {
        set({ isLoading: true, error: null });
        try {
          const newLoan: Loan = {
            id: Date.now().toString(),
            userId: data.userId || '',
            amount: data.amount || 0,
            status: 'pending',
            interestRate: data.interestRate || 12,
            term: data.term || 12,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          set((state) => ({
            loans: [...state.loans, newLoan],
            isLoading: false,
          }));
        } catch (error) {
          set({ isLoading: false, error: 'Failed to add loan' });
        }
      },

      updateLoan: async (id: string, data: Partial<Loan>) => {
        set({ isLoading: true, error: null });
        try {
          set((state) => ({
            loans: state.loans.map((loan) =>
              loan.id === id
                ? { ...loan, ...data, updatedAt: new Date().toISOString() }
                : loan
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ isLoading: false, error: 'Failed to update loan' });
        }
      },

      deleteLoan: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          set((state) => ({
            loans: state.loans.filter((loan) => loan.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          set({ isLoading: false, error: 'Failed to delete loan' });
        }
      },

      approveLoan: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          set((state) => ({
            loans: state.loans.map((loan) =>
              loan.id === id
                ? { ...loan, status: 'approved', updatedAt: new Date().toISOString() }
                : loan
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ isLoading: false, error: 'Failed to approve loan' });
        }
      },

      rejectLoan: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          set((state) => ({
            loans: state.loans.map((loan) =>
              loan.id === id
                ? { ...loan, status: 'rejected', updatedAt: new Date().toISOString() }
                : loan
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ isLoading: false, error: 'Failed to reject loan' });
        }
      },

      disburseLoan: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          set((state) => ({
            loans: state.loans.map((loan) =>
              loan.id === id
                ? { 
                    ...loan, 
                    status: 'disbursed', 
                    disbursedDate: new Date().toISOString(),
                    updatedAt: new Date().toISOString() 
                  }
                : loan
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ isLoading: false, error: 'Failed to disburse loan' });
        }
      },

      addRepayment: async (loanId: string, amount: number) => {
        set({ isLoading: true, error: null });
        try {
          const newRepayment: Repayment = {
            id: Date.now().toString(),
            loanId,
            amount,
            dueDate: new Date().toISOString(),
            status: 'completed',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          set((state) => ({
            loans: state.loans.map((loan) =>
              loan.id === loanId
                ? {
                    ...loan,
                    repayments: [...(loan.repayments || []), newRepayment],
                    remainingAmount: (loan.remainingAmount || loan.amount) - amount,
                    updatedAt: new Date().toISOString(),
                  }
                : loan
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ isLoading: false, error: 'Failed to add repayment' });
        }
      },
    }),
    {
      name: 'loan-storage'
    }
  )
);