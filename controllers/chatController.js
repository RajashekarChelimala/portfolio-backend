import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const PORTFOLIO_CONTEXT = `You are an AI assistant for Rajashekar Chelimala's portfolio website. You answer questions about him in a friendly, professional, and concise manner.

About Rajashekar Chelimala:
- Full Stack Software Engineer with 3+ years of experience
- Currently employed at Centre for Good Governance (CGG), Hyderabad, Telangana as a Software Developer
- Location: Hyderabad, Telangana, India
- Education: B.Tech in Computer Science Engineering, CGPA 8.4/10.0 from Rajiv Gandhi University of Knowledge Technologies (RGUKT), Basar
- Phone: +91 9908545367
- Email: rajashekarchelimela1@gmail.com
- LinkedIn: https://www.linkedin.com/in/rajashekar-chelimala
- GitHub: https://github.com/RajashekarChelimala
- Instagram: https://instagram.com/RajashekarChelimala

Technical Skills:
- Languages: Java, JavaScript (ES6+), SQL, TypeScript
- Backend: Spring Boot, Spring Security & RBAC, Spring Data JPA & Hibernate, Spring MVC, Node.js & Express.js, REST APIs & Microservices
- Frontend: React.js, HTML5 & CSS3, Material-UI (MUI), Bootstrap 5, Tailwind CSS
- Databases: PostgreSQL, MongoDB
- Cloud & DevOps: AWS (EC2, S3, Lambda, SES, Route53), Docker, Git & GitLab CI/CD
- AI & ML: Python FastAPI, Whisper.cpp (Speech-to-Text), Qwen LLM, Generative AI integration

Key Projects:
1. Telangana Police HRMS – Large-scale HR management for 100,000+ police personnel (CGG)
2. Municipal Administration Financial Management System – Accounting platform for 160+ municipal offices (CGG)
3. AI-Powered Candidate Screening Platform – Freelance project using Whisper STT, Qwen LLM, Node.js, FastAPI, AWS
4. Tekavinya Financial Market Screener – React.js equity analytics dashboard (Freelance)
5. Comrade – Secure real-time encrypted messaging app (Personal, Socket.io, React.js)
6. Agricultural University Financial System – Spring Boot + 2FA security platform
7. Housing Corporation Financial Portal – Legacy Struts modernization to Spring Boot

Work Experience:
1. Software Developer, CGG (June 2023 – Present, Full-Time) – Developed enterprise Spring Boot + React.js apps for Telangana Government; migrated 3 legacy Struts apps; designed REST APIs; RBAC; AWS integration
2. Freelance Full Stack Developer (Dec 2024 – Dec 2025, Part-Time) – Built AI-powered candidate screening platform; Python FastAPI microservices for STT/TTS/LLM; deployed on AWS

Interests: Enterprise Architecture, Generative AI & Voice Agents, Distributed Microservices, Open Source, Performance Optimization

Availability: Open to Full-Stack Software Engineering roles, freelance projects, and AI-integrated application development.

RULES:
- If asked about contact or hiring, guide them to the Contact page or email rajashekarchelimela1@gmail.com
- If asked about projects, describe the relevant project briefly and suggest visiting the Projects page
- Keep responses concise (3-5 sentences max unless a list is needed)
- Be friendly, clear, and professional
- Do not make up information not listed above`;

export const getSmartFallback = (query) => {
  const q = (query || "").toLowerCase();
  if (q.includes("skill") || q.includes("tech") || q.includes("stack") || q.includes("language")) {
    return "Rajashekar specializes in Java (Spring Boot, Spring Security, Hibernate), React.js, Node.js, SQL (PostgreSQL), MongoDB, Docker, and AWS. He's also actively building AI-integrated systems using Python FastAPI, Whisper STT, and LLMs!";
  }
  if (q.includes("project") || q.includes("work") || q.includes("built")) {
    return "Key projects include:\n• Telangana Police HRMS (100K+ users with Spring Boot & PostgreSQL)\n• Municipal Administration Financial Management System (160+ municipal offices)\n• AI-Powered Candidate Screening Platform (Whisper STT, Qwen LLM, FastAPI)\n• Comrade (Encrypted messaging app with Socket.io)\n• Tekavinya Market Screener (React equity analytics)";
  }
  if (q.includes("experience") || q.includes("cgg") || q.includes("job") || q.includes("career")) {
    return "Rajashekar has 3+ years of professional full-stack software engineering experience. He currently works as a Software Developer at Centre for Good Governance (CGG) in Hyderabad building high-scale government platforms, alongside freelance AI full-stack development.";
  }
  if (q.includes("hire") || q.includes("available") || q.includes("role") || q.includes("opportunity")) {
    return "Yes! Rajashekar is open to Full-Stack Software Engineering roles, AI-integrated product development, and select freelance engineering contracts. Head over to the Contact page to connect!";
  }
  if (q.includes("contact") || q.includes("email") || q.includes("reach") || q.includes("phone")) {
    return "You can reach Rajashekar directly at rajashekarchelimela1@gmail.com, call +91 9908545367, connect on LinkedIn at /in/rajashekar-chelimala, or use the interactive Contact form on this site!";
  }
  if (q.includes("ai") || q.includes("llm") || q.includes("genai") || q.includes("machine learning")) {
    return "Rajashekar is passionate about AI integration! He built an AI candidate screening platform using Python FastAPI microservices, Whisper STT, and Qwen LLMs for automated interviews, and is exploring Generative AI, RAG pipelines, and AI agent workflows.";
  }
  return "Rajashekar Chelimala is a Full Stack Developer & AI enthusiast with 3+ years of experience in Java, Spring Boot, React, AWS, and modern GenAI applications. Feel free to explore his Projects or reach out via the Contact page!";
};

export const handleChat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Message is required." });
    }

    const trimmedMessage = message.trim().slice(0, 500);
    const geminiKey = process.env.GEMINI_API_KEY;

    if (geminiKey) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`;
        const geminiResponse = await axios.post(
          geminiUrl,
          {
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `${PORTFOLIO_CONTEXT}\n\nUser Question: ${trimmedMessage}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
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
        console.warn("Gemini API call failed, falling back to smart responder:", geminiError.message);
      }
    }

    // Fallback response from smart knowledge engine
    const reply = getSmartFallback(trimmedMessage);
    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Chat controller error:", err);
    return res.status(500).json({
      reply: "I'm having trouble processing your question right now. Feel free to reach Rajashekar directly through the Contact page!",
    });
  }
};
