const db = require('../config/db');

// Register Customer
exports.register = (req, res) => {
    const { username, password, firstName, lastName, email, phone, address } = req.body;

    // Basic validation
    if (!username || !password || !email) {
        return res.status(400).json({ message: 'Please provide required fields (username, password, email)' });
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
        db.query(cartSql, (err, cartResult) => {
            if (err) return res.status(500).json({ error: err.message });

            const cartId = cartResult.insertId;

            // Insert Customer with all address fields
            const sql = `INSERT INTO Customer 
        (Username, Password, FirstName, LastName, Email, Phone, ShippingStreet, ShippingBuildingNo, ShippingCity, ShippingRegion, ShippingPostalCode, ShippingCountry, CartID) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            const values = [
                username, password, firstName, lastName, email, phone,
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

    const sql = `UPDATE Admin SET 
        FirstName = COALESCE(?, FirstName),
        LastName = COALESCE(?, LastName),
        ShippingStreet = COALESCE(?, ShippingStreet),
        ShippingBuildingNo = COALESCE(?, ShippingBuildingNo),
        ShippingCity = COALESCE(?, ShippingCity),
        ShippingRegion = COALESCE(?, ShippingRegion),
        ShippingPostalCode = COALESCE(?, ShippingPostalCode),
        ShippingCountry = COALESCE(?, ShippingCountry)
        WHERE Username = ?`;

    const values = [
        firstName, lastName,
        address?.street, address?.buildingNo, address?.city,
        address?.region, address?.postalCode, address?.country,
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
    const { username, password, firstName, lastName, email, currentUser } = req.body;

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

    // Check if admin exists
    const checkSql = 'SELECT * FROM Admin WHERE Username = ? OR Email = ?';
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

            // Insert Admin with cart and default address
            const sql = `INSERT INTO Admin 
                (Username, Password, FirstName, LastName, Email, CartID, 
                 ShippingStreet, ShippingBuildingNo, ShippingCity, ShippingRegion, ShippingPostalCode, ShippingCountry) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const values = [
                username, password, firstName || null, lastName || null, email, cartId,
                '123 Admin Street', '1', 'Cairo', 'Cairo', '12345', 'Egypt'
            ];

            db.query(sql, values, (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                res.status(201).json({ message: 'Admin registered successfully' });
            });
        });
    });
};
