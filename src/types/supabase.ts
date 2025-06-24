export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          mobile: string
          role: string
          status: string
          branch_id?: string
          mandal_id?: string
          department_id?: string
          id_proof_type?: string
          id_proof_file?: string
          id_proof_verified: boolean
          wallet_balance: number
          referral_code?: string
          photo_url?: string
          is_frozen: boolean
          frozen_at?: string
          frozen_by?: string
          freeze_reason?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          mobile: string
          role: string
          status?: string
          branch_id?: string
          mandal_id?: string
          department_id?: string
          id_proof_type?: string
          id_proof_file?: string
          id_proof_verified?: boolean
          wallet_balance?: number
          referral_code?: string
          photo_url?: string
          is_frozen?: boolean
          frozen_at?: string
          frozen_by?: string
          freeze_reason?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          mobile?: string
          role?: string
          status?: string
          branch_id?: string
          mandal_id?: string
          department_id?: string
          id_proof_type?: string
          id_proof_file?: string
          id_proof_verified?: boolean
          wallet_balance?: number
          referral_code?: string
          photo_url?: string
          is_frozen?: boolean
          frozen_at?: string
          frozen_by?: string
          freeze_reason?: string
          updated_at?: string
        }
      }
      branches: {
        Row: {
          id: string
          name: string
          code: string
          address: string
          phone: string
          email: string
          status: string
          mandal_id?: string
          manager_id?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          address: string
          phone: string
          email: string
          status?: string
          mandal_id?: string
          manager_id?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string
          address?: string
          phone?: string
          email?: string
          status?: string
          mandal_id?: string
          manager_id?: string
          updated_at?: string
        }
      }
      agent_metrics: {
        Row: {
          id: string
          agent_id: string
          branch_id: string
          revenue: number
          customer_satisfaction: number
          attendance: number
          performance_score: number
          period: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          agent_id: string
          branch_id: string
          revenue: number
          customer_satisfaction: number
          attendance: number
          performance_score: number
          period: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          agent_id?: string
          branch_id?: string
          revenue?: number
          customer_satisfaction?: number
          attendance?: number
          performance_score?: number
          period?: string
          updated_at?: string
        }
      }
      freeze_logs: {
        Row: {
          id: string
          user_id: string
          action: string
          frozen_by: string
          reason?: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          action: string
          frozen_by: string
          reason?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          action?: string
          frozen_by?: string
          reason?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 