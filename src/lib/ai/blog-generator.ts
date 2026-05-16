import { generateObject, generateText } from "ai";
import { z } from "zod";
import { openrouter, DEFAULT_MODEL } from "./openrouter";
import { BLOG_GENERATION_PROMPT } from "./prompts";
import { slugify } from "@/lib/utils/slugify";
import { readingTime } from "@/lib/utils/reading-time";
import type { BlogPost, BlogSection } from "@/types/blog";

const BlogSectionSchema = z.object({
  id: z.string(),
  type: z.enum([
    "heading",
    "paragraph",
    "table",
    "code",
    "mermaid",
    "quote",
    "faq",
    "cta",
    "image",
  ]),
  content: z.string().optional(),
  level: z.number().optional(),
  columns: z.array(z.string()).optional(),
  rows: z.array(z.array(z.string())).optional(),
  language: z.string().optional(),
  filename: z.string().optional(),
  imageUrl: z.string().optional(),
  imageAlt: z.string().optional(),
  prompt: z.string().optional(),
  ctaText: z.string().optional(),
  ctaUrl: z.string().optional(),
  ctaStyle: z.enum(["primary", "secondary", "affiliate"]).optional(),
  question: z.string().optional(),
  answer: z.string().optional(),
});

const BlogGenerationSchema = z.object({
  title: z.string(),
  slug: z.string(),
  excerpt: z.string(),
  metaTitle: z.string(),
  metaDescription: z.string(),
  focusKeyword: z.string(),
  tags: z.array(z.string()),
  heroImagePrompt: z.string(),
  sections: z.array(BlogSectionSchema),
  faq: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    })
  ),
  seoScore: z.number().min(0).max(100),
  readabilityScore: z.number().min(0).max(100),
  affiliateSuggestions: z.array(
    z.object({
      category: z.string(),
      productExample: z.string(),
      placement: z.string(),
    })
  ),
});

export async function generateBlog(
  topic: string,
  category: string,
  keywords: string[] = []
): Promise<Omit<BlogPost, "id" | "status" | "createdAt" | "updatedAt">> {
  const result = await generateObject({
    model: openrouter(DEFAULT_MODEL),
    schema: BlogGenerationSchema,
    prompt: BLOG_GENERATION_PROMPT(topic, category, keywords),
    temperature: 0.7,
  });

  const data = result.object;

  // Ensure each section has a unique ID
  const sections: BlogSection[] = data.sections.map((s, i) => ({
    ...s,
    id: s.id || `section-${i + 1}`,
  }));

  const rt = readingTime(sections);

  return {
    title: data.title,
    slug: data.slug || slugify(data.title),
    excerpt: data.excerpt,
    metaTitle: data.metaTitle,
    metaDescription: data.metaDescription,
    focusKeyword: data.focusKeyword,
    category,
    tags: data.tags,
    heroImage: {
      url: "",
      prompt: data.heroImagePrompt,
      alt: data.title,
    },
    sections,
    faq: data.faq,
    sources: [],
    affiliateLinks: [],
    seoScore: data.seoScore,
    readabilityScore: data.readabilityScore,
    readingTime: rt,
    publishedAt: null,
    viewCount: 0,
    scheduledAt: null,
  };
}

export async function regenerateSection(
  sectionType: string,
  currentContent: string,
  instruction: string
): Promise<string> {
  const { text } = await generateText({
    model: openrouter(DEFAULT_MODEL),
    prompt: `
You are an expert blog editor. Improve this blog section.
Section Type: ${sectionType}
Current Content: """${currentContent}"""
Editor Instruction: "${instruction}"
Return only the improved content, no explanation.
    `,
    temperature: 0.6,
  });
  return text.trim();
}
