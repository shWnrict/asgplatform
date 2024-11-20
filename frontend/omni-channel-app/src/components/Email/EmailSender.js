import React, { useState } from 'react';
import axios from 'axios';
import './EmailSender.css'; // Create a CSS file for styling

const EmailSender = ({ onEmailSent }) => {
    const [recipient, setRecipient] = useState('');
    const [cc, setCc] = useState('');
    const [bcc, setBcc] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [attachment, setAttachment] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!recipient || !subject || !body) {
            alert('Recipient, subject, and body are required!');
            return;
        }

        const formData = new FormData();
        formData.append('to', recipient);
        if (cc) formData.append('cc', cc);
        if (bcc) formData.append('bcc', bcc);
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
            onEmailSent(); // Callback to refresh inbox or sent items
            // Reset fields after sending
            setRecipient('');
            setCc('');
            setBcc('');
            setSubject('');
            setBody('');
            setAttachment(null);
        } catch (error) {
            console.error(error);
            alert('Failed to send email.');
        }
    };

    return (
        <div className="compose-email-container">
            <h2>Compose Email</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="email" 
                    placeholder="To" 
                    value={recipient} 
                    onChange={(e) => setRecipient(e.target.value)} 
                    required 
                />
                <input 
                    type="text" 
                    placeholder="CC" 
                    value={cc} 
                    onChange={(e) => setCc(e.target.value)} 
                />
                <input 
                    type="text" 
                    placeholder="BCC" 
                    value={bcc} 
                    onChange={(e) => setBcc(e.target.value)} 
                />
                <input 
                    type="text" 
                    placeholder="Subject" 
                    value={subject} 
                    onChange={(e) => setSubject(e.target.value)} 
                    required 
                />
                <textarea 
                    placeholder="Body" 
                    value={body} 
                    onChange={(e) => setBody(e.target.value)} 
                    required 
                ></textarea>
                <input 
                    type="file" 
                    onChange={(e) => setAttachment(e.target.files[0])} 
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default EmailSender;
