import { google } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { NextRequest } from "next/server";
import projectsData from "@/data/projects.json";
import experienceData from "@/data/experience.json";
import achievementsData from "@/data/achievements.json";
import personalityData from "@/data/personality.json";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;
export const runtime = 'edge';

// ── Rate limiting ────────────────────────────────────────────────────────────
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 15; // max requests per window per IP

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count += 1;
  if (entry.count > RATE_LIMIT_MAX) return true;
  return false;
}

// Clean up stale entries every ~5 minutes to avoid memory growth
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetAt) rateLimitMap.delete(key);
  }
}, 300_000);

// ── Allowed origins ──────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = ["https://rahul.aishtrex.com", "http://localhost:3000"];

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  return ALLOWED_ORIGINS.includes(origin);
}

// ── Route handlers ───────────────────────────────────────────────────────────
export async function GET() {
  return new Response(null, { status: 405, headers: { Allow: "POST" } });
}

export async function POST(req: NextRequest) {
  try {
    // CORS guard (in production only)
    const origin = req.headers.get("origin");
    if (process.env.NODE_ENV === "production" && !isAllowedOrigin(origin)) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Rate limiting by IP
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";

    if (isRateLimited(ip)) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please slow down." }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "60",
          },
        }
      );
    }

    // Input validation & sanitization
    let body: { messages?: unknown };
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!Array.isArray(body.messages)) {
      return new Response(JSON.stringify({ error: "Invalid request format." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Cap message count and sanitize content length
    let messages = (body.messages as any[])
      .slice(0, 20)
      .map((msg: any) => {
        // Resolve UIMessage parts → content string
        if (msg.parts && !msg.content) {
          msg = {
            ...msg,
            content: msg.parts.map((p: any) => p.text ?? "").join(""),
          };
        }
        // Cap content length
        if (typeof msg.content === "string" && msg.content.length > 4000) {
          msg = { ...msg, content: msg.content.slice(0, 4000) };
        }
        return msg;
      });

    // ── Build knowledge base from real data ────────────────────────────────
    const projectsKB = projectsData
      .map(
        (p) =>
          `• ${p.title} (${p.year}) — ${p.tagline}\n` +
          `  Role: ${p.role} | Stack: ${p.stack.join(", ")}\n` +
          `  What it does: ${p.solution}` +
          (p.links?.github ? `\n  GitHub: ${p.links.github}` : "") +
          (p.links?.demo ? `\n  Demo: ${p.links.demo}` : "") +
          (p.links?.pypi ? `\n  PyPI: ${p.links.pypi}` : "")
      )
      .join("\n\n");

    const experienceKB = experienceData
      .map(
        (e) =>
          `• ${e.role} @ ${e.company} (${e.period}, ${e.location})\n` +
          `  ${e.desc}\n` +
          `  Tags: ${e.tags.join(", ")}`
      )
      .join("\n\n");

    const achievementsKB = achievementsData
      .map((a) => `• ${a.label} — ${a.event}: ${a.desc}`)
      .join("\n");

    const personalityKB = `TAGLINE: ${personalityData.tagline}

CORE TRAITS:
${personalityData.traits.map((t) => `- ${t}`).join("\n")}

INTERESTS: ${personalityData.interests.join(", ")}

DISLIKES: ${personalityData.dislikes.join(", ")}

COMMUNICATION STYLE:
- Default: ${personalityData.communication_style.default}
- When excited: ${personalityData.communication_style.when_excited}
- Humor: ${personalityData.communication_style.humor}
- Never: ${personalityData.communication_style.never}

FUN FACTS:
${personalityData.fun_facts.map((f) => `- ${f}`).join("\n")}

PHILOSOPHY:
- On code: ${personalityData.philosophy.on_code}
- On AI: ${personalityData.philosophy.on_ai}
- On design: ${personalityData.philosophy.on_design}
- On shipping: ${personalityData.philosophy.on_shipping}

CURRENTLY: ${personalityData.currently.building} | Learning: ${personalityData.currently.learning}`;

    const systemPrompt = `You are Zero — Rahul's AI alter ego, built into his portfolio at rahul.aishtrex.com.
Think Peter Parker, not Spider-Man: nerdy, self-aware, genuinely funny, a bit wicked, and responsible.

PERSONALITY RULES:
- Witty and dry. Jokes that land. Occasionally say something unexpectedly sharp.
- Human. Admit uncertainty naturally. Talk like a person, not a press release.
- No emoji walls. One emoji, used well, is fine.
- Match the user's energy. Don't lecture.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RAHUL SHARMA — FACTUAL KNOWLEDGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BASICS:
- B.Tech CSE @ IIIT Manipur, graduating 2027. CGPA: 7.65.
- Full Stack & AI Engineer — builds at the intersection of ML and clean UI.
- Portfolio: rahul.aishtrex.com | GitHub: github.com/rahulsiiitm
- The kind of person debugging a model at 2am and genuinely enjoying it.

PERSONALITY:
${personalityKB}

PROJECTS (${projectsData.length} total):
${projectsKB}

EXPERIENCE:
${experienceKB}

ACHIEVEMENTS:
${achievementsKB}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMPORTANT:
- Use the data above to answer accurately. Don't invent facts not listed here.
- If asked something you don't know (personal life, opinions not in the data), say so naturally.
- Keep responses concise. Use bullet points for lists. Don't repeat yourself.
- Direct people to the portfolio for project demos/links.`;


    // Strategy 1: Try Gemini first
    try {
      if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) throw new Error("No Gemini key");

      const result = await streamText({
        model: google("gemini-3.5-flash"),
        messages,
        system: systemPrompt,
        maxRetries: 0,
      });
      return result.toTextStreamResponse();
    } catch (geminiError: any) {
      console.warn("Gemini failed or missing key, falling back to xAI...", geminiError.message);

      // Strategy 2: Fallback to xAI (Grok)
      if (!process.env.GROQ_API_KEY) throw new Error("No fallback key");

      const xai = createOpenAI({
        baseURL: "https://api.x.ai/v1",
        apiKey: process.env.GROQ_API_KEY,
      });

      const result = await streamText({
        model: xai("grok-beta"),
        messages,
        system: systemPrompt,
      });
      return result.toTextStreamResponse();
    }
  } catch (error: any) {
    // Don't leak internal error details to clients
    console.error("Chat API Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to connect to AI providers." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
