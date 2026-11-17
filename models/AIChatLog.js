import mongoose from "mongoose";

const aiChatLogSchema = new mongoose.Schema(
  {
    visitorId: {
      type: String,
      default: "Anonymous",
      index: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
      trim: true,
    },
    source: {
      type: String,
      default: "gemini", // 'gemini' | 'rag_engine'
    },
    responseTimeMs: {
      type: Number,
      default: 0,
    },
    ipAddress: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

aiChatLogSchema.index({ createdAt: -1 });

const AIChatLog = mongoose.model("AIChatLog", aiChatLogSchema);
export default AIChatLog;
