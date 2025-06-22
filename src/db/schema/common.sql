-- Common Schema

-- Users Table (Authentication)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    password_salt VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Staff Table (Common for all sections)
CREATE TABLE staff (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role VARCHAR(100) NOT NULL,
    department_id INTEGER REFERENCES departments(id),
    location_id INTEGER REFERENCES locations(id),
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    joining_date DATE NOT NULL,
    created_by INTEGER NOT NULL REFERENCES staff(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Locations Table (Hierarchy: State -> District -> Mandal -> Village)
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'state', 'district', 'mandal', 'village'
    parent_id INTEGER REFERENCES locations(id),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_by INTEGER NOT NULL REFERENCES staff(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_location_type CHECK (type IN ('state', 'district', 'mandal', 'village')),
    CONSTRAINT valid_coordinates CHECK (
        (latitude IS NULL AND longitude IS NULL) OR
        (latitude IS NOT NULL AND longitude IS NOT NULL AND
         latitude BETWEEN -90 AND 90 AND
         longitude BETWEEN -180 AND 180)
    )
);

-- Notifications Table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    priority VARCHAR(50) NOT NULL DEFAULT 'normal',
    status VARCHAR(50) NOT NULL DEFAULT 'unread',
    read_at TIMESTAMP WITH TIME ZONE,
    action_url TEXT,
    created_by INTEGER NOT NULL REFERENCES staff(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Settings Table
CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    key VARCHAR(255) NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    is_encrypted BOOLEAN NOT NULL DEFAULT false,
    created_by INTEGER NOT NULL REFERENCES staff(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(category, key)
);

-- Activity Logs Table
CREATE TABLE activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id INTEGER NOT NULL,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- File Storage Table
CREATE TABLE file_storage (
    id SERIAL PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    storage_type VARCHAR(50) NOT NULL, -- 'local', 's3', 'gcs'
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    uploaded_by INTEGER NOT NULL REFERENCES staff(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_locations_parent_id ON locations(parent_id);
CREATE INDEX idx_locations_type ON locations(type);
CREATE INDEX idx_staff_user_id ON staff(user_id);
CREATE INDEX idx_staff_department_id ON staff(department_id);
CREATE INDEX idx_staff_location_id ON staff(location_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_entity_type_entity_id ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_file_storage_uploaded_by ON file_storage(uploaded_by);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_updated_at
    BEFORE UPDATE ON staff
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_locations_updated_at
    BEFORE UPDATE ON locations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at
    BEFORE UPDATE ON notifications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_file_storage_updated_at
    BEFORE UPDATE ON file_storage
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to get location hierarchy
CREATE OR REPLACE FUNCTION get_location_hierarchy(location_id INTEGER)
RETURNS TABLE (
    id INTEGER,
    name VARCHAR,
    type VARCHAR,
    level INTEGER
) AS $$
WITH RECURSIVE location_hierarchy AS (
    -- Base case: the starting location
    SELECT 
        id,
        name,
        type,
        1 as level
    FROM locations
    WHERE id = location_id

    UNION ALL

    -- Recursive case: parent locations
    SELECT 
        l.id,
        l.name,
        l.type,
        lh.level + 1
    FROM locations l
    INNER JOIN location_hierarchy lh ON l.id = lh.parent_id
)
SELECT * FROM location_hierarchy
ORDER BY level DESC;
$$ LANGUAGE SQL;

-- Create function to get child locations
CREATE OR REPLACE FUNCTION get_child_locations(location_id INTEGER)
RETURNS TABLE (
    id INTEGER,
    name VARCHAR,
    type VARCHAR,
    level INTEGER
) AS $$
WITH RECURSIVE child_locations AS (
    -- Base case: direct children
    SELECT 
        id,
        name,
        type,
        1 as level
    FROM locations
    WHERE parent_id = location_id

    UNION ALL

    -- Recursive case: children of children
    SELECT 
        l.id,
        l.name,
        l.type,
        cl.level + 1
    FROM locations l
    INNER JOIN child_locations cl ON l.parent_id = cl.id
)
SELECT * FROM child_locations
ORDER BY level, name;
$$ LANGUAGE SQL; 