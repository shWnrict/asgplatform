const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const VoiceResponse = twilio.twiml.VoiceResponse;

router.post('/voice', (req, res) => {
    const response = new VoiceResponse();
    response.say('Hello! Thank you for calling. Have a great day!', { voice: 'alice' });

    res.type('text/xml');
    res.send(response.toString());
});

module.exports = router;
