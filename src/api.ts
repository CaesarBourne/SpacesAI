import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

app.get("/api/v1/health", (_, res) => {
  res.status(200).json({ status: "ok", message: "Agentic API running" });
});


export default app;
