create or replace function get_user_by_role_and_mobile(p_role text, p_mobile text)
returns setof users as $$
begin
  return query
  select *
  from users
  where users.role = p_role::user_role
    and users.mobile = p_mobile
  limit 1;
end;
$$ language plpgsql; 