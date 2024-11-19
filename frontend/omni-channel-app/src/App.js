import logo from './logo.svg';
import './App.css';
import React from 'react';
import EmailSender from './components/EmailSender';
import SmsSender from './components/SmsSender';
import Chat from './components/Chat';
import Call from './components/Call';

const App = () => {
    return (
        <div className="App">
            <h1>Omni-Channel Communication App</h1>
            <EmailSender />
            <SmsSender />
            <Chat />
            <Call />
        </div>
    );
};

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
