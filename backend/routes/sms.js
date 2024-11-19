const express = require('express');
const twilio = require('twilio');
const router = express.Router();

const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

router.post('/send', (req, res) => {
    const { to, body } = req.body;

    client.messages.create({
        body,
        from: process.env.TWILIO_PHONE_NUMBER,
        to,
    })
    .then(message => res.status(200).send(`SMS sent successfully! Message SID: ${message.sid}`))
    .catch(error => res.status(500).send(`Error sending SMS: ${error.message}`));
});

module.exports = router;