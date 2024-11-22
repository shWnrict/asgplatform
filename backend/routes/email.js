const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const Email = require('../models/Email'); // Import the Email model
const router = express.Router();
const upload = multer();
const { fetchTodaysEmails, fetchTodaysSentEmails } = require('../services/imapService'); // Ensure this function is imported correctly

router.post('/send', upload.array('attachments'), async (req, res) => {
    const { to, cc, bcc, subject, body } = req.body;
    const attachments = req.files; // Changed to handle multiple files

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

    // Prepare attachments for nodemailer
    const mailAttachments = attachments.map(file => ({
        filename: file.originalname,
        content: file.buffer,
    }));

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        cc: cc || undefined,
        bcc: bcc || undefined,
        subject,
        text: body,
        attachments: mailAttachments, // Use the prepared attachments
    };

    try {
        await transporter.sendMail(mailOptions);
        
        // Save email with attachment information in the database
        const savedEmail = new Email({
            to,
            cc,
            bcc,
            subject,
            body,
            attachments: mailAttachments.map(file => ({
                filename: file.filename,
                url: `path/to/your/storage/${file.filename}`, // Adjust this path as needed
            })),
        });
        
        await savedEmail.save();
        
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

// Simple route to fetch today's sent emails
router.get('/sent', async (req, res) => {
    try {
        const emails = await fetchTodaysSentEmails();
        res.json(emails);
    } catch (error) {
        console.error('Error fetching sent emails:', error);
        res.status(500).send('Error fetching sent emails: ' + error.message);
    }
});

module.exports = router;
