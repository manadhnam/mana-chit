-- Enable RLS
alter table public.customers enable row level security;

-- SELECT policies
create policy "Super admins can see all customers"
on public.customers for select
to authenticated
using (get_my_role() = 'superAdmin');

create policy "Agents can see their assigned customers"
on public.customers for select
to authenticated
using (get_my_role() = 'agent' and agent_id = auth.uid());

create policy "Customers can see their own record"
on public.customers for select
to authenticated
using (get_my_role() = 'customer' and user_id = auth.uid());

-- INSERT policies
create policy "Super admins and agents can create customers"
on public.customers for insert
to authenticated
with check (get_my_role() in ('superAdmin', 'agent'));

-- UPDATE policies
create policy "Super admins and agents can update customer info"
on public.customers for update
to authenticated
using (get_my_role() in ('superAdmin', 'agent'));

-- DELETE policies
create policy "Super admins can delete customers"
on public.customers for delete
to authenticated
using (get_my_role() = 'superAdmin'); 