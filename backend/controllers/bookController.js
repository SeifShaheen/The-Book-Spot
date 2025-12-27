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
        conditions.push('(b.Title LIKE ? OR b.ISBN LIKE ? OR a.Name LIKE ?)');
        values.push(`%${q}%`, `%${q}%`, `%${q}%`);
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

// Validate ISBN-13 format and checksum
function validateISBN13(isbn) {
    if (!isbn) return { valid: false, error: 'ISBN is required' };

    // Remove dashes and spaces
    const cleanISBN = isbn.replace(/[-\s]/g, '');

    // Must be exactly 13 digits
    if (!/^\d{13}$/.test(cleanISBN)) {
        return { valid: false, error: 'ISBN must be exactly 13 digits' };
    }

    // Must start with 978 or 979
    if (!cleanISBN.startsWith('978') && !cleanISBN.startsWith('979')) {
        return { valid: false, error: 'ISBN-13 must start with 978 or 979' };
    }

    // Validate checksum
    let sum = 0;
    for (let i = 0; i < 12; i++) {
        sum += parseInt(cleanISBN[i]) * (i % 2 === 0 ? 1 : 3);
    }
    const checkDigit = (10 - (sum % 10)) % 10;

    if (parseInt(cleanISBN[12]) !== checkDigit) {
        return { valid: false, error: 'Invalid ISBN checksum' };
    }

    return { valid: true, cleanISBN };
}

// Add new book (Admin only)
exports.addBook = (req, res) => {
    const { isbn, title, category, price, publicationYear, stockQuantity, threshold, publisherId, authors, username } = req.body;

    // Validate ISBN
    const isbnValidation = validateISBN13(isbn);
    if (!isbnValidation.valid) {
        return res.status(400).json({ error: isbnValidation.error });
    }

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

                    // Log the action
                    if (username) {
                        const actionSql = 'INSERT INTO action (Username, ISBN, Notes) VALUES (?, ?, ?)';
                        connection.query(actionSql, [username, isbn, `Added book: ${title}`], (err) => {
                            if (err) console.error('Failed to log action:', err);
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
    const { title, category, price, publicationYear, stockQuantity, threshold, publisherId, username } = req.body;

    const sql = `UPDATE Book SET Title=?, Category=?, Price=?, PublicationYear=?, StockQuantity=?, Threshold=?, PublisherID=? WHERE ISBN=?`;

    db.query(sql, [title, category, price, publicationYear, stockQuantity, threshold, publisherId, isbn], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        // Log the action
        if (username) {
            const actionSql = 'INSERT INTO action (Username, ISBN, Notes) VALUES (?, ?, ?)';
            db.query(actionSql, [username, isbn, `Updated book: ${title}`], (err) => {
                if (err) console.error('Failed to log action:', err);
            });
        }

        res.json({ message: 'Book updated successfully' });
    });
};

// Delete book (Admin only)
exports.deleteBook = (req, res) => {
    const { isbn } = req.params;
    const { username } = req.body;

    db.getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: err.message });

        connection.beginTransaction(err => {
            if (err) { connection.release(); return res.status(500).json({ error: err.message }); }

            // First get book title for logging
            connection.query('SELECT Title FROM Book WHERE ISBN = ?', [isbn], (err, results) => {
                if (err) return rollback(err);
                if (results.length === 0) return rollback(new Error('Book not found'));

                const bookTitle = results[0].Title;

                // Delete from BookAuthor first (foreign key)
                connection.query('DELETE FROM BookAuthor WHERE ISBN = ?', [isbn], (err) => {
                    if (err) return rollback(err);

                    // Delete from OrderItem (set to null or delete orphans)
                    connection.query('DELETE FROM OrderItem WHERE ISBN = ?', [isbn], (err) => {
                        if (err) return rollback(err);

                        // Delete from CartItem
                        connection.query('DELETE FROM CartItem WHERE ISBN = ?', [isbn], (err) => {
                            if (err) return rollback(err);

                            // Delete from SupplyOrderItem
                            connection.query('DELETE FROM SupplyOrderItem WHERE ISBN = ?', [isbn], (err) => {
                                if (err) return rollback(err);

                                // Log the action BEFORE deleting the book (use NULL for ISBN since it will be deleted)
                                const logAction = (callback) => {
                                    if (username) {
                                        connection.query(
                                            'INSERT INTO action (Username, ISBN, Notes) VALUES (?, NULL, ?)',
                                            [username, `Deleted book (ISBN: ${isbn}): ${bookTitle}`],
                                            (err) => {
                                                if (err) console.error('Failed to log action:', err);
                                                callback();
                                            }
                                        );
                                    } else {
                                        callback();
                                    }
                                };

                                logAction(() => {
                                    // Finally delete the book
                                    connection.query('DELETE FROM Book WHERE ISBN = ?', [isbn], (err) => {
                                        if (err) return rollback(err);

                                        connection.commit(err => {
                                            if (err) return rollback(err);
                                            connection.release();
                                            res.json({ message: 'Book deleted successfully' });
                                        });
                                    });
                                });
                            });
                        });
                    });
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
};

// Get top 5 best selling books
exports.getBestSellers = (req, res) => {
    const sql = `
    SELECT b.*, p.Name as PublisherName, GROUP_CONCAT(a.Name SEPARATOR ', ') as Authors, 
           COALESCE(SUM(oi.Quantity), 0) as TotalSold
    FROM Book b
    LEFT JOIN Publisher p ON b.PublisherID = p.PublisherID
    LEFT JOIN BookAuthor ba ON b.ISBN = ba.ISBN
    LEFT JOIN Author a ON ba.AuthorID = a.AuthorID
    LEFT JOIN OrderItem oi ON b.ISBN = oi.ISBN
    GROUP BY b.ISBN
    HAVING TotalSold > 0
    ORDER BY TotalSold DESC
    LIMIT 5
  `;

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// Get 5 random books for recommendation
exports.getRandomBooks = (req, res) => {
    const sql = `
    SELECT b.*, p.Name as PublisherName, GROUP_CONCAT(a.Name SEPARATOR ', ') as Authors
    FROM Book b
    LEFT JOIN Publisher p ON b.PublisherID = p.PublisherID
    LEFT JOIN BookAuthor ba ON b.ISBN = ba.ISBN
    LEFT JOIN Author a ON ba.AuthorID = a.AuthorID
    GROUP BY b.ISBN
    ORDER BY RAND()
    LIMIT 5
  `;

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};
