import { z } from "zod";

export const BlogSectionSchema = z.object({
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
  level: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).optional(),
  columns: z.array(z.string()).optional(),
  rows: z.array(z.array(z.string())).optional(),
  language: z.string().optional(),
  filename: z.string().optional(),
  imageUrl: z.string().optional(),
  imageAlt: z.string().optional(),
  ctaText: z.string().optional(),
  ctaUrl: z.string().optional(),
  ctaStyle: z.enum(["primary", "secondary", "affiliate"]).optional(),
  question: z.string().optional(),
  answer: z.string().optional(),
});

export const FAQSchema = z.object({
  question: z.string().min(5),
  answer: z.string().min(10),
});

export const HeroImageSchema = z.object({
  url: z.string(),
  prompt: z.string(),
  alt: z.string().optional(),
});

export const CreatePostSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, hyphens only"),
  status: z.enum(["draft", "scheduled", "published"]).default("draft"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).max(10),
  excerpt: z.string().min(50).max(300),
  metaTitle: z.string().min(10).max(70),
  metaDescription: z.string().min(50).max(160),
  focusKeyword: z.string().min(2),
  heroImage: HeroImageSchema,
  sections: z.array(BlogSectionSchema),
  faq: z.array(FAQSchema),
  sources: z.array(z.string().url()).optional().default([]),
  affiliateLinks: z.array(z.any()).optional().default([]),
  seoScore: z.number().min(0).max(100).default(0),
  readabilityScore: z.number().min(0).max(100).default(0),
  readingTime: z.number().default(5),
  topicId: z.string().optional(),
  scheduledAt: z.date().optional().nullable(),
});

export const UpdatePostSchema = CreatePostSchema.partial().extend({
  id: z.string(),
  updatedAt: z.date().optional(),
});

export type CreatePostInput = z.infer<typeof CreatePostSchema>;
export type UpdatePostInput = z.infer<typeof UpdatePostSchema>;
