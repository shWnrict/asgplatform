import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import Chat from './components/Chat';
import Email from './components/Email';
import SMS from './components/SMS';
import Call from './components/Call';
import Home from './components/Home';
import Login from './components/Login';
import CallPopup from './components/CallPopup';  // Import CallPopup component

const App = () => {
    const [activeTab, setActiveTab] = useState('home');
    const [user, setUser] = useState(() => localStorage.getItem('loggedInUser'));
    const [isCallPopupVisible, setIsCallPopupVisible] = useState(false);  // Manage CallPopup visibility

    const handleLogout = () => {
        localStorage.removeItem('loggedInUser');
        setUser(null);
    };

    const handleLogin = (username) => {
        setUser(username);
        setActiveTab('home');
    };

    const toggleCallPopup = () => {
        setIsCallPopupVisible(!isCallPopupVisible);  // Toggle the popup visibility
    };

    return (
        <Router>
            <AppContent
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                user={user}
                handleLogin={handleLogin}
                handleLogout={handleLogout}
                isCallPopupVisible={isCallPopupVisible}  // Pass state to child components
                toggleCallPopup={toggleCallPopup}        // Function to toggle popup visibility
            />
        </Router>
    );
};

const AppContent = ({
    activeTab,
    setActiveTab,
    user,
    handleLogin,
    handleLogout,
    isCallPopupVisible,
    toggleCallPopup
}) => {
    const location = useLocation();

    return (
        <div className="app-container">
            {/* Conditionally render the header */}
            {location.pathname !== '/login' && (
                <div className="header">
                    <h1 className="app-title">Omni-Channel Communication App</h1>
                    <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
            )}

            {/* CallPopup will be visible based on the state */}
            {isCallPopupVisible && <CallPopup onClose={toggleCallPopup} />}

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
                                    {activeTab === 'call' && <Call onIncomingCall={toggleCallPopup} />} {/* Optionally trigger popup on incoming call */}
                                </div>
                            </>
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
            </Routes>
        </div>
    );
};

export default App;
