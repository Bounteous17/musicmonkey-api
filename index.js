const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const mumoConfig = require('./config.js').get(process.env.NODE_ENV);

const port = mumoConfig.PORT;

app.use(cors());

const defaultRoutes = require('./routes/default.js');
const userRoutes = require('./routes/user.js');

app.use(bodyParser.json());

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

app.use("/", defaultRoutes);
app.use("/users", userRoutes);

module.exports = app;