var express 	= require('express');
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var jwt         = require('jsonwebtoken'); 

var app = express();

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

// Enable CORS from client-side
app.use(function(req, res, next) {  
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
});

// basic routes for the monkeys
app.get('/', function(req, res) {
	res.status(201).json({ message: 'You can see me :D - That monkeys...' });
});

app.use("/user", userRoutes);

module.exports = app;