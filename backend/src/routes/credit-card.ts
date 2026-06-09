import { Request, Response, Router } from "express";
import { CreditCardService } from "../services/credit-card.js";

export function createCreditCardRouter(creditCardService: CreditCardService): Router {
  const router = Router();

  router.post("/validate", (req: Request, res: Response): void => {
    const { cardNumber } = req.body;
    console.log("Received card number for validation:", cardNumber);
    res.json({ message: creditCardService.validateCard(cardNumber) });
  });
  
  return router;
}