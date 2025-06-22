import { create } from 'zustand';
import { LOAN_ENDPOINTS } from '@/api/endpoints';

export interface LoanApproval {
  id: string;
  loanId: string;
  level: 'BRANCH' | 'REGIONAL' | 'HEAD';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approverId: string;
  approverName: string;
  approverRole: string;
  comments: string;
  riskAssessment: {
    score: number;
    factors: string[];
    recommendations: string[];
  };
  createdAt: string;
  updatedAt: string;
}

interface LoanApprovalStore {
  approvals: LoanApproval[];
  currentApproval: LoanApproval | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchApprovals: (loanId: string) => Promise<void>;
  submitForApproval: (loanId: string, data: Partial<LoanApproval>) => Promise<void>;
  approveLoan: (approvalId: string, comments: string) => Promise<void>;
  rejectLoan: (approvalId: string, comments: string) => Promise<void>;
  setCurrentApproval: (approval: LoanApproval | null) => void;
  clearError: () => void;
}

export const useLoanApprovalStore = create<LoanApprovalStore>((set, get) => ({
  approvals: [],
  currentApproval: null,
  isLoading: false,
  error: null,

  fetchApprovals: async (loanId: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch(LOAN_ENDPOINTS.GET_APPROVAL_HISTORY(loanId));
      if (!response.ok) throw new Error('Failed to fetch approvals');
      const data = await response.json();
      set({ approvals: data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  submitForApproval: async (loanId: string, data: Partial<LoanApproval>) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch(LOAN_ENDPOINTS.SUBMIT_FOR_APPROVAL(loanId), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to submit for approval');
      const newApproval = await response.json();
      set(state => ({
        approvals: [...state.approvals, newApproval],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  approveLoan: async (approvalId: string, comments: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch(LOAN_ENDPOINTS.APPROVE_LOAN(approvalId), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comments }),
      });
      if (!response.ok) throw new Error('Failed to approve loan');
      const updatedApproval = await response.json();
      set(state => ({
        approvals: state.approvals.map(a => 
          a.id === approvalId ? updatedApproval : a
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  rejectLoan: async (approvalId: string, comments: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch(LOAN_ENDPOINTS.REJECT_LOAN(approvalId), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comments }),
      });
      if (!response.ok) throw new Error('Failed to reject loan');
      const updatedApproval = await response.json();
      set(state => ({
        approvals: state.approvals.map(a => 
          a.id === approvalId ? updatedApproval : a
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  setCurrentApproval: (approval: LoanApproval | null) => {
    set({ currentApproval: approval });
  },

  clearError: () => {
    set({ error: null });
  },
})); 