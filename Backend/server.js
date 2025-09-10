const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.connect()
  .then(() => console.log("✅ Connected to Render PostgreSQL"))
  .catch(err => console.error("❌ DB connection error", err.stack));

// Function to sanitize table names
const sanitizeTableName = (name) => {
    // Replace spaces and special characters with underscores, and convert to lowercase
    return name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
};

// API endpoint to handle form submissions
app.post('/api/leads', async (req, res) => {
    const formData = req.body;
    const location = formData.locations; // Assuming 'locations' field holds the location

    if (!location) {
        return res.status(400).json({ error: 'Location is required' });
    }

    const tableName = sanitizeTableName(location);

    // Sanitize data: convert empty strings to null for numeric and date fields
    const numericFields = ['budget', 'loanAmount', 'totalFamilyMembers'];
    const dateFields = ['leadDate', 'visitDate', 'dob', 'followupDate', 'remarkDate'];

    for (const key in formData) {
        if ((numericFields.includes(key) || dateFields.includes(key)) && (formData[key] === '' || formData[key] === null)) {
            formData[key] = null;
        }
    }

    // Convert date fields from number (timestamp) to DD-MM-YYYY string
    dateFields.forEach(field => {
        if (formData[field] && typeof formData[field] === 'number') {
            const date = new Date(formData[field]);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
            const year = date.getFullYear();
            formData[field] = `${day}-${month}-${year}`;
        }
    });

    try {
        // Check if table exists, and create if it doesn't
        await pool.query(`
            CREATE TABLE IF NOT EXISTS ${tableName} (
                id SERIAL PRIMARY KEY,
                sr_no VARCHAR(255),
                lead_date DATE,
                visit_date DATE,
                visit_status VARCHAR(255),
                name VARCHAR(255),
                contact1 VARCHAR(255),
                contact2 VARCHAR(255),
                email VARCHAR(255),
                dob DATE,
                total_family_members INTEGER,
                categories VARCHAR(255),
                locations VARCHAR(255),
                property_type VARCHAR(255),
                bhk VARCHAR(255),
                budget NUMERIC,
                loan_req VARCHAR(255),
                loan_amount NUMERIC,
                caller_name VARCHAR(255),
                meeting_attended_by VARCHAR(255),
                visit_sm_name VARCHAR(255),
                interested_project VARCHAR(255),
                reference VARCHAR(255),
                pickup_drop VARCHAR(255),
                booking_confirmation VARCHAR(255),
                cate VARCHAR(255),
                followup_date DATE,
                p1sm VARCHAR(255),
                p2sm VARCHAR(255),
                p3sm VARCHAR(255),
                p4sm VARCHAR(255),
                p5sm VARCHAR(255),
                remark_date DATE,
                remark TEXT,
                banking_remark TEXT,
                gh_dt_cc VARCHAR(255),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Prepare the insert query
        const columns = Object.keys(formData).map(key => key.replace(/([A-Z])/g, '_$1').toLowerCase());
        const values = Object.values(formData);
        const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

        const insertQuery = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders}) RETURNING *;`;

        const result = await pool.query(insertQuery, values);

        res.status(201).json({ message: 'Lead captured successfully!', data: result.rows[0] });
    } catch (error) {
        console.error('Error capturing lead:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API endpoint to get the next Sr. No. for a location
app.get('/api/leads/next-sr-no', async (req, res) => {
    const { location } = req.query;

    if (!location) {
        return res.status(400).json({ error: 'Location is required' });
    }

    const tableName = sanitizeTableName(location);

    try {
        // Check if the table exists
        const tableExistsResult = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = $1
            );
        `, [tableName]);

        if (!tableExistsResult.rows[0].exists) {
            // If table doesn't exist, next Sr. No. is 1
            return res.json({ nextSrNo: 1 });
        }

        // If table exists, get the count of rows
        const result = await pool.query(`SELECT COUNT(*) FROM ${tableName}`);
        const count = parseInt(result.rows[0].count, 10);
        res.json({ nextSrNo: count + 1 });
    } catch (error) {
        console.error('Error getting next Sr. No.:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to get all locations (tables)
app.get('/api/locations', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
              AND table_name NOT LIKE 'pg_%' 
              AND table_name NOT LIKE 'sql_%';
        `);
        const locations = result.rows.map(row => row.table_name);
        res.json(locations);
    } catch (error) {
        console.error('Error fetching locations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to get leads for a specific location
app.get('/api/leads/:location', async (req, res) => {
    const { location } = req.params;
    const tableName = sanitizeTableName(location); // Sanitize to be safe

    try {
        const result = await pool.query(`SELECT * FROM ${tableName} ORDER BY id ASC`);
        res.json(result.rows);
    } catch (error) {
        console.error(`Error fetching leads for ${location}:`, error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/leads/delete-multiple', async (req, res) => {
    const { location, ids } = req.body;

    if (!location || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: 'Location and an array of IDs are required.' });
    }

    const tableName = sanitizeTableName(location);

    try {
        // Ensure all IDs are integers for the IN clause
        const validIds = ids.map(id => parseInt(id, 10)).filter(id => !isNaN(id));

        if (validIds.length === 0) {
            return res.status(400).json({ error: 'No valid IDs provided for deletion.' });
        }

        // Construct the query with an IN clause for multiple IDs
        const query = `DELETE FROM ${tableName} WHERE id IN (${validIds.map((_, i) => `${i + 1}`).join(', ')}) RETURNING id;`;
        const result = await pool.query(query, validIds);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'No matching leads found for deletion.' });
        }

        res.status(204).send(); // 204 No Content for successful deletion
    } catch (error) {
        console.error('Error deleting multiple leads:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});