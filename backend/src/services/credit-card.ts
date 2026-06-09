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
    console.log('Decrypted Card Number:', decryptedCardNumber);
    return true;
  }
}