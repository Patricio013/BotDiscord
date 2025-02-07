const mongoose = require('mongoose');

const ReminderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    text: { type: String, required: true },
    time: { type: Date, required: true }
});

module.exports = mongoose.model('Reminder', ReminderSchema);