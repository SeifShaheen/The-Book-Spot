const db = require('../config/db');

// --- Database Viewer ---

exports.getDatabaseTable = (req, res) => {
    const tableName = req.params.tableName;
    const allowedTables = [
        'Book', 'Author', 'BookAuthor', 'Publisher', 'PublisherPhone', 'PublisherAddress',
        'Customer', 'Order', 'OrderItem', 'SupplyOrder', 'SupplyOrderItem'
    ];

    if (!allowedTables.includes(tableName)) {
        return res.status(400).json({ error: 'Invalid table name' });
    }

    const sql = `SELECT * FROM \`${tableName}\``;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        // Filter out sensitive columns
        const sanitizedResults = results.map(row => {
            const { Password, ...rest } = row;
            return rest;
        });

        res.json(sanitizedResults);
    });
};

// --- Authors ---

// Add New Author
exports.addAuthor = (req, res) => {
    const { name } = req.body;

    if (!name || name.trim().length < 2) {
        return res.status(400).json({ error: 'Author name is required (min 2 characters)' });
    }

    const sql = 'INSERT INTO Author (Name) VALUES (?)';
    db.query(sql, [name.trim()], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Author added successfully', authorId: result.insertId });
    });
};

// Get All Authors
exports.getAuthors = (req, res) => {
    const sql = 'SELECT * FROM Author ORDER BY Name ASC';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// --- Publishers ---

// Add New Publisher
exports.addPublisher = (req, res) => {
    const { name, phone, address } = req.body;

    // Validation
    if (!name || name.trim().length < 2) {
        return res.status(400).json({ error: 'Publisher name is required (min 2 characters)' });
    }

    // Phone validation: must be exactly 11 digits (numbers only)
    if (phone) {
        if (!/^\d{11}$/.test(phone)) {
            return res.status(400).json({ error: 'Phone number must be exactly 11 digits (numbers only)' });
        }
    }

    // Postal code validation: must be exactly 5 digits (numbers only)
    if (address && address.postalCode) {
        if (!/^\d{5}$/.test(address.postalCode)) {
            return res.status(400).json({ error: 'Postal code must be exactly 5 digits (numbers only)' });
        }
    }

    db.getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: err.message });

        connection.beginTransaction(err => {
            if (err) { connection.release(); return res.status(500).json({ error: err.message }); }

            // 1. Insert Publisher
            connection.query('INSERT INTO Publisher (Name) VALUES (?)', [name], (err, result) => {
                if (err) return rollback(err);
                const publisherId = result.insertId;

                // 2. Insert Phone (if provided)
                const phonePromise = new Promise((resolve, reject) => {
                    if (!phone) return resolve();
                    connection.query('INSERT INTO PublisherPhone (PublisherID, PhoneNumber) VALUES (?, ?)', [publisherId, phone], (err) => {
                        if (err) reject(err);
                        else resolve();
                    });
                });

                // 3. Insert Address (if provided)
                const addressPromise = new Promise((resolve, reject) => {
                    if (!address) return resolve();
                    const { line1, line2, city, region, postalCode, country } = address;
                    const sql = `INSERT INTO PublisherAddress (PublisherID, AddressLine1, AddressLine2, City, Region, PostalCode, Country) 
                       VALUES (?, ?, ?, ?, ?, ?, ?)`;
                    connection.query(sql, [publisherId, line1, line2, city, region, postalCode, country], (err) => {
                        if (err) reject(err);
                        else resolve();
                    });
                });

                Promise.all([phonePromise, addressPromise])
                    .then(() => {
                        connection.commit(err => {
                            if (err) return rollback(err);
                            connection.release();
                            res.json({ message: 'Publisher added successfully', publisherId });
                        });
                    })
                    .catch(err => rollback(err));
            });

            function rollback(error) {
                connection.rollback(() => {
                    connection.release();
                    res.status(500).json({ error: error.message });
                });
            }
        });
    });
};

