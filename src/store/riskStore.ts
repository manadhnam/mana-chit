import { create } from 'zustand';
import { RISK_ENDPOINTS } from '@/api/endpoints';

export interface RiskFactor {
  id: string;
  name: string;
  weight: number;
  value: number;
  description: string;
}

export interface RiskAssessment {
  id: string;
  userId: string;
  score: number;
  category: 'LOW' | 'MEDIUM' | 'HIGH';
  factors: RiskFactor[];
  recommendations: string[];
  assessedBy: string;
  assessedAt: string;
  createdAt: string;
  updatedAt: string;
}

interface RiskStore {
  assessments: RiskAssessment[];
  currentAssessment: RiskAssessment | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchRiskScore: (userId: string) => Promise<void>;
  fetchRiskHistory: (userId: string) => Promise<void>;
  assessRisk: (userId: string, factors: RiskFactor[]) => Promise<void>;
  updateRiskFactors: (userId: string, factors: RiskFactor[]) => Promise<void>;
  setCurrentAssessment: (assessment: RiskAssessment | null) => void;
  clearError: () => void;
}

export const useRiskStore = create<RiskStore>((set, get) => ({
  assessments: [],
  currentAssessment: null,
  isLoading: false,
  error: null,

  fetchRiskScore: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch(RISK_ENDPOINTS.GET_RISK_SCORE(userId));
      if (!response.ok) throw new Error('Failed to fetch risk score');
      const data = await response.json();
      set({ currentAssessment: data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchRiskHistory: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch(RISK_ENDPOINTS.GET_RISK_HISTORY(userId));
      if (!response.ok) throw new Error('Failed to fetch risk history');
      const data = await response.json();
      set({ assessments: data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  assessRisk: async (userId: string, factors: RiskFactor[]) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch(RISK_ENDPOINTS.ASSESS_RISK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, factors }),
      });
      
      if (!response.ok) throw new Error('Failed to assess risk');
      const newAssessment = await response.json();
      set(state => ({
        assessments: [...state.assessments, newAssessment],
        currentAssessment: newAssessment,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  updateRiskFactors: async (userId: string, factors: RiskFactor[]) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch(RISK_ENDPOINTS.UPDATE_RISK_FACTORS(userId), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ factors }),
      });
      
      if (!response.ok) throw new Error('Failed to update risk factors');
      const updatedAssessment = await response.json();
      set(state => ({
        assessments: state.assessments.map(a => 
          a.id === updatedAssessment.id ? updatedAssessment : a
        ),
        currentAssessment: updatedAssessment,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  setCurrentAssessment: (assessment: RiskAssessment | null) => {
    set({ currentAssessment: assessment });
  },

  clearError: () => {
    set({ error: null });
  },
})); 