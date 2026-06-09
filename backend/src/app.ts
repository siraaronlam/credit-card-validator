import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { createCreditCardRouter } from "./routes/credit-card";
import { CreditCardService } from "./services/credit-card";

export function createApp(): express.Application {
  const app: express.Application = express();
  app.use(helmet());
  app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }));
  app.use(express.json());

  const api: express.Router = express.Router();

  api.use("/credit-card", createCreditCardRouter(new CreditCardService()));

  // mount the api routes
  app.use("/v1", api);

  // handle missing routes
  app.use((req: Request, res: Response): void => {
    res.status(404).json({ error: "Route not found" });
  });

  return app;
}