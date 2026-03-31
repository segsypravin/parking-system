require('dotenv').config();
const mysql = require('mysql2/promise');

async function fixUserId() {
    let db;
    try {
        db = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('--- Fixing user table AUTO_INCREMENT ---');

        await db.query('SET FOREIGN_KEY_CHECKS=0;');
        
        await db.query('ALTER TABLE user MODIFY user_id INT AUTO_INCREMENT;');
        console.log('✅ Added AUTO_INCREMENT to user.user_id');

        await db.query('SET FOREIGN_KEY_CHECKS=1;');

        console.log('✅ Done!');
        await db.end();
    } catch (err) {
        console.error('❌ Error modifying table:', err.message);
        if (db) await db.end();
    }
}

fixUserId();
