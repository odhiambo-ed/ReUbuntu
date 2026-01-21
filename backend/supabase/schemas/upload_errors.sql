CREATE TABLE upload_errors (
    id serial PRIMARY KEY,
    upload_id INTEGER NOT NULL REFERENCES uploads(id) ON DELETE CASCADE,
    row_number INTEGER NOT NULL,
    field_name TEXT,
    error_type TEXT NOT NULL 
        CHECK (error_type IN (
            'missing_required', 
            'invalid_format', 
            'invalid_value', 
            'duplicate', 
            'out_of_range'
        )),
    error_message TEXT NOT NULL,
    raw_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_upload_errors_upload_id ON upload_errors(upload_id);
CREATE INDEX idx_upload_errors_row_number ON upload_errors(row_number);

-- Enable RLS
ALTER TABLE upload_errors ENABLE ROW LEVEL SECURITY;

-- Policies (users can view errors for their own uploads)
CREATE POLICY "Users can view own upload errors" 
    ON upload_errors FOR SELECT 
    USING (
        upload_id IN (
            SELECT id FROM uploads WHERE user_id = auth.uid()
        )
    );