import { supabase } from './supabase';

/**
 * Logs an action to the audit_log table.
 * @param action - A string describing the action (e.g., 'user.login').
 * @param details - A JSON object with relevant details about the event.
 * @param actor_id - The ID of the user who performed the action.
 */
export const log_audit = async (action: string, details: Record<string, any>, actor_id?: string) => {
  try {
    const { data, error } = await supabase
      .from('audit_log')
      .insert({
        action,
        details,
        actor_id, // If not provided, will be null
      });

    if (error) {
      console.error('Failed to log audit event:', error);
    }
  } catch (err) {
    console.error('An unexpected error occurred in log_audit:', err);
  }
}; 