const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const redis = require('redis');
const redisClient = redis.createClient();
const cors = require('cors');
const mumoMessages = require('./utils/msg-codes.json');
const defaultRoutes = require('./routes/default.js');
const userRoutes = require('./routes/user.js');

// default options express
app.use(cors());
app.use(fileUpload({
    limits: { fileSize: 1 * 1024 * 1024 },
}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

redisClient.on('connect', function () {
    console.log(mumoMessages.sys_success.A1);
});

redisClient.on('error', function (err) {
    console.log(mumoMessages.sys_errors.A1);
});

mongoose.connect('mongodb://localhost:27017/MusicMonkey-dev', function(err) {
    if (err) {
        return console.log(mumoMessages.sys_errors.A0)
    }
    console.log(mumoMessages.sys_success.A0);
});

// use body parser so we can get info from POST and/or URL parameters
// app.use(require('body-parser').json({ type : '*/*' }));

// use morgan to log requests to the console
app.use(morgan("dev"));

app.use("/", defaultRoutes);
// middleware starts here
app.use("/users", userRoutes);

module.exports = app;