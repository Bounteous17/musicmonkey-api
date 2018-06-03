var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: { type: String, match: [/^[a-zA-Z0-9]+$/, 'Is invalid']},
    email: { type: String, lowercase: true, match: [/\S+@\S+\.\S+/, 'Is invalid']},
    password: { type: String, required: true},
    torrents: { type: Array, "default": []}
}, {timestamps: true});

module.exports = mongoose.model('User', UserSchema);