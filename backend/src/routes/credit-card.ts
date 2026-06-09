import { Request, Response, Router } from "express";
import { CreditCardService } from "../services/credit-card.js";

export function createCreditCardRouter(creditCardService: CreditCardService): Router {
  const router = Router();

  router.get("/validate", (req: Request, res: Response): void => {
    res.json({ message: creditCardService.validateCard() });
  });

  return router;
}