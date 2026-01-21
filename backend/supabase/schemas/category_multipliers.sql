CREATE TABLE category_multipliers (
    category TEXT PRIMARY KEY,
    multiplier DECIMAL(4, 2) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed data
INSERT INTO category_multipliers (category, multiplier, description) VALUES
    ('Outerwear', 1.10, 'Coats, trench coats, puffer jackets'),
    ('Jackets', 1.05, 'Blazers, denim jackets, leather jackets'),
    ('Dresses', 1.00, 'All dress types'),
    ('Shoes', 0.95, 'All footwear'),
    ('Knitwear', 0.90, 'Sweaters, cardigans'),
    ('Bottoms', 0.85, 'Pants, jeans, skirts, shorts'),
    ('Tops', 0.80, 'Shirts, blouses, t-shirts'),
    ('Activewear', 0.80, 'Sports clothing'),
    ('Accessories', 0.75, 'Bags, belts, scarves');

-- Enable RLS (read-only for all authenticated users)
ALTER TABLE category_multipliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view" 
    ON category_multipliers FOR SELECT 
    USING (auth.role() = 'authenticated');