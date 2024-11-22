// src/components/Home.js
import React from 'react';

const Home = ({ onLogout, loggedInUser }) => {
    return (
        <div>
            <h2>Welcome, {loggedInUser}!</h2> {/* Use the passed loggedInUser prop */}
            <button onClick={onLogout}>Logout</button>
        </div>
    );
};

export default Home;
