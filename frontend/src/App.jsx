import React, { useState } from 'react';
import { validateCard } from './services/api';

export default function App() {
  const [cardNumber, setCardNumber] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await validateCard(cardNumber);
      setValidationResult(response);
    } catch (error) {
      setValidationResult({ isValid: false });
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
      {validationResult && (
        <div className={`validation-result ${validationResult.isValid ? 'valid' : 'invalid'}`}>
          <p>{validationResult.isValid ? 'Valid card number' : 'Invalid card number'}</p>
        </div>
      )}
    </main>
  );
}
