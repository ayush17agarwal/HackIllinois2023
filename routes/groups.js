const express = require('express');
const router = express.Router();
const utils = require('./utils');

router.get('/my_groups', (req, res) => {

    let sql = `SELECT * FROM Rooms WHERE group_id IN (SELECT group_id FROM Group_users WHERE user_id = ${req.query.user_id});`;

    let response = utils.connectToDB(sql);

    console.log(response);
    res.send(response);
});

module.exports = router;