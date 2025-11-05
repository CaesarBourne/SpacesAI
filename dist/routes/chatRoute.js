import express from "express";
import { validateChatInput } from "../middleware/validateChatInput.js";
import { sseHeaders } from "../middleware/sseHeaders.js";
import { handleChat } from "../controller/chatController.js";
const router = express.Router();
router.post("/chat", validateChatInput, sseHeaders, handleChat);
export default router;
