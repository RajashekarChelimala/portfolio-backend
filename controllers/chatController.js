import axios from "axios";
import dotenv from "dotenv";
import { queryRAG, retrieveRelevantChunks, KNOWLEDGE_CORPUS } from "../utils/ragEngine.js";
import Content from "../models/Content.js";
import Project from "../models/Project.js";
import Skill from "../models/Skill.js";
import AIChatLog from "../models/AIChatLog.js";

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
          topics: ["surname", "last name", "family name", "what is his surname", "full name", "what is his full name"],
          keywords: ["surname", "fullname", "name"],
          answer: `Full Name: **${liveContent.name}** (Surname: **Chelimala**).`
        });
      }
      if (liveContent.location) {
        corpus.push({
          id: "db_location",
          topics: ["location", "city", "where does he live", "where is he located", "address"],
          keywords: ["location", "city", "live", "where", "based"],
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
      if (liveContent.hobbies) {
        corpus.push({
          id: "db_hobbies",
          topics: ["hobbies", "hobby", "interests", "free time", "what does he do in free time", "passions"],
          keywords: ["hobbies", "hobby", "interests", "free", "time", "passions"],
          answer: `Rajashekar's hobbies and interests include: **${liveContent.hobbies}**.`
        });
      }
    }

    const liveProjects = await Project.find().lean();
    if (Array.isArray(liveProjects) && liveProjects.length > 0) {
      for (const p of liveProjects) {
        corpus.push({
          id: `db_project_${p._id}`,
          topics: [p.projectName.toLowerCase(), "project", "work", "portfolio project"],
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
  const startTime = Date.now();
  const visitorId = req.body?.visitorId || "Anonymous";
  const ipAddress = req.headers["x-forwarded-for"] || req.socket?.remoteAddress || req.ip;

  try {
    const { message } = req.body;
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Message is required." });
    }

    const trimmedMessage = message.trim().slice(0, 500);
    const corpus = await getDynamicCorpus();
    const topMatches = retrieveRelevantChunks(trimmedMessage, corpus, 3);
    const contextText = topMatches.map((m) => `[Source: ${m.chunk.id}]\n${m.chunk.answer}`).join("\n\n");

    const geminiKey = process.env.GEMINI_API_KEY;

    // If Gemini API key is configured, perform full LLM generation augmented with retrieved context
    if (geminiKey) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${geminiKey}`;
        const ragPrompt = `You are Jerry, the personal AI Assistant for Rajashekar Chelimala's official portfolio website.
Your objective is to answer the user's question directly, accurately, politely, and with structured clarity based ONLY on the verified facts provided below.

CRITICAL RULES & GUARDRAILS:
1. BOT NAME & IDENTITY: If asked who you are, what your name is, or who created you, introduce yourself as Jerry, Rajashekar Chelimala's personal AI Assistant.
2. STRICT GROUNDING: Rely strictly on the verified facts below. Do NOT hallucinate or assume facts not stated.
3. MISSING PERSONAL/FAMILY DETAILS: If the user asks about personal or family details not in the facts (such as father's name, mother's name, parents, wife, marital status, or exact date of birth), state honestly that this personal detail is not publicly available on his professional portfolio, and suggest contacting him directly at rajashekarchelimala1@gmail.com. Do NOT guess or default to his surname.
4. GENDER & PRONOUNS: If asked about gender, Rajashekar is Male (pronouns: he/him).
5. WEAKNESSES: If asked about weaknesses or areas of improvement, state that Rajashekar approaches engineering with high attention to detail; his identified areas of focus include a tendency towards edge-case perfectionism and taking on multiple complex problems, which he actively manages with strict iterative milestones and agile sprint boundaries.
6. CHARACTER & PERSONALITY: If asked if he is a "good guy", his work ethic, or attitude, highlight that he is regarded as a dedicated, humble, disciplined, and collaborative engineer with strong ownership and integrity demonstrated across mission-critical GovTech systems at the Centre for Good Governance (CGG).
7. STRENGTHS & WHAT HE EXCELLS AT: If asked what he is strong at or his core strengths, list: Java & Spring Boot microservices, React.js frontend architecture, PostgreSQL database tuning, AWS cloud infrastructure, and AI/GenAI integration.
8. AI PROJECTS: If asked about AI projects, list his specific AI systems:
   • AI-Powered Candidate Screening Platform (FastAPI, Whisper.cpp STT, Qwen LLM, AWS EC2, live at https://screener.tekavinya.com)
   • Portfolio RAG AI Assistant (Node.js, Express, Google Gemini, Vector/BM25 Knowledge Engine)
   • Comrade Encrypted Messaging Platform (Socket.io, React, Node.js, end-to-end encryption)
9. TOP SKILLS: If asked for his top 5 skills, provide a crisp numbered list: Java & Spring Boot, React.js Frontend, PostgreSQL, AWS Cloud & DevOps, and AI/GenAI Integration.
10. AWS PROJECTS: If asked which projects used AWS, explicitly mention Telangana Police HRMS (EC2, S3, SES) and the AI Candidate Screening Platform (EC2).
11. CDMA: CDMA refers to the Commissioner & Director of Municipal Administration / Municipal Administration Financial Management System (160+ municipal offices across Telangana using Spring Boot, Hibernate, and PostgreSQL).
12. FORMATTING & COMPLETENESS: Use clean markdown bullet points (•) and bold text (**) for readability. Always complete full thoughts and sentences; never cut off mid-sentence.

=== VERIFIED FACTS RETRIEVED FROM RESUME & DATABASE ===
${contextText}
======================================================

User Question: ${trimmedMessage}`;

        const geminiResponse = await axios.post(
          geminiUrl,
          {
            contents: [{ role: "user", parts: [{ text: ragPrompt }] }],
            generationConfig: {
              temperature: 0.2, // Low temperature for high factual accuracy
              maxOutputTokens: 2048,
            },
          },
          { headers: { "Content-Type": "application/json" }, timeout: 9000 }
        );

        const aiText = geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (aiText) {
          const duration = Date.now() - startTime;
          AIChatLog.create({
            visitorId,
            question: trimmedMessage,
            answer: aiText,
            source: "gemini",
            responseTimeMs: duration,
            ipAddress,
          }).catch((logErr) => console.warn("AIChatLog save failed:", logErr.message));

          if (req.io) {
            req.io.emit("newAIChatLog", {
              question: trimmedMessage,
              answer: aiText,
              source: "gemini",
              createdAt: new Date().toISOString(),
            });
          }

          return res.status(200).json({ reply: aiText });
        }
      } catch (geminiError) {
        console.warn("Gemini API call failed, falling back to local RAG engine:", geminiError.message);
      }
    }

    // Direct RAG retrieval fallback response (instant, highly accurate, zero API key required)
    const ragAnswer = queryRAG(trimmedMessage, corpus);
    const duration = Date.now() - startTime;
    AIChatLog.create({
      visitorId,
      question: trimmedMessage,
      answer: ragAnswer,
      source: "rag_engine",
      responseTimeMs: duration,
      ipAddress,
    }).catch((logErr) => console.warn("AIChatLog fallback save failed:", logErr.message));

    if (req.io) {
      req.io.emit("newAIChatLog", {
        question: trimmedMessage,
        answer: ragAnswer,
        source: "rag_engine",
        createdAt: new Date().toISOString(),
      });
    }

    return res.status(200).json({ reply: ragAnswer });
  } catch (err) {
    console.error("Chat controller error:", err);
    return res.status(500).json({
      reply: "I'm having trouble processing your question right now. Feel free to reach Rajashekar directly at rajashekarchelimala1@gmail.com!",
    });
  }
};
