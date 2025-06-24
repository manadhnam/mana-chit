-- Add freeze functionality to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_frozen BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS frozen_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS frozen_by UUID REFERENCES users(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS freeze_reason TEXT;

-- Create freeze_logs table to track freeze/unfreeze actions
CREATE TABLE IF NOT EXISTS freeze_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('freeze', 'unfreeze')),
    frozen_by UUID REFERENCES users(id) NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies for freeze functionality
ALTER TABLE freeze_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see freeze logs for users they manage
CREATE POLICY "Users can view freeze logs for managed users" ON freeze_logs
    FOR SELECT USING (
        -- Super Admin can see all
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'superAdmin'
        )
        OR
        -- Department Head can see all staff freeze logs
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'departmentHead'
        )
        OR
        -- Mandal Head can see branch manager and agent freeze logs
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'mandalHead'
            AND EXISTS (
                SELECT 1 FROM users u2 
                WHERE u2.id = freeze_logs.user_id 
                AND u2.role IN ('branchManager', 'agent')
            )
        )
        OR
        -- Branch Manager can see agent freeze logs
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'branchManager'
            AND EXISTS (
                SELECT 1 FROM users u2 
                WHERE u2.id = freeze_logs.user_id 
                AND u2.role = 'agent'
            )
        )
    );

-- Policy: Only authorized users can create freeze logs
CREATE POLICY "Authorized users can create freeze logs" ON freeze_logs
    FOR INSERT WITH CHECK (
        -- Super Admin can freeze/unfreeze anyone
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'superAdmin'
        )
        OR
        -- Department Head can freeze/unfreeze staff
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'departmentHead'
            AND EXISTS (
                SELECT 1 FROM users u2 
                WHERE u2.id = freeze_logs.user_id 
                AND u2.role IN ('departmentHead', 'mandalHead', 'branchManager', 'agent')
            )
        )
        OR
        -- Mandal Head can freeze/unfreeze branch managers and agents
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'mandalHead'
            AND EXISTS (
                SELECT 1 FROM users u2 
                WHERE u2.id = freeze_logs.user_id 
                AND u2.role IN ('branchManager', 'agent')
            )
        )
        OR
        -- Branch Manager can freeze/unfreeze agents and customers
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'branchManager'
            AND EXISTS (
                SELECT 1 FROM users u2 
                WHERE u2.id = freeze_logs.user_id 
                AND u2.role IN ('agent', 'user')
            )
        )
    );

-- Update existing RLS policies to respect frozen status
-- Users cannot access data if they are frozen
CREATE OR REPLACE FUNCTION check_user_not_frozen()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN NOT EXISTS (
        SELECT 1 FROM users 
        WHERE users.id = auth.uid() 
        AND users.is_frozen = TRUE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update users table RLS to block frozen users
DROP POLICY IF EXISTS "Users can view their own data" ON users;
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (
        auth.uid() = id 
        AND check_user_not_frozen()
    );

-- Update other tables to respect frozen status
-- This will be applied to all existing RLS policies
-- For example, in chit_groups, loans, transactions, etc.

-- Create function to freeze a user
CREATE OR REPLACE FUNCTION freeze_user(
    target_user_id UUID,
    freeze_reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    current_user_role TEXT;
    target_user_role TEXT;
BEGIN
    -- Get current user's role
    SELECT role INTO current_user_role FROM users WHERE id = auth.uid();
    
    -- Get target user's role
    SELECT role INTO target_user_role FROM users WHERE id = target_user_id;
    
    -- Check permissions
    IF current_user_role = 'superAdmin' THEN
        -- Super Admin can freeze anyone
        NULL;
    ELSIF current_user_role = 'departmentHead' AND target_user_role IN ('departmentHead', 'mandalHead', 'branchManager', 'agent') THEN
        -- Department Head can freeze staff
        NULL;
    ELSIF current_user_role = 'mandalHead' AND target_user_role IN ('branchManager', 'agent') THEN
        -- Mandal Head can freeze branch managers and agents
        NULL;
    ELSIF current_user_role = 'branchManager' AND target_user_role IN ('agent', 'user') THEN
        -- Branch Manager can freeze agents and customers
        NULL;
    ELSE
        RAISE EXCEPTION 'Insufficient permissions to freeze this user';
    END IF;
    
    -- Freeze the user
    UPDATE users 
    SET is_frozen = TRUE, 
        frozen_at = NOW(), 
        frozen_by = auth.uid(),
        freeze_reason = freeze_reason
    WHERE id = target_user_id;
    
    -- Log the action
    INSERT INTO freeze_logs (user_id, action, frozen_by, reason)
    VALUES (target_user_id, 'freeze', auth.uid(), freeze_reason);
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to unfreeze a user
CREATE OR REPLACE FUNCTION unfreeze_user(
    target_user_id UUID,
    unfreeze_reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    current_user_role TEXT;
    target_user_role TEXT;
BEGIN
    -- Get current user's role
    SELECT role INTO current_user_role FROM users WHERE id = auth.uid();
    
    -- Get target user's role
    SELECT role INTO target_user_role FROM users WHERE id = target_user_id;
    
    -- Check permissions (same as freeze)
    IF current_user_role = 'superAdmin' THEN
        -- Super Admin can unfreeze anyone
        NULL;
    ELSIF current_user_role = 'departmentHead' AND target_user_role IN ('departmentHead', 'mandalHead', 'branchManager', 'agent') THEN
        -- Department Head can unfreeze staff
        NULL;
    ELSIF current_user_role = 'mandalHead' AND target_user_role IN ('branchManager', 'agent') THEN
        -- Mandal Head can unfreeze branch managers and agents
        NULL;
    ELSIF current_user_role = 'branchManager' AND target_user_role IN ('agent', 'user') THEN
        -- Branch Manager can unfreeze agents and customers
        NULL;
    ELSE
        RAISE EXCEPTION 'Insufficient permissions to unfreeze this user';
    END IF;
    
    -- Unfreeze the user
    UPDATE users 
    SET is_frozen = FALSE, 
        frozen_at = NULL, 
        frozen_by = NULL,
        freeze_reason = NULL
    WHERE id = target_user_id;
    
    -- Log the action
    INSERT INTO freeze_logs (user_id, action, frozen_by, reason)
    VALUES (target_user_id, 'unfreeze', auth.uid(), unfreeze_reason);
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_is_frozen ON users(is_frozen);
CREATE INDEX IF NOT EXISTS idx_freeze_logs_user_id ON freeze_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_freeze_logs_created_at ON freeze_logs(created_at); 