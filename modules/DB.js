const mysql = require('mysql2')
async function db(sql) {
    const mysql = require('mysql2/promise');
    const conn = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USERNAME,
        database: process.env.MYSQL_DB,
        port: process.env.MYSQL_PORT,
        password: process.env.MYSQL_PASSWORD
    });

    const [rows, fields, err] = await conn.execute(sql)

    await conn.end();
    return rows
}

const condb = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME,
    database: process.env.MYSQL_DB,
    port: process.env.MYSQL_PORT,
    password: process.env.MYSQL_PASSWORD
})
module.exports.db = db
module.exports.condb = condb