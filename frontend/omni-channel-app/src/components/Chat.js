import React, { useEffect, useState } from 'react';
import io from 'socket.io-client'; // Make sure to install socket.io-client
// import EmojiPicker from 'emoji-picker-react'; // Install this package for emoji support

const socket = io('http://localhost:5000'); // Adjust this URL based on your backend

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    useEffect(() => {
        socket.on('receiveMessage', (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
            setIsTyping(false); // Reset typing indicator when a message is received
        });

        socket.on('typing', () => {
            setIsTyping(true);
        });

        socket.on('stopTyping', () => {
            setIsTyping(false);
        });

        return () => {
            socket.off('receiveMessage');
            socket.off('typing');
            socket.off('stopTyping');
        };
    }, []);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!message && !attachment) return; // Prevent sending empty messages

        const msgData = { message, attachment };
        socket.emit('sendMessage', msgData);
        setMessages((prevMessages) => [...prevMessages, msgData]); // Add to local messages
        setMessage('');
        setAttachment(null);
    };

    const handleTyping = () => {
        socket.emit('typing');
    };

    const handleEmojiClick = (emojiObject) => {
        setMessage((prevMessage) => prevMessage + emojiObject.emoji);
        setShowEmojiPicker(false); // Close emoji picker after selection
    };

    return (
        <div className="chat-container">
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message-bubble ${msg.attachment ? 'has-attachment' : ''}`}>
                        <p>{msg.message}</p>
                        {msg.attachment && <img src={URL.createObjectURL(msg.attachment)} alt="attachment" />}
                    </div>
                ))}
                {isTyping && <div className="typing-indicator">User is typing...</div>}
            </div>
            <form onSubmit={handleSendMessage} className="chat-form">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => {
                        setMessage(e.target.value);
                        handleTyping(); // Emit typing event on input change
                    }}
                    placeholder="Type a message..."
                />
                <input
                    type="file"
                    onChange={(e) => setAttachment(e.target.files[0])}
                />
                <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>😊</button>
                {showEmojiPicker && (
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                )}
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Chat;
