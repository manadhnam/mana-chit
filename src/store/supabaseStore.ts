import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { User, ChitGroup, Loan, Transaction } from '@/types/database';

interface SupabaseState {
  user: User | null;
  chitGroups: ChitGroup[];
  loans: Loan[];
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  
  // User operations
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (userId: string, data: Partial<User>) => Promise<void>;
  
  // Chit group operations
  fetchChitGroups: () => Promise<void>;
  createChitGroup: (data: Partial<ChitGroup>) => Promise<void>;
  updateChitGroup: (groupId: string, data: Partial<ChitGroup>) => Promise<void>;
  
  // Loan operations
  fetchLoans: () => Promise<void>;
  createLoan: (data: Partial<Loan>) => Promise<void>;
  updateLoan: (loanId: string, data: Partial<Loan>) => Promise<void>;
  
  // Transaction operations
  fetchTransactions: () => Promise<void>;
  createTransaction: (data: Partial<Transaction>) => Promise<void>;
}

export const useSupabaseStore = create<SupabaseState>((set, get) => ({
  user: null,
  chitGroups: [],
  loans: [],
  transactions: [],
  loading: false,
  error: null,

  signUp: async (email: string, password: string, userData: Partial<User>) => {
    try {
      set({ loading: true, error: null });
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        const { data, error } = await supabase
          .from('users')
          .insert([{ ...userData, id: authData.user.id }])
          .select()
          .single();

        if (error) throw error;
        set({ user: data });
      }
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (error) throw error;
        set({ user: data });
      }
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  updateUser: async (userId: string, data: Partial<User>) => {
    try {
      set({ loading: true, error: null });
      const { data: updatedUser, error } = await supabase
        .from('users')
        .update(data)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      set({ user: updatedUser });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  fetchChitGroups: async () => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('chit_groups')
        .select('*');

      if (error) throw error;
      set({ chitGroups: data });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  createChitGroup: async (data: Partial<ChitGroup>) => {
    try {
      set({ loading: true, error: null });
      const { data: newGroup, error } = await supabase
        .from('chit_groups')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      set(state => ({ chitGroups: [...state.chitGroups, newGroup] }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  updateChitGroup: async (groupId: string, data: Partial<ChitGroup>) => {
    try {
      set({ loading: true, error: null });
      const { data: updatedGroup, error } = await supabase
        .from('chit_groups')
        .update(data)
        .eq('id', groupId)
        .select()
        .single();

      if (error) throw error;
      set(state => ({
        chitGroups: state.chitGroups.map(group =>
          group.id === groupId ? updatedGroup : group
        ),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  fetchLoans: async () => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('loans')
        .select('*');

      if (error) throw error;
      set({ loans: data });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  createLoan: async (data: Partial<Loan>) => {
    try {
      set({ loading: true, error: null });
      const { data: newLoan, error } = await supabase
        .from('loans')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      set(state => ({ loans: [...state.loans, newLoan] }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  updateLoan: async (loanId: string, data: Partial<Loan>) => {
    try {
      set({ loading: true, error: null });
      const { data: updatedLoan, error } = await supabase
        .from('loans')
        .update(data)
        .eq('id', loanId)
        .select()
        .single();

      if (error) throw error;
      set(state => ({
        loans: state.loans.map(loan =>
          loan.id === loanId ? updatedLoan : loan
        ),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  fetchTransactions: async () => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('transactions')
        .select('*');

      if (error) throw error;
      set({ transactions: data });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  createTransaction: async (data: Partial<Transaction>) => {
    try {
      set({ loading: true, error: null });
      const { data: newTransaction, error } = await supabase
        .from('transactions')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      set(state => ({ transactions: [...state.transactions, newTransaction] }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
})); 