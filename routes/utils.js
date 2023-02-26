require('dotenv').config();
const mysql = require('mysql2/promise');
const bluebird = require('bluebird');

async function connectToDB(sql, subs) {
    let res;
    
    const con = await mysql.createConnection({
        host: process.env.MYSQL_DB_HOST,
        user: process.env.MYSQL_DB_USER,
        password: process.env.MYSQL_DB_PASSWD,
        database: 'livvdb',
        Promise: bluebird
    });

    try {
        const [rows, fields]= await con.execute(sql, subs);
        res = rows;
        console.log(res);
    } catch (err) {
        return {status: '400 BAD REQUEST SQL ERROR', message: err};
    }

    try {
        await con.end();
        console.log('Connection closed.');
    } catch (err) {
        return {status: '400 CONNECTION NOT CLOSED'}; 
    }

    return res;
}

module.exports = { connectToDB };
