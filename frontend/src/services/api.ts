import { encryptCardNumber } from './encryption';

export interface ValidateCardResponse {
  isValid: boolean;
  errorMessage?: string;
}

async function validateCard(cardNumber: string): Promise<ValidateCardResponse> {
  try {
    const response = await fetch('http://localhost:3000/v1/credit-card/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cardNumber: encryptCardNumber(cardNumber),
      }),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export { validateCard };