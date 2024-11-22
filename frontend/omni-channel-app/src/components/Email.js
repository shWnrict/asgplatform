import React, { useState } from 'react';
import Inbox from './Email/Inbox';
import SentItems from './Email/SentItems';
import EmailSender from './Email/EmailSender';
import './Email.css'; // Ensure the CSS file is imported

const Email = () => {
  const [activeSubTab, setActiveSubTab] = useState('inbox');

  const renderEmailContent = () => {
    switch (activeSubTab) {
      case 'inbox':
        return <Inbox />;
      case 'sent':
        return <SentItems />;
      case 'compose':
        return <EmailSender onEmailSent={() => setActiveSubTab('inbox')} setActiveSubTab={setActiveSubTab} />;
      default:
        return <Inbox />;
    }
  };

  return (
    <div className="email-container">
      <div className="email-tabs">
        <button
          className={`email-tab ${activeSubTab === 'inbox' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('inbox')}
        >
          Inbox
        </button>
        <button
          className={`email-tab ${activeSubTab === 'sent' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('sent')}
        >
          Sent Items
        </button>
        <button
          className={`email-tab ${activeSubTab === 'compose' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('compose')}
        >
          Compose Email
        </button>
      </div>
      {renderEmailContent()}
    </div>
  );
};

export default Email;
