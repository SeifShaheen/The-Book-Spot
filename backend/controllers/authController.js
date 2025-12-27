const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Register Customer
exports.register = (req, res) => {
    const { username, password, firstName, lastName, email, phone, address } = req.body;

    // Basic validation
    if (!username || !password || !email) {
        return res.status(400).json({ message: 'Please provide required fields (username, password, email)' });
    }

    // First name and last name are required
    if (!firstName || firstName.trim().length < 2) {
        return res.status(400).json({ message: 'First name is required (min 2 characters)' });
    }

    if (!lastName || lastName.trim().length < 2) {
        return res.status(400).json({ message: 'Last name is required (min 2 characters)' });
    }

    // Address validation - all required except building number
    if (!address || !address.street || !address.city || !address.region || !address.postalCode || !address.country) {
        return res.status(400).json({ message: 'All address fields are required (street, city, region, postal code, country)' });
    }

    // Postal code validation (5 digits only)
    if (!/^\d{5}$/.test(address.postalCode)) {
        return res.status(400).json({ message: 'Postal code must be exactly 5 digits' });
    }

    // Phone validation (11 digits only, if provided)
    if (phone && !/^\d{11}$/.test(phone)) {
        return res.status(400).json({ message: 'Phone number must be exactly 11 digits' });
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
        db.query(cartSql, async (err, cartResult) => {
            if (err) return res.status(500).json({ error: err.message });

            const cartId = cartResult.insertId;

            // Hash password before storing
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert Customer with all address fields
            const sql = `INSERT INTO Customer 
        (Username, Password, FirstName, LastName, Email, Phone, ShippingStreet, ShippingBuildingNo, ShippingCity, ShippingRegion, ShippingPostalCode, ShippingCountry, CartID) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            const values = [
                username, hashedPassword, firstName, lastName, email, phone,
                address?.street, address?.buildingNo, address?.city, address?.region, address?.postalCode, address?.country, cartId
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
        sql = 'SELECT * FROM Admin WHERE Username = ?';
    } else {
        sql = 'SELECT * FROM Customer WHERE Username = ?';
    }

    db.query(sql, [username], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = results[0];

        // Compare password with hashed password
        const isMatch = await bcrypt.compare(password, user.Password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

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

    // Validation
    if (!firstName || firstName.trim().length < 2) {
        return res.status(400).json({ message: 'First name is required (min 2 characters)' });
    }
    if (!lastName || lastName.trim().length < 2) {
        return res.status(400).json({ message: 'Last name is required (min 2 characters)' });
    }
    if (phone && !/^\d{11}$/.test(phone)) {
        return res.status(400).json({ message: 'Phone number must be exactly 11 digits' });
    }
    if (!address || !address.street || !address.city || !address.region || !address.postalCode || !address.country) {
        return res.status(400).json({ message: 'All address fields are required (street, city, region, postal code, country)' });
    }
    if (!/^\d{5}$/.test(address.postalCode)) {
        return res.status(400).json({ message: 'Postal code must be exactly 5 digits' });
    }

    const sql = `UPDATE Customer SET 
        FirstName = ?,
        LastName = ?,
        Phone = ?,
        ShippingStreet = ?,
        ShippingBuildingNo = ?,
        ShippingCity = ?,
        ShippingRegion = ?,
        ShippingPostalCode = ?,
        ShippingCountry = ?
        WHERE Username = ?`;

    const values = [firstName, lastName, phone || null, address.street, address.buildingNo || null,
        address.city, address.region, address.postalCode, address.country, username];

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'Profile updated successfully' });
    });
};

// Get Customer Profile
exports.getProfile = (req, res) => {
    const { username } = req.params;
    const sql = `SELECT Username, FirstName, LastName, Email, Phone, 
                 ShippingStreet, ShippingBuildingNo, ShippingCity, ShippingRegion, 
                 ShippingPostalCode, ShippingCountry 
                 FROM Customer WHERE Username = ?`;

    db.query(sql, [username], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'User not found' });
        res.json(results[0]);
    });
};

// Get Admin Profile
exports.getAdminProfile = (req, res) => {
    const { username } = req.params;
    const sql = `SELECT Username, FirstName, LastName, Email, 
                 ShippingStreet, ShippingBuildingNo, ShippingCity, ShippingRegion, 
                 ShippingPostalCode, ShippingCountry 
                 FROM Admin WHERE Username = ?`;

    db.query(sql, [username], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Admin not found' });
        res.json(results[0]);
    });
};

// Update Admin Profile
exports.updateAdminProfile = (req, res) => {
    const { username } = req.params;
    const { firstName, lastName, address } = req.body;

    // Validation
    if (!firstName || firstName.trim().length < 2) {
        return res.status(400).json({ message: 'First name is required (min 2 characters)' });
    }
    if (!lastName || lastName.trim().length < 2) {
        return res.status(400).json({ message: 'Last name is required (min 2 characters)' });
    }
    if (!address || !address.street || !address.city || !address.region || !address.postalCode || !address.country) {
        return res.status(400).json({ message: 'All address fields are required (street, city, region, postal code, country)' });
    }
    if (!/^\d{5}$/.test(address.postalCode)) {
        return res.status(400).json({ message: 'Postal code must be exactly 5 digits' });
    }

    const sql = `UPDATE Admin SET 
        FirstName = ?,
        LastName = ?,
        ShippingStreet = ?,
        ShippingBuildingNo = ?,
        ShippingCity = ?,
        ShippingRegion = ?,
        ShippingPostalCode = ?,
        ShippingCountry = ?
        WHERE Username = ?`;

    const values = [
        firstName, lastName,
        address.street, address.buildingNo || null, address.city,
        address.region, address.postalCode, address.country,
        username
    ];

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Admin not found' });
        res.json({ message: 'Profile updated successfully' });
    });
};
// Register Admin (Superadmin only - username 'Admin')
exports.registerAdmin = (req, res) => {
    const { username, password, firstName, lastName, email, phone, address, currentUser } = req.body;

    // Check if the requesting user is the superadmin
    if (!currentUser || currentUser !== 'admin') {
        return res.status(403).json({ message: 'Only the superadmin (admin) can create new admins' });
    }

    // Basic validation
    if (!username || !password || !email) {
        return res.status(400).json({ message: 'Username, password, and email are required' });
    }

    if (username.length < 3) {
        return res.status(400).json({ message: 'Username must be at least 3 characters' });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // First name and last name are required
    if (!firstName || firstName.trim().length < 2) {
        return res.status(400).json({ message: 'First name is required (min 2 characters)' });
    }

    if (!lastName || lastName.trim().length < 2) {
        return res.status(400).json({ message: 'Last name is required (min 2 characters)' });
    }

    // Address validation - all required except building number
    if (!address || !address.street || !address.city || !address.region || !address.postalCode || !address.country) {
        return res.status(400).json({ message: 'All address fields are required (street, city, region, postal code, country)' });
    }

    // Postal code validation (5 digits only)
    if (!/^\d{5}$/.test(address.postalCode)) {
        return res.status(400).json({ message: 'Postal code must be exactly 5 digits' });
    }

    // Phone validation (11 digits only, if provided)
    if (phone && !/^\d{11}$/.test(phone)) {
        return res.status(400).json({ message: 'Phone number must be exactly 11 digits' });
    }

    // Check if admin exists
    const checkSql = 'SELECT * FROM Admin WHERE Username = ? OR Email = ?';
    db.query(checkSql, [username, email], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0) {
            return res.status(400).json({ message: 'Username or Email already exists' });
        }

        // Create Shopping Cart first
        const cartSql = 'INSERT INTO ShoppingCart () VALUES ()';
        db.query(cartSql, async (err, cartResult) => {
            if (err) return res.status(500).json({ error: err.message });

            const cartId = cartResult.insertId;

            // Hash password before storing
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert Admin with cart and address from form
            const sql = `INSERT INTO Admin 
                (Username, Password, FirstName, LastName, Email, CartID, 
                 ShippingStreet, ShippingBuildingNo, ShippingCity, ShippingRegion, ShippingPostalCode, ShippingCountry) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const values = [
                username, hashedPassword, firstName, lastName, email, cartId,
                address.street, address.buildingNo || null, address.city, address.region, address.postalCode, address.country
            ];

            db.query(sql, values, (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                res.status(201).json({ message: 'Admin registered successfully' });
            });
        });
    });
};
