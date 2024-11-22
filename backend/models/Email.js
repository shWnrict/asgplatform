const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
    to: { type: String, required: true },
    cc: { type: String },
    bcc: { type: String },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    attachment: { type: String }, // URL or path to the attachment if stored
    sentAt: { type: Date, default: Date.now }, // Timestamp of when the email was sent
});

const Email = mongoose.model('Email', emailSchema);

module.exports = Email;
