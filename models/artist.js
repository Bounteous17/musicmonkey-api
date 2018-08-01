var mongoose = require('mongoose');

var ArtistSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: { type: String, match: [/^[a-zA-Z0-9]+$/, 'Is invalid']}
}, {timestamps: true});

module.exports = mongoose.model('Artist', ArtistSchema);