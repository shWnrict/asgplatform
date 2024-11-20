import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Inbox = () => {
    const [emails, setEmails] = useState([]);

    useEffect(() => {
        // Fetch emails from the backend when the component mounts
        const fetchEmails = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/email/inbox'); // Adjust this endpoint as needed
                setEmails(response.data);
            } catch (error) {
                console.error('Error fetching emails:', error);
            }
        };

        fetchEmails();
    }, []);

    return (
        <div>
            <h2>Inbox</h2>
            <ul>
                {emails.map((email) => (
                    <li key={email.id}>
                        <strong>{email.subject}</strong> from {email.from} - {email.body}
                        {/* Add more details or a link to view full email */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Inbox;
