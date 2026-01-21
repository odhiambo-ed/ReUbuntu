CREATE TABLE uploads (
    id serial PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    file_path TEXT,
    file_size_bytes INTEGER,
    status TEXT NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    total_rows INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    processing_started_at TIMESTAMPTZ,
    processing_completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_uploads_user_id ON uploads(user_id);
CREATE INDEX idx_uploads_status ON uploads(status);
CREATE INDEX idx_uploads_created_at ON uploads(created_at DESC);

-- Enable RLS
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own uploads" 
    ON uploads FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own uploads" 
    ON uploads FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own uploads" 
    ON uploads FOR UPDATE 
    USING (auth.uid() = user_id);