const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    songs: { type: [String], required: true } 
});

module.exports = mongoose.model('Playlist', playlistSchema);