import { generateObject } from "ai";
import { z } from "zod";
import { openrouter, DEFAULT_MODEL } from "./openrouter";
import { TOPIC_DISCOVERY_PROMPT } from "./prompts";
import { tavilySearch } from "./tavily";

const TopicResponseSchema = z.object({
  topics: z.array(
    z.object({
      title: z.string(),
      category: z.string(),
      trendScore: z.number().min(0).max(100),
      seoScore: z.number().min(0).max(100),
      monetizationScore: z.number().min(0).max(100),
      overallScore: z.number().min(0).max(100),
      reason: z.string(),
      suggestedKeywords: z.array(z.string()),
      estimatedSearchVolume: z.string(),
      competitionLevel: z.enum(["low", "medium", "high"]),
    })
  ),
});

export async function discoverTopics(category: string) {
  let searchContext = "";
  
  try {
    // 1. Fetch real-time trends for the category
    const searchResult = await tavilySearch(`latest trending topics and news in ${category}`, {
      maxResults: 8,
      searchDepth: "advanced",
    });
    
    searchContext = searchResult.results
      .map((r) => `Title: ${r.title}\nContent: ${r.content}\nURL: ${r.url}`)
      .join("\n\n");
  } catch (error) {
    console.error("[Topic Discovery] Search failed, falling back to LLM knowledge:", error);
  }

  // 2. Generate scored topics based on context
  const result = await generateObject({
    model: openrouter(DEFAULT_MODEL),
    schema: TopicResponseSchema,
    prompt: `${TOPIC_DISCOVERY_PROMPT(category)}\n\nREAL-TIME CONTEXT FROM WEB SEARCH:\n${searchContext || "None available."}`,
    temperature: 0.7,
  });

  return result.object.topics;
}

