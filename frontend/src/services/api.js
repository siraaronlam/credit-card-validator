import { encryptCardNumber } from './encryption';

async function validateCard(cardNumber) {
    const encryptedCardNumber = encryptCardNumber(cardNumber);
  try {
    const response = await fetch('http://localhost:3000/v1/credit-card/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cardNumber: encryptedCardNumber,
      }),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error validating card:', error);
    throw error;
  }
}

export { validateCard };