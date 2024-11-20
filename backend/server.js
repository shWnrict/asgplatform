const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Socket.io setup for chat functionality
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('sendMessage', (msgData) => {
        io.emit('receiveMessage', msgData); // Broadcast received message to all clients
    });

    socket.on('typing', () => {
        socket.broadcast.emit('typing'); // Notify others that someone is typing
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

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
