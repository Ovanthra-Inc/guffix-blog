import type { BlogSection } from "@/types/blog";

const WORDS_PER_MINUTE = 200;

/**
 * Estimates reading time in minutes from blog sections.
 */
export function readingTime(sections: BlogSection[]): number {
  let totalWords = 0;

  for (const section of sections) {
    if (section.content) {
      totalWords += section.content.split(/\s+/).filter(Boolean).length;
    }
    if (section.question) {
      totalWords += section.question.split(/\s+/).filter(Boolean).length;
    }
    if (section.answer) {
      totalWords += section.answer.split(/\s+/).filter(Boolean).length;
    }
    if (section.rows) {
      for (const row of section.rows) {
        totalWords += row.join(" ").split(/\s+/).filter(Boolean).length;
      }
    }
  }

  return Math.max(1, Math.ceil(totalWords / WORDS_PER_MINUTE));
}

/**
 * Formats reading time as a human-readable string.
 */
export function formatReadingTime(minutes: number): string {
  if (minutes < 1) return "< 1 min read";
  if (minutes === 1) return "1 min read";
  return `${minutes} min read`;
}
