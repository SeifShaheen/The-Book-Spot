const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
});

// SQL Files to execute in order
const sqlFiles = [
    { name: 'schema.sql', splitBy: ';' },
    { name: 'triggers.sql', splitBy: '/* SPLIT */' },
    { name: 'constraints.sql', splitBy: ';' },
    { name: 'views.sql', splitBy: ';' },
    { name: 'seed_data.sql', splitBy: ';' }
];

let currentFileIndex = 0;

function runSqlFile(fileIndex) {
    if (fileIndex >= sqlFiles.length) {
        console.log('\nAll SQL files executed successfully!');
        createUsers();
        return;
    }

    const file = sqlFiles[fileIndex];
    const filePath = path.join(__dirname, file.name);

    if (!fs.existsSync(filePath)) {
        console.log(`${file.name} not found, skipping...`);
        runSqlFile(fileIndex + 1);
        return;
    }

    const sql = fs.readFileSync(filePath, 'utf8');
    const statements = sql.split(file.splitBy).map(s => s.trim()).filter(s => s.length > 0);

    console.log(`\nRunning ${file.name} (${statements.length} statements)...`);

    let stmtIndex = 0;
    const runStatement = () => {
        if (stmtIndex >= statements.length) {
            console.log(`${file.name} completed.`);
            runSqlFile(fileIndex + 1);
            return;
        }

        const stmt = statements[stmtIndex];
        connection.query(stmt, (err) => {
            if (err) {
                // Some errors are okay to skip
                if (err.code === 'ER_TRG_ALREADY_EXISTS' ||
                    err.code === 'ER_DUP_KEYNAME' ||
                    err.code === 'ER_DUP_ENTRY') {
                    console.log(`Skipping (already exists): ${err.code}`);
                } else {
                    console.error(`\nError in ${file.name} statement #${stmtIndex + 1}:`);
                    console.error(stmt.substring(0, 100) + '...');
                    console.error(`   ${err.code}: ${err.message}`);
                    // Continue anyway for non-critical errors
                }
            }
            stmtIndex++;
            runStatement();
        });
    };

    runStatement();
}

async function createUsers() {
    const bcrypt = require('bcryptjs');

    // Hash passwords
    const adminPassword = await bcrypt.hash('admin123', 10);
    const customerPassword = await bcrypt.hash('password123', 10);

    // Create shopping carts for admin and customer
    const cartSql = "INSERT INTO ShoppingCart () VALUES (), ()";
    connection.query(cartSql, async (err, cartResult) => {
        if (err) {
            console.error("Error creating carts:", err);
            connection.end();
            process.exit(1);
            return;
        }

        const adminCartId = cartResult.insertId;
        const customerCartId = adminCartId + 1;

        // Create admin with cart and default address
        const adminSql = `INSERT IGNORE INTO Admin 
            (Username, Password, FirstName, LastName, Email, CartID, 
             ShippingStreet, ShippingBuildingNo, ShippingCity, ShippingRegion, ShippingPostalCode, ShippingCountry) 
            VALUES ('admin', ?, 'System', 'Admin', 'admin@bookstore.com', ?, 
                    '123 Admin Street', '1', 'Cairo', 'Cairo', '12345', 'Egypt')`;

        connection.query(adminSql, [adminPassword, adminCartId], (err) => {
            if (err) console.error("Error creating default admin:", err);
            else console.log("Default admin created (admin/admin123)");

            // Create sample customer
            const customerSql = `INSERT IGNORE INTO Customer 
                (Username, Password, FirstName, LastName, Email, Phone, CartID,
                 ShippingStreet, ShippingBuildingNo, ShippingCity, ShippingRegion, ShippingPostalCode, ShippingCountry) 
                VALUES ('johndoe', ?, 'John', 'Doe', 'john@example.com', '15551234567', ?,
                        '123 Main St', '1', 'New York', 'NY', '10001', 'USA')`;

            connection.query(customerSql, [customerPassword, customerCartId], (err) => {
                if (err) console.error("Error creating sample customer:", err);
                else console.log("Sample customer created (johndoe/password123)");
                connection.end();
                process.exit(0);
            });
        });
    });
}

// Start execution
runSqlFile(0);
