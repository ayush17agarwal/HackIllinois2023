require('dotenv').config();
const mysql = require('mysql2');

const express = require('express');
const router = express.Router();
const {connectToDB} = require('./utils');


//DONE
router.post('/add_chore', async (req, res) => {

    let chore_name = req.body.chore_name;
    let recurring_value = req.body.recurring_value;
    let chore_description = req.body.chore_description;
    let date_added = new Date();
    date_added = date_added.toISOString().slice(0,10);
    let group_id = req.body.group_id;
    let assignee_id = req.body.assignee_id;
    let due_date = req.body.due_date;

    let sql = `INSERT INTO Chores (chore_name, recurring_value, chore_description, date_added, group_id, assignee_id, due_date, completed) VALUES ("${chore_name}", ${recurring_value}, "${chore_description}", "${date_added}", ${group_id}, ${assignee_id}, "${due_date}", "FALSE");`;

    let response = await connectToDB(sql, []);

    res.send(response);
});

//DONE
router.get('/all_chores', async (req, res) => {
    let group_id = req.query.group_id;

    let sql = `SELECT * FROM Chores WHERE group_id=${group_id};`;

    const response = await connectToDB(sql, []);

    res.send(response);
});

//DONE
router.put('/completed_chore', async (req, res) => {

    let sql = `UPDATE Chores SET completed = 1 WHERE chore_id = ${req.body.chore_id};`;

    let response = await connectToDB(sql, []);

    res.send(response);
});

//DONE
router.delete('/delete_chore', async (req, res) => {

    let sql = `DELETE FROM Chores WHERE chore_id = ${req.query.chore_id};`;

    let response = await connectToDB(sql, []);

    res.send(response);
});


//DONE
router.put('/update_chore', async (req, res) => {
    let chore_id = req.body.chore_id;
    let chore_name = req.body.chore_name;
    let recurring_value = req.body.recurring_value;
    let chore_description = req.body.chore_description;
    let assignee_id = req.body.assignee_id;
    let due_date = req.body.due_date;

    let sql = `UPDATE Chores` + 
                ` SET chore_name = "${chore_name}", recurring_value = ${recurring_value}, chore_description = "${chore_description}", assignee_id = ${assignee_id}, due_date = "${due_date}"` + 
                ` WHERE chore_id = ${chore_id};`;

    let response = await connectToDB(sql, []);

    res.send(response);
});

//DONE
router.get('', async (req, res) => {
    let chore_id = req.query.chore_id;

    let sql = `SELECT chore_name, recurring_value, chore_description, assignee_id FROM Chores WHERE chore_id = ${chore_id}`;

    let response = await connectToDB(sql, []);

    res.send(response);
});

module.exports = router;