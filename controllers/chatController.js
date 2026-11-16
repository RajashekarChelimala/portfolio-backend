import axios from "axios";
import dotenv from "dotenv";
import { queryRAG, retrieveRelevantChunks, KNOWLEDGE_CORPUS } from "../utils/ragEngine.js";
import Content from "../models/Content.js";
import Project from "../models/Project.js";
import Skill from "../models/Skill.js";

dotenv.config();

/**
 * Augment the static knowledge corpus with live database records
 * so any updates made via admin panel are immediately reflected in RAG.
 */
async function getDynamicCorpus() {
  const corpus = [...KNOWLEDGE_CORPUS];
  try {
    const liveContent = await Content.findOne().lean();
    if (liveContent) {
      if (liveContent.name) {
        corpus.push({
          id: "db_name",
          topics: ["name", "surname", "full name", "chelimala", "rajashekar"],
          keywords: ["name", "surname", "full", "who"],
          answer: `Full Name: **${liveContent.name}** (Surname: **Chelimala**).`
        });
      }
      if (liveContent.location) {
        corpus.push({
          id: "db_location",
          topics: ["location", "city", "where", "address"],
          keywords: ["location", "city", "live", "where"],
          answer: `Rajashekar is currently located in **${liveContent.location}**.`
        });
      }
      if (liveContent.degree || liveContent.education) {
        corpus.push({
          id: "db_education",
          topics: ["education", "degree", "college", "university", "cgpa"],
          keywords: ["education", "degree", "college", "university", "cgpa"],
          answer: `Education: **${liveContent.degree || "B.Tech in CSE"}** from **${liveContent.education || "RGUKT, Basar"}**.`
        });
      }
    }

    const liveProjects = await Project.find().lean();
    if (Array.isArray(liveProjects) && liveProjects.length > 0) {
      for (const p of liveProjects) {
        corpus.push({
          id: `db_project_${p._id}`,
          topics: [p.projectName.toLowerCase(), "project", "work"],
          keywords: p.projectName.toLowerCase().split(/\s+/),
          answer: `**${p.projectName}** (${p.organizationName || "Featured"}):\n${p.description}${p.projectLink ? `\n• Live Link: ${p.projectLink}` : ""}${p.githubLink ? `\n• GitHub: ${p.githubLink}` : ""}`
        });
      }
    }
  } catch (dbErr) {
    // If DB is offline or empty, static corpus is completely self-contained
  }
  return corpus;
}

export const handleChat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Message is required." });
    }

    const trimmedMessage = message.trim().slice(0, 500);
    const corpus = await getDynamicCorpus();
    const topMatches = retrieveRelevantChunks(trimmedMessage, corpus, 3);
    const contextText = topMatches.map((m) => `• ${m.chunk.answer}`).join("\n\n");

    const geminiKey = process.env.GEMINI_API_KEY;

    // If Gemini API key is configured, perform full LLM generation augmented with retrieved context
    if (geminiKey) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`;
        const ragPrompt = `You are the AI Assistant for Rajashekar Chelimala's portfolio website. Answer the user question concisely, accurately, and politely based ONLY on the verified facts provided below. If you don't know, suggest checking his resume or contacting him.

Verified Facts from Rajashekar's Database & Resume:
${contextText}

User Question: ${trimmedMessage}`;

        const geminiResponse = await axios.post(
          geminiUrl,
          {
            contents: [{ role: "user", parts: [{ text: ragPrompt }] }],
            generationConfig: {
              temperature: 0.3, // Low temperature for high factual accuracy
              maxOutputTokens: 300,
            },
          },
          { headers: { "Content-Type": "application/json" }, timeout: 8000 }
        );

        const aiText = geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (aiText) {
          return res.status(200).json({ reply: aiText });
        }
      } catch (geminiError) {
        console.warn("Gemini API call failed, falling back to local RAG engine:", geminiError.message);
      }
    }

    // Direct RAG retrieval response (instant, highly accurate, zero API key required)
    const ragAnswer = queryRAG(trimmedMessage, corpus);
    return res.status(200).json({ reply: ragAnswer });
  } catch (err) {
    console.error("Chat controller error:", err);
    return res.status(500).json({
      reply: "I'm having trouble processing your question right now. Feel free to reach Rajashekar directly through the Contact page!",
    });
  }
};
