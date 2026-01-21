CREATE OR REPLACE FUNCTION calculate_resale_price(
    p_original_price DECIMAL,
    p_condition TEXT,
    p_category TEXT
) RETURNS DECIMAL AS $$
DECLARE
    v_condition_mult DECIMAL;
    v_category_mult DECIMAL;
    v_resale_price DECIMAL;
BEGIN
    -- Get condition multiplier
    SELECT multiplier INTO v_condition_mult 
    FROM condition_multipliers 
    WHERE condition = p_condition;
    
    IF v_condition_mult IS NULL THEN
        v_condition_mult := 0.50; -- Default fallback
    END IF;
    
    -- Get category multiplier
    SELECT multiplier INTO v_category_mult 
    FROM category_multipliers 
    WHERE category = p_category;
    
    IF v_category_mult IS NULL THEN
        v_category_mult := 1.00; -- Default fallback
    END IF;
    
    -- Calculate resale price
    v_resale_price := ROUND(p_original_price * v_condition_mult * v_category_mult, 2);
    
    RETURN v_resale_price;
END;
$$ LANGUAGE plpgsql;