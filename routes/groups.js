const express = require('express');
const router = express.Router();
const utils = require('./utils');

router.get('/my_groups', (req, res) => {

    let sql = `SELECT * FROM Rooms WHERE group_id IN (SELECT group_id FROM Group_users WHERE user_id = ${req.query.user_id});`;

    let response = utils.connectToDB(sql);

    console.log(response);
    res.send(response);
});

//create group in splitwise.js

router.post('/join', (req, res) => {
    let group_id = req.body.group_id;
    let user_id = req.body.user_id;

    let sql = `INSERT INTO Group_users (group_id, user_id) VALUES (${group_id}, ${user_id});`;

    let response = utils.connectToDB(sql);

    res.send(response);
});

router.get('/', (req, res) => {
    res.send("test groups");
});

module.exports = router;