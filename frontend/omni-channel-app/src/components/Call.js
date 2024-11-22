import React, { useState } from 'react';
import axios from 'axios';

const Call = () => {
    const [dialNumber, setDialNumber] = useState('');

    const handleDial = async () => {
        if (!dialNumber) {
            alert('Please enter a number to call.');
            return;
        }
        
        try {
            const response = await axios.post('http://localhost:5000/api/call', { to: dialNumber });
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