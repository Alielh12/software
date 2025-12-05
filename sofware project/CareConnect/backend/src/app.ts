import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import env from "./config/env";
import apiRouter from "./routes";

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_ORIGIN ?? "*" }));
app.use(express.json());
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api", apiRouter);

export default app;
