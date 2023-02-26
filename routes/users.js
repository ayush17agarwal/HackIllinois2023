require('dotenv').config();
const mysql = require('mysql');

const express = require('express');
const router = express.Router();
const {connectToDB} = require('./utils');

router.get('/get_userinfo', async (req, res) => {
    let user_id = req.query.user_id;
    let sql = `SELECT firstname, lastname, email FROM Users WHERE user_id = ${user_id};`;
    let response = await connectToDB(sql);
    res.send(response);
});

module.exports = router;