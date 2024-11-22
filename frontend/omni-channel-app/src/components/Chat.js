import React, { useEffect, useState, useRef } from 'react';
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
    
    // Ref for scrolling to the bottom
    const messagesEndRef = useRef(null);

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

    // Scroll to bottom every time messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleFileChange = (event) => {
        const file = event.target.files[0]; // Get the first selected file
        if (file) {
            setAttachment(file); // Update attachment state with the selected file
        }
    };

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
                        fileName: data.fileName,
                        originalName: attachment.name // Store original name from file object
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

            console.log("Sending message from user:", loggedInUser); // Debugging log
            socket.emit('sendMessage', msgData);
            resetInput(); // Ensure to reset input fields after sending
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again.'); // Show alert only on error
        } finally {
            setIsSending(false); // Always set sending state to false
        }
    };

    const resetInput = () => {
        setMessage('');
        setAttachment(null); // Reset attachment after sending
    };

    const handleDownload = async (url, fileName) => {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Download failed');
            
            // Get the filename from the Content-Disposition header if available
            const contentDisposition = response.headers.get('content-disposition');
            let downloadFileName = fileName;
            
            if (contentDisposition) {
                const matches = /filename="([^"]*)"/.exec(contentDisposition);
                if (matches && matches[1]) {
                    downloadFileName = matches[1];
                }
            }

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = downloadFileName;
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
                                        msg.attachment.originalName || msg.attachment.fileName
                                    )}
                                    className="download-button"
                                >
                                    📎 Download {msg.attachment.originalName || msg.attachment.fileName}
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
                {/* Dummy div for scrolling */}
                <div ref={messagesEndRef} />
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
                    onChange={handleFileChange} // Attach the handler here
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