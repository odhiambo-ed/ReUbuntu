create or replace view "public"."inventory_with_pricing" as  SELECT i.id,
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
    round(((i.original_price * COALESCE(cm.multiplier, 0.50)) * COALESCE(cat.multiplier, 1.00)), 2) AS calculated_price,
    round((i.original_price - COALESCE(i.resale_price, (0)::numeric)), 2) AS price_difference,
        CASE
            WHEN ((i.original_price > (0)::numeric) AND (i.resale_price IS NOT NULL)) THEN round((((i.original_price - i.resale_price) / i.original_price) * (100)::numeric), 1)
            ELSE NULL::numeric
        END AS discount_percentage
   FROM ((public.inventory_items i
     LEFT JOIN public.condition_multipliers cm ON ((i.condition = cm.condition)))
     LEFT JOIN public.category_multipliers cat ON ((i.category = cat.category)))
  WHERE (i.deleted_at IS NULL);



