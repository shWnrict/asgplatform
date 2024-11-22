// routes/chat.js - Backend
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Preserve original filename while ensuring uniqueness
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// File upload endpoint
router.post('/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Send back both the URL and the original filename
        const fileUrl = `${req.protocol}://${req.get('host')}/api/chat/download/${req.file.filename}`;
        
        res.json({
            message: 'File uploaded successfully',
            fileUrl: fileUrl,
            fileName: req.file.originalname
        });
    } catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({ error: 'File upload failed' });
    }
});

// Download endpoint
router.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '..', 'uploads', filename);

    // Verify file exists
    if (!fs.existsSync(filePath)) {
        return res.status(404).send('File not found');
    }

    // Get the original filename (remove the unique prefix)
    const originalFilename = filename.substring(filename.indexOf('-') + 1);

    // Set headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${originalFilename}"`);
    res.setHeader('Content-Type', 'application/octet-stream');

    // Send the file
    res.download(filePath, originalFilename, (err) => {
        if (err) {
            console.error('Download error:', err);
            res.status(500).send('Error downloading file');
        }
    });
});

module.exports = router;