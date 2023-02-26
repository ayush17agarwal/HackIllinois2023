require('dotenv').config();
const mysql = require('mysql');

const express = require('express');
const router = express.Router();
const {connectToDB} = require('./utils');



router.post('/add_chore', (req, res) => {

    let chore_name = req.body.chore_name;
    let recurring_value = req.body.recurring_value;
    let chore_description = req.body.chore_description;
    let date_added = new Date();
    date_added = date_added.toISOString().slice(0,10);
    let group_id = req.body.group_id;
    let assignee_id = req.body.assignee_id;
    let due_date = req.body.due_date;

    let sql = `INSERT INTO Chores (chore_name, recurring_value, chore_description, date_added, group_id, assignee_id, due_date) VALUES (${chore_name}, ${recurring_value}, ${chore_description}, ${date_added}, ${group_id}, ${assignee_id}, ${due_date});`;

    let response = connectToDB(sql);

    res.send(response);
});


router.get('/all_chores?group_id=:group_id', (req, res) => {
    let group_id = req.query.group_id;

    let sql = `SELECT * FROM Chores where group_id = ${group_id}`;

    let response = connectToDB(sql);

    res.send(response);
});

router.post('/completed_chore', (req, res) => {

    let sql = `UPDATE Chores SET completed = TRUE WHERE chore_id = ${req.body.chore_id};`;

    let response = connectToDB(sql);

    res.send(response);
});

router.delete('/delete_chore?chore_id=:chore_id', (req, res) => {

    let sql = `DELETE FROM Chores WHERE chore_id = ${req.query.chore_id});`;

    let response = connectToDB(sql);

    res.send(response);
});

router.put('/update_chore', (req, res) => {
    let chore_id = req.body.chore_id;
    let chore_name = req.body.chore_name;
    let recurring_value = req.body.recurring_value;
    let chore_description = req.body.chore_description;
    let assignee_id = req.body.assignee_id;
    let due_date = req.body.due_date;

    let sql = `UPDATE Chores` + 
                `SET chore_name = ${chore_name}, recurring_value = ${recurring_value}, chore_description = ${chore_description}, assignee_id = ${assignee_id}, due_date = ${due_date}` + 
                `WHERE chore_id = ${chore_id};`;

    let response = connectToDB(sql);

    res.send(response);
});




//del chore DELETE

//update chore UPDATE

//

module.exports = router;