// Chat.js - Frontend
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
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
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        localStorage.setItem('chatMessages', JSON.stringify(messages));

        socket.on('receiveMessage', (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
            setIsTyping(false);
        });

        socket.on('typing', () => setIsTyping(true));
        socket.on('stopTyping', () => setIsTyping(false));

        return () => {
            socket.off('receiveMessage');
            socket.off('typing');
            socket.off('stopTyping');
        };
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message && !attachment) return;

        setIsSending(true);
        
        try {
            let attachmentInfo = null;
            
            if (attachment) {
                const formData = new FormData();
                formData.append('file', attachment);
                
                const uploadResponse = await fetch('http://localhost:5000/api/chat/upload', {
                    method: 'POST',
                    body: formData,
                });
                
                if (uploadResponse.ok) {
                    const data = await uploadResponse.json();
                    attachmentInfo = {
                        url: data.fileUrl,
                        fileName: data.fileName
                    };
                } else {
                    throw new Error('File upload failed');
                }
            }

            const msgData = {
                userId: loggedInUser,
                message,
                attachment: attachmentInfo,
                timestamp: new Date().toLocaleString('en-US', { 
                    dateStyle: 'short', 
                    timeStyle: 'short' 
                })
            };

            socket.emit('sendMessage', msgData);
            resetInput();
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again.');
        } finally {
            setIsSending(false);
        }
    };

    const resetInput = () => {
        setMessage('');
        setAttachment(null);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size > 5 * 1024 * 1024) {
            alert("File size exceeds 5MB limit.");
            return;
        }
        setAttachment(file);
    };

    const handleDownload = async (url, fileName) => {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Download failed');
            
            // Create a blob from the response
            const blob = await response.blob();
            
            // Create a temporary URL for the blob
            const downloadUrl = window.URL.createObjectURL(blob);
            
            // Create a temporary link element
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = fileName || 'download'; // Use original filename if available
            document.body.appendChild(link);
            link.click();
            
            // Clean up
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error('Download error:', error);
            alert('Failed to download file. Please try again.');
        }
    };

    return (
        <div className="chat-container">
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message-bubble ${msg.userId === loggedInUser ? 'my-message' : 'admin-message'}`}>
                        <p><strong>{msg.userId}:</strong> {msg.message}</p>
                        {msg.attachment && (
                            <div className="attachment">
                                <button 
                                    onClick={() => handleDownload(
                                        msg.attachment.url, 
                                        msg.attachment.fileName
                                    )}
                                    className="download-button"
                                >
                                    📎 Download {msg.attachment.fileName}
                                </button>
                            </div>
                        )}
                        <span className="timestamp">{msg.timestamp}</span>
                    </div>
                ))}
                {isTyping && (
                    <div className="typing-indicator">
                        {loggedInUser === "admin" ? "User is typing..." : "Admin is typing..."}
                    </div>
                )}
            </div>
            <form onSubmit={handleSendMessage} className="chat-form">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => {
                        setMessage(e.target.value);
                        socket.emit('typing');
                    }}
                    onBlur={() => socket.emit('stopTyping')}
                    placeholder="Type a message..."
                />
                <input
                    type="file"
                    id="file-input"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />
                <label htmlFor="file-input" className="file-input-label">
                    📎 Attach
                </label>
                {attachment && (
                    <div className="attachment-preview">
                        <p>{attachment.name}</p>
                        <button 
                            type="button" 
                            onClick={() => setAttachment(null)}
                            className="remove-attachment"
                        >
                            ✕
                        </button>
                    </div>
                )}
                <button type="submit" disabled={isSending}>
                    {isSending ? 'Sending...' : 'Send'}
                </button>
            </form>
        </div>
    );
};

export default Chat;