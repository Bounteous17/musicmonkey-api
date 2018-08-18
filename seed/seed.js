// Modules
const mongoose = require('mongoose');
// Utils
const mumoMessages = require('../utils/msg-codes.json');
const mumoConfig = require('../config.js').get(process.env.NODE_ENV);
const torrentLib = require('./functions.library');

mongoose.connect('mongodb://localhost:27017/MusicMonkey-dev', function(err) {
    if (err) {
        return console.log(mumoMessages.sys_errors.A0)
    }
    console.log(mumoMessages.sys_success.A0);
});

if (process.argv[2] == '--download') {
    torrentLib.downSeed();
} else if (process.argv[2] == '--seed') {
    torrentLib.seed();
}