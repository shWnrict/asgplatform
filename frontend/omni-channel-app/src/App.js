import React, { useState } from 'react';
import './App.css'; // Importing the CSS file
import Navigation from './components/Navigation';
import Chat from './components/Chat';
import Email from './components/Email';
import SMS from './components/SMS';
import Call from './components/Call';
import Home from './components/Home';

const App = () => {
    const [activeTab, setActiveTab] = useState('home');

    const handleLogout = () => {
        // Placeholder for logout functionality
        console.log("User logged out");
        // You can add logic here to clear user data or redirect to a login page
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'home':
                return <Home onLogout={handleLogout} />;
            case 'chat':
                return <Chat />;
            case 'email':
                return <Email />;
            case 'sms':
                return <SMS />;
            case 'call':
                return <Call />;
            default:
                return <Home onLogout={handleLogout} />;
        }
    };

    return (
        <div className="App">
            <h1>Omni-Channel Communication App</h1>
            <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="tab-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default App;
