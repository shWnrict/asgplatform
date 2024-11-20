import React, { useState } from 'react';

const Call = () => {
    const [dialNumber, setDialNumber] = useState('');
    const [incomingCall, setIncomingCall] = useState(null); // Simulate incoming call

    const handleDial = () => {
        // Logic to initiate a call using Twilio or another service
        alert(`Calling ${dialNumber}`);
        setDialNumber('');
    };

    const answerCall = () => {
        alert('Call answered');
        setIncomingCall(null); // Reset incoming call
    };

    const rejectCall = () => {
        alert('Call rejected');
        setIncomingCall(null); // Reset incoming call
    };

    return (
        <div>
            <h2>Call</h2>
            {incomingCall ? (
                <div className="incoming-call-popup">
                    <h3>Incoming Call from {incomingCall}</h3>
                    <button onClick={answerCall}>Answer</button>
                    <button onClick={rejectCall}>Reject</button>
                </div>
            ) : (
                <>
                    <input 
                        type="text" 
                        placeholder="Dial Number" 
                        value={dialNumber} 
                        onChange={(e) => setDialNumber(e.target.value)} 
                    />
                    <button onClick={handleDial}>Dial</button>
                </>
            )}
        </div>
    );
};

export default Call;
