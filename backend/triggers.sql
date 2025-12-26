-- Trigger 1: Prevent Negative Stock (Before Update)
CREATE TRIGGER PreventNegativeStock
BEFORE UPDATE ON Book
FOR EACH ROW
BEGIN
    IF NEW.StockQuantity < 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: Stock quantity cannot be negative.';
    END IF;
END;

/* SPLIT */

-- Trigger 2: Auto-Place Supply Order (After Update)
CREATE TRIGGER AutoSupplyOrder
AFTER UPDATE ON Book
FOR EACH ROW
BEGIN
    -- Check if stock dropped from above/equal threshold to below threshold
    IF OLD.StockQuantity >= OLD.Threshold AND NEW.StockQuantity < NEW.Threshold THEN
        -- Insert into SupplyOrder (Assuming a default admin 'admin' handles this)
        INSERT INTO SupplyOrder (Username, PublisherID, OrderDate, Status, TotalPrice)
        VALUES ('admin', NEW.PublisherID, NOW(), 'Pending', 0.00); 
        
        INSERT INTO SupplyOrderItem (Username, PublisherID, OrderDate, ISBN, Quantity)
        VALUES ('admin', NEW.PublisherID, NOW(), NEW.ISBN, 10);
    END IF;
END;
