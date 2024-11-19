const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

router.post('/send', async (req, res) => {
    const { to, cc, bcc, subject, body, attachment } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail', // Use your email service
        auth: {
            user: process.env.EMAIL_USER, // Your email address
            pass: process.env.EMAIL_PASS  // Your email password or app password
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        cc,
        bcc,
        subject,
        text: body,
        attachments: attachment ? [{ filename: attachment.name, content: attachment.data }] : [] // Adjust this line if you are handling attachments differently
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Email sent successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error sending email: ' + error.message);
    }
});

module.exports = router;