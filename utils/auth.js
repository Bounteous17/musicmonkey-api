const jwt = require('jsonwebtoken');
const mumoLib = require('../utils/functions.library');
const config = require('./config');

exports.generateToken = function(user, callback) {

    var token = jwt.sign({ username: user.username }, config.secret, {
        expiresIn: 60
    });

    mumoLib.storeToken(user, token, function(updatedSessions) {
        callback(updatedSessions);
    })

};