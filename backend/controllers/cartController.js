const db = require('../config/db');

// Helper to get CartID for a user (supports both Customer and Admin)
const getCartId = (username, role, callback) => {
    const table = role === 'admin' ? 'Admin' : 'Customer';
    const sql = `SELECT CartID FROM ${table} WHERE Username = ?`;
    db.query(sql, [username], (err, results) => {
        if (err) return callback(err);
        if (results.length === 0) return callback(new Error('User not found'));
        if (!results[0].CartID) return callback(new Error('No cart assigned to user'));
        callback(null, results[0].CartID);
    });
};

// Get Cart Items
exports.getCart = (req, res) => {
    const { username, role } = req.query; // role: 'admin' or 'customer'

    getCartId(username, role, (err, cartId) => {
        if (err) return res.status(500).json({ error: err.message });

        const sql = `
      SELECT ci.ISBN, ci.Quantity, b.Title, b.Price, 
             GROUP_CONCAT(a.Name SEPARATOR ', ') as Authors, 
             (ci.Quantity * b.Price) as Total
      FROM CartItem ci
      JOIN Book b ON ci.ISBN = b.ISBN
      LEFT JOIN bookauthor ba ON b.isbn = ba.isbn
      LEFT JOIN author a ON ba.authorid = a.authorid
      WHERE ci.CartID = ?
      GROUP BY ci.ISBN, ci.Quantity, b.Title, b.Price
    `;

        db.query(sql, [cartId], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });

            // Ensure all values are numbers, not strings
            const items = results.map(item => ({
                ...item,
                Price: parseFloat(item.Price),
                Total: parseFloat(item.Total)
            }));

            const grandTotal = parseFloat(items.reduce((sum, item) => sum + item.Total, 0).toFixed(3));
            res.json({ items, grandTotal });
        });
    });
};

// Add to Cart
exports.addToCart = (req, res) => {
    const { username, isbn, quantity, role } = req.body;

    getCartId(username, role, (err, cartId) => {
        if (err) return res.status(500).json({ error: err.message });

        // First, check the book's stock quantity
        const checkStockSql = 'SELECT StockQuantity FROM Book WHERE ISBN = ?';
        db.query(checkStockSql, [isbn], (err, stockResults) => {
            if (err) return res.status(500).json({ error: err.message });

            if (stockResults.length === 0) {
                return res.status(404).json({ message: 'Book not found' });
            }

            const availableStock = stockResults[0].StockQuantity;

            // Check if there's enough stock for the requested quantity
            if (quantity > availableStock) {
                return res.status(400).json({
                    message: `Only ${availableStock} item(s) available in stock`
                });
            }

            // Check if item exists in cart
            const checkCartSql = 'SELECT Quantity FROM CartItem WHERE CartID = ? AND ISBN = ?';
            db.query(checkCartSql, [cartId, isbn], (err, cartResults) => {
                if (err) return res.status(500).json({ error: err.message });

                if (cartResults.length > 0) {
                    // Item exists in cart - check if adding more would exceed stock
                    const currentCartQuantity = cartResults[0].Quantity;
                    const newTotalQuantity = currentCartQuantity + quantity;

                    if (newTotalQuantity > availableStock) {
                        const remainingStock = availableStock - currentCartQuantity;
                        if (remainingStock <= 0) {
                            return res.status(400).json({
                                message: `You already have the maximum available quantity (${currentCartQuantity}) in your cart`
                            });
                        }
                        return res.status(400).json({
                            message: `Only ${remainingStock} more item(s) can be added. You already have ${currentCartQuantity} in your cart`
                        });
                    }

                    // Update quantity
                    const updateSql = 'UPDATE CartItem SET Quantity = Quantity + ? WHERE CartID = ? AND ISBN = ?';
                    db.query(updateSql, [quantity, cartId, isbn], (err) => {
                        if (err) return res.status(500).json({ error: err.message });
                        res.json({
                            message: 'Cart updated',
                            newQuantity: newTotalQuantity
                        });
                    });
                } else {
                    // Insert new item
                    const insertSql = 'INSERT INTO CartItem (CartID, ISBN, Quantity) VALUES (?, ?, ?)';
                    db.query(insertSql, [cartId, isbn, quantity], (err) => {
                        if (err) return res.status(500).json({ error: err.message });
                        res.json({
                            message: 'Item added to cart',
                            newQuantity: quantity
                        });
                    });
                }
            });
        });
    });
};

