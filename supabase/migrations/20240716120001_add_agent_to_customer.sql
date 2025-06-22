alter table customers
add column agent_id uuid references users(id) on delete set null;

comment on column customers.agent_id is 'The agent assigned to this customer.'; 