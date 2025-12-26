-- Constraints for Bookstore Database
-- Note: Some constraints are already defined in schema.sql (ENUMs, NOT NULL, FKs)
-- This file contains additional CHECK constraints

-- Ensure Book price is positive
ALTER TABLE Book ADD CONSTRAINT chk_book_price CHECK (Price > 0);

-- Ensure Stock and Threshold are non-negative
ALTER TABLE Book ADD CONSTRAINT chk_book_stock CHECK (StockQuantity >= 0);
ALTER TABLE Book ADD CONSTRAINT chk_book_threshold CHECK (Threshold >= 0);

-- Ensure Publication Year is reasonable
ALTER TABLE Book ADD CONSTRAINT chk_book_year CHECK (PublicationYear >= 1000 AND PublicationYear <= 2100);

-- Ensure Order Total is non-negative
ALTER TABLE `Order` ADD CONSTRAINT chk_order_total CHECK (TotalPrice >= 0);

-- Ensure CartItem quantity is positive
ALTER TABLE CartItem ADD CONSTRAINT chk_cart_quantity CHECK (Quantity > 0);

-- Ensure OrderItem quantity is positive
ALTER TABLE OrderItem ADD CONSTRAINT chk_orderitem_quantity CHECK (Quantity > 0);

-- Ensure SupplyOrderItem quantity is positive
ALTER TABLE SupplyOrderItem ADD CONSTRAINT chk_supplyitem_quantity CHECK (Quantity > 0);
