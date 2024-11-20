const express = require('express');
const router = express.Router();

// Placeholder for chat functionality; real-time chat handled by Socket.io in server.js

const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Specify upload directory

// In your chat route handler
router.post('/send', upload.single('attachment'), (req, res) => {
    const msgData = { 
        userId: req.body.userId,
        message: req.body.message,
        attachment: req.file ? req.file.path : null // Save path or URL of uploaded file
    };
    
    io.emit('receiveMessage', msgData); // Emit received message to all clients
});


module.exports = router;