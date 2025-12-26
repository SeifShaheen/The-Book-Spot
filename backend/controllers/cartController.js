const db = require('../config/db');

// Helper to get CartID for a user
const getCartId = (username, callback) => {
    const sql = 'SELECT CartID FROM Customer WHERE Username = ?';
    db.query(sql, [username], (err, results) => {
        if (err) return callback(err);
        if (results.length === 0) return callback(new Error('User not found'));
        callback(null, results[0].CartID);
    });
};

// Get Cart Items
exports.getCart = (req, res) => {
    const { username } = req.query; // In real app, from session/token

    getCartId(username, (err, cartId) => {
        if (err) return res.status(500).json({ error: err.message });

        const sql = `
      SELECT ci.ISBN, ci.Quantity, b.Title, b.Price, b.Author, (ci.Quantity * b.Price) as Total
      FROM CartItem ci
      JOIN Book b ON ci.ISBN = b.ISBN
      WHERE ci.CartID = ?
    `;

        db.query(sql, [cartId], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });

            const grandTotal = results.reduce((sum, item) => sum + item.Total, 0);
            res.json({ items: results, grandTotal });
        });
    });
};

// Add to Cart
exports.addToCart = (req, res) => {
    const { username, isbn, quantity } = req.body;

    getCartId(username, (err, cartId) => {
        if (err) return res.status(500).json({ error: err.message });

        // Check if item exists in cart
        const checkSql = 'SELECT * FROM CartItem WHERE CartID = ? AND ISBN = ?';
        db.query(checkSql, [cartId, isbn], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });

            if (results.length > 0) {
                // Update quantity
                const updateSql = 'UPDATE CartItem SET Quantity = Quantity + ? WHERE CartID = ? AND ISBN = ?';
                db.query(updateSql, [quantity, cartId, isbn], (err) => {
                    if (err) return res.status(500).json({ error: err.message });
                    res.json({ message: 'Cart updated' });
                });
            } else {
                // Insert new item
                const insertSql = 'INSERT INTO CartItem (CartID, ISBN, Quantity) VALUES (?, ?, ?)';
                db.query(insertSql, [cartId, isbn, quantity], (err) => {
                    if (err) return res.status(500).json({ error: err.message });
                    res.json({ message: 'Item added to cart' });
                });
            }
        });
    });
};

// Remove from Cart
exports.removeFromCart = (req, res) => {
    const { username, isbn } = req.body;

    getCartId(username, (err, cartId) => {
        if (err) return res.status(500).json({ error: err.message });

        const sql = 'DELETE FROM CartItem WHERE CartID = ? AND ISBN = ?';
        db.query(sql, [cartId, isbn], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Item removed from cart' });
        });
    });
};

// Checkout
exports.checkout = (req, res) => {
    const { username, creditCard, expiryDate } = req.body;

    // Basic Credit Card Validation (Mock)
    if (!creditCard || !expiryDate) {
        return res.status(400).json({ message: 'Invalid credit card information' });
    }

    getCartId(username, (err, cartId) => {
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
