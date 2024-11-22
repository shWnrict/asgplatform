// src/components/Email.js
import React, { useState, useEffect } from 'react';
import Inbox from './Email/Inbox'; // Keep only Inbox component
import EmailSender from './Email/EmailSender';

const Email = () => {
  const [activeSubTab, setActiveSubTab] = useState('inbox');

  const renderEmailContent = () => {
    switch (activeSubTab) {
      case 'inbox':
        return <Inbox />;
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
        <button onClick={() => setActiveSubTab('compose')}>Compose Email</button>
      </div>
      {renderEmailContent()}
    </div>
  );
};

export default Email;