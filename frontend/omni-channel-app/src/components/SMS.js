import React, { useState } from 'react';
import Inbox from './SMS/Inbox'; // Create this component later
import NewMessage from './SMS/NewMessage'; // Create this component later

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
        <div>
            <h2>SMS</h2>
            <div className="sms-tabs">
                <button onClick={() => setActiveSubTab('inbox')}>Inbox</button>
                <button onClick={() => setActiveSubTab('new')}>New Message</button>
            </div>
            {renderSMSContent()}
        </div>
    );
};

export default SMS;
