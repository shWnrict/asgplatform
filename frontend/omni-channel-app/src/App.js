import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css'; // Importing the CSS file
import Navigation from './components/Navigation';
import Chat from './components/Chat';
import Email from './components/Email';
import SMS from './components/SMS';
import Call from './components/Call';
import Home from './components/Home';
import Login from './components/Login'; // Import the new Login component

const App = () => {
    const [activeTab, setActiveTab] = useState('home');
    const [user, setUser] = useState(() => localStorage.getItem('loggedInUser')); // Retrieve user from local storage

    const handleLogout = () => {
        console.log("User logged out");
        localStorage.removeItem('loggedInUser'); // Clear user data from local storage
        setUser(null); // Clear user state
    };

    const handleLogin = (username) => {
        setUser(username); // Set logged-in user
        setActiveTab('home'); // Redirect to home tab after login
    };

    return (
        <Router>
            <div className="App">
                <h1>Omni-Channel Communication App</h1>
                <Routes>
                    {/* Route for Login */}
                    <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
                    {/* Default route for main content */}
                    <Route path="/" element={user ? (
                        <>
                            <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
                            {activeTab === 'home' && <Home onLogout={handleLogout} loggedInUser={user} />}
                            {activeTab === 'chat' && <Chat loggedInUser={user} />}
                            {activeTab === 'email' && <Email />}
                            {activeTab === 'sms' && <SMS />}
                            {activeTab === 'call' && <Call />}
                        </>
                    ) : (
                        <Navigate to="/login" />
                    )} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;