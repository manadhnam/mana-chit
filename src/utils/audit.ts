import { supabase } from '@/lib/supabase';

export async function logAudit(action: string, details: any, userId?: string, userRole?: string) {
  await supabase.from('audit_log').insert({
    user_id: userId,
    user_role: userRole,
    action,
    details,
    created_at: new Date().toISOString(),
  });
} 