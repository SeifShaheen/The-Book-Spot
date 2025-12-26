const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const { searchDatabase } = require('./queries');

const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const cartRoutes = require('./routes/cart');
const adminRoutes = require('./routes/admin');
const orderRoutes = require('./routes/orders');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);

// Basic route to test server
app.get('/', (req, res) => {
    res.send('Backend server is running');
});

// Search endpoint
app.get('/search', (req, res) => {
    const searchTerm = req.query.q;
    if (!searchTerm) {
        return res.status(400).send('Search term is required');
    }

    searchDatabase(searchTerm, (err, results) => {
        if (err) {
            console.error('Error searching database:', err);
            return res.status(500).send('Error searching database');
        }
        res.json(results);
    });
});

// Test DB connection
db.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the MySQL database!');
        connection.release();
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
