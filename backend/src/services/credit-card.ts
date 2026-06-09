import crypto from 'crypto';

export class CreditCardService {
  constructor() {}

  evpKDF(password: string, salt: Buffer): { key: Buffer, iv: Buffer } {
    const passwordBuf = Buffer.from(password, 'utf8');
    let d = Buffer.alloc(0);
    let dI = Buffer.alloc(0);

    while (d.length < 48) { // 32 (key) + 16 (iv)
      dI = crypto.createHash('md5').update(Buffer.concat([dI, passwordBuf, salt])).digest();
      d = Buffer.concat([d, dI]);
    }

    return {
      key: d.subarray(0, 32),
      iv: d.subarray(32, 48)
    };
  }

  decryptCardNumber(encryptedBase64: string): string {
    const secretKey = process.env.SECRET_KEY;
    if (!secretKey) {
      throw new Error('SECRET_KEY is not defined in environment variables');
    }

    const encryptedBytes = Buffer.from(encryptedBase64, 'base64');
    const salt = encryptedBytes.subarray(8, 16);
    const ciphertext = encryptedBytes.subarray(16);
    const { key, iv } = this.evpKDF(secretKey, salt);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);

    return decrypted.toString('utf8');
  }

  validateCard(cardNumber: string): boolean {
    const decryptedCardNumber = this.decryptCardNumber(cardNumber);
    return this.luhnCheck(decryptedCardNumber);
  }

  luhnCheck(cardNumber: string): boolean {
    // Remove any non-digit characters
    let cleanValue = cardNumber.replace(/\D/g, '');

    // Check if value is empty or is a valid credit card number length (13-19 digits)
    if (!cleanValue || cleanValue.length < 13 || cleanValue.length > 19) {
      return false;
    }

    let checks = 0;
    if (cleanValue && /[0-9-\s]+/.test(cleanValue)) {
        cleanValue.split('').forEach((v, n) => {
            let digits = parseInt(v, 10);
            if (!((cleanValue.length + n) % 2) && (digits *= 2) > 9) {
                digits -= 9;
            }
            checks += digits;
        });
    }

    return (checks % 10) === 0;
  }
}