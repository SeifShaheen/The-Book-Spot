-- Useful Views for Bookstore System

-- View: Books with Publisher and Author names
CREATE OR REPLACE VIEW vw_BookDetails AS
SELECT 
    b.ISBN, b.Title, b.Category, b.Price, b.PublicationYear, 
    b.StockQuantity, b.Threshold, 
    p.Name AS PublisherName, p.PublisherID,
    GROUP_CONCAT(a.Name SEPARATOR ', ') AS Authors
FROM Book b
LEFT JOIN Publisher p ON b.PublisherID = p.PublisherID
LEFT JOIN BookAuthor ba ON b.ISBN = ba.ISBN
LEFT JOIN Author a ON ba.AuthorID = a.AuthorID
GROUP BY b.ISBN;

-- View: Low Stock Books (Below Threshold)
CREATE OR REPLACE VIEW vw_LowStockBooks AS
SELECT ISBN, Title, StockQuantity, Threshold, (Threshold - StockQuantity) AS BelowBy
FROM Book
WHERE StockQuantity < Threshold;

-- View: Order Summary with Customer Info
CREATE OR REPLACE VIEW vw_OrderSummary AS
SELECT 
    o.OrderID, o.OrderDate, o.Status, o.TotalPrice,
    c.Username, c.FirstName, c.LastName, c.Email,
    COUNT(oi.ISBN) AS ItemCount
FROM `Order` o
JOIN Customer c ON o.Username = c.Username
LEFT JOIN OrderItem oi ON o.OrderID = oi.OrderID
GROUP BY o.OrderID;

-- View: Sales by Date
CREATE OR REPLACE VIEW vw_SalesByDate AS
SELECT 
    DATE(OrderDate) AS SaleDate,
    COUNT(OrderID) AS OrderCount,
    SUM(TotalPrice) AS TotalSales
FROM `Order`
WHERE Status = 'Confirmed'
GROUP BY DATE(OrderDate)
ORDER BY SaleDate DESC;

-- View: Book Reorder Count (How many times a book triggered a supply order)
CREATE OR REPLACE VIEW vw_BookReorderCount AS
SELECT 
    b.ISBN, b.Title,
    COUNT(soi.ISBN) AS ReorderCount
FROM Book b
LEFT JOIN SupplyOrderItem soi ON b.ISBN = soi.ISBN
GROUP BY b.ISBN
ORDER BY ReorderCount DESC;

-- View: Customer Order Stats
CREATE OR REPLACE VIEW vw_CustomerStats AS
SELECT 
    c.Username, c.FirstName, c.LastName,
    COUNT(o.OrderID) AS OrderCount,
    COALESCE(SUM(o.TotalPrice), 0) AS TotalSpent
FROM Customer c
LEFT JOIN `Order` o ON c.Username = o.Username AND o.Status = 'Confirmed'
GROUP BY c.Username
ORDER BY TotalSpent DESC;
