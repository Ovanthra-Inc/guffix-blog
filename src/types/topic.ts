import { Timestamp } from "firebase/firestore";

export interface TopicScore {
  title: string;
  category: string;
  trendScore: number;
  seoScore: number;
  monetizationScore: number;
  overallScore: number;
  reason: string;
  suggestedKeywords: string[];
  estimatedSearchVolume: string;
  competitionLevel: "low" | "medium" | "high";
}

export interface Topic {
  id?: string;
  title: string;
  category: string;
  trendScore: number;
  seoScore: number;
  monetizationScore: number;
  overallScore: number;
  reason: string;
  suggestedKeywords: string[];
  estimatedSearchVolume: string;
  competitionLevel: "low" | "medium" | "high";
  status: "discovered" | "generating" | "generated" | "rejected";
  postId?: string;
  discoveredAt: Date | Timestamp;
}

export type GenerationJobStatus =
  | "queued"
  | "outline"
  | "writing"
  | "seo"
  | "images"
  | "affiliate"
  | "saving"
  | "done"
  | "failed";

export interface GenerationJob {
  id?: string;
  topicId: string;
  topicTitle: string;
  status: GenerationJobStatus;
  progress: number;
  postId?: string;
  error?: string;
  startedAt: Date | Timestamp;
  completedAt?: Date | Timestamp;
}
