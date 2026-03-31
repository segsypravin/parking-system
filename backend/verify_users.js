require('dotenv').config();
const db = require('./db');
db.query("SELECT * FROM user", (err, result) => {
    if (result) {
        console.log(JSON.stringify(result, null, 2));
    } else {
         console.error(err);
    }
    process.exit();
});
