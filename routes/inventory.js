require('dotenv').config();
const mysql = require('mysql');

const express = require('express');
const router = express.Router();
const {connectToDB} = require('./utils');

router.get('/all_inventory', async (req, res) => {
    let group_id = req.query.group_id;
    let sql = `SELECT inventory_name, category_name, running_low FROM Inventory NATURAL JOIN Inventory_categories WHERE group_id = ${group_id};`;
    let response = await connectToDB(sql);
    res.send(response);
});

router.get('/all_inventory_categories', async (req, res) => {
    let group_id = req.query.group_id;
    let sql = `SELECT DISTINCT category_name FROM Inventory_categories WHERE group_id = ${group_id};`;
    let response = await connectToDB(sql);
    res.send(response);
});

router.post('/add_inventory', async (req, res) => {
    let group_id = req.body.group_id;
    let inventory_name = req.body.inventory_name;
    let category_name = req.body.category_name;

    let date_added = new Date();
    date_added = date_added.toISOString().slice(0, 10);
    
    let sql = `SELECT DISTINCT ic_id FROM Inventory_categories WHERE group_id = ${group_id} AND category_name = "${category_name}";`;
    let response = await connectToDB(sql);
    let ic_id = response.message[0].ic_id;
    sql = `INSERT INTO Inventory (inventory_name, group_id, ic_id, date_added, running_low) VALUES("${inventory_name}", ${group_id}, ${ic_id}, "${date_added}", FALSE);`;
    response = await connectToDB(sql);
    
    res.send(response);

})

router.post('/add_category', async (req, res) => {
    let group_id = req.body.group_id;
    let category_name = req.body.category_name;

    let sql = `INSERT INTO Inventory_categories (group_id, category_name) VALUES(${group_id}, "${category_name}");`;
    let response = await connectToDB(sql);
    res.send(response);
});

router.put('/update_inventory', async (req, res) => {
    let inventory_id = req.body.inventory_id;
    let inventory_name = req.body.inventory_name;
    let ic_id = req.body.ic_id;

    let sql = `UPDATE Inventory SET inventory_name = ${inventory_name}, ic_id = ${ic_id} WHERE inventory_id = ${inventory_id};`;
    let response = await connectToDB(sql);
    res.send(response);
});


router.put('/update_lowinventory', async (req, res) => {
    let inventory_id = req.body.inventory_id;
    let running_low = req.body.running_low;

    let date_updated = new Date();
    date_updated = date_updated.toISOString().slice(0, 10);

    let sql = `UPDATE Inventory SET running_low = ${running_low}, date_updated = "${date_updated}" WHERE inventory_id = ${inventory_id};`;
    let response = await connectToDB(sql);
    res.send(response);

});

router.delete('/delete_inventory', async (req, res) => {
    let inventory_id = req.query.inventory_id;
    let sql = `DELETE FROM Inventory WHERE inventory_id = ${inventory_id};`;
    let response = await connectToDB(sql);
    res.send(response);
});


module.exports = router;