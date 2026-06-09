import { Request, Response, Router } from "express";
import { CreditCardService } from "../services/credit-card.js";

export interface ValidateCardRequest {
  cardNumber: string;
}

export interface ValidateCardResponse {
  isValid: boolean;
  errorMessage?: string;
}

export function createCreditCardRouter(creditCardService: CreditCardService): Router {
  const router = Router();

  router.post("/validate", (req: Request<Record<string, never>, ValidateCardResponse, ValidateCardRequest>, res: Response<ValidateCardResponse>) => {
    const { cardNumber } = req.body;
    if (!cardNumber) {
      return res.status(400).json({
        isValid: false,
        errorMessage: "Card number is required",
      });
    }
    
    try {
      const isValid = creditCardService.validateCard(cardNumber);
      return res.status(200).json({ isValid });
    } catch (error) {
      return res.status(400).json({
        isValid: false,
        errorMessage: (error as Error).message,
      });
    }
  });
  
  return router;
}