import "dotenv/config";
import { createApp } from "./app.js";
import express from "express";

const port: number = Number(process.env.PORT) || 3000;

const app: express.Application = createApp();

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
