const db = require('../config/db');

// Get Customer Orders
exports.getCustomerOrders = (req, res) => {
    const { username } = req.query;

    const sql = `
    SELECT o.OrderID, o.OrderDate, o.Status, o.TotalPrice,
           GROUP_CONCAT(CONCAT(b.Title, ' (x', oi.Quantity, ')') SEPARATOR ', ') as Items
    FROM \`Order\` o
    LEFT JOIN OrderItem oi ON o.OrderID = oi.OrderID
    LEFT JOIN Book b ON oi.ISBN = b.ISBN
    WHERE o.Username = ?
    GROUP BY o.OrderID
    ORDER BY o.OrderDate DESC
  `;

    db.query(sql, [username], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};
