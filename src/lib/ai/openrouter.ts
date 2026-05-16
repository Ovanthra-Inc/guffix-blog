import { createOpenAI } from "@ai-sdk/openai";

if (!process.env.OPENROUTER_API_KEY) {
  console.warn("[OpenRouter] OPENROUTER_API_KEY is not set. AI features will not work.");
}

export const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY ?? "sk-or-placeholder",
  headers: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    "X-Title": process.env.NEXT_PUBLIC_SITE_NAME ?? "GuffixAI",
  },
});

// Default model — override in settings if needed
export const DEFAULT_MODEL = "openai/gpt-4o-mini";
export const FAST_MODEL = "openai/gpt-4o-mini";
export const PREMIUM_MODEL = "anthropic/claude-3.5-sonnet";
