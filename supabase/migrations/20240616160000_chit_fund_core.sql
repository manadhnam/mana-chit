-- Chit Fund Platform Core Schema Migration
-- Date: 2024-06-16

-- USERS TABLE (add chit-specific fields if not present)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL,
    branch_id UUID REFERENCES branches(id),
    group_id UUID REFERENCES groups(id),
    risk_level VARCHAR(20) DEFAULT 'normal',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- GROUPS TABLE
CREATE TABLE IF NOT EXISTS groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    amount INTEGER NOT NULL,
    members UUID[], -- Array of user IDs
    active BOOLEAN DEFAULT TRUE
);

-- PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    group_id UUID REFERENCES groups(id),
    amount INTEGER NOT NULL,
    mode VARCHAR(20) NOT NULL, -- cash, online, phonepe_qr
    paid_on DATE NOT NULL,
    fine INTEGER DEFAULT 0,
    manual BOOLEAN DEFAULT FALSE,
    agent_id UUID REFERENCES users(id),
    screenshot_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- RECEIPTS TABLE
CREATE TABLE IF NOT EXISTS receipts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID REFERENCES payments(id),
    issued_by UUID REFERENCES users(id),
    receipt_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ATTENDANCE TABLE
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES users(id),
    selfie_url TEXT,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- LOAN REQUESTS TABLE
CREATE TABLE IF NOT EXISTS loan_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    group_id UUID REFERENCES groups(id),
    status VARCHAR(20) DEFAULT 'pending',
    requested_on TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- QR CODES TABLE
CREATE TABLE IF NOT EXISTS qr_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id UUID REFERENCES branches(id),
    upi_id VARCHAR(100) NOT NULL,
    qr_image_url TEXT NOT NULL
);

-- FLAGS TABLE
CREATE TABLE IF NOT EXISTS flags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(20) NOT NULL, -- user, agent
    reference_id UUID NOT NULL, -- user_id or agent_id
    reason TEXT,
    status VARCHAR(20) DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_group_id ON payments(group_id);
CREATE INDEX IF NOT EXISTS idx_loan_requests_user_id ON loan_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_loan_requests_group_id ON loan_requests(group_id);
CREATE INDEX IF NOT EXISTS idx_flags_reference_id ON flags(reference_id);

-- Storage Buckets (for reference, not SQL)
-- manual-payments: screenshots
-- receipts: generated receipts
-- attendance-selfies: agent check-in photos 