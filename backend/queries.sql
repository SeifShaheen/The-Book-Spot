-- 1. Search for Books
-- By ISBN, Title, Category, Author, Publisher
SELECT b.*, a.Name as AuthorName, p.Name as PublisherName
FROM Book b
JOIN BookAuthor ba ON b.ISBN = ba.ISBN
JOIN Author a ON ba.AuthorID = a.AuthorID
JOIN Publisher p ON b.PublisherID = p.PublisherID
WHERE b.ISBN LIKE ? 
   OR b.Title LIKE ? 
   OR b.Category = ? 
   OR a.Name LIKE ? 
   OR p.Name LIKE ?;

-- 2. Top 5 Customers (Last 3 Months)
SELECT c.Username, c.FirstName, c.LastName, SUM(o.TotalPrice) as TotalSpent
FROM Customer c
JOIN `Order` o ON c.Username = o.Username
WHERE o.OrderDate >= DATE_SUB(NOW(), INTERVAL 3 MONTH)
GROUP BY c.Username
ORDER BY TotalSpent DESC
LIMIT 5;

-- 3. Top 10 Selling Books (Last 3 Months)
SELECT b.Title, SUM(oi.Quantity) as TotalSold
FROM Book b
JOIN OrderItem oi ON b.ISBN = oi.ISBN
JOIN `Order` o ON oi.OrderID = o.OrderID
WHERE o.OrderDate >= DATE_SUB(NOW(), INTERVAL 3 MONTH)
GROUP BY b.ISBN
ORDER BY TotalSold DESC
LIMIT 10;

-- 4. Total Sales (Previous Month)
SELECT SUM(TotalPrice) as MonthlySales
FROM `Order`
WHERE OrderDate >= DATE_SUB(DATE_FORMAT(NOW(), '%Y-%m-01'), INTERVAL 1 MONTH)
  AND OrderDate < DATE_FORMAT(NOW(), '%Y-%m-01');

-- 5. Total Sales (Specific Day)
SELECT SUM(TotalPrice) as DailySales
FROM `Order`
WHERE DATE(OrderDate) = ?;
