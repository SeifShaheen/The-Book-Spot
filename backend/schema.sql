CREATE DATABASE IF NOT EXISTS book_store;
USE book_store;

-- Drop existing tables to ensure a clean slate (order matters due to FKs)
DROP TABLE IF EXISTS SupplyOrderItem;
DROP TABLE IF EXISTS SupplyOrder;
DROP TABLE IF EXISTS action;
DROP TABLE IF EXISTS OrderItem;
DROP TABLE IF EXISTS `Order`;
DROP TABLE IF EXISTS CartItem;
DROP TABLE IF EXISTS Customer;
DROP TABLE IF EXISTS Admin;
DROP TABLE IF EXISTS ShoppingCart;
DROP TABLE IF EXISTS BookAuthor;
DROP TABLE IF EXISTS Author;
DROP TABLE IF EXISTS Book;
DROP TABLE IF EXISTS PublisherAddress;
DROP TABLE IF EXISTS PublisherPhone;
DROP TABLE IF EXISTS Publisher;

-- 1. ShoppingCart Table (must be created before Admin and Customer)
CREATE TABLE ShoppingCart (
    CartID INT AUTO_INCREMENT PRIMARY KEY
);

-- 2. Admin Table
CREATE TABLE Admin (
    Username VARCHAR(50) PRIMARY KEY,
    Password VARCHAR(255) NOT NULL,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    Email VARCHAR(100) UNIQUE,
    ShippingStreet VARCHAR(255),
    ShippingBuildingNo VARCHAR(50),
    ShippingCity VARCHAR(100),
    ShippingRegion VARCHAR(100),
    ShippingPostalCode VARCHAR(20),
    ShippingCountry VARCHAR(100),
    CartID INT,
    FOREIGN KEY (CartID) REFERENCES ShoppingCart(CartID) ON DELETE SET NULL
);

-- 3. Publisher Table
CREATE TABLE Publisher (
    PublisherID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL
);

-- 4. PublisherPhone Table
CREATE TABLE PublisherPhone (
    PublisherID INT,
    PhoneNumber VARCHAR(20),
    PRIMARY KEY (PublisherID, PhoneNumber),
    FOREIGN KEY (PublisherID) REFERENCES Publisher(PublisherID) ON DELETE CASCADE
);

-- 5. PublisherAddress Table
CREATE TABLE PublisherAddress (
    AddressID INT AUTO_INCREMENT PRIMARY KEY,
    PublisherID INT NOT NULL,
    AddressLine1 VARCHAR(255) NOT NULL,
    AddressLine2 VARCHAR(255),
    City VARCHAR(100) NOT NULL,
    Region VARCHAR(100) NOT NULL,
    PostalCode VARCHAR(20) NOT NULL,
    Country VARCHAR(100) NOT NULL,
    FOREIGN KEY (PublisherID) REFERENCES Publisher(PublisherID) ON DELETE CASCADE
);

-- 6. Book Table
CREATE TABLE Book (
    ISBN VARCHAR(20) PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    Category ENUM('Science', 'Art', 'Religion', 'History', 'Geography') NOT NULL,
    Price DECIMAL(10, 2) NOT NULL,
    PublicationYear INT NOT NULL,
    StockQuantity INT NOT NULL,
    Threshold INT NOT NULL,
    PublisherID INT NOT NULL,
    FOREIGN KEY (PublisherID) REFERENCES Publisher(PublisherID) ON DELETE CASCADE
);

-- 7. Author Table
CREATE TABLE Author (
    AuthorID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL
);

-- 8. BookAuthor Table
CREATE TABLE BookAuthor (
    ISBN VARCHAR(20),
    AuthorID INT,
    PRIMARY KEY (ISBN, AuthorID),
    FOREIGN KEY (ISBN) REFERENCES Book(ISBN) ON DELETE CASCADE,
    FOREIGN KEY (AuthorID) REFERENCES Author(AuthorID) ON DELETE CASCADE
);

-- 9. Customer Table
CREATE TABLE Customer (
    Username VARCHAR(50) PRIMARY KEY,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    Email VARCHAR(100) UNIQUE,
    Phone VARCHAR(20),
    Password VARCHAR(255) NOT NULL,
    ShippingStreet VARCHAR(255),
    ShippingBuildingNo VARCHAR(50),
    ShippingCity VARCHAR(100),
    ShippingRegion VARCHAR(100),
    ShippingPostalCode VARCHAR(20),
    ShippingCountry VARCHAR(100),
    CartID INT,
    FOREIGN KEY (CartID) REFERENCES ShoppingCart(CartID) ON DELETE SET NULL
);

-- 10. CartItem Table
CREATE TABLE CartItem (
    CartID INT,
    ISBN VARCHAR(20),
    Quantity INT DEFAULT 1,
    PRIMARY KEY (CartID, ISBN),
    FOREIGN KEY (CartID) REFERENCES ShoppingCart(CartID) ON DELETE CASCADE,
    FOREIGN KEY (ISBN) REFERENCES Book(ISBN) ON DELETE CASCADE
);

-- 11. Order Table (Username can be either Customer or Admin)
CREATE TABLE `Order` (
    OrderID INT AUTO_INCREMENT PRIMARY KEY,
    OrderDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    Status ENUM('Pending', 'Confirmed', 'Cancelled') DEFAULT 'Pending',
    TotalPrice DECIMAL(10, 2),
    Username VARCHAR(50)
    -- Note: No FK on Username to allow orders from both Customer and Admin tables
);

-- 12. OrderItem Table
CREATE TABLE OrderItem (
    OrderID INT,
    ISBN VARCHAR(20),
    Quantity INT,
    PRIMARY KEY (OrderID, ISBN),
    FOREIGN KEY (OrderID) REFERENCES `Order`(OrderID) ON DELETE CASCADE,
    FOREIGN KEY (ISBN) REFERENCES Book(ISBN) ON DELETE CASCADE
);

-- 13. Action Table (Audit Log)
CREATE TABLE action (
    ActionID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50),
    ISBN VARCHAR(20),
    UpdateTimestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    Notes TEXT,
    FOREIGN KEY (Username) REFERENCES Admin(Username) ON DELETE SET NULL,
    FOREIGN KEY (ISBN) REFERENCES Book(ISBN) ON DELETE SET NULL
);

-- 14. SupplyOrder Table
CREATE TABLE SupplyOrder (
    Username VARCHAR(50),
    PublisherID INT,
    OrderDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    Status ENUM('Pending', 'Confirmed', 'Cancelled') DEFAULT 'Pending',
    TotalPrice DECIMAL(10, 2),
    DecisionBy VARCHAR(50),
    PRIMARY KEY (Username, PublisherID, OrderDate),
    FOREIGN KEY (Username) REFERENCES Admin(Username) ON DELETE CASCADE,
    FOREIGN KEY (PublisherID) REFERENCES Publisher(PublisherID) ON DELETE CASCADE
);

-- 15. SupplyOrderItem Table
CREATE TABLE SupplyOrderItem (
    Username VARCHAR(50),
    PublisherID INT,
    OrderDate DATETIME,
    ISBN VARCHAR(20),
    Quantity INT,
    PRIMARY KEY (Username, PublisherID, OrderDate, ISBN),
    FOREIGN KEY (Username, PublisherID, OrderDate) REFERENCES SupplyOrder(Username, PublisherID, OrderDate) ON DELETE CASCADE,
    FOREIGN KEY (ISBN) REFERENCES Book(ISBN) ON DELETE CASCADE
);
