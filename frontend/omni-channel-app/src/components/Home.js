// src/components/Home.js
import React from 'react';
import './Home.css'; // Add this for Home component specific styles

const Home = ({ onLogout, loggedInUser }) => {
    return (
        <div className="home-container">
            <h2>Welcome, <span className="user-name">{loggedInUser}!</span></h2>
            <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
    );
};

export default Home;
