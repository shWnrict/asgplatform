const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

router.post('/send', async (req, res) => {
    const { to, subject, body, attachments } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail', // or any other email service provider you prefer
        auth: {
            user: process.env.EMAIL_USER, // Your email address here
            pass: process.env.EMAIL_PASS  // Your email password here (consider using an app password)
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text: body,
        attachments // Pass attachments if any are provided in the request body.
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Email sent successfully!');
    } catch (error) {
        res.status(500).send('Error sending email: ' + error.message);
    }
});

module.exports = router;