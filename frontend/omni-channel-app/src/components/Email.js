import React, { useState } from 'react';
import Inbox from './Email/Inbox';
import SentItems from './Email/SentItems';
import EmailSender from './Email/EmailSender';

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
    <div>
      <h2>Email</h2>
      <div className="email-tabs">
        <button onClick={() => setActiveSubTab('inbox')}>Inbox</button>
        <button onClick={() => setActiveSubTab('sent')}>Sent Items</button>
        <button onClick={() => setActiveSubTab('compose')}>Compose Email</button>
      </div>
      {renderEmailContent()}
    </div>
  );
};

export default Email;
