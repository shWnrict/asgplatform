import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import Chat from './components/Chat';
import Email from './components/Email';
import SMS from './components/SMS';
import Call from './components/Call';
import Home from './components/Home';
import Login from './components/Login';

const App = () => {
    const [activeTab, setActiveTab] = useState('home');
    const [user, setUser] = useState(() => localStorage.getItem('loggedInUser'));

    const handleLogout = () => {
        localStorage.removeItem('loggedInUser');
        setUser(null);
    };

    const handleLogin = (username) => {
        setUser(username);
        setActiveTab('home');
    };

    return (
        <Router>
            <div className="app-container">
                {/* Header Section */}
                <div className="header">
                    <h1 className="app-title">Omni-Channel Communication App</h1>
                    <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
                <Routes>
                    <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
                    <Route
                        path="/"
                        element={
                            user ? (
                                <>
                                    <div className="content-container">
                                        {activeTab === 'home' && <Home onLogout={handleLogout} loggedInUser={user} />}
                                        {activeTab === 'chat' && <Chat loggedInUser={user} />}
                                        {activeTab === 'email' && <Email />}
                                        {activeTab === 'sms' && <SMS />}
                                        {activeTab === 'call' && <Call />}
                                    </div>
                                </>
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
