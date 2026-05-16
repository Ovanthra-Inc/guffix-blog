import { Timestamp } from "firebase/firestore";

export type SectionType =
  | "heading"
  | "paragraph"
  | "table"
  | "code"
  | "mermaid"
  | "quote"
  | "faq"
  | "cta"
  | "image";

export type BlogStatus = "draft" | "scheduled" | "published";

export interface HeroImage {
  url: string;
  prompt: string;
  alt?: string;
}

export interface BlogSection {
  id: string;
  type: SectionType;
  content?: string;
  // heading
  level?: 1 | 2 | 3 | 4;
  // table
  columns?: string[];
  rows?: string[][];
  // code
  language?: string;
  filename?: string;
  // image
  imageUrl?: string;
  imageAlt?: string;
  // cta
  ctaText?: string;
  ctaUrl?: string;
  ctaStyle?: "primary" | "secondary" | "affiliate";
  // faq specific
  question?: string;
  answer?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface AffiliateReference {
  linkId: string;
  text: string;
  url: string;
  placement: "inline" | "cta" | "sidebar";
}

export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  status: BlogStatus;
  category: string;
  tags: string[];
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  heroImage: HeroImage;
  sections: BlogSection[];
  faq: FAQ[];
  sources: string[];
  affiliateLinks: AffiliateReference[];
  seoScore: number;
  readabilityScore: number;
  readingTime: number;
  authorName?: string;
  authorAvatar?: string;
  authorBio?: string;
  scheduledAt?: Date | null;
  createdAt?: Date | Timestamp;
  updatedAt?: Date | Timestamp;
  publishedAt?: Date | Timestamp | null;
  viewCount?: number;
  topicId?: string;
  isPremium: boolean;
  seriesId?: string;
  seriesOrder?: number;
}

export interface GenerationStep {
  id: string;
  label: string;
  status: "pending" | "running" | "done" | "error";
}

export type BlogCategory =
  | "AI Tools"
  | "Web Development"
  | "Mobile Development"
  | "Cloud & DevOps"
  | "Cybersecurity"
  | "Data Science"
  | "Machine Learning"
  | "Blockchain"
  | "Startup & Business"
  | "Productivity"
  | "Programming Languages"
  | "Open Source";

export const DEFAULT_CATEGORIES: BlogCategory[] = [
  "AI Tools",
  "Web Development",
  "Mobile Development",
  "Cloud & DevOps",
  "Cybersecurity",
  "Data Science",
  "Machine Learning",
  "Blockchain",
  "Startup & Business",
  "Productivity",
];
