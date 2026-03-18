const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function runSchema() {
    console.log("Connecting to Database...");
    
    // We connect without specifying a database first to run the DROP/CREATE commands
    let connection;
    try {
        connection = await mysql.createConnection({
            host: '161.97.95.16',
            user: 'dylanc0214',
            password: 'l0o0feHZpp42Zk',
            multipleStatements: true // Crucial to run the entire SQL file at once
        });

        console.log("Connected successfully. Reading schema file...");
        
        const schemaPath = path.join(__dirname, '../flowforge_schema.sql');
        const sql = fs.readFileSync(schemaPath, 'utf8');

        console.log("Executing SQL schema...");
        await connection.query(sql);

        console.log("✅ Database and Schema successfully provisioned on VPS!");
    } catch (error) {
        console.error("❌ Error provisioning database:", error);
    } finally {
        if (connection) await connection.end();
    }
}

runSchema();
