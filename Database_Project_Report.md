# Bookstore Management System
## Database Project Report

---

## Table of Contents
1. [Implemented Features](#1-implemented-features)
2. [ERD Diagram](#2-erd-diagram)
3. [Relational Schema](#3-relational-schema)
4. [User Interface Screens Description](#4-user-interface-screens-description)

---

## 1. Implemented Features

### 1.1 User Management
- **Customer Registration**: New customers can register with username, password, email, phone, and shipping address details
- **Admin Registration**: The primary admin can create additional admin accounts
- **Dual-Role Login System**: Supports both customer and admin login with role-based access control
- **Profile Management**: Users can view and update their personal information and shipping address

### 1.2 Book Catalog Management
- **Book Browsing**: Display all available books with search and filter capabilities
- **Search Functionality**: Search books by title, ISBN, or author name
- **Category Filtering**: Filter books by categories (Science, Art, Religion, History, Geography)
- **Book Details View**: Detailed view showing ISBN, title, authors, publisher, category, price, and stock availability
- **Stock Status Indicators**: Visual badges showing "In Stock", "Low Stock", or "Out of Stock" status

### 1.3 Shopping Cart System
- **Add to Cart**: Customers can add books with specified quantities
- **View Cart**: Display all cart items with prices and quantities
- **Update Quantity**: Increase or decrease item quantities using +/- controls
- **Remove Items**: Remove individual items or all items from cart
- **Cart Persistence**: Cart data is tied to user accounts

### 1.4 Order Processing
- **Checkout Process**: Secure checkout with address selection and payment validation
- **Address Management**: Use saved address or enter new shipping address
- **Credit Card Validation**: Luhn algorithm for credit card number validation
- **Expiry Date Validation**: Validates card expiration dates
- **Order History**: Customers can view their past orders with status tracking
- **Order Status Tracking**: Orders have status states: Pending, Confirmed, Cancelled

### 1.5 Admin Dashboard Features
- **Quick Actions Menu**: Links to add books, authors, publishers, and admins
- **Low Stock Alerts**: Real-time alerts for books below reorder threshold
- **Supply Order Management**: View and manage pending supply orders
- **Confirm/Cancel Supply Orders**: Admins can approve or reject restock orders

### 1.6 Book Management (Admin)
- **Add New Books**: Create new book entries with publisher and author associations
- **Edit Books**: Modify book details including price, stock, threshold, and category
- **Author Management**: Add new authors to the system
- **Publisher Management**: Add publishers with contact information and addresses

### 1.7 Reporting System
- **Monthly Sales Report**: Total sales in the last 30 days
- **Sales on Date**: Query sales for a specific date
- **Top 5 Customers**: Customers ranked by total spending (last 3 months)
- **Top 10 Best-Selling Books**: Books ranked by sales volume (last 3 months)
- **Book Reorder Statistics**: Count of reorder events per book
- **Low Stock Report**: List of all books below threshold

### 1.8 Audit and Logging
- **Action Log**: Tracks admin actions with timestamps and notes
- **Reorder Decision Log**: Records supply order confirmations/cancellations
- **Decision Attribution**: Tracks which admin made each decision

### 1.9 Database Integrity Features
- **Triggers**:
  - Prevent negative stock quantities
  - Auto-generate supply orders when stock falls below threshold
- **Constraints**:
  - Positive price validation
  - Non-negative stock and threshold values
  - Valid publication year range (1000-2100)
  - Positive quantities for cart and order items
- **Views**:
  - Book details with publisher and author information
  - Low stock books view
  - Order summary with customer information
  - Sales by date aggregation
  - Book reorder count statistics
  - Customer order statistics

---

## 2. ERD Diagram

```
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│                              BOOKSTORE SYSTEM - ENTITY RELATIONSHIP DIAGRAM                   │
└──────────────────────────────────────────────────────────────────────────────────────────────┘

    ┌─────────────────┐                              ┌─────────────────┐
    │  ShoppingCart   │                              │    Publisher    │
    ├─────────────────┤                              ├─────────────────┤
    │ PK: CartID      │                              │ PK: PublisherID │
    └────────┬────────┘                              │    Name         │
             │                                       └────────┬────────┘
             │ 1                                              │ 1
             │                                                │
    ┌────────┴────────┐                              ┌────────┴────────┐
    │                 │                              │                 │
    ▼ 0..1            ▼ 0..1                         ▼ *               ▼ *
┌─────────┐      ┌──────────┐                ┌──────────────────┐  ┌──────────────────┐
│  Admin  │      │ Customer │                │ PublisherPhone   │  │ PublisherAddress │
├─────────┤      ├──────────┤                ├──────────────────┤  ├──────────────────┤
│PK:Uname │      │PK:Uname  │                │PK: PublisherID   │  │PK: AddressID     │
│Password │      │Password  │                │PK: PhoneNumber   │  │FK: PublisherID   │
│FirstName│      │FirstName │                └──────────────────┘  │AddressLine1      │
│LastName │      │LastName  │                                      │AddressLine2      │
│Email    │      │Email     │                                      │City, Region      │
│Shipping │      │Phone     │                                      │PostalCode,Country│
│Address  │      │Shipping  │                                      └──────────────────┘
│FK:CartID│      │Address   │
└────┬────┘      │FK:CartID │                         │
     │           └────┬─────┘                         │ 1
     │                │                               │
     │ 1              │ 1                             ▼ *
     │                │                        ┌──────────────┐
     │                │                        │    Book      │
     ▼ *              ▼ *                      ├──────────────┤
┌─────────────┐  ┌─────────────┐               │ PK: ISBN     │
│   action    │  │   Order     │               │ Title        │
├─────────────┤  ├─────────────┤               │ Category     │
│PK: ActionID │  │PK: OrderID  │               │ Price        │
│FK: Username │  │ OrderDate   │               │ Pub.Year     │
│FK: ISBN     │  │ Status      │               │ StockQty     │
│ Timestamp   │  │ TotalPrice  │               │ Threshold    │
│ Notes       │  │ Username    │               │FK:PublisherID│
└─────────────┘  └──────┬──────┘               └──────┬───────┘
                        │ 1                          │
                        │                     ┌──────┴───────┐
                        ▼ *                   │              │
                  ┌───────────┐               ▼ *            ▼ *
                  │ OrderItem │         ┌──────────┐   ┌───────────┐
                  ├───────────┤         │CartItem  │   │BookAuthor │
                  │PK:OrderID │         ├──────────┤   ├───────────┤
                  │PK: ISBN   │         │PK:CartID │   │PK: ISBN   │
                  │ Quantity  │         │PK: ISBN  │   │PK:AuthorID│
                  └───────────┘         │ Quantity │   └─────┬─────┘
                                        └──────────┘         │
                                                             │
    ┌───────────────────────────────────────────┐            │
    │              SupplyOrder                  │            ▼ *
    ├───────────────────────────────────────────┤      ┌──────────┐
    │ PK: Username + PublisherID + OrderDate    │      │  Author  │
    │ FK: Username (Admin)                      │      ├──────────┤
    │ FK: PublisherID                           │      │PK:AuthID │
    │ Status, TotalPrice, DecisionBy            │      │  Name    │
    └─────────────────────┬─────────────────────┘      └──────────┘
                          │ 1
                          │
                          ▼ *
              ┌────────────────────────┐
              │   SupplyOrderItem      │
              ├────────────────────────┤
              │ PK: Username           │
              │ PK: PublisherID        │
              │ PK: OrderDate          │
              │ PK: ISBN               │
              │ Quantity               │
              └────────────────────────┘

LEGEND:
─────────────────────────────────────────
PK = Primary Key    FK = Foreign Key
1 = One             * = Many
0..1 = Zero or One  ───► = Relationship
```

### Entity Relationships Summary:

| Relationship | Type | Description |
|-------------|------|-------------|
| ShoppingCart → Admin | 1:0..1 | Each admin has at most one cart |
| ShoppingCart → Customer | 1:0..1 | Each customer has at most one cart |
| ShoppingCart → CartItem | 1:* | A cart contains multiple items |
| Publisher → Book | 1:* | A publisher publishes many books |
| Publisher → PublisherPhone | 1:* | A publisher has multiple phones |
| Publisher → PublisherAddress | 1:* | A publisher has multiple addresses |
| Book → BookAuthor | 1:* | A book has multiple authors |
| Author → BookAuthor | 1:* | An author writes multiple books |
| Book → CartItem | 1:* | A book can be in multiple carts |
| Book → OrderItem | 1:* | A book can be in multiple orders |
| Order → OrderItem | 1:* | An order contains multiple items |
| Admin → action | 1:* | An admin performs multiple actions |
| Admin → SupplyOrder | 1:* | An admin creates supply orders |
| Publisher → SupplyOrder | 1:* | Orders placed with publishers |
| SupplyOrder → SupplyOrderItem | 1:* | A supply order has multiple items |

---

## 3. Relational Schema

### Primary Tables

```sql
ShoppingCart (
    CartID: INT [PK, AUTO_INCREMENT]
)

Admin (
    Username: VARCHAR(50) [PK],
    Password: VARCHAR(255) [NOT NULL],
    FirstName: VARCHAR(50),
    LastName: VARCHAR(50),
    Email: VARCHAR(100) [UNIQUE],
    ShippingStreet: VARCHAR(255),
    ShippingBuildingNo: VARCHAR(50),
    ShippingCity: VARCHAR(100),
    ShippingRegion: VARCHAR(100),
    ShippingPostalCode: VARCHAR(20),
    ShippingCountry: VARCHAR(100),
    CartID: INT [FK → ShoppingCart(CartID)]
)

Customer (
    Username: VARCHAR(50) [PK],
    FirstName: VARCHAR(50),
    LastName: VARCHAR(50),
    Email: VARCHAR(100) [UNIQUE],
    Phone: VARCHAR(20),
    Password: VARCHAR(255) [NOT NULL],
    ShippingStreet: VARCHAR(255),
    ShippingBuildingNo: VARCHAR(50),
    ShippingCity: VARCHAR(100),
    ShippingRegion: VARCHAR(100),
    ShippingPostalCode: VARCHAR(20),
    ShippingCountry: VARCHAR(100),
    CartID: INT [FK → ShoppingCart(CartID)]
)

Publisher (
    PublisherID: INT [PK, AUTO_INCREMENT],
    Name: VARCHAR(100) [NOT NULL]
)

PublisherPhone (
    PublisherID: INT [PK, FK → Publisher(PublisherID)],
    PhoneNumber: VARCHAR(20) [PK]
)

PublisherAddress (
    AddressID: INT [PK, AUTO_INCREMENT],
    PublisherID: INT [NOT NULL, FK → Publisher(PublisherID)],
    AddressLine1: VARCHAR(255) [NOT NULL],
    AddressLine2: VARCHAR(255),
    City: VARCHAR(100) [NOT NULL],
    Region: VARCHAR(100) [NOT NULL],
    PostalCode: VARCHAR(20) [NOT NULL],
    Country: VARCHAR(100) [NOT NULL]
)

Book (
    ISBN: VARCHAR(20) [PK],
    Title: VARCHAR(255) [NOT NULL],
    Category: ENUM('Science', 'Art', 'Religion', 'History', 'Geography') [NOT NULL],
    Price: DECIMAL(10,2) [NOT NULL, CHECK > 0],
    PublicationYear: INT [NOT NULL, CHECK 1000-2100],
    StockQuantity: INT [NOT NULL, CHECK >= 0],
    Threshold: INT [NOT NULL, CHECK >= 0],
    PublisherID: INT [NOT NULL, FK → Publisher(PublisherID)]
)

Author (
    AuthorID: INT [PK, AUTO_INCREMENT],
    Name: VARCHAR(100) [NOT NULL]
)

BookAuthor (
    ISBN: VARCHAR(20) [PK, FK → Book(ISBN)],
    AuthorID: INT [PK, FK → Author(AuthorID)]
)

CartItem (
    CartID: INT [PK, FK → ShoppingCart(CartID)],
    ISBN: VARCHAR(20) [PK, FK → Book(ISBN)],
    Quantity: INT [DEFAULT 1, CHECK > 0]
)

Order (
    OrderID: INT [PK, AUTO_INCREMENT],
    OrderDate: DATETIME [DEFAULT CURRENT_TIMESTAMP],
    Status: ENUM('Pending', 'Confirmed', 'Cancelled') [DEFAULT 'Pending'],
    TotalPrice: DECIMAL(10,2) [CHECK >= 0],
    Username: VARCHAR(50)
)

OrderItem (
    OrderID: INT [PK, FK → Order(OrderID)],
    ISBN: VARCHAR(20) [PK, FK → Book(ISBN)],
    Quantity: INT [CHECK > 0]
)

action (
    ActionID: INT [PK, AUTO_INCREMENT],
    Username: VARCHAR(50) [FK → Admin(Username)],
    ISBN: VARCHAR(20) [FK → Book(ISBN)],
    UpdateTimestamp: DATETIME [DEFAULT CURRENT_TIMESTAMP],
    Notes: TEXT
)

SupplyOrder (
    Username: VARCHAR(50) [PK, FK → Admin(Username)],
    PublisherID: INT [PK, FK → Publisher(PublisherID)],
    OrderDate: DATETIME [PK, DEFAULT CURRENT_TIMESTAMP],
    Status: ENUM('Pending', 'Confirmed', 'Cancelled') [DEFAULT 'Pending'],
    TotalPrice: DECIMAL(10,2),
    DecisionBy: VARCHAR(50)
)

SupplyOrderItem (
    Username: VARCHAR(50) [PK, FK → SupplyOrder],
    PublisherID: INT [PK, FK → SupplyOrder],
    OrderDate: DATETIME [PK, FK → SupplyOrder],
    ISBN: VARCHAR(20) [PK, FK → Book(ISBN)],
    Quantity: INT [CHECK > 0]
)
```

### Database Views

| View Name | Purpose |
|-----------|---------|
| vw_BookDetails | Books with publisher and author names (JOIN aggregation) |
| vw_LowStockBooks | Books where StockQuantity < Threshold |
| vw_OrderSummary | Order details with customer information |
| vw_SalesByDate | Daily sales aggregation (confirmed orders only) |
| vw_BookReorderCount | Count of supply orders per book |
| vw_CustomerStats | Customer order statistics and total spending |

### Triggers

| Trigger Name | Event | Purpose |
|-------------|-------|---------|
| PreventNegativeStock | BEFORE UPDATE on Book | Prevents stock from going below zero |
| AutoSupplyOrder | AFTER UPDATE on Book | Auto-creates supply order when stock < threshold |

---

## 4. User Interface Screens Description

### 4.1 Home Page
**Purpose**: Landing page that welcomes users and showcases featured books.

**Logic**:
- Displays a hero section with welcome message and "Browse Collection" call-to-action
- Fetches and displays "Best Sellers" section with top-selling books
- Shows "You Might Also Like" section with randomly selected book recommendations
- Each book card displays: title, author, category, price, and stock status badge
- Clicking "View Details" navigates to the book details page

---

### 4.2 Login Page
**Purpose**: Authentication gateway for both customers and administrators.

**Logic**:
- Provides a role toggle switch to select between "Customer" and "Admin" roles
- Validates that both username and password fields are filled
- Submits credentials to the backend authentication endpoint
- On successful login:
  - Stores user session in local storage
  - Redirects admins to `/admin` dashboard
  - Redirects customers to home page
- Displays error toast on failed login attempts
- Provides link to registration page for new customers

---

### 4.3 Registration Page
**Purpose**: New customer account creation with comprehensive profile information.

**Logic**:
- Collects user information: username, password, email, phone
- Collects shipping address: street, building number, city, region, postal code, country
- Client-side validation for:
  - Required fields completion
  - Email format validation
  - Phone number format validation
  - Password confirmation match
- Form inputs include real-time validation feedback
- Password visibility toggle for convenience
- On successful registration, redirects to login page
- Displays appropriate error messages for validation failures

---

### 4.4 Browse Books (BookList) Page
**Purpose**: Main catalog browsing interface with search and filtering capabilities.

**Logic**:
- Loads all available books on initial page load
- Provides search functionality:
  - Searches by book title, ISBN, or author name
  - Search is triggered on form submission
- Category filter dropdown with options: All, Science, Art, Religion, History, Geography
  - Automatically fetches filtered results when category changes
- Displays books in a responsive grid layout
- Each book card shows:
  - Title, author, category
  - Price (formatted to 2 decimal places)
  - Stock status badge (In Stock/Low Stock/Out of Stock)
  - "View Details" button
  - "Edit" button (visible only to admins)
- Empty state message when no books match search criteria

---

### 4.5 Book Details Page
**Purpose**: Detailed view of a single book with add-to-cart functionality.

**Logic**:
- Fetches book details by ISBN from URL parameter
- Displays comprehensive book information:
  - Title, ISBN, Publisher, Authors, Category, Price, Stock Quantity
- Quantity selector input (minimum 1, maximum = available stock)
- "Add to Cart" button:
  - Prompts login if user is not authenticated
  - Sends add-to-cart request with username, ISBN, quantity, and role
  - Shows success/error toast messages
  - Button disabled when out of stock

---

### 4.6 Shopping Cart Page
**Purpose**: View and manage items in the shopping cart before checkout.

**Logic**:
- Requires user authentication (shows message if not logged in)
- Fetches cart items tied to the user's account
- Displays cart as a table with columns: Title, Author(s), Price, Quantity, Total, Action
- Quantity controls:
  - Plus (+) button increases quantity
  - Minus (−) button decreases quantity
  - Validates against available stock
- "Remove All" button removes the entire item from cart
- Shows grand total at the bottom
- "Proceed to Checkout" button navigates to checkout page
- Empty cart state displays appropriate message

---

### 4.7 Checkout Page
**Purpose**: Complete purchase with address confirmation and payment processing.

**Logic**:
- Fetches user's saved shipping address from profile
- Address Selection Options:
  - Use saved address (displays current address details)
  - Enter new address (shows address input form)
  - Option to save new address to profile
- New address validation for required fields
- Credit Card Payment Form:
  - Card number input with automatic formatting (XXXX XXXX XXXX XXXX)
  - Luhn algorithm validation for card number
  - Expiry date input with MM/YY formatting
  - Expiry date validation (must be in future)
  - CVV input (3 digits)
- Checkout process:
  - Validates all inputs before submission
  - Creates order and order items
  - Clears the shopping cart
  - Deducts stock quantities
  - Displays success message and redirects to order history

---

### 4.8 Order History Page
**Purpose**: View past orders and their current status.

**Logic**:
- Requires user authentication
- Fetches all orders associated with the logged-in user
- Displays orders in a table format:
  - Order ID, Date, Number of Items, Total Price, Status
- Status values: Pending, Confirmed, Cancelled
- Empty state when no orders exist
- Date formatting for readability

---

### 4.9 Profile Page
**Purpose**: View and edit user profile and shipping information.

**Logic**:
- Fetches current user profile data on load
- Displays profile form with:
  - Personal info: First Name, Last Name, Email, Phone
  - Shipping Address: Street, Building No, City, Region, Postal Code, Country
- Field validation:
  - Email format validation
  - Phone number validation
  - Required fields check
- Form submission updates profile via API
- Success/error toast notifications
- Current password required for sensitive changes (optional)

---

### 4.10 Admin Dashboard Page
**Purpose**: Central administrative control panel for store management.

**Logic**:
- Quick Action Links:
  - Add New Book → `/admin/add-book`
  - Add Author → `/admin/add-author`
  - Add Publisher → `/admin/add-publisher`
  - Add Admin → `/admin/add-admin` (visible only to primary admin)
  - View Reports → `/admin/reports`
  - View Logs → `/admin/logs`
  - Database → `/admin/database`
- Low Stock Alert Banner:
  - Fetches books below threshold
  - Displays count and first 3 low-stock book names
- Pending Supply Orders Section:
  - Fetches supply orders with "Pending" status
  - Table columns: Publisher, Date, Items, Status, Actions
  - Confirm button: Approves supply order, updates stock
  - Cancel button: Rejects supply order
  - Records which admin made the decision

---

### 4.11 Add Book Page (Admin)
**Purpose**: Create new book entries in the catalog.

**Logic**:
- Form fields:
  - ISBN (required, unique identifier)
  - Title (required)
  - Category dropdown (Science, Art, Religion, History, Geography)
  - Price (required, must be positive)
  - Publication Year (required, 1000-2100)
  - Stock Quantity (required, non-negative)
  - Reorder Threshold (required, non-negative)
  - Publisher selection (searchable dropdown)
  - Author selection (multi-select with search)
- Validation before submission
- Creates book record and BookAuthor associations
- Logs action in audit trail
- Success/error notifications

---

### 4.12 Edit Book Page (Admin)
**Purpose**: Modify existing book details.

**Logic**:
- Fetches current book data by ISBN from URL parameter
- Pre-fills form with existing values
- Allows modification of:
  - Title, Category, Price
  - Publication Year, Stock Quantity, Threshold
  - Publisher, Authors
- ISBN is read-only (primary key)
- Validates all changes
- Updates book record in database
- Logs modification action
- Back link to book list

---

### 4.13 Admin Reports Page
**Purpose**: Business analytics and key performance indicators.

**Logic**:
- Monthly Sales Card:
  - Displays total confirmed sales from last 30 days
- Sales by Date Card:
  - Date picker input
  - Search button fetches sales for selected date
  - Shows order count and total sales
- Top 5 Customers Card:
  - Lists customers by total spending (last 3 months)
  - Shows name and amount spent
- Top 10 Books Card:
  - Lists best-selling books by quantity (last 3 months)
  - Shows title and units sold
- Book Reorder Count Card:
  - Shows books by number of supply orders triggered
- Low Stock Alert Card:
  - Lists all books below threshold
  - Shows current stock and threshold values

---

### 4.14 Admin Logs Page
**Purpose**: Audit trail and activity monitoring.

**Logic**:
- Tab-based navigation between two views:
  1. **Reorder Decisions Tab**:
     - Shows supply order history
     - Columns: Date, Book, Quantity, Publisher, Status, Decision By
     - Status badges for Confirmed/Pending
  2. **Action Log Tab**:
     - Shows admin actions (book edits, additions)
     - Columns: ID, Timestamp, Admin Username, Book, Notes
- Back link to dashboard
- Timestamps formatted for readability
- Empty state messages when no data

---

### 4.15 Add Publisher Page (Admin)
**Purpose**: Register new publishers with contact information.

**Logic**:
- Form fields:
  - Publisher Name (required)
  - Phone Numbers (dynamic add/remove)
  - Address fields: AddressLine1, AddressLine2, City, Region, PostalCode, Country
- Allows multiple phone numbers and addresses
- Validation for required fields
- Creates Publisher, PublisherPhone, and PublisherAddress records
- Success notification with option to add another

---

### 4.16 Add Author Page (Admin)
**Purpose**: Add new authors to the system.

**Logic**:
- Simple form with Author Name field
- Validates name is not empty
- Creates Author record
- Can be used when adding new books
- Success/error notifications

---

### 4.17 Add Admin Page (Primary Admin Only)
**Purpose**: Create additional administrator accounts.

**Logic**:
- Visible only to primary admin (username = 'admin')
- Form fields similar to customer registration:
  - Username, Password, Confirm Password
  - First Name, Last Name, Email
  - Shipping Address (optional)
- Password visibility toggle
- Validation for all required fields
- Creates Admin and ShoppingCart records
- Success notification on creation

---

## Technology Stack

### Backend
- **Runtime**: Node.js with Express.js framework
- **Database**: MySQL with mysql2 driver
- **Authentication**: Session-based with role differentiation

### Frontend
- **Framework**: React.js with React Router
- **State Management**: React Context API (AuthContext, ToastContext)
- **HTTP Client**: Axios
- **Styling**: Custom CSS with component-specific stylesheets

---

*End of Report*
