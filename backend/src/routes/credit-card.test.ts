import express from 'express';
import request from 'supertest';
import { createCreditCardRouter } from './credit-card';
import { CreditCardService } from '../services/credit-card';

describe('createCreditCardRouter', () => {
  const validateCard = jest.fn();
  let app: express.Application;

  beforeEach(() => {
    validateCard.mockReset();

    app = express();
    app.use(express.json());
    app.use('/credit-card', createCreditCardRouter({ validateCard } as unknown as CreditCardService));
  });

  it('returns 400 when cardNumber is missing', async () => {
    const response = await request(app).post('/credit-card/validate').send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      isValid: false,
      errorMessage: 'Card number is required'
    });
    expect(validateCard).not.toHaveBeenCalled();
  });

  it('returns true when the service validates the card', async () => {
    validateCard.mockReturnValue(true);

    const response = await request(app)
      .post('/credit-card/validate')
      .send({ cardNumber: 'encrypted-valid-card' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ isValid: true });
    expect(validateCard).toHaveBeenCalledWith('encrypted-valid-card');
  });

  it('returns false when the service rejects the card', async () => {
    validateCard.mockReturnValue(false);

    const response = await request(app)
      .post('/credit-card/validate')
      .send({ cardNumber: 'encrypted-invalid-card' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ isValid: false });
    expect(validateCard).toHaveBeenCalledWith('encrypted-invalid-card');
  });

  it('returns 400 with the service error message when validation throws', async () => {
    validateCard.mockImplementation(() => {
      throw new Error('Unable to decrypt card number');
    });

    const response = await request(app)
      .post('/credit-card/validate')
      .send({ cardNumber: 'bad-payload' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      isValid: false,
      errorMessage: 'Unable to decrypt card number'
    });
  });
});
