-- Enable RLS
alter table public.contributions enable row level security;

-- SELECT policies
create policy "Customers can see their own contributions"
on public.contributions for select
to authenticated
using (get_my_role() = 'customer' and user_id = auth.uid());

create policy "Agents can see contributions of their customers"
on public.contributions for select
to authenticated
using (
  get_my_role() = 'agent'
  and user_id in (select id from customers where agent_id = auth.uid())
);

create policy "Super admins can see all contributions"
on public.contributions for select
to authenticated
using (get_my_role() = 'superAdmin');

-- INSERT policies
create policy "Super admins and agents can record contributions"
on public.contributions for insert
to authenticated
with check (get_my_role() in ('superAdmin', 'agent'));

-- UPDATE policies
create policy "Super admins can update contributions"
on public.contributions for update
to authenticated
using (get_my_role() = 'superAdmin');

-- DELETE policies
create policy "Super admins can delete contributions"
on public.contributions for delete
to authenticated
using (get_my_role() = 'superAdmin'); 