create or replace function get_my_role()
returns text as $$
  select role
  from public.users
  where id = auth.uid();
$$ language sql stable security definer; 