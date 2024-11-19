import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Ensure this matches your backend URL

const Chat = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.on('receiveMessage', (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });
        
        return () => {
            socket.off('receiveMessage');
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        socket.emit('sendMessage', message);
        setMessage('');
    };

    return (
        <div>
            <h2>Chat</h2>
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
            </div>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    placeholder="Type a message..." 
                    required 
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Chat;