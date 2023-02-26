require('dotenv').config();
const mysql = require('mysql');

async function connectToDB(sql, subs) {
    let res;
    
    const con = mysql.createConnection({
        host: process.env.MYSQL_DB_HOST,
        user: process.env.MYSQL_DB_USER,
        password: process.env.MYSQL_DB_PASSWD,
        database: 'livvdb'
    });

    try {
        res = await con.query(sql, subs);
    } catch (err) {
        return {status: '400 BAD REQUEST SQL ERROR'}
    }

    try {
        await con.end();
        console.log('Connection closed.');
    } catch (err) {
        res = {status: '400 CONNECTION NOT CLOSED'}    
    }

    return res;
}

module.exports = { connectToDB };
