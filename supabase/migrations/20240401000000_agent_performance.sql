-- Create agent_metrics table
CREATE TABLE agent_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    customer_acquisition INTEGER NOT NULL DEFAULT 0,
    transaction_volume INTEGER NOT NULL DEFAULT 0,
    revenue DECIMAL(12,2) NOT NULL DEFAULT 0,
    customer_satisfaction DECIMAL(3,2) NOT NULL DEFAULT 0,
    attendance DECIMAL(5,2) NOT NULL DEFAULT 0,
    targets JSONB NOT NULL DEFAULT '{
        "customer_acquisition": 30,
        "transaction_volume": 200,
        "revenue": 400000,
        "customer_satisfaction": 4.8,
        "attendance": 98
    }',
    previous JSONB NOT NULL DEFAULT '{
        "customer_acquisition": 0,
        "transaction_volume": 0,
        "revenue": 0,
        "customer_satisfaction": 0,
        "attendance": 0
    }',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create agent_goals table
CREATE TABLE agent_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    target DECIMAL(12,2) NOT NULL,
    current DECIMAL(12,2) NOT NULL DEFAULT 0,
    deadline DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'on_track',
    unit TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create agent_commissions table
CREATE TABLE agent_commissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    amount DECIMAL(12,2) NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('referral', 'collection', 'performance', 'bonus')),
    date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create function to calculate and update agent metrics
CREATE OR REPLACE FUNCTION update_agent_metrics()
RETURNS TRIGGER AS $$
BEGIN
    -- Store current metrics as previous
    UPDATE agent_metrics
    SET 
        previous = jsonb_build_object(
            'customer_acquisition', customer_acquisition,
            'transaction_volume', transaction_volume,
            'revenue', revenue,
            'customer_satisfaction', customer_satisfaction,
            'attendance', attendance
        ),
        -- Update current metrics based on recent activity
        customer_acquisition = (
            SELECT COUNT(DISTINCT customer_id)
            FROM customers
            WHERE added_by = NEW.agent_id
            AND created_at >= date_trunc('month', CURRENT_DATE)
        ),
        transaction_volume = (
            SELECT COUNT(*)
            FROM collections
            WHERE agent_id = NEW.agent_id
            AND created_at >= date_trunc('month', CURRENT_DATE)
        ),
        revenue = (
            SELECT COALESCE(SUM(amount), 0)
            FROM collections
            WHERE agent_id = NEW.agent_id
            AND created_at >= date_trunc('month', CURRENT_DATE)
        ),
        customer_satisfaction = (
            SELECT COALESCE(AVG(rating), 0)
            FROM customer_feedback
            WHERE agent_id = NEW.agent_id
            AND created_at >= date_trunc('month', CURRENT_DATE)
        ),
        attendance = (
            SELECT COALESCE(
                (COUNT(*) FILTER (WHERE status = 'present')::DECIMAL / NULLIF(COUNT(*), 0) * 100),
                0
            )
            FROM agent_attendance
            WHERE agent_id = NEW.agent_id
            AND date >= date_trunc('month', CURRENT_DATE)
        ),
        updated_at = NOW()
    WHERE agent_id = NEW.agent_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for metrics updates
CREATE TRIGGER agent_metrics_update
AFTER INSERT OR UPDATE ON collections
FOR EACH ROW
EXECUTE FUNCTION update_agent_metrics();

-- Create RLS policies
ALTER TABLE agent_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_commissions ENABLE ROW LEVEL SECURITY;

-- Agents can view their own metrics
CREATE POLICY agent_metrics_view ON agent_metrics
    FOR SELECT
    USING (auth.uid() = agent_id);

-- Agents can view their own goals
CREATE POLICY agent_goals_view ON agent_goals
    FOR SELECT
    USING (auth.uid() = agent_id);

-- Agents can view their own commissions
CREATE POLICY agent_commissions_view ON agent_commissions
    FOR SELECT
    USING (auth.uid() = agent_id);

-- Branch managers can view all agent metrics in their branch
CREATE POLICY branch_manager_metrics_view ON agent_metrics
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users u
            WHERE u.id = auth.uid()
            AND u.role = 'branchManager'
            AND u.branch_id = (
                SELECT branch_id FROM users WHERE id = agent_metrics.agent_id
            )
        )
    );

-- Branch managers can manage agent goals
CREATE POLICY branch_manager_goals_manage ON agent_goals
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users u
            WHERE u.id = auth.uid()
            AND u.role = 'branchManager'
            AND u.branch_id = (
                SELECT branch_id FROM users WHERE id = agent_goals.agent_id
            )
        )
    );

-- Branch managers can manage commissions
CREATE POLICY branch_manager_commissions_manage ON agent_commissions
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users u
            WHERE u.id = auth.uid()
            AND u.role = 'branchManager'
            AND u.branch_id = (
                SELECT branch_id FROM users WHERE id = agent_commissions.agent_id
            )
        )
    );

-- Department heads and super admins can view all metrics
CREATE POLICY admin_metrics_view ON agent_metrics
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users u
            WHERE u.id = auth.uid()
            AND u.role IN ('departmentHead', 'superAdmin')
        )
    );

-- Department heads and super admins can view all goals
CREATE POLICY admin_goals_view ON agent_goals
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users u
            WHERE u.id = auth.uid()
            AND u.role IN ('departmentHead', 'superAdmin')
        )
    );

-- Department heads and super admins can view all commissions
CREATE POLICY admin_commissions_view ON agent_commissions
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users u
            WHERE u.id = auth.uid()
            AND u.role IN ('departmentHead', 'superAdmin')
        )
    ); 