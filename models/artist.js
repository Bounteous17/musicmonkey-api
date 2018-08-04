var mongoose = require('mongoose');

var ArtistSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: { type: String, trim: true}
}, {timestamps: true});

module.exports = mongoose.model('Artist', ArtistSchema);