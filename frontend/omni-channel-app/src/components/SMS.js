import React, { useState } from 'react';
import Inbox from './SMS/Inbox'; // Ensure Inbox component is updated
import NewMessage from './SMS/NewMessage'; // Ensure NewMessage component is updated
import './SMS.css';

const SMS = () => {
    const [activeSubTab, setActiveSubTab] = useState('inbox');

    const renderSMSContent = () => {
        switch (activeSubTab) {
            case 'inbox':
                return <Inbox />;
            case 'new':
                return <NewMessage />;
            default:
                return <Inbox />;
        }
    };

    return (
        <div className="sms-container">
            <h2 className="sms-title">SMS</h2>
            <div className="sms-tabs">
                <button
                    className={`sms-tab ${activeSubTab === 'inbox' ? 'active' : ''}`}
                    onClick={() => setActiveSubTab('inbox')}
                >
                    Inbox
                </button>
                <button
                    className={`sms-tab ${activeSubTab === 'new' ? 'active' : ''}`}
                    onClick={() => setActiveSubTab('new')}
                >
                    New Message
                </button>
            </div>
            {renderSMSContent()}
        </div>
    );
};

export default SMS;
