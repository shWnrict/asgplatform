import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import EmojiPicker from 'emoji-picker-react';
import './Chat.css';

const socket = io('http://localhost:5000');

const Chat = ({ loggedInUser }) => {
    const [messages, setMessages] = useState(() => {
        const savedMessages = localStorage.getItem('chatMessages');
        return savedMessages ? JSON.parse(savedMessages) : [];
    });
    const [message, setMessage] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        localStorage.setItem('chatMessages', JSON.stringify(messages));
    }, [messages]);

    useEffect(() => {
        socket.on('receiveMessage', (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
            setIsTyping(false);
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

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message && !attachment) return;

        const msgData = {
            userId: loggedInUser,
            message,
            attachment,
            timestamp: new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })
        };

        setIsSending(true);
        socket.emit('sendMessage', msgData);
        resetInput();
        setIsSending(false);
    };

    const resetInput = () => {
        setMessage('');
        setAttachment(null);
        setShowEmojiPicker(false);
    };

    const handleTyping = () => {
        socket.emit('typing');
    };

    const handleEmojiClick = (emojiObject) => {
        setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size > 5 * 1024 * 1024) {
            alert("File size exceeds 5MB limit.");
            return;
        }
        setAttachment(file);
    };

    return (
        <div className="chat-container">
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message-bubble ${msg.userId === loggedInUser ? 'my-message' : 'admin-message'}`}>
                        <p><strong>{msg.userId}:</strong> {msg.message}</p>
                        {msg.attachment && <img src={URL.createObjectURL(msg.attachment)} alt="attachment" />}
                        <span className="timestamp">{msg.timestamp}</span>
                    </div>
                ))}
                {isTyping && <div className="typing-indicator">{loggedInUser === "admin" ? "User is typing..." : "Admin is typing..."}</div>}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="chat-form">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => {
                        setMessage(e.target.value);
                        handleTyping();
                    }}
                    placeholder="Type a message..."
                />
                <input
                    type="file"
                    id="file-input"
                    onChange={handleFileChange}
                />
                <label htmlFor="file-input">📎 Attach</label>
                {attachment && <div className="attachment-preview"><p>{attachment.name}</p></div>}
                <button type="button" className="emoji-btn" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>😊</button>
                {showEmojiPicker && (
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                )}
                <button type="submit" disabled={isSending}>{isSending ? 'Sending...' : 'Send'}</button>
            </form>
        </div>
    );
};

export default Chat;
