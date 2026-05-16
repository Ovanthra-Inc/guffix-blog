import { z } from "zod";

export const TopicSchema = z.object({
  title: z.string().min(5),
  category: z.string().min(1),
  trendScore: z.number().min(0).max(100),
  seoScore: z.number().min(0).max(100),
  monetizationScore: z.number().min(0).max(100),
  overallScore: z.number().min(0).max(100),
  reason: z.string().min(10),
  suggestedKeywords: z.array(z.string()),
  estimatedSearchVolume: z.string(),
  competitionLevel: z.enum(["low", "medium", "high"]),
});

export const DiscoverTopicsResponseSchema = z.object({
  topics: z.array(TopicSchema),
  category: z.string(),
  discoveredAt: z.string(),
});

export type TopicInput = z.infer<typeof TopicSchema>;
export type DiscoverTopicsResponse = z.infer<typeof DiscoverTopicsResponseSchema>;
