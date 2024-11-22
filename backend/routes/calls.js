const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

router.post('/make', async (req, res) => {
    const { to } = req.body;

    try {
        const call = await client.calls.create({
            url: 'http://demo.twilio.com/docs/voice.xml', // You can set up your own TwiML URL
            to,
            from: process.env.TWILIO_PHONE_NUMBER // Your Twilio phone number
        });

        res.status(200).send(`Call initiated with SID: ${call.sid}`);
    } catch (error) {
        console.error('Error making call:', error);
        res.status(500).send('Failed to make call');
    }
});

module.exports = router;
