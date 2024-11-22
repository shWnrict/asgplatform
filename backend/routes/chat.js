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
        // Create uploads directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        // Add file type restrictions if needed
        cb(null, true);
    }
});

// File upload endpoint
router.post('/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Generate the file URL
        const fileUrl = `http://${req.get('host')}/uploads/${req.file.filename}`;
        
        res.json({
            message: 'File uploaded successfully',
            fileUrl: fileUrl
        });
    } catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({ error: 'File upload failed' });
    }
});

module.exports = router;