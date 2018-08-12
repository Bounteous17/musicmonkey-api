const clientScp = require('scp2')
const mongoose = require('mongoose');
const parseTorrent = require('parse-torrent');
const fs = require('fs');
const redis = require('redis');
const redisClient = redis.createClient();
const User = require('../models/user');
const Artist = require('../models/artist');
const Song = require('../models/song');
const mumoMessages = require('./msg-codes.json');
const mumoConfig = require('../config.js').get(process.env.NODE_ENV);

exports.storeToken = function(user, token, callback) {
    User.findOne({username: user.username})
    .then((user) => {
        if (!user) {
            return callback({error: false, stats: mumoMessages.app_errors.A0});
        }

        let userSessions = user.sessions;
        let userId = JSON.stringify(user._id);

        userSessions.push(token);

        redisClient.hmset(JSON.parse(userId), userSessions, function (err) {
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

exports.scpTorrent = function(filePath, callback) { // mv torrent to ZFS storage server
    torrentHash = parseTorrent(fs.readFileSync(filePath)).infoHash;
    clientScp.scp(filePath, {
        host: mumoConfig.storageHost,
        username: mumoConfig.storageUsername,
        password: mumoConfig.storagePassword,
        path: mumoConfig.storagePath + '/' + torrentHash + '.torrent',
        port: mumoConfig.storagePort
    }, function(err) {
        if (err) {
            callback({error: false});
            return;
        }
        fs.unlinkSync(filePath);
        callback({error: true, hash: torrentHash});
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

exports.storeArtist = function(artistBody, callback) {
    Artist.find({username: artistBody})
    .then((artist) => {
        if (artist[0]) {
            console.log('Artist already exists');
            callback(artist[0]._id);
            return;
        }
        const artistStore = new Artist({
            _id: new mongoose.Types.ObjectId(),
            username: artistBody,
        });
        artistStore
        .save()
        .then(result => {
            console.log('Store new artist');
            callback(result._id);
        })
        .catch(err => {
              console.log(err);
        })
    })
    .catch((e) => {
        callback({error: true, stats: mumoMessages.sys_errors.A0});
  });  
}

exports.generateRandomSongs = function() {
    Song.find()
        .then(songs => {
            let randomSongs = [];
            let songSelected = '';
            for (let i = 0; i < 10; i++) {
                songSelected = songs[Math.floor(Math.random() * songs.length)];
                randomSongs.push({title: songSelected.title, artistName: songSelected.artist, torrentHash: songSelected.torrent, songStyle: songSelected.style});
            }

            redisClient.set('random-songs-home', JSON.stringify(randomSongs), function(err) {
                if (!err) console.log('Stored ok');
            });
        })
    }

exports.getRandomSongs = function(callback) {
            redisClient.get('random-songs-home', function(err, reply){
                callback(JSON.parse(reply));
            })
    }