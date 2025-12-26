const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'book_store'
});

connection.query('SHOW TABLES', (err, tables) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }

    console.log('\nTables in database:');
    console.log('-------------------');

    let pending = tables.length;
    if (pending === 0) {
        console.log('No tables found.');
        process.exit(0);
    }

    tables.forEach(row => {
        const tableName = Object.values(row)[0];
        connection.query(`SELECT COUNT(*) as count FROM \`${tableName}\``, (err, result) => {
            const count = result ? result[0].count : '?';
            console.log(`${tableName.padEnd(20)} | ${count} rows`);

            pending--;
            if (pending === 0) {
                console.log('-------------------');
                process.exit(0);
            }
        });
    });
});
