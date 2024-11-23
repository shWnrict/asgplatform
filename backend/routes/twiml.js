const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const VoiceResponse = twilio.twiml.VoiceResponse;

router.post('/voice', (req, res) => {
    const response = new VoiceResponse();
    response.say('You have an incoming call.', { voice: 'alice' });
    response.pause({ length: 5 });
    response.hangup();

    res.type('text/xml');
    res.send(response.toString());

    // Notify the frontend about the incoming call (e.g., using WebSockets)
    io.emit('incomingCall', { from: req.body.From });
});

module.exports = router;
