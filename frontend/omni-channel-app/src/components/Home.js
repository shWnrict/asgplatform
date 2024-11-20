import React from 'react';

const Home = ({ onLogout }) => {
    // Placeholder for logged-in user
    const loggedInUser = "User"; // Replace this with actual user data when available

    return (
        <div>
            <h2>Welcome, {loggedInUser}!</h2>
            <button onClick={onLogout}>Logout</button>
        </div>
    );
};

export default Home;
