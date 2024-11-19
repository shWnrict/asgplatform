import React, { useState } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill'; // Import the react-quill component
import 'react-quill/dist/quill.snow.css'; // Import styles for react-quill

const EmailSender = () => {
    const [recipient, setRecipient] = useState('');
    const [cc, setCc] = useState('');
    const [bcc, setBcc] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [attachment, setAttachment] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!recipient) {
            alert('Recipient email is required!');
            return;
        }

        const formData = new FormData();
        formData.append('to', recipient);
        if (cc) formData.append('cc', cc);
        if (bcc) formData.append('bcc', bcc);
        formData.append('subject', subject);
        formData.append('body', body);
        if (attachment) {
            formData.append('attachment', attachment);
        }

        try {
            await axios.post('http://localhost:5000/api/email/send', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Email sent successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to send email.');
        }
    };

    // Define the toolbar options
    const modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['bold', 'italic', 'underline', 'strike'],
            ['link', 'image'],
            [{ 'color': [] }, { 'background': [] }], // Font color and background color
            [{ 'size': ['small', 'medium', 'large', 'huge'] }], // Font size
        ],
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Send Email</h2>
            <input type="email" placeholder="Recipient" onChange={(e) => setRecipient(e.target.value)} required />
            <input type="email" placeholder="CC" onChange={(e) => setCc(e.target.value)} />
            <input type="email" placeholder="BCC" onChange={(e) => setBcc(e.target.value)} />
            <input type="text" placeholder="Subject" onChange={(e) => setSubject(e.target.value)} required />
            
            {/* React Quill for rich text editing */}
            <ReactQuill 
                value={body} 
                onChange={setBody} 
                theme="snow" 
                placeholder="Body" 
                modules={modules} // Apply custom toolbar configuration
            />

            <input type="file" onChange={(e) => setAttachment(e.target.files[0])} />
            <button type="submit">Send Email</button>
        </form>
    );
};

export default EmailSender;
