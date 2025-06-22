-- Department Head Schema

-- Staff Table
CREATE TABLE staff (
    id SERIAL PRIMARY KEY,
    department_id INTEGER NOT NULL REFERENCES departments(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    joining_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Staff Performance Table
CREATE TABLE staff_performance (
    id SERIAL PRIMARY KEY,
    staff_id INTEGER NOT NULL REFERENCES staff(id),
    department_id INTEGER NOT NULL REFERENCES departments(id),
    performance_score INTEGER NOT NULL CHECK (performance_score >= 0 AND performance_score <= 100),
    tasks_completed INTEGER NOT NULL DEFAULT 0,
    customer_satisfaction INTEGER NOT NULL CHECK (customer_satisfaction >= 0 AND customer_satisfaction <= 100),
    evaluation_date DATE NOT NULL,
    evaluation_period VARCHAR(50) NOT NULL, -- 'weekly', 'monthly', 'quarterly', 'yearly'
    evaluator_id INTEGER NOT NULL REFERENCES staff(id),
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Staff Attendance Table
CREATE TABLE staff_attendance (
    id SERIAL PRIMARY KEY,
    staff_id INTEGER NOT NULL REFERENCES staff(id),
    department_id INTEGER NOT NULL REFERENCES departments(id),
    date DATE NOT NULL,
    status VARCHAR(50) NOT NULL, -- 'present', 'absent', 'late', 'half-day'
    check_in_time TIMESTAMP WITH TIME ZONE,
    check_out_time TIMESTAMP WITH TIME ZONE,
    work_hours DECIMAL(4,2),
    location_id INTEGER REFERENCES locations(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(staff_id, date)
);

-- Department Financial Reports Table
CREATE TABLE department_financial_reports (
    id SERIAL PRIMARY KEY,
    department_id INTEGER NOT NULL REFERENCES departments(id),
    report_date DATE NOT NULL,
    report_period VARCHAR(50) NOT NULL, -- 'weekly', 'monthly', 'quarterly', 'yearly'
    total_revenue DECIMAL(15,2) NOT NULL DEFAULT 0,
    total_expenses DECIMAL(15,2) NOT NULL DEFAULT 0,
    net_profit DECIMAL(15,2) NOT NULL DEFAULT 0,
    revenue_breakdown JSONB, -- Stores detailed revenue sources
    expense_breakdown JSONB, -- Stores detailed expense categories
    created_by INTEGER NOT NULL REFERENCES staff(id),
    approved_by INTEGER REFERENCES staff(id),
    status VARCHAR(50) NOT NULL DEFAULT 'draft', -- 'draft', 'submitted', 'approved', 'rejected'
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Staff Tasks Table
CREATE TABLE staff_tasks (
    id SERIAL PRIMARY KEY,
    staff_id INTEGER NOT NULL REFERENCES staff(id),
    department_id INTEGER NOT NULL REFERENCES departments(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(50) NOT NULL, -- 'low', 'medium', 'high', 'urgent'
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'cancelled'
    due_date DATE NOT NULL,
    completed_date DATE,
    assigned_by INTEGER NOT NULL REFERENCES staff(id),
    location_id INTEGER REFERENCES locations(id),
    customer_id INTEGER REFERENCES customers(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Staff Leave Requests Table
CREATE TABLE staff_leave_requests (
    id SERIAL PRIMARY KEY,
    staff_id INTEGER NOT NULL REFERENCES staff(id),
    department_id INTEGER NOT NULL REFERENCES departments(id),
    leave_type VARCHAR(50) NOT NULL, -- 'casual', 'sick', 'annual', 'unpaid'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INTEGER NOT NULL,
    reason TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    approved_by INTEGER REFERENCES staff(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Staff Documents Table
CREATE TABLE staff_documents (
    id SERIAL PRIMARY KEY,
    staff_id INTEGER NOT NULL REFERENCES staff(id),
    document_type VARCHAR(100) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    uploaded_by INTEGER NOT NULL REFERENCES staff(id),
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
    verified_by INTEGER REFERENCES staff(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Department Goals Table
CREATE TABLE department_goals (
    id SERIAL PRIMARY KEY,
    department_id INTEGER NOT NULL REFERENCES departments(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_value DECIMAL(15,2) NOT NULL,
    current_value DECIMAL(15,2) NOT NULL DEFAULT 0,
    goal_type VARCHAR(50) NOT NULL, -- 'revenue', 'customer_satisfaction', 'staff_performance', etc.
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- 'active', 'completed', 'cancelled'
    created_by INTEGER NOT NULL REFERENCES staff(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_staff_department_id ON staff(department_id);
CREATE INDEX idx_staff_performance_staff_id ON staff_performance(staff_id);
CREATE INDEX idx_staff_performance_department_id ON staff_performance(department_id);
CREATE INDEX idx_staff_attendance_staff_id ON staff_attendance(staff_id);
CREATE INDEX idx_staff_attendance_date ON staff_attendance(date);
CREATE INDEX idx_department_financial_reports_department_id ON department_financial_reports(department_id);
CREATE INDEX idx_staff_tasks_staff_id ON staff_tasks(staff_id);
CREATE INDEX idx_staff_tasks_department_id ON staff_tasks(department_id);
CREATE INDEX idx_staff_leave_requests_staff_id ON staff_leave_requests(staff_id);
CREATE INDEX idx_staff_documents_staff_id ON staff_documents(staff_id);
CREATE INDEX idx_department_goals_department_id ON department_goals(department_id);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_staff_updated_at
    BEFORE UPDATE ON staff
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_performance_updated_at
    BEFORE UPDATE ON staff_performance
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_attendance_updated_at
    BEFORE UPDATE ON staff_attendance
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_department_financial_reports_updated_at
    BEFORE UPDATE ON department_financial_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_tasks_updated_at
    BEFORE UPDATE ON staff_tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_leave_requests_updated_at
    BEFORE UPDATE ON staff_leave_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_documents_updated_at
    BEFORE UPDATE ON staff_documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_department_goals_updated_at
    BEFORE UPDATE ON department_goals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 