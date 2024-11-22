import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Inbox = () => {
    const [messages, setMessages] = useState([]);

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

    return (
        <div>
            <h3>Inbox</h3>
            <ul>
                {messages.map((message) => (
                    <li key={message.sid}>
                        From: {message.from} <br />
                        To: {message.to} <br />
                        Message: {message.body} <br />
                        Date Sent: {new Date(message.dateSent).toLocaleString()} <br />
                        <hr />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Inbox;