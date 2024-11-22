const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
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

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Handle socket connections
io.on('connection', (socket) => {
    console.log('New client connected');

    // Listen for incoming messages
    socket.on('sendMessage', (msg) => {
        console.log(`Message received: ${JSON.stringify(msg)}`); // Log the received message
        io.emit('receiveMessage', msg); // Broadcast message to all clients
    });

    // Listen for typing events
    socket.on('typing', () => {
        socket.broadcast.emit('typing'); // Notify other clients that someone is typing
    });

    socket.on('stopTyping', () => {
        socket.broadcast.emit('stopTyping'); // Notify other clients that typing has stopped
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Import routes
app.use('/api/email', require('./routes/email')); // Use the email route
app.use('/api/sms', require('./routes/sms'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/calls', require('./routes/calls'));
app.use('/api/incoming-call', require('./routes/incoming-call'));

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
