const db = require('./config/db');

const searchDatabase = (searchTerm, callback) => {
    const query = 'SELECT * FROM books WHERE title LIKE ?';
    const searchValue = `%${searchTerm}%`;

    db.query(query, [searchValue], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
};

module.exports = { searchDatabase };
