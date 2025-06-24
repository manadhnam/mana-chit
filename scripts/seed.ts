import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { faker } from '@faker-js/faker';
import { Receipt } from '../src/types/database';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY; // IMPORTANT: Use the SERVICE ROLE KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase URL or Service Key is missing from environment variables.');
}

// Initialize Supabase client with service role key for admin-level access
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  console.log('🌱 Starting database seeding...');

  // ----------------------------------------------------------------
  // 1. Clean up existing data (optional, but recommended for clean slate)
  // ----------------------------------------------------------------
  console.log('🗑️  Deleting existing data...');
  // Note: Order of deletion matters to avoid foreign key constraint errors.
  // We delete from tables that are depended upon last.
  await supabase.from('collections').delete().neq('id', 0);
  await supabase.from('customers').delete().neq('id', 0);
  await supabase.from('chit_group_members').delete().neq('id', 0);
  await supabase.from('chit_groups').delete().neq('id', 0);
  await supabase.from('users').delete().neq('id', 0);
  await supabase.from('branches').delete().neq('id', 0);
  await supabase.from('mandals').delete().neq('id', 0);
  await supabase.from('departments').delete().neq('id', 0);
  console.log('✅ Existing data deleted.');


  // ----------------------------------------------------------------
  // 2. Seed data
  // ----------------------------------------------------------------
  console.log('🌱 Seeding organizational structure...');

  // Seed Departments
  const { data: departments, error: departmentsError } = await supabase
    .from('departments')
    .insert([
      { name: 'Operations' },
      { name: 'Sales & Marketing' },
    ])
    .select();
  if (departmentsError) throw departmentsError;
  console.log(`✅ Seeded ${departments.length} departments.`);

  // Seed Mandals
  const { data: mandals, error: mandalsError } = await supabase
    .from('mandals')
    .insert([
      { name: 'North Zone', department_id: departments[0].id },
      { name: 'South Zone', department_id: departments[0].id },
      { name: 'East Zone', department_id: departments[1].id },
    ])
    .select();
  if (mandalsError) throw mandalsError;
  console.log(`✅ Seeded ${mandals.length} mandals.`);
  
  // Seed Branches
  const { data: branches, error: branchesError } = await supabase
    .from('branches')
    .insert([
      // Branches in North Zone
      { name: 'Main Branch', code: 'MAIN', address: '123 Downtown', phone: '1111111111', email: 'main@mana-chit.com', status: 'active', mandal_id: mandals[0].id },
      { name: 'Suburb Branch', code: 'SUB', address: '456 Suburbia', phone: '2222222222', email: 'suburb@mana-chit.com', status: 'active', mandal_id: mandals[0].id },
      // Branches in South Zone
      { name: 'Southside Branch', code: 'STH', address: '789 Southside', phone: '3333333333', email: 'south@mana-chit.com', status: 'active', mandal_id: mandals[1].id },
      // Branches in East Zone
      { name: 'East End Branch', code: 'EST', address: '101 East End', phone: '4444444444', email: 'east@mana-chit.com', status: 'inactive', mandal_id: mandals[2].id },
    ])
    .select();
  if (branchesError) throw branchesError;
  console.log(`✅ Seeded ${branches.length} branches.`);

  // ----------------------------------------------------------------
  // 3. Seed Users
  // ----------------------------------------------------------------
  console.log('🌱 Seeding users for all roles...');

  // Helper function to create a user in Supabase Auth and our public 'users' table
  const createUser = async (userData: {
    email: string;
    role: 'superAdmin' | 'departmentHead' | 'mandalHead' | 'branchManager' | 'agent';
    name: string;
    mobile: string;
    department_id?: string;
    mandal_id?: string;
    branch_id?: string;
  }) => {
    // Create user in Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: 'password123', // Default password for all seeded users
    });
    if (authError && authError.message !== 'Email rate limit exceeded') {
       // Ignore "User already registered" error if re-running script, but throw others
      if (!authError.message.includes('User already registered')) {
        throw authError;
      }
    }

    // Create user profile in our public 'users' table
    if (authUser.user) {
        const { error: profileError } = await supabase.from('users').insert({
            id: authUser.user.id,
            email: userData.email,
            role: userData.role,
            name: userData.name,
            mobile: userData.mobile,
            status: 'active',
            department_id: userData.department_id,
            mandal_id: userData.mandal_id,
            branch_id: userData.branch_id,
        });

        if (profileError) throw profileError;
        return { ...userData, id: authUser.user.id };
    }
    return null;
  };
  
  // Create Super Admin
  const superAdmin = await createUser({ email: 'superadmin@mana-chit.com', role: 'superAdmin', name: 'Super Admin', mobile: '9999999999' });
  console.log('✅ Seeded Super Admin.');

  // Create Department Heads
  const deptHead1 = await createUser({ email: 'depthead.ops@mana-chit.com', role: 'departmentHead', name: 'Operations Head', mobile: '8888888881', department_id: departments[0].id });
  const deptHead2 = await createUser({ email: 'depthead.sales@mana-chit.com', role: 'departmentHead', name: 'Sales Head', mobile: '8888888882', department_id: departments[1].id });
  console.log('✅ Seeded Department Heads.');

  // Create Mandal Heads
  const mandalHead1 = await createUser({ email: 'mandal.north@mana-chit.com', role: 'mandalHead', name: 'North Zone Head', mobile: '7777777771', department_id: departments[0].id, mandal_id: mandals[0].id });
  const mandalHead2 = await createUser({ email: 'mandal.south@mana-chit.com', role: 'mandalHead', name: 'South Zone Head', mobile: '7777777772', department_id: departments[0].id, mandal_id: mandals[1].id });
  console.log('✅ Seeded Mandal Heads.');

  // Create Branch Managers
  const branchManager1 = await createUser({ email: 'bm.main@mana-chit.com', role: 'branchManager', name: 'Main Branch Manager', mobile: '6666666661', mandal_id: mandals[0].id, branch_id: branches[0].id });
  const branchManager2 = await createUser({ email: 'bm.suburb@mana-chit.com', role: 'branchManager', name: 'Suburb Branch Manager', mobile: '6666666662', mandal_id: mandals[0].id, branch_id: branches[1].id });
  console.log('✅ Seeded Branch Managers.');

  // Create Agents
  const agent1 = await createUser({ email: 'agent1@mana-chit.com', role: 'agent', name: 'Agent Smith', mobile: '5555555551', branch_id: branches[0].id });
  const agent2 = await createUser({ email: 'agent2@mana-chit.com', role: 'agent', name: 'Agent Jones', mobile: '5555555552', branch_id: branches[0].id });
  const agent3 = await createUser({ email: 'agent3@mana-chit.com', role: 'agent', name: 'Agent Brown', mobile: '5555555553', branch_id: branches[1].id });
  console.log('✅ Seeded Agents.');
  
  // ----------------------------------------------------------------
  // 4. Seed Customers
  // ----------------------------------------------------------------
  console.log('🌱 Seeding customers...');
  const customersToCreate = [
    { name: faker.person.fullName(), email: faker.internet.email(), mobile: faker.phone.number(), code: `CUST${faker.string.alphanumeric(5).toUpperCase()}`, status: 'active' as const, branch_id: branches[0].id },
    { name: faker.person.fullName(), email: faker.internet.email(), mobile: faker.phone.number(), code: `CUST${faker.string.alphanumeric(5).toUpperCase()}`, status: 'active' as const, branch_id: branches[0].id },
    { name: faker.person.fullName(), email: faker.internet.email(), mobile: faker.phone.number(), code: `CUST${faker.string.alphanumeric(5).toUpperCase()}`, status: 'active' as const, branch_id: branches[1].id },
    { name: faker.person.fullName(), email: faker.internet.email(), mobile: faker.phone.number(), code: `CUST${faker.string.alphanumeric(5).toUpperCase()}`, status: 'inactive' as const, branch_id: branches[1].id },
    { name: faker.person.fullName(), email: faker.internet.email(), mobile: faker.phone.number(), code: `CUST${faker.string.alphanumeric(5).toUpperCase()}`, status: 'pending' as const, branch_id: branches[2].id },
  ];

  const { data: customers, error: customersError } = await supabase
    .from('customers')
    .insert(customersToCreate)
    .select();
  if (customersError) throw customersError;
  console.log(`✅ Seeded ${customers.length} customers.`);


  // ----------------------------------------------------------------
  // 5. Seed Chit Groups & Members
  // ----------------------------------------------------------------
  console.log('🌱 Seeding chit groups and memberships...');

  // Seed Chit Groups
  const { data: chitGroups, error: chitGroupsError } = await supabase
    .from('chit_groups')
    .insert([
      { group_name: 'Monthly 1 Lakh', chit_value: 100000, commission_percentage: 5, duration: 10, max_members: 10, current_cycle: 1, status: 'active' as const, branch_id: branches[0].id, start_date: faker.date.past().toISOString() },
      { group_name: 'Weekly 50k', chit_value: 50000, commission_percentage: 5, duration: 20, max_members: 20, current_cycle: 5, status: 'active' as const, branch_id: branches[1].id, start_date: faker.date.past().toISOString() },
      { group_name: 'Long Term 5 Lakh', chit_value: 500000, commission_percentage: 7, duration: 25, max_members: 25, current_cycle: 0, status: 'pending' as const, branch_id: branches[0].id },
    ])
    .select();
  if (chitGroupsError) throw chitGroupsError;
  console.log(`✅ Seeded ${chitGroups.length} chit groups.`);

  // Seed Chit Group Members
  const { data: groupMembers, error: groupMembersError } = await supabase
    .from('chit_group_members')
    .insert([
      // Note: In a real app, you would fetch a user's ID from the 'users' table if customers could also be platform users. Here, we use the customer ID directly.
      { chit_group_id: chitGroups[0].id, user_id: customers[0].id, joined_at: new Date().toISOString() },
      { chit_group_id: chitGroups[0].id, user_id: customers[1].id, joined_at: new Date().toISOString() },
      { chit_group_id: chitGroups[1].id, user_id: customers[2].id, joined_at: new Date().toISOString() },
    ])
    .select();
  if (groupMembersError) throw groupMembersError;
  console.log(`✅ Seeded ${groupMembers.length} group memberships.`);


  // ----------------------------------------------------------------
  // 6. Seed Collections
  // ----------------------------------------------------------------
  console.log('🌱 Seeding collection records...');
  const collectionsToCreate: Partial<Receipt>[] = [];
  if (groupMembers.length > 0 && [agent1, agent2, agent3].filter(Boolean).length > 0) {
    for (let i = 0; i < 20; i++) {
        const randomMember = faker.helpers.arrayElement(groupMembers);
        const randomGroup = chitGroups.find(g => g.id === randomMember.chit_group_id)!;
        const agentsInBranch = [agent1, agent2, agent3].filter(a => a && a.branch_id === randomGroup.branch_id);
        
        if (agentsInBranch.length > 0) {
          const randomAgent = faker.helpers.arrayElement(agentsInBranch);
          
          collectionsToCreate.push({
              customer_id: randomMember.user_id,
              chit_group_id: randomMember.chit_group_id,
              amount: randomGroup.chit_value / randomGroup.duration,
              payment_date: faker.date.recent({ days: 90 }).toISOString(),
              payment_mode: faker.helpers.arrayElement(['cash' as const, 'upi' as const, 'bank_transfer' as const]),
              receipt_number: `RCPT-${faker.string.alphanumeric(8).toUpperCase()}`,
              status: faker.helpers.arrayElement(['pending' as const, 'approved' as const, 'rejected' as const]),
              created_by: randomAgent!.id, // agent who collected
              branch_id: randomGroup.branch_id,
          });
        }
    }
  }

  if (collectionsToCreate.length > 0) {
    const { data: collections, error: collectionsError } = await supabase
      .from('collections')
      .insert(collectionsToCreate)
      .select();
    if (collectionsError) throw collectionsError;
    console.log(`✅ Seeded ${collections.length} collection records.`);
  } else {
    console.log('⚠️  Skipping collections seeding as there are no members or agents to associate them with.');
  }

  // ----------------------------------------------------------------
  // 7. Finish
  // ----------------------------------------------------------------
  console.log('🎉 Database seeding completed successfully!');
}

main().catch((error) => {
  console.error('🔴 An error occurred during seeding:');
  console.error(error);
  process.exit(1);
}); 