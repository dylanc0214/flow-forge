const mysql = require('mysql2/promise');

async function seedAnalyticsData() {
    const pool = mysql.createPool({
        host: '161.97.95.16',
        user: 'dylanc0214',
        password: 'l0o0feHZpp42Zk',
        database: 'flowforge'
    });

    try {
        // Find existing users
        const [users] = await pool.query('SELECT id, email FROM Users');
        const getUserId = (email) => users.find(u => u.email === email)?.id;
        
        const employeeId = getUserId('employee@flowforge.com') || getUserId('test@test.com') || (users.length > 0 ? users[0].id : 1);
        const managerId = getUserId('manager@flowforge.com') || getUserId('test@test.com') || (users.length > 0 ? users[0].id : 1);

        // Find existing workflows
        const [workflows] = await pool.query('SELECT id, name FROM Workflows');
        const purchaseWfId = workflows.find(w => w.name === 'Purchase Approval')?.id || workflows[0].id;
        const itWfId = workflows.find(w => w.name === 'IT Access Request')?.id || workflows[0].id;

        console.log("Seeding historical data for the last 6 months...");

        // Helper to generate a random date in the past N days
        const getRandomDate = (daysAgoStart, daysAgoEnd) => {
            const start = new Date();
            start.setDate(start.getDate() - daysAgoStart);
            const end = new Date();
            end.setDate(end.getDate() - daysAgoEnd);
            return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        };

        // We will generate 80 requests spread across the last 180 days (6 months)
        for (let i = 0; i < 80; i++) {
            const createdDate = getRandomDate(180, 2); // between 180 days ago and 2 days ago
            const createdDateStr = createdDate.toISOString().slice(0, 19).replace('T', ' ');

            const isPurchase = Math.random() > 0.4;
            const wfId = isPurchase ? purchaseWfId : itWfId;
            const title = isPurchase ? `Purchase Request #${i}` : `IT Access Request #${i}`;
            const amount = isPurchase ? (Math.random() * 5000 + 100).toFixed(2) : null;
            
            // Randomly determine status: 70% Approved, 10% Rejected, 20% Pending
            const randFormat = Math.random();
            let status = 'Pending';
            if (randFormat < 0.7) status = 'Approved';
            else if (randFormat < 0.8) status = 'Rejected';

            // Insert Request with backdated created_at
            const [reqResult] = await pool.query(
                `INSERT INTO Requests (title, description, amount, created_by, workflow_id, status, created_at) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`, 
                 [title, `Historical data generated for analytics. ID: ${i}`, amount, employeeId, wfId, status, createdDateStr]
            );
            const reqId = reqResult.insertId;

            // Generate approval record based on status
            if (status === 'Pending') {
                await pool.query(
                    `INSERT INTO Approvals (request_id, step_order, status) VALUES (?, 1, 'Pending')`, 
                    [reqId]
                );
            } else {
                // If Approved/Rejected, generate an approved_at date that is 1 to 72 hours after created_at
                const hoursToApprove = Math.random() * 71 + 1; // 1 to 72 hours
                const approvedDate = new Date(createdDate.getTime() + hoursToApprove * 60 * 60 * 1000);
                const approvedDateStr = approvedDate.toISOString().slice(0, 19).replace('T', ' ');

                await pool.query(
                    `INSERT INTO Approvals (request_id, step_order, status, approver_id, comment, approved_at) 
                     VALUES (?, 1, ?, ?, 'Automated historical review', ?)`, 
                    [reqId, status, managerId, approvedDateStr]
                );
            }
        }

        console.log('Successfully seeded 80 historical requests and approvals for analytics charts!');

    } catch (error) {
        console.error('Failed to seed data:', error);
    } finally {
        await pool.end();
    }
}

seedAnalyticsData();
