const express = require('express');
const router = express.Router();
const {connectToDB} = require('./utils');

router.get('/my_groups', async (req, res) => {

    const user_id = req.query.user_id;

    let sql = `SELECT * FROM Rooms WHERE group_id IN (SELECT group_id FROM Group_users WHERE user_id = ${user_id});`;

    let response = await connectToDB(sql);

    res.send(response);
});

module.exports = router;