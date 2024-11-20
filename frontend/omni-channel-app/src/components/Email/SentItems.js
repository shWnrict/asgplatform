import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SentItems = () => {
    const [sentEmails, setSentEmails] = useState([]);

    useEffect(() => {
        const fetchSentEmails = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/email/sent');
                setSentEmails(response.data);
            } catch (error) {
                console.error('Error fetching sent emails:', error);
            }
        };

        fetchSentEmails();
    }, []);

    return (
        <div>
            <h3>Sent Items</h3>
            <ul>
                {sentEmails.map((email) => (
                    <li key={email._id}>
                        <strong>{email.subject}</strong> to {email.to} - {email.body}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SentItems;
