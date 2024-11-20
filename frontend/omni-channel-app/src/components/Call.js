import React, { useState } from 'react';

const Call = () => {
    const [dialNumber, setDialNumber] = useState('');

    const handleDial = () => {
        // Logic to initiate a call using Twilio or another service
        alert(`Calling ${dialNumber}`);
        setDialNumber(''); // Clear the number after dialing
    };

    const handleButtonClick = (num) => {
        setDialNumber((prev) => prev + num);
    };

    const handleClear = () => {
        setDialNumber('');
    };

    return (
        <div>
            <h2>Dial Pad</h2>
            <div className="dial-pad">
                <input 
                    type="text" 
                    placeholder="Enter Number" 
                    value={dialNumber} 
                    readOnly 
                />
                <div className="button-grid">
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((num) => (
                        <button key={num} onClick={() => handleButtonClick(num)}>{num}</button>
                    ))}
                </div>
                <button onClick={handleClear}>Clear</button>
                <button onClick={handleDial}>Call</button>
            </div>
        </div>
    );
};

export default Call;