// Remove from Cart
exports.removeFromCart = (req, res) => {
    const { username, isbn, role } = req.body;

    getCartId(username, role, (err, cartId) => {
        if (err) return res.status(500).json({ error: err.message });

        const sql = 'DELETE FROM CartItem WHERE CartID = ? AND ISBN = ?';
        db.query(sql, [cartId, isbn], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Item removed from cart' });
        });
    });
};

// Update Cart Item Quantity
exports.updateQuantity = (req, res) => {
    const { username, isbn, change, role } = req.body; // change: +1 or -1

    getCartId(username, role, (err, cartId) => {
        if (err) return res.status(500).json({ error: err.message });

        // First get current quantity
        const getSql = 'SELECT Quantity FROM CartItem WHERE CartID = ? AND ISBN = ?';
        db.query(getSql, [cartId, isbn], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length === 0) return res.status(404).json({ message: 'Item not found in cart' });

            const currentQuantity = results[0].Quantity;
            const newQuantity = currentQuantity + change;

            if (newQuantity <= 0) {
                // Remove item if quantity becomes 0 or less
                const deleteSql = 'DELETE FROM CartItem WHERE CartID = ? AND ISBN = ?';
                db.query(deleteSql, [cartId, isbn], (err) => {
                    if (err) return res.status(500).json({ error: err.message });
                    res.json({ message: 'Item removed from cart' });
                });
            } else if (change > 0) {
                // Only validate stock when INCREASING quantity
                const checkStockSql = 'SELECT StockQuantity FROM Book WHERE ISBN = ?';
                db.query(checkStockSql, [isbn], (err, stockResults) => {
                    if (err) return res.status(500).json({ error: err.message });

                    if (stockResults.length === 0) {
                        return res.status(404).json({ message: 'Book not found' });
                    }

                    const availableStock = stockResults[0].StockQuantity;

                    // Check if new quantity exceeds available stock
                    if (newQuantity > availableStock) {
                        return res.status(400).json({
                            message: `Only ${availableStock} item(s) available in stock. You currently have ${currentQuantity} in your cart.`
                        });
                    }

                    // Update quantity
                    const updateSql = 'UPDATE CartItem SET Quantity = ? WHERE CartID = ? AND ISBN = ?';
                    db.query(updateSql, [newQuantity, cartId, isbn], (err) => {
                        if (err) return res.status(500).json({ error: err.message });
                        res.json({ message: 'Quantity updated', newQuantity });
                    });
                });
            } else {
                // Decreasing quantity - no stock validation needed
                const updateSql = 'UPDATE CartItem SET Quantity = ? WHERE CartID = ? AND ISBN = ?';
                db.query(updateSql, [newQuantity, cartId, isbn], (err) => {
                    if (err) return res.status(500).json({ error: err.message });
                    res.json({ message: 'Quantity updated', newQuantity });
                });
            }
        });
    });
};

// Luhn Algorithm for Credit Card Validation
const validateCreditCard = (cardNumber) => {
    // Remove spaces and dashes
    const cleaned = cardNumber.replace(/[\s-]/g, '');

    // Check if it contains only digits and is 13-19 characters long
    if (!/^\d{13,19}$/.test(cleaned)) {
        return false;
    }

    // Luhn algorithm
    let sum = 0;
    let isEven = false;

    // Loop through values starting from the rightmost digit
    for (let i = cleaned.length - 1; i >= 0; i--) {
        let digit = parseInt(cleaned[i]);

        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        isEven = !isEven;
    }

    return sum % 10 === 0;
};

