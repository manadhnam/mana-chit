-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('superAdmin', 'departmentHead', 'mandalHead', 'branchManager', 'agent', 'user');
    END IF;
END$$;
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'id_proof_type') THEN
        CREATE TYPE id_proof_type AS ENUM ('AADHAR', 'PAN', 'PASSPORT', 'DRIVING_LICENSE');
    END IF;
END$$;
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'chit_group_status') THEN
        CREATE TYPE chit_group_status AS ENUM ('pending', 'active', 'completed', 'cancelled');
    END IF;
END$$;
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'loan_status') THEN
        CREATE TYPE loan_status AS ENUM ('pending', 'approved', 'rejected', 'disbursed', 'completed', 'defaulted');
    END IF;
END$$;
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
        CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
    END IF;
END$$;
CREATE TYPE permission_action AS ENUM ('CREATE', 'READ', 'UPDATE', 'DELETE');

-- Create permissions table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'permissions') THEN
        CREATE TABLE permissions (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name VARCHAR(255) NOT NULL,
            description TEXT,
            module VARCHAR(255) NOT NULL,
            action permission_action NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    END IF;
END$$;

-- Create roles table
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    level INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create role_permissions junction table
CREATE TABLE role_permissions (
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, permission_id)
);

-- Create users table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'users') THEN
        CREATE TABLE users (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            mobile VARCHAR(15) UNIQUE NOT NULL,
            role user_role NOT NULL DEFAULT 'user',
            branch_id UUID,
            mandal_id UUID,
            department_id UUID,
            id_proof_type id_proof_type,
            id_proof_file TEXT,
            id_proof_verified BOOLEAN DEFAULT FALSE,
            wallet_balance DECIMAL(12,2) DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    END IF;
END$$;

-- Create user_roles junction table
CREATE TABLE user_roles (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id)
);

-- Create branches table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'branches') THEN
        CREATE TABLE branches (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name VARCHAR(255) NOT NULL,
            code VARCHAR(50) UNIQUE NOT NULL,
            address TEXT NOT NULL,
            city VARCHAR(100) NOT NULL,
            state VARCHAR(100) NOT NULL,
            pincode VARCHAR(10) NOT NULL,
            phone VARCHAR(15) NOT NULL,
            email VARCHAR(255) NOT NULL,
            manager_id UUID REFERENCES users(id),
            status BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    END IF;
END$$;

-- Create mandals table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'mandals') THEN
        CREATE TABLE mandals (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name VARCHAR(255) NOT NULL,
            code VARCHAR(50) UNIQUE NOT NULL,
            address TEXT NOT NULL,
            city VARCHAR(100) NOT NULL,
            state VARCHAR(100) NOT NULL,
            pincode VARCHAR(10) NOT NULL,
            phone VARCHAR(15) NOT NULL,
            email VARCHAR(255) NOT NULL,
            head_id UUID REFERENCES users(id),
            branch_id UUID REFERENCES branches(id),
            status BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    END IF;
END$$;

-- Create departments table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'departments') THEN
        CREATE TABLE departments (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name VARCHAR(255) NOT NULL,
            code VARCHAR(50) UNIQUE NOT NULL,
            description TEXT,
            head_id UUID REFERENCES users(id),
            status BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    END IF;
END$$;

-- Create chit_groups table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'chit_groups') THEN
        CREATE TABLE chit_groups (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name VARCHAR(255) NOT NULL,
            code VARCHAR(50) UNIQUE NOT NULL,
            total_amount DECIMAL(12,2) NOT NULL,
            number_of_members INTEGER NOT NULL,
            monthly_contribution DECIMAL(12,2) NOT NULL,
            commission_percentage DECIMAL(5,2) NOT NULL,
            start_date DATE NOT NULL,
            end_date DATE NOT NULL,
            status chit_group_status DEFAULT 'pending',
            created_by UUID REFERENCES users(id),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    END IF;
END$$;

-- Create chit_members table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'chit_members') THEN
        CREATE TABLE chit_members (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            chit_group_id UUID REFERENCES chit_groups(id),
            user_id UUID REFERENCES users(id),
            member_number INTEGER NOT NULL,
            joining_date DATE NOT NULL,
            status BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(chit_group_id, user_id)
        );
    END IF;
END$$;

