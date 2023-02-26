require('dotenv').config();
const mysql = require('mysql');

const express = require('express');
const router = express.Router();
const {connectToDB} = require('./utils');

router.get('/all_inventory?group_id=:group_id', (req, res) => {
    let group_id = req.params.group_id;
    let sql = 'SELECT name, category_name, running_low FROM Inventory NATURAL JOIN Inventory_categories';
    let response = connectToDB(sql);
});


module.exports = router;