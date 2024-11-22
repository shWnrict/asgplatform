const express = require('express');
const twilio = require('twilio');
const router = express.Router();

// Ensure Twilio client is correctly initialized
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// Outbound Call Initiation with Comprehensive Error Handling
router.post('/initiate-call', async (req, res) => {
    const { to, from } = req.body;

    // Input validation
    if (!to) {
        return res.status(400).json({
            error: 'Missing destination number',
            details: 'A valid phone number is required to initiate a call'
        });
    }

    try {
        // Validate phone number format (basic validation)
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        if (!phoneRegex.test(to)) {
            return res.status(400).json({
                error: 'Invalid phone number format',
                details: 'Phone number must be in E.164 format'
            });
        }

        // Initiate call with detailed configuration
        const call = await client.calls.create({
            url: `${process.env.BASE_URL}/api/call-instructions`, // Dynamic TwiML endpoint
            to,
            from: from || process.env.TWILIO_PHONE_NUMBER,
            statusCallback: `${process.env.BASE_URL}/api/call-status`,
            statusCallbackEvent: [
                'initiated', 
                'ringing', 
                'answered', 
                'completed'
            ],
            timeout: 30 // Call timeout in seconds
        });

        // Successful call initiation response
        res.status(200).json({ 
            message: 'Call initiated successfully', 
            callSid: call.sid,
            status: call.status,
            direction: call.direction
        });

    } catch (error) {
        // Detailed error handling for different Twilio errors
        console.error('Twilio Call Initiation Error:', error);

        let statusCode = 500;
        let errorMessage = 'Unexpected error initiating call';

        // Specific Twilio error handling
        switch(error.code) {
            case 21212: // Invalid 'To' Phone Number
                statusCode = 400;
                errorMessage = 'Invalid destination phone number';
                break;
            case 21213: // Invalid 'From' Phone Number
                statusCode = 400;
                errorMessage = 'Invalid originating phone number';
                break;
            case 21214: // 'To' phone number cannot be reached
                statusCode = 404;
                errorMessage = 'Destination phone number is unavailable';
                break;
            case 21215: // 'From' phone number cannot be used
                statusCode = 403;
                errorMessage = 'Originating phone number is restricted';
                break;
        }

        res.status(statusCode).json({
            error: errorMessage,
            details: error.message,
            twilioErrorCode: error.code,
            moreInfo: error.moreInfo || 'Check Twilio documentation'
        });
    }
});

// Call Instructions TwiML Endpoint
router.post('/call-instructions', (req, res) => {
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say('Connecting your call');
    res.type('text/xml');
    res.send(twiml.toString());
});

// Call Status Webhook
router.post('/call-status', (req, res) => {
    const { CallStatus, CallSid } = req.body;
    console.log(`Call ${CallSid} status: ${CallStatus}`);
    
    // Here you could add socket.io emission or database logging
    res.sendStatus(200);
});

// Call Accept/Reject Routes
router.post('/accept', async (req, res) => {
    const { callSid } = req.body;
    try {
        await client.calls(callSid).update({ status: 'in-progress' });
        res.status(200).json({ message: 'Call accepted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to accept call' });
    }
});

router.post('/reject', async (req, res) => {
    const { callSid } = req.body;
    try {
        await client.calls(callSid).update({ status: 'completed' });
        res.status(200).json({ message: 'Call rejected' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to reject call' });
    }
});

module.exports = router;