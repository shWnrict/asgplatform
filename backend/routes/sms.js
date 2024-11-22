// Import necessary modules
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
    .catch(error => {
        console.error('Twilio Error:', error); // Log the error for debugging
        res.status(500).send(`Error sending SMS: ${error.message}`);
    });
});

// New route to fetch message history
router.get('/history', async (req, res) => {
    try {
        const messages = await client.messages.list({ limit: 20 }); // Adjust limit as needed
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).send(`Error fetching message history: ${error.message}`);
    }
});

module.exports = router;