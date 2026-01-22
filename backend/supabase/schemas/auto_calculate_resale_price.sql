CREATE OR REPLACE FUNCTION auto_calculate_resale_price()
RETURNS TRIGGER AS $$
BEGIN
    -- Only calculate if not manually set
    IF NEW.is_price_manual = FALSE OR NEW.resale_price IS NULL THEN
        NEW.resale_price := calculate_resale_price(
            NEW.original_price, 
            NEW.condition, 
            NEW.category
        );
    END IF;
    
    -- Update status to 'priced' if resale_price is set
    IF NEW.resale_price IS NOT NULL AND NEW.status = 'pending' THEN
        NEW.status := 'priced';
    END IF;
    
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_price
    BEFORE INSERT OR UPDATE ON inventory_items
    FOR EACH ROW
    EXECUTE FUNCTION auto_calculate_resale_price();