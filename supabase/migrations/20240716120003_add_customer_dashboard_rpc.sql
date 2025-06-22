create type customer_transaction as (
    id uuid,
    transaction_type text,
    amount numeric,
    description text,
    created_at timestamptz
);

create type customer_payment as (
    id uuid,
    name text,
    amount numeric,
    due_date date,
    payment_type text
);

create or replace function get_customer_dashboard_metrics(p_user_id uuid)
returns table (
    wallet_balance numeric,
    chit_count bigint,
    loan_count bigint,
    recent_transactions customer_transaction[],
    upcoming_payments customer_payment[]
)
as $$
begin
    return query
    select
        (select u.wallet_balance from users u where u.id = p_user_id),
        (select count(*) from chit_group_members cgm where cgm.customer_id = p_user_id),
        (select count(*) from loans l where l.user_id = p_user_id and l.status = 'disbursed'),
        (select array_agg(t) from (
            select ct.id, ct.transaction_type, ct.amount, ct.description, ct.created_at
            from transactions ct
            where ct.user_id = p_user_id
            order by ct.created_at desc
            limit 5
        ) as t),
        (select array_agg(p) from (
            select l.id, 'Loan Repayment' as name, l.emi_amount as amount, l.due_date, 'loan' as payment_type
            from loans l
            where l.user_id = p_user_id and l.status = 'disbursed' and l.due_date >= current_date
            order by l.due_date
            limit 5
        ) as p);
end;
$$ language plpgsql; 