require('dotenv').config();
const mysql = require('mysql2/promise');

async function fixSchema() {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    console.log('=== Current parking_record schema ===');
    const [rows] = await db.query('DESCRIBE parking_record');
    const existingCols = rows.map(r => r.Field);
    console.log('Existing columns:', existingCols.join(', '));

    const needed = [
        { col: 'slot_id', sql: 'ALTER TABLE parking_record ADD COLUMN slot_id INT NULL' },
        { col: 'exit_time', sql: 'ALTER TABLE parking_record ADD COLUMN exit_time TIMESTAMP NULL' },
        { col: 'duration_hours', sql: 'ALTER TABLE parking_record ADD COLUMN duration_hours INT NULL' },
        { col: 'total_charges', sql: 'ALTER TABLE parking_record ADD COLUMN total_charges DECIMAL(10,2) NULL' }
    ];

    for (const item of needed) {
        if (!existingCols.includes(item.col)) {
            await db.query(item.sql);
            console.log(`✅ Added: ${item.col}`);
        } else {
            console.log(`✔  Already exists: ${item.col}`);
        }
    }

    console.log('\n=== Current booking schema ===');
    const [brows] = await db.query('DESCRIBE booking');
    const bCols = brows.map(r => r.Field);
    console.log('Existing columns:', bCols.join(', '));

    if (!bCols.includes('slot_id')) {
        await db.query('ALTER TABLE booking ADD COLUMN slot_id INT NULL');
        console.log('✅ Added: booking.slot_id');
    } else {
        console.log('✔  Already exists: booking.slot_id');
    }

    console.log('\n✅ Schema is good!');
    await db.end();
}

fixSchema().catch(console.error);
