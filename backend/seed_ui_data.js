require('dotenv').config();
const mysql = require('mysql2/promise');

async function seedData() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST || 'db',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'flowforge'
    });

    try {
        // Find existing users
        const [users] = await pool.query('SELECT id, email FROM Users');
        const getUserId = (email) => users.find(u => u.email === email)?.id;
        
        const employeeId = getUserId('employee@flowforge.com') || getUserId('test@test.com') || users[0].id;
        const managerId = getUserId('manager@flowforge.com') || getUserId('test@test.com') || users[0].id;

        // Find existing workflows
        const [workflows] = await pool.query('SELECT id, name FROM Workflows');
        const purchaseWfId = workflows.find(w => w.name === 'Purchase Approval')?.id || workflows[0].id;
        const itWfId = workflows.find(w => w.name === 'IT Access Request')?.id || workflows[0].id;

        // Insert Requests
        await pool.query('INSERT INTO Requests (title, description, amount, created_by, workflow_id, status) VALUES (?, ?, ?, ?, ?, ?)', 
            ['MacBook Pro M3 Max for Design Team', 'Need a high powered machine to render Figma prototypes faster.', 3500.00, employeeId, purchaseWfId, 'Approved']);
        const req1 = await pool.query('SELECT LAST_INSERT_ID() as id');

        await pool.query('INSERT INTO Requests (title, description, amount, created_by, workflow_id, status) VALUES (?, ?, ?, ?, ?, ?)', 
            ['Q4 Software Subscriptions', 'Renewal for Adobe Creative Cloud and Figma for 10 users.', 4200.00, employeeId, purchaseWfId, 'Pending']);
        const req2 = await pool.query('SELECT LAST_INSERT_ID() as id');

        await pool.query('INSERT INTO Requests (title, description, amount, created_by, workflow_id, status) VALUES (?, ?, ?, ?, ?, ?)', 
            ['Annual Team Offsite Flight Tickets', 'Flights for exactly 8 team members to Lisbon.', 6000.00, employeeId, purchaseWfId, 'Rejected']);
        const req3 = await pool.query('SELECT LAST_INSERT_ID() as id');

        await pool.query('INSERT INTO Requests (title, description, amount, created_by, workflow_id, status) VALUES (?, ?, ?, ?, ?, ?)', 
            ['AWS Database Access', 'Requesting read-only production DB access for analytics dashboard reporting.', null, employeeId, itWfId, 'Pending']);
        const req4 = await pool.query('SELECT LAST_INSERT_ID() as id');

        // Insert some Approvals to match Dashboard Mock logic
        // 1. Pending
        await pool.query("INSERT INTO Approvals (request_id, step_order, status) VALUES (?, ?, 'Pending')", [req2[0][0].id, 1]);
        await pool.query("INSERT INTO Approvals (request_id, step_order, status) VALUES (?, ?, 'Pending')", [req4[0][0].id, 1]);

        // 2. Approved
        await pool.query("INSERT INTO Approvals (request_id, step_order, status, approver_id, comment, approved_at) VALUES (?, ?, 'Approved', ?, ?, CURRENT_TIMESTAMP)", 
            [req1[0][0].id, 1, managerId, "Approved. Need this for Q4 roadmap."]);

        // 3. Rejected
        await pool.query("INSERT INTO Approvals (request_id, step_order, status, approver_id, comment, approved_at) VALUES (?, ?, 'Rejected', ?, ?, CURRENT_TIMESTAMP)", 
            [req3[0][0].id, 1, managerId, "Budget is constrained this quarter. We're flying domestic."]);

        console.log('Successfully seeded requests and approvals for realistic UI data!');

    } catch (error) {
        console.error('Failed to seed data:', error);
    } finally {
        await pool.end();
    }
}

seedData();
