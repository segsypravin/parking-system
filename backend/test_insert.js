require('dotenv').config();
const db = require('./db');
const bcrypt = require('bcryptjs');

async function testInsert() {
    try {
        const email = 'regtest5@example.com';
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash('pass', salt);
        const [res] = await db.query(
            "INSERT INTO user (name, email, password, contact_no, user_type) VALUES (?, ?, ?, ?, 'User')", 
            ['test', email, hash, '000']
        );
        console.log('Success!', res);
        process.exit(0);
    } catch (e) {
        console.error('Error insert:', e);
        process.exit(1);
    }
}
testInsert();
