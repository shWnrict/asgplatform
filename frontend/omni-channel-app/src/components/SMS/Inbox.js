import React from 'react';

const Inbox = () => {
    return (
        <div>
            <h3>Inbox</h3>
            {/* Display list of received SMS messages here */}
            {/* Example static message */}
            <ul>
                <li>Message 1 from +1234567890: Hello!</li>
                {/* Add more messages */}
            </ul>
        </div>
    );
};

export default Inbox;
