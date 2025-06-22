import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Branch } from '@/types/database';

interface BranchState {
  branches: Branch[];
  isLoading: boolean;
  error: string | null;
  fetchBranches: () => Promise<void>;
  createBranch: (data: Omit<Branch, 'id' | 'created_at' | 'updated_at'>) => Promise<Branch | null>;
  updateBranch: (id: string, data: Partial<Branch>) => Promise<Branch | null>;
  deleteBranch: (id: string) => Promise<boolean>;
}

export const useBranchStore = create<BranchState>((set, get) => ({
  branches: [],
  isLoading: false,
  error: null,

  fetchBranches: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.from('branches').select('*');
      if (error) throw error;
      set({ branches: data || [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createBranch: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const { data: newBranch, error } = await supabase
        .from('branches')
        .insert([data])
        .select()
        .single();
        
      if (error) throw error;

      set((state) => ({
        branches: [...state.branches, newBranch],
        isLoading: false,
      }));
      return newBranch;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },

  updateBranch: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const { data: updatedBranch, error } = await supabase
        .from('branches')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;

      set((state) => ({
        branches: state.branches.map((branch) =>
          branch.id === id ? { ...branch, ...updatedBranch } : branch
        ),
        isLoading: false,
      }));
      return updatedBranch;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },

  deleteBranch: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.from('branches').delete().eq('id', id);
      if (error) throw error;

      set((state) => ({
        branches: state.branches.filter((branch) => branch.id !== id),
        isLoading: false,
      }));
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },
})); 