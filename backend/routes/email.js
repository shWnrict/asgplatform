const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const Email = require('../models/Email'); // Import the Email model
const router = express.Router();
const upload = multer();
const { fetchTodaysEmails } = require('../services/imapService'); // Ensure this function is imported correctly

router.post('/send', upload.single('attachment'), async (req, res) => {
    const { to, cc, bcc, subject, body } = req.body;
    const attachment = req.file;

    if (!to || !subject || !body) {
        return res.status(400).send('Recipient, subject, and body are required!');
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
        res.status(200).send('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending email: ' + error.message);
    }
});

// Simple route to fetch today's inbox emails
router.get('/inbox', async (req, res) => {
    try {
        const emails = await fetchTodaysEmails();
        res.json(emails);
    } catch (error) {
        console.error('Error fetching emails:', error);
        res.status(500).send('Error fetching emails: ' + error.message);
    }
});

module.exports = router;
