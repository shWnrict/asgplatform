const express = require('express');
const twilio = require('twilio');
const router = express.Router();

const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

router.post('/call', (req, res) => {
    const { to } = req.body;

    client.calls.create({
        url: 'http://demo.twilio.com/docs/voice.xml', // URL that returns TwiML instructions for the call.
        to,
        from: process.env.TWILIO_PHONE_NUMBER,
    })
    .then(call => res.status(200).send(`Call initiated successfully! Call SID: ${call.sid}`))
    .catch(error => res.status(500).send(`Error making call: ${error.message}`));
});

module.exports = router;