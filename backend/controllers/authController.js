const db = require('../config/db');

// Register Customer
exports.register = (req, res) => {
    const { username, password, firstName, lastName, email, phone, address } = req.body;

    // Basic validation
    if (!username || !password || !email) {
        return res.status(400).json({ message: 'Please provide required fields' });
    }

    // Check if user exists
    const checkSql = 'SELECT * FROM Customer WHERE Username = ? OR Email = ?';
    db.query(checkSql, [username, email], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0) {
            return res.status(400).json({ message: 'Username or Email already exists' });
        }

        // Create Shopping Cart first
        const cartSql = 'INSERT INTO ShoppingCart () VALUES ()';
        db.query(cartSql, (err, cartResult) => {
            if (err) return res.status(500).json({ error: err.message });

            const cartId = cartResult.insertId;

            // Insert Customer
            const sql = `INSERT INTO Customer 
        (Username, Password, FirstName, LastName, Email, Phone, ShippingStreet, ShippingCity, ShippingCountry, CartID) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            // Note: In production, password should be hashed (e.g., bcrypt). 
            // For this project, we store plain text as per implied simplicity or use simple hashing if requested.
            // We will store plain text for now to match the schema directly, but recommend hashing.

            const values = [
                username, password, firstName, lastName, email, phone,
                address?.street, address?.city, address?.country, cartId
            ];

            db.query(sql, values, (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                res.status(201).json({ message: 'User registered successfully' });
            });
        });
    });
};

// Login (Admin or Customer)
exports.login = (req, res) => {
    const { username, password, role } = req.body; // role: 'admin' or 'customer'

    if (!username || !password || !role) {
        return res.status(400).json({ message: 'Please provide username, password and role' });
    }

    let sql = '';
    if (role === 'admin') {
        sql = 'SELECT * FROM Admin WHERE Username = ? AND Password = ?';
    } else {
        sql = 'SELECT * FROM Customer WHERE Username = ? AND Password = ?';
    }

    db.query(sql, [username, password], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = results[0];
        // Remove password from response
        delete user.Password;

        res.json({
            message: 'Login successful',
            user: user,
            role: role
        });
    });
};

// Update Customer Profile
exports.updateProfile = (req, res) => {
    const { username } = req.params;
    const { firstName, lastName, phone, address } = req.body;

    const sql = `UPDATE Customer SET 
        FirstName = COALESCE(?, FirstName),
        LastName = COALESCE(?, LastName),
        Phone = COALESCE(?, Phone),
        ShippingStreet = COALESCE(?, ShippingStreet),
        ShippingCity = COALESCE(?, ShippingCity),
        ShippingCountry = COALESCE(?, ShippingCountry)
        WHERE Username = ?`;

    const values = [firstName, lastName, phone, address?.street, address?.city, address?.country, username];

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'Profile updated successfully' });
    });
};

// Get Customer Profile
exports.getProfile = (req, res) => {
    const { username } = req.params;
    const sql = 'SELECT Username, FirstName, LastName, Email, Phone, ShippingStreet, ShippingCity, ShippingCountry FROM Customer WHERE Username = ?';

    db.query(sql, [username], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'User not found' });
        res.json(results[0]);
    });
};
