const express = require('express');
const router = express.Router();
const axios = require('axios');
const { connectToDB } = require('./utils');
const Splitwise = require('splitwise');
require('dotenv').config();

const SPLITWISE_AUTHORIZE_URL = 'https://secure.splitwise.com/oauth/authorize';
const SPLITWISE_TOKEN_URL = 'https://secure.splitwise.com/oauth/token';
const REDIRECT_URI = encodeURI(process.env.redirect_uri + '/splitwise/callback');


router.get('/my_groups?user_id=:user_id', (req, res) => {

    let sql = 'SELECT * FROM Rooms';

    let response = connectToDB(sql);

    res.send(response);
});

router.post('/create_group?user_id=:user_id&group_name=:group_name', (req, res) => {
    // params group_name, user_id
    // res group_id
    user_id = req.params.user_id;
    group_name = req.params.group_name;

    // let sql = 'INSERT INTO Rooms';
    let sql = `SELECT email, useraccesstoken FROM Users WHERE user_id = ${user_id};`;
    let response = connectToDB(sql)
    email = response.message.email;
    useraccesstoken = response.message.useraccesstoken;

    const sw = Splitwise({
        consumerKey: process.env.SPLITWISE_CONSUMER_KEY,
        consumerSecret: process.env.SPLITWISE_CONSUMER_SECRET,
        accessToken: useraccesstoken
    });

    sw.createGroup({
        name: group_name
    }).then((swRes) => {
        group_id = swRes.group.id;
        let sql = `INSERT INTO Rooms VALUES (${group_id}, ${group_name}); INSERT INTO Group_users VALUES (${group_id}, ${user_id});`;
        let response = connectToDB(sql);
        res.send({
            group_id: group_id
        });
    });

});

router.get("/login", (req, res) => {
    const user_info = `${req.query.first_name}|${req.query.last_name}`;
    const encoded = Buffer.from(user_info, 'utf-8').toString('base64');
    res.redirect(SPLITWISE_AUTHORIZE_URL + '?response_type=code&client_id=' + process.env.SPLITWISE_CONSUMER_KEY + '&redirect_uri=' + REDIRECT_URI + '&state=' + encoded);
});

router.get("/callback", async (req, res) => {
    const code = req.query.code;
    const decoded = Buffer.from(req.query.state, 'base64').toString('utf8');
    const user_info = decoded.split('|');
    try {
        const { data: { access_token } } = await axios.post(SPLITWISE_TOKEN_URL, {
            grant_type: 'authorization_code',
            client_id: process.env.SPLITWISE_CONSUMER_KEY,
            client_secret: process.env.SPLITWISE_CONSUMER_SECRET,
            redirect_uri: REDIRECT_URI,
            code: code
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });
        const sw = Splitwise({
            consumerKey: process.env.SPLITWISE_CONSUMER_KEY,
            consumerSecret: process.env.SPLITWISE_CONSUMER_SECRET,
            accessToken: access_token 
        });
        sw.getCurrentUser().then( (swRes) => {
            s_id = swRes.id;
            s_email = swRes.email;
            let sql = `INSERT INTO Users VALUES (?, ?, "${s_email}", ${s_id}, ${useraccesstoken});`;
            let response = connectToDB(sql, user_info);
            res.send(response);
        });
        
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
    res.status(200);
});

router.post('/join_group?group_id=:group_id&user_id=:user_id', (req, res) => {
    group_id = req.params.group_id;
    user_id = req.params.user_id;

    let sql = `SELECT useraccesstoken FROM Users WHERE user_id = ${user_id};`;
    let response = connectToDB(sql)
    useraccesstoken = response.message.useraccesstoken;

    const sw = Splitwise({
        consumerKey: process.env.SPLITWISE_CONSUMER_KEY,
        consumerSecret: process.env.SPLITWISE_CONSUMER_SECRET,
        accessToken: useraccesstoken
    });

    sw.addUserToGroup({
        group_id: group_id,
        user_id: user_id
    }).then( (swRes) => {
    
        let sql = `INSERT INTO Group_users VALUES (${group_id}, ${user_id});`;
        let response = connectToDB(sql);
        res.send({
            group_id: group_id
        });
    });

        console.log(sw);
        res.send(response);
    
});

router.post('/add_group_expense?user_id=:user_id&group_id=:group_id&cost=:cost&description=:description', (req, res) => {
    group_id = req.params.group_id;
    cost = req.params.cost;
    description = req.params.description;

    let sql = `SELECT useraccesstoken FROM Users WHERE user_id = ${user_id};`;
    let response = connectToDB(sql)
    useraccesstoken = response.message.useraccesstoken;

    const sw = Splitwise({
        consumerKey: process.env.SPLITWISE_CONSUMER_KEY,
        consumerSecret: process.env.SPLITWISE_CONSUMER_SECRET,
        accessToken: useraccesstoken
    });

    sw.createExpense({
        group_id: group_id,
        cost: cost,
        description: description,
        split_equally: true
    }).then( (swRes) => {
        res.send(swRes);
    });

});

module.exports = router;