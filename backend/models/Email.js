const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
    to: { type: String, required: true },
    cc: { type: String },
    bcc: { type: String },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    attachments: [{ filename: String, url: String }], // Updated to support multiple attachments
    sentAt: { type: Date, default: Date.now },
});

const Email = mongoose.model('Email', emailSchema);

module.exports = Email;
