import React, { useState } from 'react';
import { validateCard } from './services/api';

export default function App() {
  const [cardNumber, setCardNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await validateCard(cardNumber);
      console.log('Validation response:', response);
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
