-- View: Inventory with calculated pricing fields
CREATE OR REPLACE VIEW inventory_with_pricing AS
SELECT 
  i.id,
  i.user_id,
  i.upload_id,
  i.merchant_id,
  i.sku,
  i.title,
  i.brand,
  i.category,
  i.condition,
  i.original_price,
  i.currency,
  i.quantity,
  i.resale_price,
  i.is_price_manual,
  i.status,
  i.listed_at,
  i.created_at,
  i.updated_at,
  cm.multiplier AS condition_multiplier,
  cat.multiplier AS category_multiplier,
  ROUND((i.original_price * COALESCE(cm.multiplier, 0.50) * COALESCE(cat.multiplier, 1.00))::numeric, 2) AS calculated_price,
  ROUND((i.original_price - COALESCE(i.resale_price, 0))::numeric, 2) AS price_difference,
  CASE 
    WHEN i.original_price > 0 AND i.resale_price IS NOT NULL 
    THEN ROUND((((i.original_price - i.resale_price) / i.original_price) * 100)::numeric, 1)
    ELSE NULL
  END AS discount_percentage
FROM inventory_items i
LEFT JOIN condition_multipliers cm ON i.condition = cm.condition
LEFT JOIN category_multipliers cat ON i.category = cat.category
WHERE i.deleted_at IS NULL;

-- Grant access to views for authenticated users
GRANT SELECT ON inventory_with_pricing TO authenticated;
