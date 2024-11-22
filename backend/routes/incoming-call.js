// backend/routes/incoming-call.js
const express = require('express');
const twilio = require('twilio');
const router = express.Router();

router.post('/handle-incoming', (req, res) => {
    const twiml = new twilio.twiml.VoiceResponse();
    
    // Gather DTMF input or provide options
    const gather = twiml.gather({
        numDigits: 1,
        action: '/api/handle-input',
        method: 'POST'
    });
    
    gather.say('An incoming call. Press 1 to accept, 2 to reject.');
    
    // If no input, hang up
    twiml.say('No input received. Goodbye.');
    twiml.hangup();

    res.type('text/xml');
    res.send(twiml.toString());
});

router.post('/handle-input', (req, res) => {
    const { Digits } = req.body;
    const twiml = new twilio.twiml.VoiceResponse();

    switch(Digits) {
        case '1':
            twiml.say('Call accepted');
            break;
        case '2':
            twiml.say('Call rejected');
            twiml.hangup();
            break;
        default:
            twiml.say('Invalid input');
            twiml.hangup();
    }

    res.type('text/xml');
    res.send(twiml.toString());
});

module.exports = router;