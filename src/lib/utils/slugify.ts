/**
 * Converts a string to a URL-safe slug.
 * Example: "Best AI Tools for 2026!" → "best-ai-tools-for-2026"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Generates a unique slug by appending a timestamp if needed.
 */
export function uniqueSlug(text: string): string {
  const base = slugify(text);
  const timestamp = Date.now().toString(36);
  return `${base}-${timestamp}`;
}
