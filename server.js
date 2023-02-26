const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true
    })
);

//Routes
const groupRoutes = require('./routes/groups');
const choreRoutes = require('./routes/chores');
const splitwiseRoutes = require('./routes/splitwise');

//Use routes
app.use('/group', groupRoutes);
app.use('chore', choreRoutes);
app.use('/splitwise', splitwiseRoutes);

app.get("/", (req, res) => {
    res.json({ message: "Server running!" });
  });

app.set('port', process.env.PORT);

app.listen(process.env.PORT, () => {
    console.log(`Listening on http://localhost:${process.env.PORT}`);
  });