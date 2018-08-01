const mumoLib = require('../utils/functions.library');

exports.generateToken = function(user, callback) {
    var token = mumoLib.randomString();

    mumoLib.storeToken(user, token, function(updatedSessions) {
        callback(updatedSessions);
    });
};