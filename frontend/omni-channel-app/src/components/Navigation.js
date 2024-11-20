import React from 'react';

const Navigation = ({ activeTab, setActiveTab }) => {
    return (
        <div className="navigation">
            <button onClick={() => setActiveTab('home')}>Home</button>
            <button onClick={() => setActiveTab('chat')}>Chat</button>
            <button onClick={() => setActiveTab('email')}>Email</button>
            <button onClick={() => setActiveTab('contacts')}>Contacts</button>
            <button onClick={() => setActiveTab('logout')}>Logout</button>
        </div>
    );
};

export default Navigation;
