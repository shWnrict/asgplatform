import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Inbox.css';

const Inbox = () => {
    const [emails, setEmails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const fetchEmails = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get('http://localhost:5000/api/email/inbox');
            if (response.data && Array.isArray(response.data)) {
                setEmails(response.data.sort((a, b) => new Date(b.date) - new Date(a.date))); // Sort by date
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Error fetching emails:', error);
            setError(error.message || 'Failed to fetch emails');
            setEmails(prevEmails => prevEmails); // Keep the existing emails in case of error
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial fetch
    useEffect(() => {
        fetchEmails();
    }, [fetchEmails, refreshKey]);

    // Refresh emails periodically
    useEffect(() => {
        const intervalId = setInterval(() => {
            setRefreshKey(prev => prev + 1);
        }, 300000); // Refresh every 5 minutes

        return () => clearInterval(intervalId);
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    if (error) {
        return (
            <div className="error-container">
                <p>Error: {error}</p>
                <button onClick={() => setRefreshKey(prev => prev + 1)}>
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="inbox-container">
            <div className="email-controls">
                <button 
                    onClick={() => setRefreshKey(prev => prev + 1)}
                    disabled={loading}
                >
                    Refresh
                </button>
            </div>
            
            <div className="email-list">
                {loading && emails.length === 0 ? (
                    <div className="loading">Loading emails...</div>
                ) : (
                    emails.map((email) => (
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
                    ))
                )}
                {loading && emails.length > 0 && (
                    <div className="loading-overlay">Refreshing...</div>
                )}
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
                                    <a href={attachment.url} download>{attachment.filename} 📎</a>
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
