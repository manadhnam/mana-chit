-- Function to get upcoming payments for an agent's customers
create or replace function get_agent_upcoming_payments(p_agent_id uuid)
returns table (
    customer_name text,
    due_date date,
    amount numeric,
    payment_type text
) as $$
begin
    return query
    select c.name as customer_name, l.due_date, l.emi_amount, 'loan' as payment_type
    from loans l
    join customers c on l.user_id = c.id
    where c.agent_id = p_agent_id
      and l.status = 'disbursed'
      and l.due_date >= current_date
    order by l.due_date
    limit 5;
    
    -- Note: This only fetches upcoming loan payments. Chit contributions would need similar logic
    -- if they have due dates. For now, we focus on loans.
end;
$$ language plpgsql;

-- Function to get daily collection trends for an agent over the last 30 days
create or replace function get_agent_collection_trends(p_agent_id uuid)
returns table (
    collection_date date,
    total_amount numeric
) as $$
begin
    return query
    select date(c.payment_date) as collection_date, sum(c.amount) as total_amount
    from contributions c
    where c.created_by = p_agent_id
      and c.payment_date >= current_date - interval '30 days'
    group by date(c.payment_date)
    order by collection_date;
end;
$$ language plpgsql; 