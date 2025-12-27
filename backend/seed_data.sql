-- Seed Data for Bookstore System
-- Run this after schema.sql and triggers.sql

-- Publishers
INSERT INTO Publisher (Name) VALUES
('Penguin Random House'),
('HarperCollins'),
('Simon & Schuster'),
('Hachette Book Group'),
('Macmillan Publishers');

-- Publisher Phones
INSERT INTO PublisherPhone (PublisherID, PhoneNumber) VALUES
(1, '+1-212-782-9000'),
(2, '+1-212-207-7000'),
(3, '+1-212-698-7000'),
(4, '+1-212-364-1100'),
(5, '+1-646-307-5151');

-- Publisher Addresses
INSERT INTO PublisherAddress (PublisherID, AddressLine1, City, Region, PostalCode, Country) VALUES
(1, '1745 Broadway', 'New York', 'NY', '10019', 'USA'),
(2, '195 Broadway', 'New York', 'NY', '10007', 'USA'),
(3, '1230 Avenue of the Americas', 'New York', 'NY', '10020', 'USA'),
(4, '1290 Avenue of the Americas', 'New York', 'NY', '10104', 'USA'),
(5, '120 Broadway', 'New York', 'NY', '10271', 'USA');

-- Authors
INSERT INTO Author (Name) VALUES
('Stephen King'),
('J.K. Rowling'),
('Dan Brown'),
('Malcolm Gladwell'),
('Yuval Noah Harari'),
('Michelle Obama'),
('James Clear'),
('Carl Sagan'),
('Neil deGrasse Tyson'),
('Bill Bryson');

-- Books
INSERT INTO Book (ISBN, Title, Category, Price, PublicationYear, StockQuantity, Threshold, PublisherID) VALUES
('978-1501142970', 'The Outsider', 'History', 28.99, 2018, 50, 10, 3),
('978-0439708180', 'Harry Potter and the Sorcerer''s Stone', 'Art', 12.99, 1998, 100, 20, 1),
('978-0385504201', 'The Da Vinci Code', 'Religion', 17.00, 2003, 75, 15, 2),
('978-0316017930', 'Outliers', 'Science', 18.99, 2008, 60, 12, 4),
('978-0062316110', 'Sapiens: A Brief History of Humankind', 'History', 24.99, 2015, 80, 15, 2),
('978-1524763138', 'Becoming', 'History', 32.50, 2018, 90, 18, 1),
('978-0735211292', 'Atomic Habits', 'Science', 27.00, 2018, 120, 25, 5),
('978-0345539434', 'Cosmos', 'Science', 18.00, 2013, 45, 10, 1),
('978-0393355673', 'Astrophysics for People in a Hurry', 'Science', 18.95, 2017, 55, 12, 4),
('978-0767908184', 'A Short History of Nearly Everything', 'Geography', 18.00, 2004, 40, 8, 1);

-- BookAuthor (Many-to-Many)
INSERT INTO BookAuthor (ISBN, AuthorID) VALUES
('978-1501142970', 1),  -- The Outsider by Stephen King
('978-0439708180', 2),  -- Harry Potter by J.K. Rowling
('978-0385504201', 3),  -- The Da Vinci Code by Dan Brown
('978-0316017930', 4),  -- Outliers by Malcolm Gladwell
('978-0062316110', 5),  -- Sapiens by Yuval Noah Harari
('978-1524763138', 6),  -- Becoming by Michelle Obama
('978-0735211292', 7),  -- Atomic Habits by James Clear
('978-0345539434', 8),  -- Cosmos by Carl Sagan
('978-0393355673', 9),  -- Astrophysics for People in a Hurry by Neil deGrasse Tyson
('978-0767908184', 10); -- A Short History of Nearly Everything by Bill Bryson

-- Note: Sample Customer is created in init-db.js with hashed password

-- Sample Order (for testing reports)
INSERT INTO `Order` (OrderDate, Status, TotalPrice, Username) VALUES
(DATE_SUB(NOW(), INTERVAL 5 DAY), 'Confirmed', 45.98, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 10 DAY), 'Confirmed', 27.00, 'johndoe');

INSERT INTO OrderItem (OrderID, ISBN, Quantity) VALUES
(1, '978-0439708180', 2),
(1, '978-0316017930', 1),
(2, '978-0735211292', 1);
