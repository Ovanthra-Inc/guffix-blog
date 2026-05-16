import { generateObject } from "ai";
import { z } from "zod";
import { openrouter, DEFAULT_MODEL } from "./openrouter";
import { SEO_IMPROVEMENT_PROMPT } from "./prompts";

const SEOResultSchema = z.object({
  metaTitle: z.string(),
  metaDescription: z.string(),
  focusKeyword: z.string(),
  suggestedTags: z.array(z.string()),
  seoScore: z.number().min(0).max(100),
  improvements: z.array(z.string()),
});

export async function improveSEO(
  title: string,
  excerpt: string,
  currentKeyword: string
) {
  const result = await generateObject({
    model: openrouter(DEFAULT_MODEL),
    schema: SEOResultSchema,
    prompt: SEO_IMPROVEMENT_PROMPT(title, excerpt, currentKeyword),
    temperature: 0.5,
  });

  return result.object;
}
