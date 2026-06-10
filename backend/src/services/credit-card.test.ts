import crypto from 'crypto-js';
import { CreditCardService } from './credit-card';

const SECRET_KEY = 'test-secret-key';

function encryptCardNumber(cardNumber: string): string {
  return crypto.AES.encrypt(cardNumber, SECRET_KEY).toString();
}

describe('CreditCardService', () => {
  const originalSecretKey = process.env.SECRET_KEY;
  let service: CreditCardService;

  beforeEach(() => {
    service = new CreditCardService();
    process.env.SECRET_KEY = SECRET_KEY;
  });

  afterAll(() => {
    if (originalSecretKey === undefined) {
      delete process.env.SECRET_KEY;
      return;
    }

    process.env.SECRET_KEY = originalSecretKey;
  });

  describe('luhnCheck', () => {
    it('returns true for valid card numbers', () => {
      expect(service.luhnCheck('4111111111111111')).toBe(true);
      expect(service.luhnCheck('4012-8888-8888-1881')).toBe(true);
      expect(service.luhnCheck('3782 822463 10005')).toBe(true);
    });

    it('returns false for invalid card numbers', () => {
      expect(service.luhnCheck('4111111111111112')).toBe(false);
      expect(service.luhnCheck('1234567890123')).toBe(false);
    });

    it('returns false for empty values and invalid lengths', () => {
      expect(service.luhnCheck('')).toBe(false);
      expect(service.luhnCheck('411111111111')).toBe(false);
      expect(service.luhnCheck('41111111111111111111')).toBe(false);
    });
  });

  describe('decryptCardNumber', () => {
    it('decrypts a salted AES encrypted card number', () => {
      const encryptedCardNumber = encryptCardNumber('4111111111111111');

      expect(service.decryptCardNumber(encryptedCardNumber)).toBe('4111111111111111');
    });

    it('throws when SECRET_KEY is not configured', () => {
      const encryptedCardNumber = encryptCardNumber('4111111111111111');
      delete process.env.SECRET_KEY;

      expect(() => service.decryptCardNumber(encryptedCardNumber)).toThrow(
        'SECRET_KEY is not defined in environment variables'
      );
    });
  });

  describe('validateCard', () => {
    it('returns true for an encrypted valid card number', () => {
      expect(service.validateCard(encryptCardNumber('4111111111111111'))).toBe(true);
    });

    it('returns false for an encrypted invalid card number', () => {
      expect(service.validateCard(encryptCardNumber('4111111111111112'))).toBe(false);
    });
  });
});