// Validate Expiry Date
const validateExpiryDate = (expiryDate) => {
    // Check format MM/YY
    const regex = /^(0[1-9]|1[0-2])\/(\d{2})$/;
    if (!regex.test(expiryDate)) {
        return { valid: false, message: 'Expiry date must be in MM/YY format' };
    }

    const [month, year] = expiryDate.split('/');
    const expMonth = parseInt(month);
    const expYear = parseInt('20' + year); // Convert YY to YYYY

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // getMonth() is 0-indexed

    // Check if card is expired
    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
        return { valid: false, message: 'Credit card has expired' };
    }

    return { valid: true };
};

// Checkout
exports.checkout = (req, res) => {
    const { username, creditCard, expiryDate, role } = req.body;

    // Validate credit card information
    if (!creditCard || !expiryDate) {
        return res.status(400).json({ message: 'Credit card number and expiry date are required' });
    }

    // Validate credit card number using Luhn algorithm
    if (!validateCreditCard(creditCard)) {
        return res.status(400).json({ message: 'Invalid credit card number' });
    }

    // Validate expiry date
    const expiryValidation = validateExpiryDate(expiryDate);
    if (!expiryValidation.valid) {
        return res.status(400).json({ message: expiryValidation.message });
    }

    getCartId(username, role, (err, cartId) => {
        if (err) return res.status(500).json({ error: err.message });

        db.getConnection((err, connection) => {
            if (err) return res.status(500).json({ error: err.message });

            connection.beginTransaction(err => {
                if (err) { connection.release(); return res.status(500).json({ error: err.message }); }

                // 1. Get Cart Items
                const getItemsSql = `
          SELECT ci.ISBN, ci.Quantity, b.Price, b.StockQuantity 
          FROM CartItem ci
          JOIN Book b ON ci.ISBN = b.ISBN
          WHERE ci.CartID = ? FOR UPDATE
        `; // Lock rows for update

                connection.query(getItemsSql, [cartId], (err, items) => {
                    if (err) return rollback(err);

                    if (items.length === 0) return rollback(new Error('Cart is empty'));

                    // 2. Check Stock
                    for (const item of items) {
                        if (item.StockQuantity < item.Quantity) {
                            return rollback(new Error(`Not enough stock for ISBN ${item.ISBN}`));
                        }
                    }

                    // 3. Create Order
                    const totalPrice = items.reduce((sum, item) => sum + (item.Price * item.Quantity), 0);
                    const createOrderSql = 'INSERT INTO `Order` (Username, TotalPrice, Status) VALUES (?, ?, ?)';

                    connection.query(createOrderSql, [username, totalPrice, 'Confirmed'], (err, orderResult) => {
                        if (err) return rollback(err);

                        const orderId = orderResult.insertId;

                        // 4. Create Order Items & Deduct Stock
                        // We can do this in a loop or bulk insert. Loop is easier for stock deduction logic.

                        const processItems = (index) => {
                            if (index >= items.length) {
                                // 5. Clear Cart
                                const clearCartSql = 'DELETE FROM CartItem WHERE CartID = ?';
                                connection.query(clearCartSql, [cartId], (err) => {
                                    if (err) return rollback(err);

                                    connection.commit(err => {
                                        if (err) return rollback(err);
                                        connection.release();
                                        res.json({ message: 'Checkout successful', orderId });
                                    });
                                });
                                return;
                            }

                            const item = items[index];
                            const orderItemSql = 'INSERT INTO OrderItem (OrderID, ISBN, Quantity) VALUES (?, ?, ?)';
                            connection.query(orderItemSql, [orderId, item.ISBN, item.Quantity], (err) => {
                                if (err) return rollback(err);

                                const updateStockSql = 'UPDATE Book SET StockQuantity = StockQuantity - ? WHERE ISBN = ?';
                                connection.query(updateStockSql, [item.Quantity, item.ISBN], (err) => {
                                    if (err) {
                                        // Trigger might throw error here if negative stock
                                        return rollback(err);
                                    }
                                    processItems(index + 1);
                                });
                            });
                        };

                        processItems(0);
                    });
                });

                function rollback(error) {
                    connection.rollback(() => {
                        connection.release();
                        res.status(500).json({ error: error.message });
                    });
                }
            });
        });
    });
};
