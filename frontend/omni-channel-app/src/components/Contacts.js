import React, { useState } from 'react';
import axios from 'axios';

const Contacts = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [smsMessage, setSmsMessage] = useState('');

    const handleCall = async () => {
        if (!phoneNumber) {
            alert('Please enter a phone number.');
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/calls/outbound', { to: phoneNumber });
            alert('Call initiated successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to initiate call.');
        }
    };

    const handleSms = async () => {
        if (!phoneNumber || !smsMessage) {
            alert('Please enter a phone number and message.');
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/sms/send', { to: phoneNumber, body: smsMessage });
            alert('SMS sent successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to send SMS.');
        }
    };

    return (
        <div>
            <h2>Contacts</h2>
            <input 
                type="text" 
                placeholder="Enter phone number" 
                value={phoneNumber} 
                onChange={(e) => setPhoneNumber(e.target.value)} 
                required 
            />
            <div>
                <button onClick={handleCall}>Call Now</button>
                <textarea 
                    placeholder="Enter SMS message" 
                    value={smsMessage} 
                    onChange={(e) => setSmsMessage(e.target.value)} 
                    required 
                />
                <button onClick={handleSms}>Send SMS</button>
            </div>
        </div>
    );
};

export default Contacts;
