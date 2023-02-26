const mysql = require('mysql');
require('dotenv').config();

const con = mysql.createConnection({
    host: process.env.MYSQL_DB_HOST,
    user: process.env.MYSQL_DB_USER,
    password: process.env.MYSQL_DB_PASSWD
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Databased connected!");
});

exports.databaseConnection = con;