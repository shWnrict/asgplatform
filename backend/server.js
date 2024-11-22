const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();
    
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*", // Adjust this based on your frontend URL for production
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Set up storage engine for file uploads
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
}).single('file');

// Serve static files from the 'uploads' directory
// app.use('/uploads', express.static('uploads'));

// Handle file upload
app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.status(500).send('File upload error');
        } else {
            res.send('File uploaded successfully');
        }
    });
});

// Handle socket connections
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('sendMessage', (msg) => {
        console.log(`Message received: ${JSON.stringify(msg)}`);
        io.emit('receiveMessage', msg);
    });

    socket.on('typing', () => {
        socket.broadcast.emit('typing');
    });

    socket.on('stopTyping', () => {
        socket.broadcast.emit('stopTyping');
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Import routes
app.use('/api/email', require('./routes/email')); // Use the email route
app.use('/api/sms', require('./routes/sms'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/call', require('./routes/calls'));
app.use('/api/incoming-call', require('./routes/incoming-call'));
app.use('/api/twiml', require('./routes/twiml'));


// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
