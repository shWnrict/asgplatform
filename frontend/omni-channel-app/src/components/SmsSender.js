import React, { useState } from 'react';
import axios from 'axios';

const SmsSender = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/sms/send', { to: phoneNumber, body: message });
            alert('SMS sent successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to send SMS.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Send SMS</h2>
            <input type="text" placeholder="Phone Number" onChange={(e) => setPhoneNumber(e.target.value)} required />
            <textarea placeholder="Message" onChange={(e) => setMessage(e.target.value)} required></textarea>
            <button type="submit">Send SMS</button>
        </form>
    );
};

export default SmsSender;