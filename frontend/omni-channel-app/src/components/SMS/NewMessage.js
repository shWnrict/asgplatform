import React, { useState } from 'react';
import axios from 'axios';

const NewMessage = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [message, setMessage] = useState('');

    const handleSendSms = async (e) => {
        e.preventDefault();
        if (!phoneNumber || !message) {
            alert('Please enter both phone number and message.');
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/sms/send', { to: phoneNumber, body: message });
            alert('SMS sent successfully!');
            setPhoneNumber('');
            setMessage('');
        } catch (error) {
            console.error(error);
            alert('Failed to send SMS.');
        }
    };

    return (
        <form onSubmit={handleSendSms}>
            <h3>New Message</h3>
            <input 
                type="text" 
                placeholder="Enter phone number" 
                value={phoneNumber} 
                onChange={(e) => setPhoneNumber(e.target.value)} 
                required 
            />
            <textarea 
                placeholder="Enter your message" 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                required 
            />
            <button type="submit">Send SMS</button>
        </form>
    );
};

export default NewMessage;
