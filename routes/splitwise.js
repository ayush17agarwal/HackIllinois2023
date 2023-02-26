const express = require('express');
const router = express.Router();
const axios = require('axios');
const { connectToDB } = require('./utils');
const Splitwise = require('splitwise');
require('dotenv').config();

const SPLITWISE_AUTHORIZE_URL = 'https://secure.splitwise.com/oauth/authorize';
const SPLITWISE_TOKEN_URL = 'https://secure.splitwise.com/oauth/token';
const REDIRECT_URI = encodeURI(process.env.redirect_uri + '/splitwise/callback');

//DONE
router.post('/create_group', async (req, res) => {
    // params group_name, user_id
    // res group_id
    user_id = req.body.user_id;
    group_name = req.body.group_name;

    let sql = `SELECT email, useraccesstoken, splitwise_id FROM Users WHERE user_id = ${user_id};`;
    let response = await connectToDB(sql, [])
    console.log(response);
    email = response.message[0].email;
    useraccesstoken = response.message[0].useraccesstoken;
    splitwise_id = response.message[0].splitwise_id;

    const sw = Splitwise({
        consumerKey: process.env.SPLITWISE_CONSUMER_KEY,
        consumerSecret: process.env.SPLITWISE_CONSUMER_SECRET,
        accessToken: useraccesstoken
    });

    sw.createGroup({
        name: group_name,
        users_0_id: splitwise_id
    }).then(async (swRes) => {
        group_id = swRes.id;
        let sql = `INSERT INTO Rooms VALUES (${group_id}, "${group_name}");`;
        let response = await connectToDB(sql);

        sql = `INSERT INTO Group_users VALUES (${group_id}, ${user_id});`
        response = await connectToDB(sql);

        res.send({
            response
        });
    });

});

//DONE
router.get("/login", (req, res) => {
    console.log("start");
    const user_info = `${req.query.first_name}|${req.query.last_name}`;
    const encoded = Buffer.from(user_info, 'utf-8').toString('base64');
    res.redirect(SPLITWISE_AUTHORIZE_URL + '?response_type=code&client_id=' + process.env.SPLITWISE_CONSUMER_KEY + '&redirect_uri=' + REDIRECT_URI + '&state=' + encoded);
});

//DONE
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
        sw.getCurrentUser().then( async (swRes) => {
            console.log(swRes);
            let s_id = swRes.id;
            let s_email = swRes.email;
            let s_first = swRes.first_name;
            let s_last = swRes.last_name;
            let sql = `SELECT COUNT(${s_id}) as count FROM Users WHERE splitwise_id = ${s_id};`
            response = await connectToDB(sql);
            let count = response.message[0].count;
            console.log(count);
            if (count == 0) {
                sql = `INSERT INTO Users (firstname, lastname, email, splitwise_id, useraccesstoken) VALUES ("${s_first}", "${s_last}", "${s_email}", ${s_id}, "${access_token}");`;
            } else {
                sql = `UPDATE Users SET useraccesstoken = "${access_token}" WHERE splitwise_id = ${s_id}`;
            }
            
            //sql = `INSERT INTO Users (firstname, lastname, email, splitwise_id, useraccesstoken) VALUES ("${s_first}", "${s_last}", "${s_email}", ${s_id}, ?);`;
            response = await connectToDB(sql);
            //console.log(response);

            sql = `SELECT user_id FROM Users WHERE splitwise_id = ${s_id}`;
            response = await connectToDB(sql);
            res.send(response);
        });
        
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }

    res.status(200);
});


router.post('/join_group', async (req, res) => {
    group_id = req.body.group_id;
    user_0_id = req.body.user_0_id;
    adding_user_id = req.body.adding_user_id;

    let sql = `SELECT useraccesstoken FROM Users WHERE user_id = ${user_0_id};`;
    let response = await connectToDB(sql)
    //console.log(response);
    useraccesstoken = response.message[0].useraccesstoken;

    sql = `SELECT splitwise_id FROM Users WHERE user_id = ${adding_user_id}`;
    response = await connectToDB(sql);
    invitee_splitwise_id = response.message[0].splitwise_id;

    const sw = Splitwise({
        consumerKey: process.env.SPLITWISE_CONSUMER_KEY,
        consumerSecret: process.env.SPLITWISE_CONSUMER_SECRET,
        accessToken: useraccesstoken
    });

    sw.addUserToGroup({
        group_id: group_id,
        user_id: invitee_splitwise_id
    }).then(async (swRes) => {
    
        let sql = `INSERT INTO Group_users VALUES (${group_id}, ${adding_user_id});`;
        let response = await connectToDB(sql);
        res.send({
            group_id: group_id
        });
    });    
});

router.post('/add_group_expense', async (req, res) => {
    group_id = req.body.group_id;
    cost = req.body.cost;
    description = req.body.description;
    user_id = req.body.user_id;

    let sql = `SELECT useraccesstoken FROM Users WHERE user_id = ${user_id};`;
    let response = await connectToDB(sql)
    useraccesstoken = response.message[0].useraccesstoken;
    // sql = `SELECT group_name FROM Rooms WHERE group_id = ${group_id};`;
    // response = await connectToDB(sql);
    // group_name = response.message[0].group_name;

    sql = `SELECT splitwise_id as user_id FROM Group_users NATURAL JOIN Users WHERE group_id = ${group_id}`;
    response = await connectToDB(sql);
    console.log(response);
    const sw = Splitwise({
        consumerKey: process.env.SPLITWISE_CONSUMER_KEY,
        consumerSecret: process.env.SPLITWISE_CONSUMER_SECRET,
        accessToken: useraccesstoken
    });

    const { data } = await axios.post('https://secure.splitwise.com/api/v3.0/create_expense', {
        cost,
        description,
        group_id,
        split_equally: true
    }, {
        headers: {
            Authorization: `Bearer ${useraccesstoken}`
        }
    });
    
    console.log(data);
    res.json(data);
    // sw.createExpense({
    //     group_id: group_id,
    //     cost: cost,
    //     description: description,
    //     users: [{user_id: '39590589'}]
    // }).then( (swRes) => {
    //     res.send(swRes);
    // });
    
});

router.get('/group_expenses', async (req, res) => {
    const group_id = req.query.group_id;
    const user_id = req.query.user_id;

    let sql = `SELECT useraccesstoken FROM Users WHERE user_id = ${user_id};`;
    let response = await connectToDB(sql)
    let useraccesstoken = response.message.useraccesstoken;

    const sw = Splitwise({
        consumerKey: process.env.SPLITWISE_CONSUMER_KEY,
        consumerSecret: process.env.SPLITWISE_CONSUMER_SECRET,
        accessToken: useraccesstoken
    });

    sw.getExpenses({
        group_id: group_id
    }).then ((swRes) => {
        let response = [];
        for (let i = 0; i < swRes.length; i++) {
            let obj = swRes[i];
            response.push({cost: obj.cost, description: obj.description});
        }
        res.send({expenses: response});
    });
});

module.exports = router;
