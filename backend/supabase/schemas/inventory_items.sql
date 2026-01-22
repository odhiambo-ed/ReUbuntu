CREATE TABLE inventory_items (
    id serial PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    upload_id INTEGER REFERENCES uploads(id) ON DELETE SET NULL,
    
    -- Core inventory fields (from CSV)
    merchant_id TEXT NOT NULL,
    sku TEXT NOT NULL,
    title TEXT NOT NULL,
    brand TEXT, -- Optional
    category TEXT NOT NULL,
    condition TEXT NOT NULL 
        CHECK (condition IN ('new', 'like_new', 'good', 'fair')),
    original_price DECIMAL(12, 2) NOT NULL CHECK (original_price > 0),
    currency TEXT NOT NULL DEFAULT 'ZAR',
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 1),
    
    -- Pricing fields
    resale_price DECIMAL(12, 2),
    is_price_manual BOOLEAN DEFAULT FALSE,
    
    -- Status tracking
    status TEXT NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'priced', 'listed', 'unlisted', 'sold')),
    listed_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ, -- Soft delete
    
    -- Constraints
    CONSTRAINT unique_merchant_sku UNIQUE (user_id, merchant_id, sku)
);

-- Indexes
CREATE INDEX idx_inventory_user_id ON inventory_items(user_id);
CREATE INDEX idx_inventory_merchant_id ON inventory_items(merchant_id);
CREATE INDEX idx_inventory_sku ON inventory_items(sku);
CREATE INDEX idx_inventory_category ON inventory_items(category);
CREATE INDEX idx_inventory_condition ON inventory_items(condition);
CREATE INDEX idx_inventory_status ON inventory_items(status);
CREATE INDEX idx_inventory_created_at ON inventory_items(created_at DESC);
CREATE INDEX idx_inventory_not_deleted ON inventory_items(id) WHERE deleted_at IS NULL;

-- Full-text search index
CREATE INDEX idx_inventory_search ON inventory_items 
    USING gin(to_tsvector('english', title || ' ' || COALESCE(brand, '')));

-- Enable RLS
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own inventory" 
    ON inventory_items FOR SELECT 
    USING (auth.uid() = user_id AND deleted_at IS NULL);

CREATE POLICY "Users can create own inventory" 
    ON inventory_items FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own inventory" 
    ON inventory_items FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own inventory" 
    ON inventory_items FOR DELETE 
    USING (auth.uid() = user_id);