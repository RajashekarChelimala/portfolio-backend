import Visit from "../models/Visit.js";
import AIChatLog from "../models/AIChatLog.js";
import Project from "../models/Project.js";
import Post from "../models/Post.js";
import Skill from "../models/Skill.js";
import Contact from "../models/Contact.js";
import mongoose from "mongoose";

/**
 * Record a page visit.
 * Debounced: If the same visitor visited the same path within the last 10 minutes,
 * we avoid duplicate entries so page refreshes don't spam the database.
 */
export const recordVisit = async (req, res) => {
  try {
    const { visitorId, path: visitPath = "/", referrer = "Direct", device = "Desktop" } = req.body;

    if (!visitorId || typeof visitorId !== "string") {
      return res.status(400).json({ error: "visitorId is required." });
    }

    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const existingRecent = await Visit.findOne({
      visitorId,
      path: visitPath,
      createdAt: { $gte: tenMinutesAgo },
    }).lean();

    if (existingRecent) {
      return res.status(200).json({ status: "debounced", message: "Visit recently logged" });
    }

    const ipAddress = req.headers["x-forwarded-for"] || req.socket?.remoteAddress || req.ip;
    const userAgent = req.headers["user-agent"] || "";

    const newVisit = await Visit.create({
      visitorId,
      path: visitPath,
      referrer: referrer || "Direct",
      device: device || "Desktop",
      ipAddress,
      userAgent,
    });

    if (req.io) {
      req.io.emit("newVisit", {
        path: visitPath,
        device,
        createdAt: newVisit.createdAt,
      });
    }

    res.status(201).json({ status: "success", visitId: newVisit._id });
  } catch (error) {
    console.error("Record visit error:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get comprehensive analytics overview for the admin dashboard.
 */
export const getOverviewMetrics = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [
      totalVisits,
      uniqueVisitorsList,
      todayVisits,
      todayUniqueList,
      totalQuestions,
      todayQuestions,
      recentChatLogs,
      topPages,
      deviceBreakdown,
      recentVisits,
      projectsCount,
      postsCount,
      skillsCount,
      contactsCount,
      postsData,
    ] = await Promise.all([
      Visit.countDocuments(),
      Visit.distinct("visitorId"),
      Visit.countDocuments({ createdAt: { $gte: startOfDay } }),
      Visit.distinct("visitorId", { createdAt: { $gte: startOfDay } }),
      AIChatLog.countDocuments(),
      AIChatLog.countDocuments({ createdAt: { $gte: startOfDay } }),
      AIChatLog.find().sort({ createdAt: -1 }).limit(50).lean(),
      Visit.aggregate([
        { $group: { _id: "$path", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 6 },
      ]),
      Visit.aggregate([
        { $group: { _id: "$device", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Visit.find().sort({ createdAt: -1 }).limit(10).lean(),
      Project.countDocuments(),
      Post.countDocuments(),
      Skill.countDocuments(),
      Contact.countDocuments(),
      Post.find({}, "likes engagementCount").lean(),
    ]);

    const totalLikes = postsData.reduce((acc, p) => acc + (p.likes || 0), 0);
    const totalEngagements = postsData.reduce((acc, p) => acc + (p.engagementCount || 0), 0);

    res.json({
      visitors: {
        totalVisits,
        uniqueVisitors: uniqueVisitorsList.length,
        todayVisits,
        todayUniqueVisitors: todayUniqueList.length,
        recentVisits,
        topPages,
        deviceBreakdown,
      },
      chatLogs: {
        totalQuestions,
        todayQuestions,
        recent: recentChatLogs,
      },
      cms: {
        projects: projectsCount,
        posts: postsCount,
        skills: skillsCount,
        contacts: contactsCount,
        likes: totalLikes,
        engagements: totalEngagements,
      },
    });
  } catch (error) {
    console.error("Get overview metrics error:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get paginated & searchable chat history logs.
 */
export const getChatLogs = async (req, res) => {
  try {
    const { q, page = 1, limit = 30 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const filter = {};

    if (q && q.trim()) {
      const regex = new RegExp(q.trim(), "i");
      filter.$or = [{ question: regex }, { answer: regex }];
    }

    const [logs, total] = await Promise.all([
      AIChatLog.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      AIChatLog.countDocuments(filter),
    ]);

    res.json({
      logs,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Delete a specific chat log.
 */
export const deleteChatLog = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid log ID format." });
    }

    const deleted = await AIChatLog.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Chat log not found." });
    }

    res.json({ message: "Chat log deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Clear all chat logs.
 */
export const clearChatLogs = async (req, res) => {
  try {
    await AIChatLog.deleteMany({});
    res.json({ message: "All chat logs cleared successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
