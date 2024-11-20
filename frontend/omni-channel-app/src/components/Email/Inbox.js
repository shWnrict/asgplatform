import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Inbox = () => {
    const [emails, setEmails] = useState([]);

    useEffect(() => {
        const fetchInboxEmails = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/email/inbox');
                setEmails(response.data);
            } catch (error) {
                console.error('Error fetching inbox emails:', error);
            }
        };

        fetchInboxEmails();
    }, []);

    return (
        <div>
            <h3>Inbox</h3>
            <ul>
                {emails.map((email) => (
                    <li key={email._id}>
                        <strong>{email.subject}</strong> from {email.to} - {email.body}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Inbox;
