// backend/routes/incoming-call.js
const express = require('express');
const twilio = require('twilio');
const router = express.Router();

router.post('/', (req, res) => {
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say('Hello! You have reached my Twilio number.');
    twiml.say('Please leave a message after the beep.');
    twiml.record(); // This will record the message left by the caller

    res.type('text/xml');
    res.send(twiml.toString());
});

module.exports = router;