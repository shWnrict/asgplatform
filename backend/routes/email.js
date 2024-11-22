const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const Email = require('../models/Email');
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Store files in memory
const { fetchTodaysEmails, fetchTodaysSentEmails } = require('../services/imapService');

router.post('/send', upload.array('attachments'), async (req, res) => {
    const { to, cc, bcc, subject, body } = req.body;
    const attachments = req.files; // Handle multiple files

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
        attachments: attachments.map(file => ({
            filename: file.originalname,
            content: file.buffer,
        })),
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
            attachments: attachments.map(file => ({
                filename: file.originalname,
                url: `http://localhost:5000/api/email/attachments/${file.originalname}`, // URL for downloading
            })),
        });

        await savedEmail.save();
        res.status(200).send('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending email: ' + error.message);
    }
});

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
// Route to serve attachments
// router.get('/attachments/:filename', (req, res) => {
//     const filePath = `path/to/your/storage/${req.params.filename}`; // Adjust this path as needed
//     res.download(filePath); // This will prompt the user to download the file
// });

const { fetchAttachment } = require('../services/imapService');

// Dynamic attachment download route
router.get('/attachments/:uid/:filename', async (req, res) => {
    const { uid, filename } = req.params;

    try {
        const attachment = await fetchAttachment(uid, filename);

        res.setHeader('Content-Type', attachment.contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${attachment.filename}"`);
        res.send(attachment.content); // Directly stream the content
    } catch (error) {
        console.error('Error fetching attachment:', error);
        res.status(404).send('Attachment not found');
    }
});


module.exports = router;