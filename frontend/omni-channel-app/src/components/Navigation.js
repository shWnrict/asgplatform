import React from 'react';
import './Navigation.css';

const Navigation = ({ activeTab, setActiveTab }) => {
    return (
        <div className="navigation-container">
            <button
                className={`navigation-btn ${activeTab === 'home' ? 'active' : ''}`}
                onClick={() => setActiveTab('home')}
            >
                Home
            </button>
            <button
                className={`navigation-btn ${activeTab === 'chat' ? 'active' : ''}`}
                onClick={() => setActiveTab('chat')}
            >
                Chat
            </button>
            <button
                className={`navigation-btn ${activeTab === 'email' ? 'active' : ''}`}
                onClick={() => setActiveTab('email')}
            >
                Email
            </button>
            <button
                className={`navigation-btn ${activeTab === 'sms' ? 'active' : ''}`}
                onClick={() => setActiveTab('sms')}
            >
                SMS
            </button>
            <button
                className={`navigation-btn ${activeTab === 'call' ? 'active' : ''}`}
                onClick={() => setActiveTab('call')}
            >
                Call
            </button>
        </div>
    );
};

export default Navigation;
