import React, { useState } from 'react';
import Inbox from './Email/Inbox'; // Keep Inbox component
import SentItems from './Email/SentItems'; // Import SentItems component
import EmailSender from './Email/EmailSender';

const Email = () => {
  const [activeSubTab, setActiveSubTab] = useState('inbox');

  const renderEmailContent = () => {
    switch (activeSubTab) {
      case 'inbox':
        return <Inbox />;
      case 'sent':
        return <SentItems />; // Render SentItems component
      case 'compose':
        return <EmailSender onEmailSent={() => setActiveSubTab('inbox')} />;
      default:
        return <Inbox />;
    }
  };

  return (
    <div>
      <h2>Email</h2>
      <div className="email-tabs">
        <button onClick={() => setActiveSubTab('inbox')}>Inbox</button>
        <button onClick={() => setActiveSubTab('sent')}>Sent Items</button> {/* New button for Sent Items */}
        <button onClick={() => setActiveSubTab('compose')}>Compose Email</button>
      </div>
      {renderEmailContent()}
    </div>
  );
};

export default Email;
