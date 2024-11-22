import React, { useState } from 'react';
import axios from 'axios';
import './DialPad.css'; // Ensure you have the CSS imported

const Call = () => {
    const [dialNumber, setDialNumber] = useState('');

    const handleDial = async () => {
        if (!dialNumber) {
            alert('Please enter a number to call.');
            return;
        }
    
        try {
            const response = await axios.post('http://localhost:5000/api/call/make', { to: dialNumber });
            alert(response.data); // Display success message
        } catch (error) {
            console.error('Error making call:', error);
            alert('Failed to make call: ' + error.response?.data || error.message);
        }
    
        setDialNumber(''); // Clear the number after dialing
    };
    

    const handleButtonClick = (num) => {
        setDialNumber((prev) => prev + num);
    };

    const handleClear = () => {
        setDialNumber('');
    };

    return (
        <div className="dial-container">
            <h2>Dial Pad</h2>
            <div className="dial-pad">
                <input 
                    type="text" 
                    placeholder="Enter Number" 
                    value={dialNumber} 
                    readOnly 
                    className="dial-input"
                />
                <div className="button-grid">
                    {/* Added '+' button */}
                    <button onClick={() => handleButtonClick('+')} className="dial-button">+</button>
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '#'].map((num) => (
                        <button key={num} onClick={() => handleButtonClick(num)} className="dial-button">{num}</button>
                    ))}
                </div>
                <div className="dial-actions">
                    <button onClick={handleClear} className="action-button clear-button">Clear</button>
                    <button onClick={handleDial} className="action-button call-button">Call</button>
                </div>
            </div>
        </div>
    );
};

export default Call;