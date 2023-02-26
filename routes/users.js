require('dotenv').config();
const mysql = require('mysql');

const express = require('express');
const router = express.Router();
const {connectToDB} = require('./utils');

router.get('/get_userinfo?user_id=:user_id', (req, res) => {
    let user_id = req.params.user_id;
    let sql = `SELECT firstname, lastname, email FROM Users WHERE user_id = ${user_id};`;
    let response = connectToDB(sql);
    res.send(response);
});