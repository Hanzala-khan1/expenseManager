const mysql = require("mysql2");


const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "expensemanager"
});


pool.getConnection((err, conn) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('DATABASE_CONNECTION_WAS_CLOSED');
        }
        if (err.code === 'ER_CON_COUNT_ERRORS') {
            console.log('DATABASE HAS TO MANY CONNECTIONS');
        }
        if (err.code === 'ECONNREFUSED') {
            console.log('DATABASE CONNECTION WAS REFUSED');
        }
    }

    if (conn) conn.release();
    console.log('DB is Connected');
    return;
})

module.exports = pool; 