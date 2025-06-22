-- Customer Schema

-- Customer Profiles
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
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) NOT NULL,
    occupation VARCHAR(100),
    monthly_income DECIMAL(12,2),
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_by INTEGER NOT NULL REFERENCES staff(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_gender CHECK (gender IN ('male', 'female', 'other')),
    CONSTRAINT valid_aadhar CHECK (aadhar_number ~ '^[0-9]{12}$'),
    CONSTRAINT valid_pan CHECK (pan_number ~ '^[A-Z]{5}[0-9]{4}[A-Z]{1}$')
);

-- Customer Documents
CREATE TABLE customer_documents (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    document_type VARCHAR(50) NOT NULL,
    file_id INTEGER NOT NULL REFERENCES file_storage(id),
    verification_status VARCHAR(50) NOT NULL DEFAULT 'pending',
    verified_by INTEGER REFERENCES staff(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    created_by INTEGER NOT NULL REFERENCES staff(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_document_type CHECK (document_type IN ('aadhar', 'pan', 'income_proof', 'address_proof', 'photo', 'other')),
    CONSTRAINT valid_verification_status CHECK (verification_status IN ('pending', 'verified', 'rejected'))
);

-- Customer Accounts
CREATE TABLE customer_accounts (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    account_type VARCHAR(50) NOT NULL,
    account_number VARCHAR(50) UNIQUE NOT NULL,
    balance DECIMAL(15,2) NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    approved_by INTEGER REFERENCES staff(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_by INTEGER NOT NULL REFERENCES staff(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_account_type CHECK (account_type IN ('savings', 'chit_fund', 'loan')),
    CONSTRAINT valid_balance CHECK (balance >= 0)
);

-- Customer Transactions
CREATE TABLE customer_transactions (
    id SERIAL PRIMARY KEY,
    account_id INTEGER NOT NULL REFERENCES customer_accounts(id),
    transaction_type VARCHAR(50) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    balance_before DECIMAL(15,2) NOT NULL,
    balance_after DECIMAL(15,2) NOT NULL,
    reference_id VARCHAR(100),
    description TEXT,
    location_id INTEGER NOT NULL REFERENCES locations(id),
    created_by INTEGER NOT NULL REFERENCES staff(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_transaction_type CHECK (transaction_type IN ('deposit', 'withdrawal', 'transfer', 'interest', 'fee', 'loan_disbursement', 'loan_repayment', 'chit_contribution', 'chit_payout')),
    CONSTRAINT valid_amount CHECK (amount > 0),
    CONSTRAINT valid_balance_flow CHECK (balance_after = balance_before + 
        CASE 
            WHEN transaction_type IN ('deposit', 'interest', 'loan_disbursement', 'chit_payout') THEN amount
            WHEN transaction_type IN ('withdrawal', 'transfer', 'fee', 'loan_repayment', 'chit_contribution') THEN -amount
            ELSE 0
        END
    )
);

-- Customer Communications
CREATE TABLE customer_communications (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    communication_type VARCHAR(50) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    channel VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    sent_at TIMESTAMP WITH TIME ZONE,
    created_by INTEGER NOT NULL REFERENCES staff(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_communication_type CHECK (communication_type IN ('email', 'sms', 'notification', 'letter')),
    CONSTRAINT valid_channel CHECK (channel IN ('email', 'sms', 'app', 'post'))
);

-- Customer Notes
CREATE TABLE customer_notes (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    note_type VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    is_private BOOLEAN NOT NULL DEFAULT false,
    created_by INTEGER NOT NULL REFERENCES staff(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_note_type CHECK (note_type IN ('general', 'meeting', 'complaint', 'feedback', 'other'))
);

-- Create indexes for better query performance
CREATE INDEX idx_customers_mandal_id ON customers(mandal_id);
CREATE INDEX idx_customers_village_id ON customers(village_id);
CREATE INDEX idx_customers_aadhar_number ON customers(aadhar_number);
CREATE INDEX idx_customers_pan_number ON customers(pan_number);
CREATE INDEX idx_customer_documents_customer_id ON customer_documents(customer_id);
CREATE INDEX idx_customer_documents_verification_status ON customer_documents(verification_status);
CREATE INDEX idx_customer_accounts_customer_id ON customer_accounts(customer_id);
CREATE INDEX idx_customer_accounts_account_number ON customer_accounts(account_number);
CREATE INDEX idx_customer_transactions_account_id ON customer_transactions(account_id);
CREATE INDEX idx_customer_transactions_created_at ON customer_transactions(created_at);
CREATE INDEX idx_customer_communications_customer_id ON customer_communications(customer_id);
CREATE INDEX idx_customer_communications_status ON customer_communications(status);
CREATE INDEX idx_customer_notes_customer_id ON customer_notes(customer_id);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_documents_updated_at
    BEFORE UPDATE ON customer_documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_accounts_updated_at
    BEFORE UPDATE ON customer_accounts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_communications_updated_at
    BEFORE UPDATE ON customer_communications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_notes_updated_at
    BEFORE UPDATE ON customer_notes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to get customer account balance
CREATE OR REPLACE FUNCTION get_customer_account_balance(account_id INTEGER)
RETURNS DECIMAL AS $$
    SELECT balance
    FROM customer_accounts
    WHERE id = account_id;
$$ LANGUAGE SQL;

-- Create function to get customer transaction history
CREATE OR REPLACE FUNCTION get_customer_transaction_history(
    account_id INTEGER,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE
)
RETURNS TABLE (
    id INTEGER,
    transaction_type VARCHAR,
    amount DECIMAL,
    balance_before DECIMAL,
    balance_after DECIMAL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
    SELECT 
        id,
        transaction_type,
        amount,
        balance_before,
        balance_after,
        description,
        created_at
    FROM customer_transactions
    WHERE account_id = $1
    AND created_at BETWEEN $2 AND $3
    ORDER BY created_at DESC;
$$ LANGUAGE SQL; 