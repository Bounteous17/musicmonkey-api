// Torrent
var WebTorrent = require('webtorrent-hybrid')
var client = new WebTorrent();
// Modules
const mongoose = require('mongoose');
// Models
const Song = require('../models/song');
const fs = require('fs');
// Files
const mumoMessages = require('../utils/msg-codes.json');
const mumoConfig = require('../config.js').get(process.env.NODE_ENV);

exports.downSeed = function () {
    Song.find({})
    .then((songs) => {
        for (let i = 0; i < songs.length; i++) {
            client.add(songs[i].magnet, { path: '/tmp/songs' }, function (torrent) {
                torrent.on('done', function () {
                    console.log('Torrent download finished')
                })
            })
        }
    })
    .catch(err => {
        console.log(err);
    })
}

exports.seed = function() {
    var walkPath = mumoConfig.storagePath;

    var walk = function (dir, done) {
        fs.readdir(dir, function (error, list) {
            if (error) {
                return done(error);
            }
    
            var i = 0;
    
            (function next () {
                var file = list[i++];
                if (!file) {
                    return done(null);
                }
                
                file = dir + '/' + file;                
                fs.stat(file, function (error, stat) {
                    if (stat && stat.isDirectory()) {
                        walk(file, function (error) {
                            next();
                        });
                    } else {
                        client.seed(file, function (torrent) {
                            console.log('Client is seeding:', torrent.magnetURI)
                        });

                        next();
                    }
                });
            })();
        });
    };
    
    console.log('-------------------------------------------------------------');
    console.log('processing...');
    console.log('-------------------------------------------------------------');
    
    walk(walkPath, function(error) {
        if (error) {
            throw error;
        } else {
            console.log('-------------------------------------------------------------');
            console.log('finished.');
            console.log('-------------------------------------------------------------');
        }
    });
}