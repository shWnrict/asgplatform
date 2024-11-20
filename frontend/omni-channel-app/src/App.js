import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Chat from './components/Chat'; // Create this component later
import Email from './components/Email'; // Create this component later
import Contacts from './components/Contacts'; // Create this component later
import './App.css'; // Ensure this line is present


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
            case 'contacts':
                return <Contacts />;
            case 'logout':
                // Handle logout functionality here
                return <h2>You have logged out.</h2>;
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
