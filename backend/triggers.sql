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
    DECLARE pending_orders INT DEFAULT 0;
    DECLARE order_time DATETIME;
    DECLARE order_total DECIMAL(10, 2);
    
    -- Check if this book has been sold at least once
    SELECT COUNT(*) INTO books_sold
    FROM OrderItem
    WHERE ISBN = NEW.ISBN;
    
    -- Check if there's already a pending supply order for this book
    SELECT COUNT(*) INTO pending_orders
    FROM SupplyOrderItem soi
    JOIN SupplyOrder so ON soi.Username = so.Username 
                        AND soi.PublisherID = so.PublisherID 
                        AND soi.OrderDate = so.OrderDate
    WHERE soi.ISBN = NEW.ISBN AND so.Status = 'Pending';
    
    -- Create supply order if:
    -- 1. Stock is below threshold after update
    -- 2. Stock decreased (someone bought)
    -- 3. Book has been sold at least once
    -- 4. No pending supply order exists for this book
    IF NEW.StockQuantity < NEW.Threshold 
       AND NEW.StockQuantity < OLD.StockQuantity
       AND books_sold > 0 
       AND pending_orders = 0 THEN
        
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
