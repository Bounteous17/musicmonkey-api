const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

var app = express();

app.use(cors())

var userRoutes = require('./routes/user.js');

mongoose.connect('mongodb://localhost:27017/MusicMonkey-dev', function(err) {
    if (err) {
        return console.log("Erro DB")
    }
    console.log("Success connect");
});

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('body-parser').json({ type : '*/*' }));

// use morgan to log requests to the console
app.use(morgan("dev"));

// basic routes for the monkeys
app.get('/', function(req, res) {
	res.status(201).json({ message: 'You can see me :D - That monkeys...' });
});

app.use("/user", userRoutes);

module.exports = app;