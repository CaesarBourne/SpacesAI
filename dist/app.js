import express from "express";
import dotenv from "dotenv";
import chatRoute from "./routes/chatRoute.js";
import cors from "cors";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.get("/api/v1/health", (_, res) => {
    res.status(200).json({ status: "ok", message: "Agentic API running" });
});
app.use("/api/v1", chatRoute);
export default app;
