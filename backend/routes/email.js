const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const router = express.Router();

const upload = multer();

router.post('/send', upload.single('attachment'), async (req, res) => {
    const { to, cc, bcc, subject, body } = req.body;
    const attachment = req.file;

    if (!to) {
        return res.status(400).send('Recipient email is required!');
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
        attachments: attachment ? [{ filename: attachment.originalname, content: attachment.buffer }] : [], // Use buffer for attachment
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