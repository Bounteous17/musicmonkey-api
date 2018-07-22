const jwt = require('jsonwebtoken');
const mumoLib = require('../utils/functions.library');
const mumoConfig = require('../config.js').get(process.env.NODE_ENV);

exports.generateToken = function(user, callback) {

    var token = jwt.sign({ username: user.username }, mumoConfig.JWT_KEY, {
        expiresIn: 60
    });

    mumoLib.storeToken(user, token, function(updatedSessions) {
        callback(updatedSessions);
    })

};