// Get All Publishers
exports.getPublishers = (req, res) => {
    const sql = 'SELECT * FROM Publisher ORDER BY Name ASC';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// --- Supply Orders ---

// Get Pending Supply Orders
exports.getSupplyOrders = (req, res) => {
    const sql = `
    SELECT so.*, p.Name as PublisherName, 
           GROUP_CONCAT(CONCAT(b.Title, ' (x', soi.Quantity, ')') SEPARATOR ', ') as Items
    FROM SupplyOrder so
    JOIN Publisher p ON so.PublisherID = p.PublisherID
    LEFT JOIN SupplyOrderItem soi ON so.Username = soi.Username AND so.PublisherID = soi.PublisherID AND so.OrderDate = soi.OrderDate
    LEFT JOIN Book b ON soi.ISBN = b.ISBN
    GROUP BY so.Username, so.PublisherID, so.OrderDate
    ORDER BY so.OrderDate DESC
  `;

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// Confirm Supply Order
exports.confirmSupplyOrder = (req, res) => {
    const { username, publisherId, orderDate } = req.body;

    console.log('=== Confirm Supply Order Debug ===');
    console.log('Received username:', username);
    console.log('Received publisherId:', publisherId);
    console.log('Received orderDate:', orderDate);
    console.log('orderDate type:', typeof orderDate);

    db.getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: err.message });

        // First, let's check what orders exist in the database
        const checkSql = `SELECT * FROM SupplyOrder WHERE Status = 'Pending'`;
        connection.query(checkSql, (err, existingOrders) => {
            if (err) {
                connection.release();
                return res.status(500).json({ error: err.message });
            }
            console.log('Existing pending orders:', existingOrders);

            connection.beginTransaction(err => {
                if (err) { connection.release(); return res.status(500).json({ error: err.message }); }

                // 1. Update Status - pass the date directly, let MySQL driver handle it
                const updateSql = `
            UPDATE SupplyOrder 
            SET Status = 'Confirmed' 
            WHERE Username = ? AND PublisherID = ? AND OrderDate = ? AND Status = 'Pending'
          `;

                console.log('Executing update with:', [username, publisherId, orderDate]);
                connection.query(updateSql, [username, publisherId, new Date(orderDate)], (err, result) => {
                    console.log('Update result:', result);
                    if (err) return rollback(err);
                    if (result.affectedRows === 0) return rollback(new Error('Order not found or already confirmed'));

                    // 2. Add to Stock
                    const getItemsSql = `
              SELECT ISBN, Quantity FROM SupplyOrderItem 
              WHERE Username = ? AND PublisherID = ? AND OrderDate = ?
            `;

                    connection.query(getItemsSql, [username, publisherId, new Date(orderDate)], (err, items) => {
                        if (err) return rollback(err);

                        const processItems = (index) => {
                            if (index >= items.length) {
                                connection.commit(err => {
                                    if (err) return rollback(err);
                                    connection.release();
                                    res.json({ message: 'Supply order confirmed and stock updated' });
                                });
                                return;
                            }

                            const item = items[index];
                            const updateStockSql = 'UPDATE Book SET StockQuantity = StockQuantity + ? WHERE ISBN = ?';
                            connection.query(updateStockSql, [item.Quantity, item.ISBN], (err) => {
                                if (err) return rollback(err);
                                processItems(index + 1);
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

// Cancel Supply Order
exports.cancelSupplyOrder = (req, res) => {
    const { username, publisherId, orderDate } = req.body;

    console.log('=== Cancel Supply Order Debug ===');
    console.log('Received:', { username, publisherId, orderDate });

    const sql = `
    UPDATE SupplyOrder 
    SET Status = 'Cancelled' 
    WHERE Username = ? AND PublisherID = ? AND OrderDate = ? AND Status = 'Pending'
  `;

    db.query(sql, [username, publisherId, new Date(orderDate)], (err, result) => {
        console.log('Cancel result:', result);
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(400).json({ message: 'Order not found or cannot be cancelled' });

        res.json({ message: 'Supply order cancelled' });
    });
};

// --- Reports ---

// 1. Total Sales Previous Month
exports.getSalesLastMonth = (req, res) => {
    const sql = `
    SELECT SUM(TotalPrice) as MonthlySales
    FROM \`Order\`
    WHERE OrderDate >= DATE_SUB(DATE_FORMAT(NOW(), '%Y-%m-01'), INTERVAL 1 MONTH)
      AND OrderDate < DATE_FORMAT(NOW(), '%Y-%m-01')
  `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results[0]);
    });
};

// 2. Top 5 Customers
exports.getTopCustomers = (req, res) => {
    const sql = `
    SELECT c.Username, c.FirstName, c.LastName, SUM(o.TotalPrice) as TotalSpent
    FROM Customer c
    JOIN \`Order\` o ON c.Username = o.Username
    WHERE o.OrderDate >= DATE_SUB(NOW(), INTERVAL 3 MONTH)
    GROUP BY c.Username
    ORDER BY TotalSpent DESC
    LIMIT 5
  `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// 3. Top 10 Selling Books
exports.getTopBooks = (req, res) => {
    const sql = `
    SELECT b.Title, SUM(oi.Quantity) as TotalSold
    FROM Book b
    JOIN OrderItem oi ON b.ISBN = oi.ISBN
    JOIN \`Order\` o ON oi.OrderID = o.OrderID
    WHERE o.OrderDate >= DATE_SUB(NOW(), INTERVAL 3 MONTH)
    GROUP BY b.ISBN
    ORDER BY TotalSold DESC
    LIMIT 10
  `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// 4. Sales on Specific Date
exports.getSalesByDate = (req, res) => {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: 'Date parameter required (YYYY-MM-DD)' });

    const sql = `
    SELECT COUNT(OrderID) as OrderCount, COALESCE(SUM(TotalPrice), 0) as TotalSales
    FROM \`Order\`
    WHERE DATE(OrderDate) = ? AND Status = 'Confirmed'
  `;
    db.query(sql, [date], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results[0]);
    });
};

// 5. Book Reorder Count (How many times a book was reordered via supply orders)
exports.getBookReorderCount = (req, res) => {
    const sql = `
    SELECT b.ISBN, b.Title, COUNT(soi.ISBN) as ReorderCount
    FROM Book b
    LEFT JOIN SupplyOrderItem soi ON b.ISBN = soi.ISBN
    GROUP BY b.ISBN
    HAVING ReorderCount > 0
    ORDER BY ReorderCount DESC
  `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// 6. Low Stock Alert
exports.getLowStockBooks = (req, res) => {
    const sql = `
    SELECT ISBN, Title, StockQuantity, Threshold, (Threshold - StockQuantity) AS BelowBy
    FROM Book
    WHERE StockQuantity < Threshold
    ORDER BY BelowBy DESC
  `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};
