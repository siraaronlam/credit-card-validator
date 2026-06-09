import crypto from 'crypto-js';

function encryptCardNumber(cardNumber: string): string {
  const encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY;
  if (!encryptionKey) {
    throw new Error('Encryption key is not defined in environment variables');
  }
  const encryptedCard = crypto.AES.encrypt(cardNumber, encryptionKey).toString();
  return encryptedCard;
}

export { encryptCardNumber };