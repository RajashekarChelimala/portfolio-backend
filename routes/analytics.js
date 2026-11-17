import express from "express";
import {
  recordVisit,
  getOverviewMetrics,
  getChatLogs,
  deleteChatLog,
  clearChatLogs,
} from "../controllers/analyticsController.js";
import verifyJWT from "../middlewares/verifyJWT.js";

const router = express.Router();

// Public: Record page visit
router.post("/visit", recordVisit);

// Protected: Admin Analytics & Jerry AI Chat History
router.get("/overview", verifyJWT, getOverviewMetrics);
router.get("/chat-logs", verifyJWT, getChatLogs);
router.delete("/chat-logs/:id", verifyJWT, deleteChatLog);
router.delete("/chat-logs", verifyJWT, clearChatLogs);

export default router;
