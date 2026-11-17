import mongoose from "mongoose";

const visitSchema = new mongoose.Schema(
  {
    visitorId: {
      type: String,
      required: true,
      index: true,
    },
    path: {
      type: String,
      default: "/",
      index: true,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    device: {
      type: String,
      default: "Desktop",
    },
    referrer: {
      type: String,
      default: "Direct",
    },
  },
  {
    timestamps: true,
  }
);

visitSchema.index({ createdAt: -1 });
visitSchema.index({ visitorId: 1, createdAt: -1 });

const Visit = mongoose.model("Visit", visitSchema);
export default Visit;
