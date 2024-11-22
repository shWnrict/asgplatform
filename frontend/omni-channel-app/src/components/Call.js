import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import './Call.css';

const Call = () => {
    const [dialNumber, setDialNumber] = useState('');
    const [callStatus, setCallStatus] = useState('idle');
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Connect to socket for real-time call updates
        const newSocket = io('http://localhost:5000');
        setSocket(newSocket);

        newSocket.on('callStatus', (status) => {
            setCallStatus(status);
        });

        return () => newSocket.close();
    }, []);

    const handleDial = async () => {
        if (!dialNumber) {
            alert('Please enter a number');
            return;
        }

        try {
            setCallStatus('dialing');
            const response = await axios.post('http://localhost:5000/api/call/initiate-call', { 
                to: dialNumber 
            });
            
            alert(`Call initiated: ${response.data.callSid}`);
        } catch (error) {
            console.error('Call error:', error);
            setCallStatus('error');
        }
    };

    const handleButtonClick = (num) => {
        setDialNumber(prev => prev + num);
    };

    const handleClear = () => {
        setDialNumber('');
    };

    return (
        <div className="call-container">
            <div className="call-status">
                Current Status: {callStatus}
            </div>
            <div className="dialer">
                <input 
                    type="text" 
                    value={dialNumber}
                    readOnly 
                    placeholder="Enter Number" 
                />
                <div className="dial-pad">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map(num => (
                        <button key={num} onClick={() => handleButtonClick(num)}>
                            {num}
                        </button>
                    ))}
                </div>
                <div className="call-actions">
                    <button onClick={handleClear}>Clear</button>
                    <button onClick={handleDial}>Call</button>
                </div>
            </div>
        </div>
    );
};

export default Call;
