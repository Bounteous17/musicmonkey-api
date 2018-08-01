const clientScp = require('scp2')
const parseTorrent = require('parse-torrent');
const fs = require('fs');
const redis = require('redis');
const redisClient = redis.createClient();
const User = require('../models/user');
const mumoMessages = require('./msg-codes.json');
const mumoConfig = require('../config.js').get(process.env.NODE_ENV);

exports.storeToken = function(user, token, callback) {
    User.findOne({username: user.username})
    .then((user) => {
        if (!user) {
            return callback({error: false, stats: mumoMessages.app_errors.A0});
        }

        let userSessions = user.sessions;

        userSessions.push(token);

        redisClient.hmset(user._id.toString(), userSessions, function (err) {
            if (err) console.log(mumoMessages.sys_errors.A1);
            console.log(err);
            
            user.save(function(err) {
                if (err) return callback({error: true, stats: mumoMessages.sys_errors.A0});
            })
    
            return callback({error: false, token: token});
        });

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

exports.scpTorrent = function(filePath) { // mv torrent to ZFS storage server
    torrentHash = parseTorrent(fs.readFileSync(filePath)).infoHash;
    clientScp.scp(filePath, {
        host: mumoConfig.storageHost,
        username: mumoConfig.storageUsername,
        password: mumoConfig.storagePassword,
        path: mumoConfig.storagePath + '/' + torrentHash + '.torrent',
        port: mumoConfig.storagePort
    }, function(err) {
        if (err) {
            return false;
        }
        fs.unlinkSync(filePath);
        return true;
    })
}

exports.backTorrent = function(torrentHash) { // download torrent by id from storage server
    let storePath = '/tmp/' + torrentHash + '.torrent';
    clientScp.scp({
        host: mumoConfig.storageHost,
        username: mumoConfig.storageUsername,
        password: mumoConfig.storagePassword,
        path: mumoConfig.storagePath + '/' + torrentHash + '.torrent',
        port: mumoConfig.storagePort
    }, storePath, function(err) {
        if (err) {
            return false;
        }
        return true;
    })
}

exports.randomString = function() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 50; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }