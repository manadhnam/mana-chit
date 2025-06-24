create or replace function get_all_branch_details()
returns table (
    id uuid,
    name text,
    code text,
    address text,
    phone text,
    email text,
    manager json,
    status text,
    financialMetrics json,
    performanceMetrics json,
    riskLevel text,
    createdAt timestamptz,
    lastUpdated timestamptz
) as $$
begin
    return query
    select
        b.id,
        b.name,
        b.code,
        b.address,
        b.phone,
        b.email,
        json_build_object('id', m.id, 'name', m.name, 'email', m.email) as manager,
        b.status,
        json_build_object(
            'totalRevenue', coalesce(sum(c.amount) filter (where c.type = 'wallet_deposit'), 0),
            'totalExpenses', coalesce(sum(l.amount) filter (where l.status = 'disbursed'), 0),
            'netProfit', (coalesce(sum(c.amount) filter (where c.type = 'wallet_deposit'), 0) - coalesce(sum(l.amount) filter (where l.status = 'disbursed'), 0)),
            'budgetUtilization', 0, -- Placeholder
            'collectionsThisMonth', coalesce(sum(c.amount) filter (where date_trunc('month', c.created_at) = date_trunc('month', now())), 0),
            'pendingCollections', coalesce(sum(c.amount) filter (where c.status = 'pending'), 0)
        ) as financialMetrics,
        json_build_object(
            'customerCount', (select count(*) from customers where customers.branch_id = b.id),
            'staffCount', (select count(*) from users where users.branch_id = b.id and users.role = 'agent'),
            'chitGroups', (select count(*) from chit_groups where chit_groups.branch_id = b.id),
            'activeLoans', (select count(*) from loans where loans.branch_id = b.id and loans.status = 'active'),
            'onTimePayments', 0, -- Placeholder
            'defaulters', (select count(distinct customer_id) from loans where loans.branch_id = b.id and loans.status = 'overdue')
        ) as performanceMetrics,
        'low' as riskLevel, -- Placeholder
        b.created_at as createdAt,
        b.updated_at as lastUpdated
    from
        branches b
    left join users m on b.manager_id = m.id
    left join collections c on c.branch_id = b.id
    left join loans l on l.branch_id = b.id
    group by b.id, m.id;
end;
$$ language plpgsql;

create or replace function get_chit_groups_with_member_count(p_branch_id uuid)
returns table (
    id uuid,
    group_name text,
    chit_value numeric,
    max_members int,
    duration int,
    status text,
    start_date date,
    current_cycle int,
    member_count bigint
) as $$
begin
  return query
  select
    cg.id,
    cg.group_name,
    cg.chit_value,
    cg.max_members,
    cg.duration,
    cg.status,
    cg.start_date,
    cg.current_cycle,
    (select count(*) from chit_group_members where chit_group_id = cg.id) as member_count
  from
    chit_groups cg
  where
    cg.branch_id = p_branch_id;
end;
$$ language plpgsql; 