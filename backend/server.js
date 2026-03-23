require('dotenv').config();

const REQUIRED_ENV = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'JWT_SECRET'];
const missing = REQUIRED_ENV.filter(k => !process.env[k]);
if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

/* --- AUTH ROUTES --- */

app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Check if user already exists
        const [existingUsers] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Default role
        const role = 'Employee'; 

        const [result] = await pool.query(
            'INSERT INTO Users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role]
        );

        const user = { id: result.insertId, name, email, role };
        const token = jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ token, user });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const [users] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
        
        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);
        
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '24h' });
        
        res.json({
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

/* --- DASHBOARD STATS --- */
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
    try {
        const [totalRequestsArr] = await pool.query('SELECT COUNT(*) as count FROM Requests');
        const [pendingApprovalsArr] = await pool.query("SELECT COUNT(*) as count FROM Approvals WHERE status = 'Pending'");
        const [approvedRequestsArr] = await pool.query("SELECT COUNT(*) as count FROM Requests WHERE status = 'Approved'");

        // Trend Data (Requests per day, based on days param)
        const days = parseInt(req.query.days) || 30;
        const [trendData] = await pool.query(`
            SELECT 
                DATE_FORMAT(created_at, '%Y-%m-%d') as date,
                COUNT(*) as count
            FROM Requests
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
            GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')
            ORDER BY date ASC
        `, [days]);

        // Distribution Data (Requests per workflow)
        const [distributionData] = await pool.query(`
            SELECT 
                w.name as workflow_name,
                COUNT(*) as count
            FROM Requests r
            JOIN Workflows w ON r.workflow_id = w.id
            GROUP BY w.id, w.name
            ORDER BY count DESC
        `);

        res.json({
            totalRequests: totalRequestsArr[0].count,
            pendingApprovals: pendingApprovalsArr[0].count,
            approvedRequests: approvedRequestsArr[0].count,
            trendData,
            distributionData
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

/* --- ANALYTICS --- */
app.get('/api/analytics', authenticateToken, async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 30;

        // 1. Basic KPIs (scoped to selected days)
        const [totalWorkflows] = await pool.query(
            'SELECT COUNT(*) as count FROM Requests WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)', [days]);
        
        const [bottlenecks] = await pool.query(
            "SELECT COUNT(*) as count FROM Requests WHERE status = 'Pending' AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)", [days]);

        const [approved] = await pool.query(
            "SELECT COUNT(*) as count FROM Requests WHERE status = 'Approved' AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)", [days]);
        const hoursSaved = approved[0].count * 4;

        // Calculate Global Avg Resolution Time (Approved requests in period)
        const [timeRows] = await pool.query(`
            SELECT AVG(TIMESTAMPDIFF(MINUTE, r.created_at, a.approved_at)) as avg_minutes
            FROM Approvals a
            JOIN Requests r ON a.request_id = r.id
            WHERE a.status = 'Approved' AND r.created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
        `, [days]);
        
        let avgResolutionTime = '-';
        if (timeRows[0].avg_minutes !== null) {
            avgResolutionTime = (timeRows[0].avg_minutes / 60).toFixed(1) + ' hrs';
        }

        // 2. Volume Data (monthly buckets in selected period)
        const [volumeDbData] = await pool.query(`
            SELECT 
                DATE_FORMAT(created_at, '%Y-%m') as month,
                SUM(CASE WHEN status = 'Approved' THEN 1 ELSE 0 END) as completed,
                COUNT(*) as initiated
            FROM Requests
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
            GROUP BY DATE_FORMAT(created_at, '%Y-%m')
            ORDER BY month ASC
        `, [days]);

        // 3. Efficiency Data by Workflow — COALESCE ensures workflows with no completions also appear
        const [efficiencyDbData] = await pool.query(`
            SELECT 
                w.name as workflow_name,
                COALESCE(
                    AVG(TIMESTAMPDIFF(HOUR, r.created_at, a.approved_at)),
                    0
                ) as avg_hours,
                COUNT(r.id) as total_requests,
                SUM(CASE WHEN a.status = 'Approved' THEN 1 ELSE 0 END) as completed_count
            FROM Workflows w
            LEFT JOIN Requests r ON r.workflow_id = w.id AND r.created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
            LEFT JOIN Approvals a ON r.id = a.request_id
            GROUP BY w.id, w.name
            HAVING total_requests > 0
            ORDER BY avg_hours ASC
        `, [days]);

        res.json({
            totalWorkflows: totalWorkflows[0].count,
            avgResolutionTime: avgResolutionTime, 
            bottlenecks: bottlenecks[0].count,
            hoursSaved: hoursSaved,
            volumeData: volumeDbData,
            efficiencyData: efficiencyDbData
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

/* --- REQUESTS ROUTES --- */

app.get('/api/requests', authenticateToken, async (req, res) => {
    try {
        let query = `
            SELECT r.*, u.name as requestor_name, w.name as workflow_name
            FROM Requests r
            JOIN Users u ON r.created_by = u.id
            JOIN Workflows w ON r.workflow_id = w.id
            WHERE r.created_by = ?
            ORDER BY r.created_at DESC
        `;
        const [requests] = await pool.query(query, [req.user.id]);
        res.json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/requests', authenticateToken, async (req, res) => {
    try {
        const { title, description, amount, workflow_id } = req.body;
        const userId = req.user.id;
        
        // 1. Create the request
        const [result] = await pool.query(
            'INSERT INTO Requests (title, description, amount, created_by, workflow_id) VALUES (?, ?, ?, ?, ?)',
            [title, description, amount, userId, workflow_id]
        );
        const newRequestId = result.insertId;

        // 2. Fetch the first step of the workflow to create the initial approval record
        const [steps] = await pool.query('SELECT * FROM WorkflowSteps WHERE workflow_id = ? ORDER BY step_order ASC LIMIT 1', [workflow_id]);
        
        if (steps.length > 0) {
            // Usually we'd figure out exactly WHO the approver is based on role and org chart.
            // For now, we leave approver_id NULL so any user with that role (e.g., 'Manager') can claim/approve it.
            await pool.query(
                "INSERT INTO Approvals (request_id, step_order, status) VALUES (?, ?, 'Pending')",
                [newRequestId, steps[0].step_order]
            );
        }

        res.status(201).json({ id: newRequestId, message: 'Request created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

/* --- APPROVALS ROUTES --- */
app.get('/api/approvals/stats', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Calculate Average Response Time (in minutes) for this user's completed approvals
        const [timeRows] = await pool.query(`
            SELECT AVG(TIMESTAMPDIFF(MINUTE, r.created_at, a.approved_at)) as avg_minutes
            FROM Approvals a
            JOIN Requests r ON a.request_id = r.id
            WHERE a.approver_id = ? AND a.status IN ('Approved', 'Rejected') AND a.approved_at IS NOT NULL
        `, [userId]);
        
        // Convert to hours for display
        let avgResponseTime = '-';
        if (timeRows[0].avg_minutes !== null) {
            avgResponseTime = (timeRows[0].avg_minutes / 60).toFixed(1) + ' hours';
        }

        // 2. Calculate Approval Rate (%) for this user's completed approvals
        const [statusRows] = await pool.query(`
            SELECT status, COUNT(*) as count
            FROM Approvals
            WHERE approver_id = ? AND status IN ('Approved', 'Rejected')
            GROUP BY status
        `, [userId]);

        let approvedCount = 0;
        let rejectedCount = 0;
        
        statusRows.forEach(row => {
            if (row.status === 'Approved') approvedCount = row.count;
            if (row.status === 'Rejected') rejectedCount = row.count;
        });

        const totalCompleted = approvedCount + rejectedCount;
        let approvalRate = '-';
        if (totalCompleted > 0) {
            approvalRate = Math.round((approvedCount / totalCompleted) * 100) + '%';
        }

        res.json({
            avgResponseTime,
            approvalRate
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});
app.get('/api/approvals', authenticateToken, async (req, res) => {
     try {
         const tab = req.query.tab || 'pending';
         let query = '';
         let params = [];

         if (tab === 'history') {
             query = `
                 SELECT a.*, r.title, r.amount, r.created_at, u.name as requestor_name
                 FROM Approvals a
                 JOIN Requests r ON a.request_id = r.id
                 JOIN Users u ON r.created_by = u.id
                 WHERE a.approver_id = ? AND a.status IN ('Approved', 'Rejected')
                 ORDER BY a.approved_at DESC
             `;
             params = [req.user.id];
         } else if (tab === 'archived') {
             query = `
                 SELECT a.*, r.title, r.amount, r.created_at, u.name as requestor_name
                 FROM Approvals a
                 JOIN Requests r ON a.request_id = r.id
                 JOIN Users u ON r.created_by = u.id
                 JOIN WorkflowSteps ws ON r.workflow_id = ws.workflow_id AND a.step_order = ws.step_order
                 WHERE ws.role_required = ? AND r.status IN ('Approved', 'Rejected')
                 ORDER BY r.created_at DESC
             `;
             params = [req.user.role];
         } else {
             query = `
                 SELECT a.*, r.title, r.amount, r.created_at, u.name as requestor_name
                 FROM Approvals a
                 JOIN Requests r ON a.request_id = r.id
                 JOIN Users u ON r.created_by = u.id
                 JOIN WorkflowSteps ws ON r.workflow_id = ws.workflow_id AND a.step_order = ws.step_order
                 WHERE a.status = 'Pending' AND ws.role_required = ?
                 ORDER BY r.created_at DESC
             `;
             params = [req.user.role];
         }

         const [approvals] = await pool.query(query, params);
         res.json(approvals);
     } catch (error) {
         console.error(error);
         res.status(500).json({ error: 'Server error' });
     }
});

app.post('/api/approvals/:id/approve', authenticateToken, async (req, res) => {
    try {
        const approvalId = req.params.id;
        const { comment } = req.body;
        const userId = req.user.id;

        // 1. Update Approval Record
        await pool.query(
            "UPDATE Approvals SET status = 'Approved', approver_id = ?, comment = ?, approved_at = CURRENT_TIMESTAMP WHERE id = ?",
            [userId, comment, approvalId]
        );

        // 2. Determine if there is a next step
        const [approvalRecs] = await pool.query("SELECT request_id, step_order FROM Approvals WHERE id = ?", [approvalId]);
        const requestId = approvalRecs[0].request_id;
        const currentStep = approvalRecs[0].step_order;

        const [requestRecs] = await pool.query("SELECT workflow_id FROM Requests WHERE id = ?", [requestId]);
        const workflowId = requestRecs[0].workflow_id;

        const [nextSteps] = await pool.query(
            "SELECT * FROM WorkflowSteps WHERE workflow_id = ? AND step_order > ? ORDER BY step_order ASC LIMIT 1",
            [workflowId, currentStep]
        );

        if (nextSteps.length > 0) {
            // Create next pending approval
            await pool.query(
                "INSERT INTO Approvals (request_id, step_order, status) VALUES (?, ?, 'Pending')",
                [requestId, nextSteps[0].step_order]
            );
        } else {
            // Workflow complete! Update Request status to Approved
            await pool.query("UPDATE Requests SET status = 'Approved' WHERE id = ?", [requestId]);
        }

        res.json({ message: 'Request approved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/approvals/:id/reject', authenticateToken, async (req, res) => {
    try {
        const approvalId = req.params.id;
        const { comment } = req.body;
        const userId = req.user.id;

        await pool.query(
            "UPDATE Approvals SET status = 'Rejected', approver_id = ?, comment = ?, approved_at = CURRENT_TIMESTAMP WHERE id = ?",
            [userId, comment, approvalId]
        );

        const [approvalRecs] = await pool.query("SELECT request_id FROM Approvals WHERE id = ?", [approvalId]);
        const requestId = approvalRecs[0].request_id;

        await pool.query("UPDATE Requests SET status = 'Rejected' WHERE id = ?", [requestId]);

        res.json({ message: 'Request rejected' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

/* --- WORKFLOWS --- */
app.get('/api/workflows', authenticateToken, async (req, res) => {
    try {
        const [workflows] = await pool.query('SELECT * FROM Workflows ORDER BY name ASC');
        res.json(workflows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));
