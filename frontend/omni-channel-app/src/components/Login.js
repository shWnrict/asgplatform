// src/components/Login.js
import React, { useState } from 'react';
import './Login.css'; // Create this CSS file for styling

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Define multiple user credentials
    const users = [
        { username: 'user', password: 'password' }, // User 1
        { username: 'admin', password: 'admin123' }  // User 2
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const foundUser = users.find(user => user.username === username && user.password === password);
    
        if (foundUser) {
            localStorage.setItem('loggedInUser', foundUser.username); // Store username in local storage
            onLogin(foundUser.username); // Call the onLogin function passed as a prop
        } else {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
