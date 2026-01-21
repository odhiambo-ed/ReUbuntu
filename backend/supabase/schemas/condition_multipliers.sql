CREATE TABLE condition_multipliers (
    condition TEXT PRIMARY KEY,
    multiplier DECIMAL(4, 2) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed data
INSERT INTO condition_multipliers (condition, multiplier, description) VALUES
    ('new', 0.70, 'Brand new with tags'),
    ('like_new', 0.60, 'Worn once or twice, no visible wear'),
    ('good', 0.50, 'Gently used, minor signs of wear'),
    ('fair', 0.35, 'Visible wear, still functional');

-- Enable RLS (read-only for all authenticated users)
ALTER TABLE condition_multipliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view" 
    ON condition_multipliers FOR SELECT 
    USING (auth.role() = 'authenticated');