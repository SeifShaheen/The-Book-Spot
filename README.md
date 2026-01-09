# 📚 The book Spot

A full-stack online bookstore application built with React and Node.js, featuring customer shopping, admin management, and comprehensive inventory control.

## ✨ Features

### Customer Features
- **User Authentication** - Registration and login with secure password hashing
- **Browse Books** - Search and filter books by category, author, and title
- **Shopping Cart** - Add, remove, and adjust book quantities
- **Checkout** - Complete orders with shipping address management
- **Order History** - View past orders and their status
- **User Profile** - Manage personal information and addresses

### Admin Features
- **Dashboard** - Overview of store statistics and recent activity
- **Book Management** - Add, edit, and delete books from inventory
- **Author Management** - Add and manage book authors
- **Publisher Management** - Add publishers with addresses and phone numbers
- **Admin User Management** - Create additional admin accounts
- **Reports** - View sales and inventory reports
- **Activity Logs** - Track admin actions and changes
- **Database Viewer** - Direct access to database tables

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **MySQL2** - Database driver
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Database
- **MySQL** - Relational database

## 📁 Project Structure

```
Book-Store/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route handlers
│   ├── routes/          # API route definitions
│   ├── schema.sql       # Database schema
│   ├── seed_data.sql    # Sample data
│   ├── triggers.sql     # Database triggers
│   ├── views.sql        # Database views
│   ├── constraints.sql  # Database constraints
│   ├── server.js        # Express server entry point
│   └── init-db.js       # Database initialization script
├── frontend/
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── pages/       # React page components
│   │   ├── services/    # API service functions
│   │   └── App.jsx      # Main application component
│   └── index.html       # HTML entry point
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MySQL Server
- npm or yarn

### Database Setup

1. Start your MySQL server

2. Create the database and tables:
   ```bash
   cd backend
   npm run db:init
   ```

   This will execute `schema.sql` to create all tables and `seed_data.sql` to populate sample data.

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables by creating a `.env` file:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=book_store
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

   The server will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The application will open on `http://localhost:5173`

## 📊 Database Schema

The database includes the following main entities:

| Table | Description |
|-------|-------------|
| `Customer` | Registered customers with shipping addresses |
| `Admin` | Administrator accounts |
| `Book` | Book inventory with ISBN, title, category, price |
| `Author` | Book authors |
| `BookAuthor` | Many-to-many relationship between books and authors |
| `Publisher` | Publishing companies |
| `PublisherAddress` | Publisher addresses |
| `PublisherPhone` | Publisher contact numbers |
| `ShoppingCart` | Shopping carts for users |
| `CartItem` | Items in shopping carts |
| `Order` | Customer orders |
| `OrderItem` | Items in orders |
| `SupplyOrder` | Orders placed to publishers |
| `SupplyOrderItem` | Items in supply orders |
| `action` | Audit log for admin actions |

### Book Categories
- Science
- Art
- Religion
- History
- Geography

## 🔧 Available Scripts

### Backend
| Command | Description |
|---------|-------------|
| `npm start` | Start the server |
| `npm run dev` | Start with hot reload (nodemon) |
| `npm run db:init` | Initialize database with schema and seed data |
| `npm test` | Run tests with coverage |

### Frontend
| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 📄 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new customer
- `POST /api/auth/login` - Login user

### Books
- `GET /api/books` - Get all books
- `GET /api/books/:isbn` - Get book by ISBN
- `POST /api/books` - Add new book (Admin)
- `PUT /api/books/:isbn` - Update book (Admin)
- `DELETE /api/books/:isbn` - Delete book (Admin)

### Cart
- `GET /api/cart/:username` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `DELETE /api/cart/remove` - Remove item from cart

### Orders
- `GET /api/orders/:username` - Get user's orders
- `POST /api/orders` - Create new order

## 👥 Default Users

After running seed data, you can use these accounts:

### Admin Account
- **Username:** `admin`
- **Password:** `admin123`

### Customer Accounts
- **Username:** `johndoe` | **Password:** `password123`
- **Username:** `janedoe` | **Password:** `password123`
