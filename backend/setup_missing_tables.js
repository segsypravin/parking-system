require('dotenv').config();
const mysql = require('mysql2/promise');

async function createTables() {
    let db;
    try {
        db = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('--- Creating missing tables ---');

        await db.query(`
            CREATE TABLE IF NOT EXISTS location (
                location_id INT PRIMARY KEY AUTO_INCREMENT,
                location_name VARCHAR(100),
                address TEXT,
                total_levels INT
            );
        `);
        console.log('✅ location table created or already exists');

        await db.query(`
            CREATE TABLE IF NOT EXISTS booking (
                booking_id INT PRIMARY KEY AUTO_INCREMENT,
                user_id INT,
                vehicle_id INT,
                location_id INT,
                slot_type VARCHAR(20),
                preferred_level INT,
                status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
                rejection_reason TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ booking table created or already exists');

        await db.end();
    } catch (err) {
        console.error('❌ Error creating tables:', err.message);
        if (db) await db.end();
    }
}

createTables();
