import { type FormEvent, useState } from 'react';
import { type ValidateCardResponse, validateCard } from '../services/api';

export default function CreditCardValidator() {
  const [cardNumber, setCardNumber] = useState('');
  const [validationResult, setValidationResult] = useState<ValidateCardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await validateCard(cardNumber);
      setValidationResult(response);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to validate card number';
      setValidationResult({ isValid: false, errorMessage: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="credit-card-validator">
      <h1>Credit Card Validator</h1>
      <form className="card-form" onSubmit={handleSubmit}>
        <label htmlFor="card-number">Credit Card Number:</label>
        <input 
          className="card-number"
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
        <div className="modal-backdrop">
          <div className="modal">
            <p>{validationResult.isValid ? 'Valid card number' : 'Invalid card number'}</p>
            {validationResult.errorMessage && <p className="error-message">{validationResult.errorMessage}</p>}
            <button type="button" onClick={() => setValidationResult(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
