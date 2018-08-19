var mongoose = require('mongoose');

var SongSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {type: String, trim: true},
    artist: [{type: mongoose.Schema.Types.ObjectId, ref: 'Artist'}],
    style: {type: String},
    torrent: {type: String},
    magnet: {type: String},
    seeding: {type: Boolean}
}, {timestamps: true});

module.exports = mongoose.model('Song', SongSchema);