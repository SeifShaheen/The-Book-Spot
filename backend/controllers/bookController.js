const db = require('../config/db');

// Get all books with optional search filters
exports.getAllBooks = (req, res) => {
    const { q, category, author, publisher } = req.query;

    let sql = `
    SELECT b.*, p.Name as PublisherName, GROUP_CONCAT(a.Name SEPARATOR ', ') as Authors
    FROM Book b
    LEFT JOIN Publisher p ON b.PublisherID = p.PublisherID
    LEFT JOIN BookAuthor ba ON b.ISBN = ba.ISBN
    LEFT JOIN Author a ON ba.AuthorID = a.AuthorID
  `;

    const conditions = [];
    const values = [];

    if (q) {
        conditions.push('(b.Title LIKE ? OR b.ISBN LIKE ?)');
        values.push(`%${q}%`, `%${q}%`);
    }

    if (category) {
        conditions.push('b.Category = ?');
        values.push(category);
    }

    if (author) {
        conditions.push('a.Name LIKE ?');
        values.push(`%${author}%`);
    }

    if (publisher) {
        conditions.push('p.Name LIKE ?');
        values.push(`%${publisher}%`);
    }

    if (conditions.length > 0) {
        sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' GROUP BY b.ISBN';

    db.query(sql, values, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// Get single book by ISBN
exports.getBookByISBN = (req, res) => {
    const { isbn } = req.params;
    const sql = `
    SELECT b.*, p.Name as PublisherName, GROUP_CONCAT(a.Name SEPARATOR ', ') as Authors
    FROM Book b
    LEFT JOIN Publisher p ON b.PublisherID = p.PublisherID
    LEFT JOIN BookAuthor ba ON b.ISBN = ba.ISBN
    LEFT JOIN Author a ON ba.AuthorID = a.AuthorID
    WHERE b.ISBN = ?
    GROUP BY b.ISBN
  `;

    db.query(sql, [isbn], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Book not found' });
        res.json(results[0]);
    });
};

// Add new book (Admin only)
exports.addBook = (req, res) => {
    const { isbn, title, category, price, publicationYear, stockQuantity, threshold, publisherId, authors } = req.body;

    // Transaction to ensure Book and BookAuthor are added together
    db.getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: err.message });

        connection.beginTransaction(err => {
            if (err) { connection.release(); return res.status(500).json({ error: err.message }); }

            const bookSql = `INSERT INTO Book (ISBN, Title, Category, Price, PublicationYear, StockQuantity, Threshold, PublisherID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
            connection.query(bookSql, [isbn, title, category, price, publicationYear, stockQuantity, threshold, publisherId], (err, result) => {
                if (err) {
                    return connection.rollback(() => {
                        connection.release();
                        res.status(500).json({ error: err.message });
                    });
                }

                // Handle Authors (assuming authors is an array of IDs or Names - let's assume IDs for simplicity or create new ones)
                // Requirement says "one or more authors".
                // Simplified: We expect an array of AuthorIDs.
                if (authors && authors.length > 0) {
                    const authorValues = authors.map(authorId => [isbn, authorId]);
                    const authorSql = 'INSERT INTO BookAuthor (ISBN, AuthorID) VALUES ?';
                    connection.query(authorSql, [authorValues], (err, result) => {
                        if (err) {
                            return connection.rollback(() => {
                                connection.release();
                                res.status(500).json({ error: err.message });
                            });
                        }
                        commitTransaction();
                    });
                } else {
                    commitTransaction();
                }
            });

            function commitTransaction() {
                connection.commit(err => {
                    if (err) {
                        return connection.rollback(() => {
                            connection.release();
                            res.status(500).json({ error: err.message });
                        });
                    }
                    connection.release();
                    res.status(201).json({ message: 'Book added successfully' });
                });
            }
        });
    });
};

// Update book (Admin only)
exports.updateBook = (req, res) => {
    const { isbn } = req.params;
    const { title, category, price, publicationYear, stockQuantity, threshold, publisherId } = req.body;

    const sql = `UPDATE Book SET Title=?, Category=?, Price=?, PublicationYear=?, StockQuantity=?, Threshold=?, PublisherID=? WHERE ISBN=?`;

    db.query(sql, [title, category, price, publicationYear, stockQuantity, threshold, publisherId, isbn], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Book updated successfully' });
    });
};
