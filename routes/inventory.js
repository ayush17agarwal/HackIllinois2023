require('dotenv').config();
const mysql = require('mysql');

const express = require('express');
const router = express.Router();
const {connectToDB} = require('./utils');

router.get('/all_inventory?group_id=:group_id', (req, res) => {
    let group_id = req.params.group_id;
    let sql = `SELECT name, category_name, running_low FROM Inventory NATURAL JOIN Inventory_categories WHERE group_id = ${group_id};`;
    let response = connectToDB(sql);
    res.send(response);
});

router.post('/add_inventory?inventory_name=:inventory_name&group_id=:group_id&category_name=:category_name', (req, res) => {
    let group_id = req.params.group_id;
    let inventory_name = req.params.inventory_name;
    let category_name = req.params.category_name;

    var d = Date.now(),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
    let date_added = [year, month, day].join('-');
    
    let sql = `INSERT INTO Inventory (inventory_name, group_id, category_name, date_added) VALUES("${inventory_name}", ${group_id}, "${category_name}", "${date_added}");`;
    let response = connectToDB(sql);
    res.send(response);

})

router.put('/update_inventory?inventory_id=:inventory_id&running_low=:running_low', (req, res) => {
    let inventory_id = req.params.inventory_id;
    let running_low = req.params.running_low;

    var d = Date.now(),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
    let date_updated = [year, month, day].join('-');

    let sql = `UPDATE TABLE Inventory SET running_low = ${running_low}, date_updated = ${date_updated} WHERE inventory_id = ${inventory_id};`;
    let response = connectToDB(sql);
    res.send(response);

});

router.delete('/delete_inventory?inventory_id=:inventory_id', (req, res) => {
    let inventory_id = req.params.inventory_id;
    let sql = `DELETE FROM Inventory WHERE inventory_id = ${inventory_id};`;
    let response = connectToDB(sql);
    res.send(response);
});


module.exports = router;