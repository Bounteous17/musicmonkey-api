const jwt = require('jsonwebtoken');
const config = require('./config');

exports.generateToken = function(user) {
    var token = jwt.sign({ username: user.username }, config.secret, {
        expiresIn: 60
    });

    return token;
};