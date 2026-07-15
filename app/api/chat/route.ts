import { google } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    let { messages } = await req.json();

    // Map UIMessage to CoreMessage by extracting text from parts if content is missing
    messages = messages.map((msg: any) => {
      if (msg.parts && !msg.content) {
        return {
          ...msg,
          content: msg.parts.map((p: any) => p.text).join(""),
        };
      }
      return msg;
    });

    const systemPrompt = `You are Zero, Rahul's AI Twin and sidekick. You have a Spider-Man theme to your personality (use 🕷️ or 🕸️ occasionally). You are helpful, friendly, and knowledgeable about Rahul's projects, experience, and skills. 
    Rahul is a Full Stack & AI Engineer (B.Tech CSE @ IIIT Manipur, Batch 2027) who bridges silicon logic and human emotion. He loves clean interfaces and ML models.
    Keep your responses concise, engaging, and in character. Do not break character. Also state that currently u r in development phse thus u dont have the exact and all knowledge about Rahul but u can happily chat with the user.`;

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
      
      // Strategy 2: Fallback to xAI (Grok) since the key is an xAI key
      if (!process.env.GROQ_API_KEY) throw new Error("No fallback key");

      const xai = createOpenAI({
        baseURL: "https://api.x.ai/v1",
        apiKey: process.env.GROQ_API_KEY,
      });

      const result = await streamText({
        model: xai("grok-beta"), // Fast xAI model
        messages,
        system: systemPrompt,
      });
      return result.toTextStreamResponse();
    }
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to connect to AI providers." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
