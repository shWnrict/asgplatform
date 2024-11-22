import React, { useState } from 'react';
import axios from 'axios';
import './NewMessage.css';

const NewMessage = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendSms = async (e) => {
        e.preventDefault();
        if (!phoneNumber || !message) {
            setStatus('Please enter both phone number and message.');
            return;
        }
        if (message.length > 160) {
            setStatus('Message exceeds 160 characters.');
            return;
        }

        setLoading(true);
        setStatus('');

        try {
            const response = await axios.post('http://localhost:5000/api/sms/send', {
                to: phoneNumber,
                body: message,
            });
            setStatus('Message sent successfully!');
            setPhoneNumber('');
            setMessage('');
        } catch (error) {
            console.error('Error sending SMS:', error);
            setStatus('Failed to send SMS. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setPhoneNumber('');
        setMessage('');
        setStatus('');
    };

    return (
        <form onSubmit={handleSendSms} className="new-message-container">
            <h3 className="new-message-title">Create a New Message</h3>
            <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                    type="text"
                    id="phoneNumber"
                    placeholder="Enter phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                    id="message"
                    placeholder="Enter your message (max 160 characters)"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                />
                <div className="character-count">{160 - message.length} characters remaining</div>
            </div>
            {status && <p className="status-message">{status}</p>}
            <div className="button-group">
                <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? 'Sending...' : 'Send SMS'}
                </button>
                <button type="button" className="clear-button" onClick={handleClear}>
                    Clear
                </button>
            </div>
        </form>
    );
};

export default NewMessage;
