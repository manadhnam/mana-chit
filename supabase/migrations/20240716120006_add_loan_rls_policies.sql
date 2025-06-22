-- Enable RLS
alter table public.loans enable row level security;

-- SELECT policies
create policy "Customers can see their own loans"
on public.loans for select
to authenticated
using (get_my_role() = 'customer' and user_id = auth.uid());

create policy "Agents can see the loans of their customers"
on public.loans for select
to authenticated
using (
  get_my_role() = 'agent'
  and user_id in (select id from customers where agent_id = auth.uid())
);

create policy "Super admins can see all loans"
on public.loans for select
to authenticated
using (get_my_role() = 'superAdmin');

-- INSERT policies
create policy "Super admins and agents can create loans"
on public.loans for insert
to authenticated
with check (get_my_role() in ('superAdmin', 'agent'));

-- UPDATE policies
create policy "Super admins can update loans"
on public.loans for update
to authenticated
using (get_my_role() = 'superAdmin');

-- DELETE policies
create policy "Super admins can delete loans"
on public.loans for delete
to authenticated
using (get_my_role() = 'superAdmin'); 