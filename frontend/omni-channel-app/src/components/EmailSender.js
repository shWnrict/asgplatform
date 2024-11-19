import React, { useState } from 'react';
import axios from 'axios';

const EmailSender = () => {
    const [recipient, setRecipient] = useState('');
    const [cc, setCc] = useState('');
    const [bcc, setBcc] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [attachment, setAttachment] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('to', recipient);
        formData.append('cc', cc);
        formData.append('bcc', bcc);
        formData.append('subject', subject);
        formData.append('body', body);
        if (attachment) {
            formData.append('attachment', attachment);
        }

        try {
            await axios.post('http://localhost:5000/api/email/send', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Email sent successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to send email.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Send Email</h2>
            <input type="email" placeholder="Recipient" onChange={(e) => setRecipient(e.target.value)} required />
            <input type="email" placeholder="CC" onChange={(e) => setCc(e.target.value)} />
            <input type="email" placeholder="BCC" onChange={(e) => setBcc(e.target.value)} />
            <input type="text" placeholder="Subject" onChange={(e) => setSubject(e.target.value)} required />
            <textarea placeholder="Body" onChange={(e) => setBody(e.target.value)} required></textarea>
            <input type="file" onChange={(e) => setAttachment(e.target.files[0])} />
            <button type="submit">Send Email</button>
        </form>
    );
};

export default EmailSender;