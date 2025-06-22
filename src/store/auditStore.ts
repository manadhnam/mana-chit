import { create } from 'zustand';
import { AUDIT_ENDPOINTS } from '@/api/endpoints';

export interface AuditLog {
  id: string;
  userId: string;
  userRole: string;
  action: string;
  module: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

interface AuditStore {
  logs: AuditLog[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchAuditLogs: () => Promise<void>;
  fetchUserAuditLogs: (userId: string) => Promise<void>;
  fetchBranchAuditLogs: (branchId: string) => Promise<void>;
  logAction: (log: Omit<AuditLog, 'id' | 'createdAt'>) => Promise<void>;
  clearError: () => void;
}

export const useAuditStore = create<AuditStore>((set, get) => ({
  logs: [],
  isLoading: false,
  error: null,

  fetchAuditLogs: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch(AUDIT_ENDPOINTS.GET_AUDIT_LOGS);
      if (!response.ok) throw new Error('Failed to fetch audit logs');
      const data = await response.json();
      set({ logs: data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchUserAuditLogs: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch(AUDIT_ENDPOINTS.GET_USER_AUDIT_LOGS(userId));
      if (!response.ok) throw new Error('Failed to fetch user audit logs');
      const data = await response.json();
      set({ logs: data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchBranchAuditLogs: async (branchId: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch(AUDIT_ENDPOINTS.GET_BRANCH_AUDIT_LOGS(branchId));
      if (!response.ok) throw new Error('Failed to fetch branch audit logs');
      const data = await response.json();
      set({ logs: data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  logAction: async (log: Omit<AuditLog, 'id' | 'createdAt'>) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch(AUDIT_ENDPOINTS.LOG_ACTION, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log),
      });
      
      if (!response.ok) throw new Error('Failed to log action');
      const newLog = await response.json();
      set(state => ({
        logs: [newLog, ...state.logs],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  clearError: () => {
    set({ error: null });
  },
})); 