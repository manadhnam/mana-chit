import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// These headers are important for browser-based clients
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log(`Function "create-staff" up and running!`);

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { staffData } = await req.json()
    if (!staffData) throw new Error("Missing staffData in request body");
    if (!staffData.password) throw new Error("Password is required");

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Create user in Supabase Auth
    const { data: { user }, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: staffData.email,
      password: staffData.password,
      email_confirm: true,
      user_metadata: { name: staffData.name, role: staffData.role }
    });
    if (authError) throw new Error(`Auth error: ${authError.message}`);
    if (!user) throw new Error("User creation failed in Auth.");

    // The public.users table should be populated by a trigger from auth.users.
    // We may need to update it with extra info not present in auth.
    // A robust solution would be a database trigger that copies auth.users -> public.users
    const { error: publicUserError } = await supabaseAdmin
      .from('users')
      .update({
          name: staffData.name, // Ensure name is synced
          role: staffData.role,   // Ensure role is synced
          mobile: staffData.mobile,
          branch_id: staffData.branch_id
      })
      .eq('id', user.id);

    if (publicUserError) {
      await supabaseAdmin.auth.admin.deleteUser(user.id); // Rollback
      throw new Error(`Failed to update user profile: ${publicUserError.message}`);
    }

    // 2. Create the associated staff record
    const { error: staffError } = await supabaseAdmin.from('staff').insert({
      user_id: user.id,
      position: staffData.position,
      department_id: staffData.department_id,
      joining_date: staffData.joining_date,
      salary: staffData.salary,
      status: staffData.status,
    });

    if (staffError) {
      await supabaseAdmin.auth.admin.deleteUser(user.id); // Rollback
      throw new Error(`Failed to create staff record: ${staffError.message}`);
    }

    return new Response(JSON.stringify({ message: `Successfully created ${staffData.name}` }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
}) 