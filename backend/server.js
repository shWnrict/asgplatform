const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const twilio = require('twilio');
require('dotenv').config();
    
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Twilio webhook validation middleware
const twilioWebhookValidation = (req, res, next) => {
    const signature = req.headers['x-twilio-signature'];
    const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

    try {
        twilio.validateRequest(
            process.env.TWILIO_AUTH_TOKEN, 
            signature, 
            url, 
            req.body
        );
        next();
    } catch (error) {
        res.status(403).send('Twilio webhook validation failed');
    }
};

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

let activeConnections = 0;

io.on('connection', (socket) => {
    activeConnections++;
    console.log(`New client connected. Total active: ${activeConnections}`);

    // Incoming Call Event
    socket.on('incomingCall', (callDetails) => {
        io.emit('callNotification', callDetails);
    });

    // Call Response Events
    socket.on('acceptCall', (callSid) => {
        io.emit('callAccepted', callSid);
    });

    socket.on('rejectCall', (callSid) => {
        io.emit('callRejected', callSid);
    });

    socket.on('disconnect', () => {
        activeConnections--;
        console.log(`Client disconnected. Total active: ${activeConnections}`);
    });
});

module.exports = { app, server, io };

// Routes
app.use('/api/email', require('./routes/email'));
app.use('/api/sms', require('./routes/sms'));
app.use('/api/chat', require('./routes/chat'));

// Twilio routes with webhook validation
app.use('/api/call', twilioWebhookValidation, require('./routes/calls'));
//app.use('/api/incoming-call', twilioWebhookValidation, require('./routes/incoming-call'));
app.use('/api/incoming-call', require('./routes/incoming-call'));

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});