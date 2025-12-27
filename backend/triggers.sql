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
-- Constraint: Only reorder books that have been sold at least once
CREATE TRIGGER AutoSupplyOrder
AFTER UPDATE ON Book
FOR EACH ROW
BEGIN
    DECLARE books_sold INT DEFAULT 0;
    DECLARE order_time DATETIME;
    DECLARE order_total DECIMAL(10, 2);
    
    -- Check if this book has been sold at least once
    SELECT COUNT(*) INTO books_sold
    FROM OrderItem
    WHERE ISBN = NEW.ISBN;
    
    -- Only create supply order if:
    -- 1. Stock dropped from above/equal threshold to below threshold
    -- 2. Book has been sold at least once
    IF OLD.StockQuantity >= OLD.Threshold 
       AND NEW.StockQuantity < NEW.Threshold 
       AND books_sold > 0 THEN
        
        -- Use a consistent timestamp for both inserts
        SET order_time = NOW();
        -- Calculate total price (threshold quantity * book price)
        SET order_total = NEW.Price * NEW.Threshold;
        
        -- Insert into SupplyOrder
        INSERT INTO SupplyOrder (Username, PublisherID, OrderDate, Status, TotalPrice)
        VALUES ('admin', NEW.PublisherID, order_time, 'Pending', order_total); 
        
        -- Insert supply order item with SAME timestamp (quantity = threshold)
        INSERT INTO SupplyOrderItem (Username, PublisherID, OrderDate, ISBN, Quantity)
        VALUES ('admin', NEW.PublisherID, order_time, NEW.ISBN, NEW.Threshold);
    END IF;
END;
