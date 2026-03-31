require('dotenv').config();
const db = require('./db');
const tables = ['parking_slot', 'booking', 'location', 'vehicle'];

const checkTable = (index) => {
    if (index >= tables.length) {
        process.exit();
        return;
    }
    const table = tables[index];
    db.query(`DESCRIBE ${table}`, (err, result) => {
        console.log(`--- ${table} ---`);
        if (err) {
            console.error(err.message);
        } else {
            console.table(result);
        }
        checkTable(index + 1);
    });
};

checkTable(0);
