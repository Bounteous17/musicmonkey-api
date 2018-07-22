const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const defaultRoutes = require('./routes/default.js');
const userRoutes = require('./routes/user.js');

// default options express
app.use(cors());
app.use(fileUpload({
    limits: { fileSize: 1 * 1024 * 1024 },
}));

app.use(bodyParser());
app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({
    limit: '1mb',
    extended: true,
    parameterLimit:50000
  }));

mongoose.connect('mongodb://localhost:27017/MusicMonkey-dev', function(err) {
    if (err) {
        return console.log("Erro DB")
    }
    console.log("Success connect");
});

// use body parser so we can get info from POST and/or URL parameters
// app.use(require('body-parser').json({ type : '*/*' }));

// use morgan to log requests to the console
app.use(morgan("dev"));

app.use("/", defaultRoutes);
// middleware starts here
app.use("/users", userRoutes);

module.exports = app;