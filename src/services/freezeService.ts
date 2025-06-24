import { supabase } from '../lib/supabase';
import { User } from '../types';
import { FreezeLog } from '../types/index';

export interface FreezeUserParams {
  userId: string;
  reason?: string;
}

export interface UnfreezeUserParams {
  userId: string;
  reason?: string;
}

export interface FreezeLogWithUser extends FreezeLog {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  frozenByUser: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export class FreezeService {
  /**
   * Freeze a user account
   */
  static async freezeUser({ userId, reason }: FreezeUserParams): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('freeze_user', {
        target_user_id: userId,
        freeze_reason: reason || null
      });

      if (error) {
        console.error('Error freezing user:', error);
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Freeze user error:', error);
      throw error;
    }
  }

  /**
   * Unfreeze a user account
   */
  static async unfreezeUser({ userId, reason }: UnfreezeUserParams): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('unfreeze_user', {
        target_user_id: userId,
        unfreeze_reason: reason || null
      });

      if (error) {
        console.error('Error unfreezing user:', error);
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Unfreeze user error:', error);
      throw error;
    }
  }

  /**
   * Get freeze logs for a specific user
   */
  static async getUserFreezeLogs(userId: string): Promise<FreezeLog[]> {
    try {
      const { data, error } = await supabase
        .from('freeze_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching freeze logs:', error);
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Get freeze logs error:', error);
      throw error;
    }
  }

  /**
   * Get all freeze logs with user details
   */
  static async getAllFreezeLogs(): Promise<FreezeLogWithUser[]> {
    try {
      const { data, error } = await supabase
        .from('freeze_logs')
        .select(`
          *,
          user:users!freeze_logs_user_id_fkey(
            id,
            name,
            email,
            role
          ),
          frozenByUser:users!freeze_logs_frozen_by_fkey(
            id,
            name,
            email,
            role
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all freeze logs:', error);
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Get all freeze logs error:', error);
      throw error;
    }
  }

  /**
   * Check if a user is frozen
   */
  static async isUserFrozen(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('is_frozen')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error checking user freeze status:', error);
        throw new Error(error.message);
      }

      return data?.is_frozen || false;
    } catch (error) {
      console.error('Check user frozen error:', error);
      throw error;
    }
  }

  /**
   * Get frozen users count
   */
  static async getFrozenUsersCount(): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('is_frozen', true);

      if (error) {
        console.error('Error getting frozen users count:', error);
        throw new Error(error.message);
      }

      return count || 0;
    } catch (error) {
      console.error('Get frozen users count error:', error);
      throw error;
    }
  }

  /**
   * Get all frozen users
   */
  static async getFrozenUsers(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('is_frozen', true)
        .order('frozen_at', { ascending: false });

      if (error) {
        console.error('Error fetching frozen users:', error);
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Get frozen users error:', error);
      throw error;
    }
  }
} 