-- Create contributions table
CREATE TABLE contributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chit_group_id UUID REFERENCES chit_groups(id),
    user_id UUID REFERENCES users(id),
    amount DECIMAL(12,2) NOT NULL,
    cycle_number INTEGER NOT NULL,
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status payment_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create loans table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'loans') THEN
        CREATE TABLE loans (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID REFERENCES users(id),
            amount DECIMAL(12,2) NOT NULL,
            interest_rate DECIMAL(5,2) NOT NULL,
            term_months INTEGER NOT NULL,
            start_date DATE NOT NULL,
            end_date DATE NOT NULL,
            status loan_status DEFAULT 'pending',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    END IF;
END$$;

-- Create loan_repayments table
CREATE TABLE loan_repayments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    loan_id UUID REFERENCES loans(id),
    amount DECIMAL(12,2) NOT NULL,
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status payment_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    amount DECIMAL(12,2) NOT NULL,
    type VARCHAR(50) NOT NULL,
    reference_id UUID,
    reference_type VARCHAR(50),
    status payment_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key constraints
ALTER TABLE users
    ADD CONSTRAINT fk_users_branch FOREIGN KEY (branch_id) REFERENCES branches(id),
    ADD CONSTRAINT fk_users_mandal FOREIGN KEY (mandal_id) REFERENCES mandals(id),
    ADD CONSTRAINT fk_users_department FOREIGN KEY (department_id) REFERENCES departments(id);

ALTER TABLE branches
    ADD CONSTRAINT fk_branches_mandal FOREIGN KEY (mandal_id) REFERENCES mandals(id);

ALTER TABLE mandals
    ADD CONSTRAINT fk_mandals_department FOREIGN KEY (department_id) REFERENCES departments(id);

-- Create indexes
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_branch ON users(branch_id);
CREATE INDEX idx_chit_groups_status ON chit_groups(status);
CREATE INDEX idx_chit_groups_branch ON chit_groups(branch_id);
CREATE INDEX idx_contributions_chit_group ON contributions(chit_group_id);
CREATE INDEX idx_contributions_user ON contributions(user_id);
CREATE INDEX idx_loans_user ON loans(user_id);
CREATE INDEX idx_loans_status ON loans(status);
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all tables
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_branches_updated_at
    BEFORE UPDATE ON branches
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mandals_updated_at
    BEFORE UPDATE ON mandals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_departments_updated_at
    BEFORE UPDATE ON departments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chit_groups_updated_at
    BEFORE UPDATE ON chit_groups
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contributions_updated_at
    BEFORE UPDATE ON contributions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_loans_updated_at
    BEFORE UPDATE ON loans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_loan_repayments_updated_at
    BEFORE UPDATE ON loan_repayments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for roles and permissions
CREATE INDEX idx_roles_level ON roles(level);
CREATE INDEX idx_permissions_module ON permissions(module);
CREATE INDEX idx_role_permissions_role ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission ON role_permissions(permission_id);
CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role_id);

-- Add updated_at triggers for new tables
CREATE TRIGGER update_permissions_updated_at
    BEFORE UPDATE ON permissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_roles_updated_at
    BEFORE UPDATE ON roles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default roles
INSERT INTO roles (name, description, level) VALUES
    ('superAdmin', 'Super Administrator with full system access', 1),
    ('departmentHead', 'Department Head with department-wide access', 2),
    ('mandalHead', 'Mandal Head with mandal-wide access', 3),
    ('branchManager', 'Branch Manager with branch-wide access', 4),
    ('agent', 'Agent with limited access to assigned tasks', 5),
    ('user', 'Regular user with basic access', 6);

-- Insert default permissions
INSERT INTO permissions (name, description, module, action) VALUES
    ('manage_users', 'Manage user accounts', 'users', 'CREATE'),
    ('view_users', 'View user accounts', 'users', 'READ'),
    ('edit_users', 'Edit user accounts', 'users', 'UPDATE'),
    ('delete_users', 'Delete user accounts', 'users', 'DELETE'),
    ('manage_roles', 'Manage roles and permissions', 'roles', 'CREATE'),
    ('view_roles', 'View roles and permissions', 'roles', 'READ'),
    ('edit_roles', 'Edit roles and permissions', 'roles', 'UPDATE'),
    ('delete_roles', 'Delete roles and permissions', 'roles', 'DELETE'),
    ('manage_chit_groups', 'Manage chit groups', 'chit_groups', 'CREATE'),
    ('view_chit_groups', 'View chit groups', 'chit_groups', 'READ'),
    ('edit_chit_groups', 'Edit chit groups', 'chit_groups', 'UPDATE'),
    ('delete_chit_groups', 'Delete chit groups', 'chit_groups', 'DELETE'),
    ('manage_loans', 'Manage loans', 'loans', 'CREATE'),
    ('view_loans', 'View loans', 'loans', 'READ'),
    ('edit_loans', 'Edit loans', 'loans', 'UPDATE'),
    ('delete_loans', 'Delete loans', 'loans', 'DELETE');

-- Assign permissions to roles
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    r.id as role_id,
    p.id as permission_id
FROM roles r
CROSS JOIN permissions p
WHERE 
    (r.name = 'superAdmin') OR
    (r.name = 'departmentHead' AND p.module IN ('users', 'chit_groups', 'loans')) OR
    (r.name = 'mandalHead' AND p.module IN ('users', 'chit_groups', 'loans')) OR
    (r.name = 'branchManager' AND p.module IN ('users', 'chit_groups', 'loans')) OR
    (r.name = 'agent' AND p.module IN ('chit_groups', 'loans') AND p.action IN ('READ', 'CREATE')) OR
    (r.name = 'user' AND p.module IN ('chit_groups', 'loans') AND p.action = 'READ'); 