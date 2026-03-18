const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

async function fixPasswords() {
    const pool = mysql.createPool({
        host: '161.97.95.16',
        user: 'dylanc0214',
        password: 'l0o0feHZpp42Zk',
        database: 'flowforge'
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
