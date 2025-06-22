import { test as setup, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD } = process.env;

setup('Global setup: Ensure test prerequisites exist', async () => {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !SUPER_ADMIN_EMAIL || !SUPER_ADMIN_PASSWORD) {
    throw new Error("Missing required environment variables for global setup.");
  }
  
  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // 1. Ensure 'Field Operations' department exists
  const { data: department, error: deptError } = await supabaseAdmin
    .from('departments')
    .select('id')
    .eq('name', 'Field Operations')
    .single();

  if (deptError && deptError.code !== 'PGRST116') { // PGRST116 = 'No rows found'
    throw new Error(`Error checking for department: ${deptError.message}`);
  }
  
  if (!department) {
    console.log("Department 'Field Operations' not found, creating it...");
    const { error: createDeptError } = await supabaseAdmin
      .from('departments')
      .insert({ name: 'Field Operations' });
    if (createDeptError) throw new Error(`Could not create department: ${createDeptError.message}`);
  }

  // 2. Ensure Super Admin user exists in Auth
  const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
  if (usersError) throw new Error(`Error listing users: ${usersError.message}`);
  
  const superAdminUser = users.find(u => u.email === SUPER_ADMIN_EMAIL);

  if (!superAdminUser) {
    console.log("Super Admin user not found, creating it...");
    const { error: createAdminError } = await supabaseAdmin.auth.admin.createUser({
      email: SUPER_ADMIN_EMAIL,
      password: SUPER_ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: { role: 'superAdmin', name: 'Super Admin' }
    });
    if (createAdminError) throw new Error(`Could not create super admin: ${createAdminError.message}`);
  }
}); 