import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Chat from './components/Chat';
import Email from './components/Email';
import SMS from './components/SMS'; // Import the new SMS component
import Call from './components/Call'; // Import the new Call component
import './App.css';

const App = () => {
    const [activeTab, setActiveTab] = useState('home');

    const renderContent = () => {
        switch (activeTab) {
            case 'home':
                return <h2>Welcome to the Omni-Channel Communication App!</h2>;
            case 'chat':
                return <Chat />;
            case 'email':
                return <Email />;
            case 'sms':
                return <SMS />;
            case 'call':
                return <Call />;
            default:
                return <h2>Welcome to the Omni-Channel Communication App!</h2>;
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
