const User = require('../models/user');
const mumoMessages = require('./msg-codes.json');

exports.storeToken = function(user, token, callback) {
    User.findOne({username: user.username})
    .then((user) => {
        if (!user) {
            return callback({error: false, stats: mumoMessages.app_errors.A0});
        }

        user.sessions.push(token);

        user.save(function(err) {
            if (err) return callback({error: true, stats: mumoMessages.sys_errors.A0});
        })

        return callback({error: false, message: user.sessions});
        
    })
    .catch((e) => {
        return callback({error: true, stats: mumoMessages.sys_errors.A0});
    })
}

exports.listToken = function(user, callback) { // list stored tokens from user
    User.findOne({username: user.username})
    .then((user) => {
        if (!user) {
            return callback({error: false, stats: mumoMessages.app_errors.A0});
        }

        return callback({error: false, message: user.sessions});
        
    })
    .catch((e) => {
        return callback({error: true, stats: mumoMessages.sys_errors.A0});
    })
}