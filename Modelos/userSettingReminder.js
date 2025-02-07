const mongoose = require('mongoose');

const UserSettingsSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    timezone: { type: String, default: 'America/Argentina/Buenos_Aires' }
});

module.exports = mongoose.model('UserSettings', UserSettingsSchema);