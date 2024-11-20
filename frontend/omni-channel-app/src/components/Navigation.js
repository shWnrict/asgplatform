import React from 'react';

const Navigation = ({ activeTab, setActiveTab }) => {
    return (
        <div className="navigation">
            <button onClick={() => setActiveTab('home')}>Home</button>
            <button onClick={() => setActiveTab('chat')}>Chat</button>
            <button onClick={() => setActiveTab('email')}>Email</button>
            <button onClick={() => setActiveTab('sms')}>SMS</button>
            <button onClick={() => setActiveTab('call')}>Call</button>
        </div>
    );
};

export default Navigation;
