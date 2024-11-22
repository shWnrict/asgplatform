// src/components/Email/Inbox.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Inbox.css';

const Inbox = () => {
    const [emails, setEmails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEmail, setSelectedEmail] = useState(null);

    useEffect(() => {
        fetchEmails();
    }, []);

    const fetchEmails = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/email/inbox');
            setEmails(response.data);
        } catch (error) {
            console.error('Error fetching emails:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    if (loading) {
        return <div className="loading">Loading emails...</div>;
    }

    return (
        <div className="inbox-container">
            <div className="email-list">
                {emails.map((email) => (
                    <div
                        key={email.id}
                        className={`email-item ${!email.isRead ? 'unread' : ''} ${selectedEmail?.id === email.id ? 'selected' : ''}`}
                        onClick={() => setSelectedEmail(email)}
                    >
                        <div className="email-header">
                            <span className="from">{email.from}</span>
                            <span className="date">{formatDate(email.date)}</span>
                        </div>
                        <div className="subject">{email.subject}</div>
                        <div className="preview">{email.body?.substring(0, 100)}...</div>
                    </div>
                ))}
            </div>
            {selectedEmail && (
                <div className="email-content">
                    <h3>{selectedEmail.subject}</h3>
                    <div className="email-details">
                        <p><strong>From:</strong> {selectedEmail.from}</p>
                        <p><strong>To:</strong> {selectedEmail.to}</p>
                        <p><strong>Date:</strong> {formatDate(selectedEmail.date)}</p>
                    </div>
                    <div className="email-body">
                        {selectedEmail.html ? (
                            <div dangerouslySetInnerHTML={{ __html: selectedEmail.html }} />
                        ) : (
                            <pre>{selectedEmail.body}</pre>
                        )}
                    </div>
                    {selectedEmail.attachments?.length > 0 && (
                        <div className="attachments">
                            <h4>Attachments:</h4>
                            {selectedEmail.attachments.map((attachment, index) => (
                                <div key={index} className="attachment">
                                    📎 {attachment.filename}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Inbox;