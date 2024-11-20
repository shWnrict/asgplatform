import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SentItems = () => {
    const [sentEmails, setSentEmails] = useState([]);

    useEffect(() => {
        // Fetch sent emails from the backend when the component mounts
        const fetchSentEmails = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/email/sent'); // Adjust this endpoint as needed
                setSentEmails(response.data);
            } catch (error) {
                console.error('Error fetching sent emails:', error);
            }
        };

        fetchSentEmails();
    }, []);

    return (
        <div>
            <h2>Sent Items</h2>
            <ul>
                {sentEmails.map((email) => (
                    <li key={email.id}>
                        <strong>{email.subject}</strong> to {email.to} - {email.body}
                        {/* Add more details or options to delete */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SentItems;
