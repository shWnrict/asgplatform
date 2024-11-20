const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const Email = require('../models/Email'); // Import the Email model
const router = express.Router();

const upload = multer();

router.post('/send', upload.single('attachment'), async (req, res) => {
    const { to, cc, bcc, subject, body } = req.body;
    const attachment = req.file;

    if (!to) {
        return res.status(400).send('Recipient email is required!');
    }
    if (!subject || !body) {
        return res.status(400).send('Subject and body are required!');
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        cc: cc || undefined,
        bcc: bcc || undefined,
        subject,
        text: body,
        attachments: attachment ? [{ filename: attachment.originalname, content: attachment.buffer }] : [],
    };

    try {
        await transporter.sendMail(mailOptions);

        // Save sent email to database
        const newEmail = new Email({
            to,
            cc,
            bcc,
            subject,
            body,
            isReceived: false // Mark as sent
        });
        await newEmail.save();

        console.log(`Email sent successfully to ${to}`);
        res.status(200).send('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending email: ' + error.message);
    }
});

// Route to get Inbox (received emails)
router.get('/inbox', async (req, res) => {
    try {
        const inboxEmails = await Email.find({ isReceived: true }); // Fetch received emails
        res.status(200).json(inboxEmails);
    } catch (error) {
        console.error('Error fetching inbox:', error);
        res.status(500).send('Error fetching inbox: ' + error.message);
    }
});

// Route to get Sent Items
router.get('/sent', async (req, res) => {
    try {
        const sentEmails = await Email.find({ isReceived: false }); // Fetch sent emails
        res.status(200).json(sentEmails);
    } catch (error) {
        console.error('Error fetching sent items:', error);
        res.status(500).send('Error fetching sent items: ' + error.message);
    }
});

module.exports = router;
