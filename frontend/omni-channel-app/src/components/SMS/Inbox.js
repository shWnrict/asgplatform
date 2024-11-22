import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Inbox.css';

const Inbox = () => {
    const [messages, setMessages] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    const fetchMessages = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/sms/history');
            setMessages(response.data);
        } catch (error) {
            console.error(error);
            alert('Failed to fetch message history.');
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const filteredMessages = messages.filter((message) => {
        const matchesSearch = message.body.toLowerCase().includes(search.toLowerCase()) || 
                              message.from.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' || message.from === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="inbox-container">
            <div className="inbox-controls">
                <input
                    type="text"
                    className="inbox-search"
                    placeholder="Search messages..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    className="inbox-filter"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="all">All Senders</option>
                    {[...new Set(messages.map((msg) => msg.from))].map((sender) => (
                        <option key={sender} value={sender}>
                            {sender}
                        </option>
                    ))}
                </select>
            </div>
            <div className="inbox-scrollable">
                <ul className="inbox-list">
                    {filteredMessages.length > 0 ? (
                        filteredMessages.map((message) => (
                            <li key={message.sid} className="inbox-item">
                                <div className="message-header">
                                    <span className="message-sender">{message.from}</span>
                                    <span className="message-date">{new Date(message.dateSent).toLocaleString()}</span>
                                </div>
                                <p className="message-body">{message.body}</p>
                            </li>
                        ))
                    ) : (
                        <div className="empty-state">No messages found.</div>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Inbox;
