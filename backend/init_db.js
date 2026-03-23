const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function runSchema() {
    console.log("Connecting to Database...");
    
    // We connect without specifying a database first to run the DROP/CREATE commands
require('dotenv').config();
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
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
