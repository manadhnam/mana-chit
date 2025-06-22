-- Mandal Head Schema

-- Customers Table
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    mandal_id INTEGER NOT NULL REFERENCES locations(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    village_id INTEGER NOT NULL REFERENCES locations(id),
    aadhar_number VARCHAR(12) UNIQUE,
    pan_number VARCHAR(10) UNIQUE,
    date_of_birth DATE,
    gender VARCHAR(10),
    occupation VARCHAR(100),
    monthly_income DECIMAL(15,2),
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_by INTEGER NOT NULL REFERENCES staff(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Customer Documents Table
CREATE TABLE customer_documents (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    document_type VARCHAR(100) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    ocr_data JSONB,
    verification_status VARCHAR(50) NOT NULL DEFAULT 'pending',
    verified_by INTEGER REFERENCES staff(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    uploaded_by INTEGER NOT NULL REFERENCES staff(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Chit Fund Groups Table
CREATE TABLE chit_fund_groups (
    id SERIAL PRIMARY KEY,
    mandal_id INTEGER NOT NULL REFERENCES locations(id),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    number_of_members INTEGER NOT NULL,
    monthly_contribution DECIMAL(15,2) NOT NULL,
    commission_percentage DECIMAL(5,2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_by INTEGER NOT NULL REFERENCES staff(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Chit Fund Members Table
CREATE TABLE chit_fund_members (
    id SERIAL PRIMARY KEY,
    chit_fund_id INTEGER NOT NULL REFERENCES chit_fund_groups(id),
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    member_number INTEGER NOT NULL,
    joining_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_by INTEGER NOT NULL REFERENCES staff(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(chit_fund_id, customer_id)
);

-- Chit Fund Auctions Table
CREATE TABLE chit_fund_auctions (
    id SERIAL PRIMARY KEY,
    chit_fund_id INTEGER NOT NULL REFERENCES chit_fund_groups(id),
    auction_date DATE NOT NULL,
    auction_number INTEGER NOT NULL,
    total_bids INTEGER NOT NULL DEFAULT 0,
    winning_bid_amount DECIMAL(15,2),
    winning_member_id INTEGER REFERENCES chit_fund_members(id),
    status VARCHAR(50) NOT NULL DEFAULT 'scheduled',
    conducted_by INTEGER NOT NULL REFERENCES staff(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(chit_fund_id, auction_number)
);

-- Chit Fund Payments Table
CREATE TABLE chit_fund_payments (
    id SERIAL PRIMARY KEY,
    chit_fund_id INTEGER NOT NULL REFERENCES chit_fund_groups(id),
    member_id INTEGER NOT NULL REFERENCES chit_fund_members(id),
    payment_date DATE NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    payment_type VARCHAR(50) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    transaction_id VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    verified_by INTEGER REFERENCES staff(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    created_by INTEGER NOT NULL REFERENCES staff(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Customer Accounts Table
CREATE TABLE customer_accounts (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    account_type VARCHAR(50) NOT NULL,
    account_number VARCHAR(50) UNIQUE NOT NULL,
    balance DECIMAL(15,2) NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    approved_by INTEGER REFERENCES staff(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_by INTEGER NOT NULL REFERENCES staff(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Customer Transactions Table
CREATE TABLE customer_transactions (
    id SERIAL PRIMARY KEY,
    account_id INTEGER NOT NULL REFERENCES customer_accounts(id),
    transaction_type VARCHAR(50) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    balance_before DECIMAL(15,2) NOT NULL,
    balance_after DECIMAL(15,2) NOT NULL,
    reference_id VARCHAR(100),
    description TEXT,
    location_id INTEGER REFERENCES locations(id),
    created_by INTEGER NOT NULL REFERENCES staff(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Customer Communications Table
CREATE TABLE customer_communications (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    communication_type VARCHAR(50) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    channel VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_by INTEGER NOT NULL REFERENCES staff(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_customers_mandal_id ON customers(mandal_id);
CREATE INDEX idx_customers_village_id ON customers(village_id);
CREATE INDEX idx_customer_documents_customer_id ON customer_documents(customer_id);
CREATE INDEX idx_chit_fund_groups_mandal_id ON chit_fund_groups(mandal_id);
CREATE INDEX idx_chit_fund_members_chit_fund_id ON chit_fund_members(chit_fund_id);
CREATE INDEX idx_chit_fund_members_customer_id ON chit_fund_members(customer_id);
CREATE INDEX idx_chit_fund_auctions_chit_fund_id ON chit_fund_auctions(chit_fund_id);
CREATE INDEX idx_chit_fund_payments_chit_fund_id ON chit_fund_payments(chit_fund_id);
CREATE INDEX idx_chit_fund_payments_member_id ON chit_fund_payments(member_id);
CREATE INDEX idx_customer_accounts_customer_id ON customer_accounts(customer_id);
CREATE INDEX idx_customer_transactions_account_id ON customer_transactions(account_id);
CREATE INDEX idx_customer_communications_customer_id ON customer_communications(customer_id);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_documents_updated_at
    BEFORE UPDATE ON customer_documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chit_fund_groups_updated_at
    BEFORE UPDATE ON chit_fund_groups
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chit_fund_members_updated_at
    BEFORE UPDATE ON chit_fund_members
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chit_fund_auctions_updated_at
    BEFORE UPDATE ON chit_fund_auctions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chit_fund_payments_updated_at
    BEFORE UPDATE ON chit_fund_payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_accounts_updated_at
    BEFORE UPDATE ON customer_accounts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_transactions_updated_at
    BEFORE UPDATE ON customer_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_communications_updated_at
    BEFORE UPDATE ON customer_communications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 