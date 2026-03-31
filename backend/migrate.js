require('dotenv').config();
const mysql = require('mysql2/promise');

async function runMigrations() {
    let db;
    try {
        db = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('--- Running migrations ---');

        // Add missing columns to parking_record
        const alterations = [
            { col: 'slot_id', sql: 'ALTER TABLE parking_record ADD COLUMN slot_id INT NULL' },
            { col: 'exit_time', sql: 'ALTER TABLE parking_record ADD COLUMN exit_time TIMESTAMP NULL' },
            { col: 'duration_hours', sql: 'ALTER TABLE parking_record ADD COLUMN duration_hours INT NULL' },
            { col: 'total_charges', sql: 'ALTER TABLE parking_record ADD COLUMN total_charges DECIMAL(10,2) NULL' }
        ];

        for (const alt of alterations) {
            try {
                await db.query(alt.sql);
                console.log(`✅ Added column: ${alt.col}`);
            } catch (e) {
                if (e.code === 'ER_DUP_FIELDNAME') {
                    console.log(`⏭️  Column already exists: ${alt.col}`);
                } else {
                    console.error(`❌ Failed on ${alt.col}:`, e.message);
                }
            }
        }

        // Add slot_id to booking if missing (already done but safe to re-run)
        try {
            await db.query('ALTER TABLE booking ADD COLUMN slot_id INT NULL');
            console.log('✅ Added column: booking.slot_id');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') console.log('⏭️  booking.slot_id already exists');
            else console.error('❌ booking.slot_id:', e.message);
        }

        console.log('\n✅ All migrations done!');
        await db.end();
    } catch (err) {
        console.error('❌ Migration failed:', err.message);
        if (db) await db.end();
    }
}

runMigrations();
