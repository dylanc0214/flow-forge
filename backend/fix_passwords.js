require('dotenv').config();
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

async function fixPasswords() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST || 'db',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'flowforge'
    });

    try {
        const hashedPassword = await bcrypt.hash('password123', 10);
        await pool.query('UPDATE Users SET password_hash = ? WHERE email IN ("admin@flowforge.com", "manager@flowforge.com", "employee@flowforge.com")', [hashedPassword]);
        console.log('Successfully updated seed user passwords to "password123"');
    } catch (error) {
        console.error('Failed to update passwords:', error);
    } finally {
        await pool.end();
    }
}

fixPasswords();
