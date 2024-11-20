import React, { useState } from 'react';
import EmailSender from './Email/EmailSender';
import Inbox from './Email/Inbox';
import SentItems from './Email/SentItems';
import Chat from './Chat';
import Contacts from './Contacts';

const Tabs = () => {
    const [activeTab, setActiveTab] = useState('inbox');

    const renderContent = () => {
        switch (activeTab) {
            case 'inbox':
                return <Inbox />;
            case 'sent':
                return <SentItems />;
            case 'send':
                return <EmailSender onEmailSent={() => setActiveTab('inbox')} />;
            case 'chat':
                return <Chat />;
            case 'contacts':
                return <Contacts />;
            default:
                return <Inbox />;
        }
    };

    return (
        <div>
            <div className="tabs">
                <button onClick={() => setActiveTab('inbox')}>Inbox</button>
                <button onClick={() => setActiveTab('sent')}>Sent Items</button>
                <button onClick={() => setActiveTab('send')}>Send Email</button>
                <button onClick={() => setActiveTab('chat')}>Chat</button>
                <button onClick={() => setActiveTab('contacts')}>Contacts</button>
            </div>
            <div className="tab-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default Tabs;
