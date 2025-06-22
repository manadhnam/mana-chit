create or replace function get_agent_dashboard_metrics(p_agent_id uuid)
returns table (
    total_customers bigint,
    active_loans bigint,
    todays_collection numeric,
    pending_payments bigint
) as $$
begin
    return query
    with agent_customers as (
        select id from customers where agent_id = p_agent_id
    )
    select
        (select count(*) from agent_customers) as total_customers,
        
        (select count(*) from loans l where l.user_id in (select id from agent_customers) and l.status = 'disbursed') as active_loans,

        (select coalesce(sum(c.amount), 0) from contributions c 
         where c.created_by = p_agent_id and c.payment_date = current_date) as todays_collection,

        (select count(*) from contributions c 
         where c.user_id in (select id from agent_customers) and c.status = 'pending') as pending_payments;
end;
$$ language plpgsql; 