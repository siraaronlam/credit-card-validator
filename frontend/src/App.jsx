import React, { useState } from 'react';

export default function App() {
  const [cardNumber, setCardNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/v1/credit-card/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cardNumber }),
      });
      
      const data = await response.json();
      console.log('Validation result:', data);
    } catch (error) {
      console.error('Error validating card:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="app">
      <h1>Credit Card Validator</h1>
      <form className="card-form" onSubmit={handleSubmit}>
        <label htmlFor="card-number">Credit Card Number:</label>
        <input 
          type="text" 
          id="card-number" 
          name="card-number" 
          placeholder="Enter your card number" 
          onChange={(e) => setCardNumber(e.target.value)}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Validating...' : 'Validate'}
        </button>
      </form>
    </main>
  );
}
