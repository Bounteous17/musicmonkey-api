var mongoose = require('mongoose');

var SongSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {type: String, trim: true},
    artist: mongoose.Schema.Types.ObjectId,
    style: {type: String},
    torrent: {type: String},
}, {timestamps: true});

module.exports = mongoose.model('Song', SongSchema);